#!/usr/bin/env python3
"""
unicar-sentiment capture tool
==============================
Collects citable, full-page screenshots of PUBLIC customer sentiment about
motor (car) insurance in Singapore, and writes a manifest mapping every
screenshot to its source and to the research themes.

Design goals / compliance:
  * Public pages only. Never bypasses a login, paywall, or bot wall.
  * Realistic desktop user-agent, 1440px viewport, polite delay between loads.
  * If a site blocks automated access, the run RECORDS it as 'blocked' and
    moves on -- it does not hammer or retry aggressively.
  * Reddit + forum threads are DISCOVERED from search terms at runtime;
    Trustpilot brand pages are captured directly.
  * The manifest's one-line sentiment summary is left for the researcher to
    confirm (the tool never fabricates sentiment); a theme is AUTO-SUGGESTED
    from on-page keywords so you have a starting point to accept/override.

Usage:
    python capture.py                      # run everything enabled in sources.json
    python capture.py --only reddit,trustpilot
    python capture.py --dry-run            # discover + list targets, capture nothing
    python capture.py --fb-profile /path/to/chromium-profile   # use a logged-in
                                           # profile for Facebook (only if YOU
                                           # supply one; never auto-login)

Requires: playwright  (pip install playwright)
Chromium is pre-provisioned in this environment; elsewhere run:
    python -m playwright install chromium
"""

import argparse
import csv
import datetime as dt
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
SHOTS = os.path.join(HERE, "screenshots")
CFG_PATH = os.path.join(HERE, "sources.json")

DESKTOP_UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)
VIEWPORT = {"width": 1440, "height": 1600}
POLITE_DELAY = 2.5  # seconds between page loads

# Signals that a page is a bot/login wall rather than real content.
BLOCK_SIGNS = [
    "just a moment", "attention required", "are you a robot", "verify you are human",
    "enable javascript and cookies", "unusual traffic", "captcha", "cf-challenge",
    "log in to continue", "sign in to continue", "you must log in", "please log in",
    "access denied", "request blocked",
]

records = []       # manifest rows
seq = 0            # running capture number for NN_ prefix


# ---------------------------------------------------------------------------
# helpers
# ---------------------------------------------------------------------------
def load_cfg():
    with open(CFG_PATH) as f:
        return json.load(f)


def slugify(text, maxlen=40):
    text = re.sub(r"https?://", "", text or "")
    text = re.sub(r"[^a-zA-Z0-9]+", "-", text).strip("-").lower()
    return (text[:maxlen] or "untitled").strip("-")


def next_name(platform, slug):
    global seq
    seq += 1
    return f"{seq:02d}_{platform}_{slug}.png"


def guess_theme(text, theme_keywords):
    """Return a list of theme ids whose keywords appear in the text (auto-suggestion)."""
    low = (text or "").lower()
    hits = []
    for tid, kws in theme_keywords.items():
        if any(k in low for k in kws):
            hits.append(tid)
    return hits


def brand_hits(text, brands):
    low = (text or "").lower()
    return [b for b in brands if b in low]


def looks_blocked(title, body_text):
    hay = f"{title}\n{body_text}".lower()
    return any(s in hay for s in BLOCK_SIGNS)


def record(filename, platform, title, permalink, post_date, themes, brands,
           status="captured", note=""):
    records.append({
        "filename": filename,
        "platform": platform,
        "title": (title or "").strip()[:200],
        "permalink": permalink,
        "post_date": post_date or "",
        # summary is intentionally left for the researcher to write (one-line,
        # paraphrased -- the tool does not fabricate sentiment).
        "summary_TODO": "",
        "theme_suggested": ",".join(themes),
        "brands_seen": ",".join(brands),
        "usernames_visible": "yes (review before external sharing)",
        "status": status,
        "note": note,
    })
    print(f"  [{status}] {filename}  <- {permalink}")


