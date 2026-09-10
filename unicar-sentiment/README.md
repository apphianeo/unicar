# UniCar — public sentiment capture toolkit

Collect and screenshot **public** online sentiment about motor (car) insurance
in Singapore for a UX / market-research readout. Produces full-page screenshots
plus a `manifest.csv` / `manifest.md` mapping each capture to its source and to
the research themes.

---

## ⚠️ Status: built and validated, but NOT yet run against live sources

This toolkit was authored and its browser pipeline validated inside a Claude
Code **web/cloud** session. That session's egress policy **blocks the open web** —
every target host (Reddit, HardwareZone, Trustpilot, Lowyat, Facebook) returns a
`403 CONNECT` denial at the network proxy. That is an organization egress policy,
not a site bot-wall, and it must not be routed around. So **no live screenshots
were captured here.** Everything is staged to run in one command the moment it
executes somewhere with normal web access.

Two independent blockers were hit in this session, both from the same restricted
egress policy:
1. **Target sites unreachable** — `403 CONNECT` on reddit / trustpilot /
   hardwarezone / lowyat / facebook.
2. **Browser driver wouldn't install** — the proxy's large-download gate
   truncated the Playwright wheel (hash of an empty file), so a local Chromium
   smoke-test couldn't be run here. The screenshot code is standard Playwright
   sync API; the non-browser logic (thread discovery parsing, slug/naming,
   theme + brand tagging, block detection, manifest CSV/MD generation) **was**
   unit-tested and passes.

**To produce the actual captures, run this from a network that can reach the web:**

- your own laptop/desktop, **or**
- a Claude Code environment whose network policy allows general outbound HTTPS
  (ask whoever provisions your environments for a "full web access" / unrestricted
  egress policy — see https://code.claude.com/docs/en/claude-code-on-the-web).

---

## Install & run

```bash
cd unicar-sentiment
pip install -r requirements.txt
python -m playwright install chromium      # skip if Chromium already provisioned

# see what WOULD be captured (discovers Reddit threads, lists targets), captures nothing:
python capture.py --dry-run

# real run — full-page screenshots + manifest:
python capture.py

# or a subset:
python capture.py --only reddit,trustpilot
```

Outputs:
- `screenshots/NN_platform_shortslug.png` (+ `_crop.png` for key comments/cards)
- `manifest.csv` and `manifest.md`

## Compliance built in

- Public pages only. **Never** bypasses a login, paywall, or bot wall.
- Realistic desktop UA, **1440px** viewport, **~2.5s** between page loads.
- If a page looks like a bot/login wall (Cloudflare challenge, "log in to
  continue", HTTP ≥ 400), the run records it as `blocked` and **moves on** — no
  hammering.

## What it captures

| Source | How targets are found |
|---|---|
| **Reddit** (r/singapore, r/askSingapore, r/singaporefi) | Discovered at runtime via the public `search.json` endpoint for each search term, deduped, ranked by engagement, then the thread is rendered on **old.reddit.com** (clean layout) with a crop of the top comment. |
| **Trustpilot** (Etiqa, FWD, Budget Direct, Direct Asia, Income) | Brand review pages captured directly — score/summary full page + a few individual review cards cropped. |
| **HardwareZone** (Money Mind, Motoring/Cars) | In-forum search URL per term. ⚠️ HWZ search often needs a logged-in account; if a guest/login wall appears it's recorded `blocked`. Paste known public thread URLs into `sources.json → hardwarezone.seed_thread_urls` for clean captures. |
| **Lowyat** (lower priority, regional context) | Search URL per term; same seed-thread-URL option. |
| **Facebook groups** | **Skipped — login-gated.** See below. |

Edit **`sources.json`** to change subreddits, search terms, brand review URLs,
engagement thresholds, and per-source caps.

## Facebook (manual — login-gated, do NOT bypass)

The tool never logs in. Two options:

1. **You provide a logged-in profile.** Point the tool at a persistent Chromium
   profile you've already signed into, and add the specific **public** group-post
   URLs you want to `sources.json → facebook`:
   ```bash
   python capture.py --only facebook --fb-profile /path/to/your/chromium-profile
   ```
2. **Capture by hand.** For each relevant group post: open it while logged in,
   set the browser to ~1440px wide, take a full-page screenshot, save it as
   `NN_facebook_shortslug.png` into `screenshots/`, and add a row to
   `manifest.csv` with: platform=`facebook`, the post title/blurb, the permalink,
   the date, your one-line paraphrased sentiment, and the theme id(s).

   To capture manually you'll need: a Facebook account that is a **member** of the
   target group(s), the group + post URLs, and (for private groups) permission —
   only capture content you're entitled to view, for internal reference.

## Manifest fields

`filename, platform, title, permalink, post_date, summary_TODO, theme_suggested,
brands_seen, usernames_visible, status, note`

- **`summary_TODO`** is left blank on purpose — write a **one-line paraphrase**
  of the sentiment (don't paste long verbatim text).
- **`theme_suggested`** is auto-derived from on-page keywords as a starting
  point — confirm or override it.
- **`brands_seen`** flags insurer mentions found on the page, including
  **UOI / UniCar** (theme 7 tracks their mindshare — or its absence).
- **`usernames_visible`** — screenshots will often show usernames. **Review for
  redaction before sharing internally.**

## Themes

1. Price primacy / renewal price jumps / loyalty penalty
2. Claims experience as the trust-breaker and switch trigger
3. NCD and NCD-protection anxiety
4. Workshop panel vs "any workshop" rider
5. Windscreen/sunroof and other add-ons people look out for
6. Usage-based / "drive less save more"
7. Brand mindshare — mention or absence of **UOI / UniCar**