def reddit_search_json(subreddit, term, sort, time_filter, limit=15):
    """Discover threads via Reddit's public .json search endpoint."""
    q = urllib.parse.quote(term)
    url = (f"https://www.reddit.com/r/{subreddit}/search.json"
           f"?q={q}&restrict_sr=1&sort={sort}&t={time_filter}&limit={limit}")
    req = urllib.request.Request(url, headers={"User-Agent": DESKTOP_UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = json.load(r)
    out = []
    for child in data.get("data", {}).get("children", []):
        d = child.get("data", {})
        out.append({
            "title": d.get("title", ""),
            "permalink": "https://old.reddit.com" + d.get("permalink", ""),
            "score": d.get("score", 0),
            "created": d.get("created_utc"),
            "selftext": d.get("selftext", "")[:1000],
            "num_comments": d.get("num_comments", 0),
        })
    return out


# ---------------------------------------------------------------------------
# page capture primitives (Playwright)
# ---------------------------------------------------------------------------
def new_context(browser, storage_state=None):
    return browser.new_context(
        user_agent=DESKTOP_UA,
        viewport=VIEWPORT,
        locale="en-SG",
        storage_state=storage_state,
    )


def capture_page(page, url, out_path, crop_selector=None):
    """Load url, full-page screenshot to out_path. Returns (title, body_text, blocked)."""
    resp = page.goto(url, wait_until="domcontentloaded", timeout=45000)
    status = resp.status if resp else 0
    page.wait_for_timeout(1500)
    title = page.title()
    try:
        body_text = page.inner_text("body")[:4000]
    except Exception:
        body_text = ""
    blocked = status >= 400 or looks_blocked(title, body_text)
    if not blocked:
        page.screenshot(path=out_path, full_page=True)
        if crop_selector:
            try:
                el = page.query_selector(crop_selector)
                if el:
                    crop = out_path.replace(".png", "_crop.png")
                    el.screenshot(path=crop)
            except Exception:
                pass
    return title, body_text, blocked, status


# ---------------------------------------------------------------------------
# per-source drivers
# ---------------------------------------------------------------------------
def run_reddit(browser, cfg, dry_run):
    rc = cfg["reddit"]
    if not rc.get("enabled"):
        return
    print("\n== Reddit ==")
    seen = set()
    theme_kw = cfg["theme_keywords"]
    brands = cfg["brands_of_interest"]
    for sub in rc["subreddits"]:
        picked = []
        for term in rc["terms"]:
            try:
                hits = reddit_search_json(sub, term, rc["sort"], rc["time"])
            except Exception as e:
                print(f"  ! search failed r/{sub} '{term}': {e}")
                time.sleep(POLITE_DELAY)
                continue
            for h in hits:
                if h["permalink"] in seen:
                    continue
                if h["score"] < rc["min_score"]:
                    continue
                seen.add(h["permalink"])
                picked.append(h)
            time.sleep(POLITE_DELAY)
        picked.sort(key=lambda h: (h["num_comments"], h["score"]), reverse=True)
        picked = picked[: rc["max_per_source"]]
        for h in picked:
            slug = slugify(h["title"])
            fname = next_name("reddit", slug)
            date = ""
            if h.get("created"):
                date = dt.datetime.utcfromtimestamp(h["created"]).strftime("%Y-%m-%d")
            text_for_theme = f"{h['title']} {h['selftext']}"
            themes = guess_theme(text_for_theme, theme_kw)
            bseen = brand_hits(text_for_theme, brands)
            if dry_run:
                print(f"  (dry) r/{sub}: {h['title'][:70]}  [{h['num_comments']} cmts]")
                record(fname, "reddit", h["title"], h["permalink"], date,
                       themes, bseen, status="planned")
                continue
            page = new_context(browser).new_page()
            try:
                title, body, blocked, st = capture_page(
                    page, h["permalink"], os.path.join(SHOTS, fname),
                    crop_selector="div.commentarea div.comment")
                # refine theme/brand tags with the actually-rendered text
                themes = guess_theme(text_for_theme + " " + body, theme_kw)
                bseen = brand_hits(text_for_theme + " " + body, brands)
                record(fname, "reddit", h["title"], h["permalink"], date,
                       themes, bseen,
                       status="blocked" if blocked else "captured",
                       note=f"http {st}" if blocked else "")
            except Exception as e:
                record(fname, "reddit", h["title"], h["permalink"], date,
                       themes, bseen, status="error", note=str(e)[:120])
            finally:
                page.context.close()
                time.sleep(POLITE_DELAY)


def run_trustpilot(browser, cfg, dry_run):
    tc = cfg["trustpilot"]
    if not tc.get("enabled"):
        return
    print("\n== Trustpilot ==")
    theme_kw = cfg["theme_keywords"]
    brands = cfg["brands_of_interest"]
    for entry in tc["review_pages"]:
        brand, url = entry["brand"], entry["url"]
        fname = next_name("trustpilot", slugify(brand))
        if dry_run:
            print(f"  (dry) {brand}: {url}")
            record(fname, "trustpilot", f"Trustpilot - {brand}", url, "",
                   ["1", "2"], [brand.lower()], status="planned")
            continue
        page = new_context(browser).new_page()
        try:
            title, body, blocked, st = capture_page(
                page, url, os.path.join(SHOTS, fname),
                crop_selector="section")
            themes = guess_theme(body, theme_kw) or ["1", "2"]
            bseen = brand_hits(brand + " " + body, brands)
            record(fname, "trustpilot", f"Trustpilot - {brand}", url, "",
                   themes, bseen,
                   status="blocked" if blocked else "captured",
                   note=f"http {st}" if blocked else "score/summary page")
            # capture a few individual review cards
            if not blocked:
                cards = page.query_selector_all("article")[: tc.get("reviews_to_crop", 4)]
                for i, card in enumerate(cards, 1):
                    cfname = next_name("trustpilot", f"{slugify(brand)}-review{i}")
                    try:
                        card.scroll_into_view_if_needed()
                        page.wait_for_timeout(400)
                        card.screenshot(path=os.path.join(SHOTS, cfname))
                        ctext = card.inner_text()[:1500]
                        record(cfname, "trustpilot",
                               f"Trustpilot review ({brand}) #{i}", url, "",
                               guess_theme(ctext, theme_kw),
                               brand_hits(ctext, brands),
                               status="captured", note="individual review card")
                    except Exception as e:
                        print(f"    ! review card {i} failed: {e}")
        except Exception as e:
            record(fname, "trustpilot", f"Trustpilot - {brand}", url, "",
                   [], [brand.lower()], status="error", note=str(e)[:120])
        finally:
            page.context.close()
            time.sleep(POLITE_DELAY)


def run_forum(browser, cfg, key, platform, dry_run):
    fc = cfg[key]
    if not fc.get("enabled"):
        return
    print(f"\n== {platform} ==")
    theme_kw = cfg["theme_keywords"]
    brands = cfg["brands_of_interest"]
    # Known thread URLs (if you've pasted any into sources.json) are captured
    # directly. Otherwise the search page is captured as a starting point --
    # forum in-site search frequently needs a login, in which case it is
    # recorded 'blocked' and skipped rather than worked around.
    targets = list(fc.get("seed_thread_urls", []))
    if not targets:
        for term in fc.get("terms", [])[:3]:
            targets.append(fc["search_url_template"].format(term=urllib.parse.quote(term)))
    targets = targets[: fc.get("max_per_source", 5)]
    for url in targets:
        fname = next_name(platform, slugify(url))
        if dry_run:
            print(f"  (dry) {url}")
            record(fname, platform, url, url, "", [], [], status="planned")
            continue
        page = new_context(browser).new_page()
        try:
            title, body, blocked, st = capture_page(page, url, os.path.join(SHOTS, fname))
            record(fname, platform, title or url, url, "",
                   guess_theme(title + " " + body, theme_kw),
                   brand_hits(title + " " + body, brands),
                   status="blocked" if blocked else "captured",
                   note=f"http {st} (login/guest wall?)" if blocked else "")
        except Exception as e:
            record(fname, platform, url, url, "", [], [], status="error", note=str(e)[:120])
        finally:
            page.context.close()
            time.sleep(POLITE_DELAY)


def run_facebook(browser, cfg, fb_profile, dry_run):
    fbc = cfg["facebook"]
    if not fbc.get("enabled") and not fb_profile:
        print("\n== Facebook == SKIPPED (login-gated; no profile supplied). "
              "See README 'Facebook (manual)'.")
        record("--", "facebook", "Facebook groups (login-gated)", "", "",
               [], [], status="skipped-login-gated",
               note="Supply --fb-profile with YOUR logged-in Chromium profile to capture, "
                    "or capture manually per README.")
        return
    # If a persistent logged-in profile is supplied by the user, use it as-is.
    # The tool never performs a login itself.
    print("\n== Facebook (using supplied profile) ==")
    # Left as an explicit hook; populate sources.json facebook.targets with
    # specific public group post URLs to capture with the supplied profile.
    record("--", "facebook", "Facebook (profile supplied)", "", "",
           [], [], status="manual-config-needed",
           note="Add specific group post URLs to sources.json to capture with the profile.")


# ---------------------------------------------------------------------------
# manifest writers
# ---------------------------------------------------------------------------
def write_manifests(cfg):
    csv_path = os.path.join(HERE, "manifest.csv")
    md_path = os.path.join(HERE, "manifest.md")
    cols = ["filename", "platform", "title", "permalink", "post_date",
            "summary_TODO", "theme_suggested", "brands_seen",
            "usernames_visible", "status", "note"]
    with open(csv_path, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for r in records:
            w.writerow(r)

    themes = cfg["themes"]
    captured = [r for r in records if r["status"] == "captured"]
    other = [r for r in records if r["status"] != "captured"]
    with open(md_path, "w") as f:
        f.write("# UniCar sentiment capture - manifest\n\n")
        f.write(f"_Generated {dt.datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}_\n\n")
        f.write("**Themes**\n\n")
        for k, v in themes.items():
            f.write(f"- **{k}.** {v}\n")
        f.write("\n> `theme_suggested` is auto-derived from on-page keywords - "
                "confirm/override by hand. `summary_TODO` is intentionally blank: "
                "write a ONE-LINE paraphrase (do not paste verbatim text). "
                "Usernames may be visible in screenshots - review before external sharing.\n\n")
        f.write(f"**Captured:** {len(captured)}  |  **Blocked/skipped/other:** {len(other)}\n\n")
        f.write("## Captures\n\n")
        f.write("| # | file | platform | title | theme(s) | brands | status |\n")
        f.write("|---|------|----------|-------|----------|--------|--------|\n")
        for r in records:
            f.write(f"| | `{r['filename']}` | {r['platform']} | "
                    f"{r['title'][:60].replace('|','/')} | {r['theme_suggested']} | "
                    f"{r['brands_seen']} | {r['status']} |\n")
        f.write("\n## Permalinks\n\n")
        for r in records:
            if r["permalink"]:
                f.write(f"- `{r['filename']}` - [{r['title'][:70]}]({r['permalink']})\n")
    print(f"\nWrote {csv_path}\nWrote {md_path}\n{len(records)} rows "
          f"({len(captured)} captured).")


# ---------------------------------------------------------------------------
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", help="comma list: reddit,trustpilot,hardwarezone,lowyat,facebook")
    ap.add_argument("--dry-run", action="store_true",
                    help="discover + list targets and write a planned manifest; capture nothing")
    ap.add_argument("--fb-profile", help="path to a persistent, ALREADY-logged-in Chromium profile")
    args = ap.parse_args()

    cfg = load_cfg()
    only = set(args.only.split(",")) if args.only else None
    os.makedirs(SHOTS, exist_ok=True)

    def want(name):
        return only is None or name in only

    if args.dry_run:
        browser = None
        if want("reddit"):        run_reddit(None, cfg, True)
        if want("trustpilot"):    run_trustpilot(None, cfg, True)
        if want("hardwarezone"):  run_forum(None, cfg, "hardwarezone", "hardwarezone", True)
        if want("lowyat"):        run_forum(None, cfg, "lowyat", "lowyat", True)
        if want("facebook"):      run_facebook(None, cfg, args.fb_profile, True)
        write_manifests(cfg)
        return

    from playwright.sync_api import sync_playwright
    exe = "/opt/pw-browsers/chromium"  # pre-provisioned in this environment
    launch_kwargs = {"headless": True, "args": ["--no-sandbox"]}
    if os.path.exists(exe):
        launch_kwargs["executable_path"] = exe
    with sync_playwright() as p:
        try:
            browser = p.chromium.launch(**launch_kwargs)
        except Exception:
            launch_kwargs.pop("executable_path", None)
            browser = p.chromium.launch(**launch_kwargs)
        try:
            if want("reddit"):        run_reddit(browser, cfg, False)
            if want("trustpilot"):    run_trustpilot(browser, cfg, False)
            if want("hardwarezone"):  run_forum(browser, cfg, "hardwarezone", "hardwarezone", False)
            if want("lowyat"):        run_forum(browser, cfg, "lowyat", "lowyat", False)
            if want("facebook"):      run_facebook(browser, cfg, args.fb_profile, False)
        finally:
            browser.close()
    write_manifests(cfg)


if __name__ == "__main__":
    main()
