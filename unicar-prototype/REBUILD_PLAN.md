# UniCar Singpass autofill prototype: full redo (exact to Figma)

## Context
The first build (`unicar-prototype/`, commit on `claude/focused-knuth-g16mib`) was rejected. It used striped placeholders instead of the real images, Ant Design stand-in icons, a fallback font, and antd's default look instead of the UOI design-system components. The user wants **everything redone strictly from their materials**:
- Flow: Figma `C9cCiS2sKbkCK0iqP9U2nw`, section `8618:3276`
- Design system: Figma `FgI4SkDaDs2zZ9fwhumBZx` (UOI Design System library; its components are reachable via `search_design_system`)

Rules: invent no visuals, copy or behaviour; ask when material is missing.

**Assets:** `www.figma.com` is blocked in this session (403 from the proxy). The user has allowed it and will **start a new session**, so the rebuild runs there. First step in this session after approval: commit this plan as `unicar-prototype/REBUILD_PLAN.md` so the new session can pick it up. No other changes here.

## Flow (confirmed by user)
| # | Frame | What the user does |
|---|---|---|
| 1 | `8383:5191` Get quote | clicks "Retrieve with Singpass" |
| 2 | `8387:7681` Singpass consent | Cancel → 1; I Agree → 3 |
| 3 | `8517:3153` Singpass filled | vehicle fields locked; fills the policy fields by hand |
| 4 | `8390:8064` Get quote – fields filled | (end state of manual input); hovering the Insurance end date (i) shows `8571:17306` |
| 5 | `8543:25408` | **clicks Check Price** → "We found 3 vehicles…" info alert appears (confirmed by user) |
| 6 | `8543:25868` | opens the registration dropdown (SKC5500A ✓, SGT5899C, SVT02934G) |
| 7 | `8543:26182` | picks the car; its details fill in locked; user fills the remaining blanks |

## Build approach (new session)
1. **Re-pull every frame** with `get_design_context` (plus a screenshot) for the 7 frames and the tooltip. Download **all** asset URLs it returns into `src/assets/`: logo PNG, hero PNG, `retrieve_with_singpass_full_red` SVG, Singpass logo PNG, consent list PNG (`image 252`), and the SVG icons (question mark, info, ic-down, ic-up, ic-tick, calendar, radio-circle, discount, ic-close, ic-plus, divider line, popover arrow). Use each one in its exact slot at its exact size, with no substitutes.
2. **Components are built from the Figma markup, not antd defaults.** Convert the returned React+Tailwind into a few reusable pieces that match the DS instances exactly (classes, spacing, colors): `Header`, `FooterShort`, `LandingBanner`, `RetrieveSingpass` / `ClearForm` card, `InputHeader`, `Dropdown` (closed, disabled, open with `dropdown-overlay` and Hover rows), `InputField`, `DatePicker` field, `RadioItem`, `Alert` (info), `Popover`, promo `Input Button Field`, `Buttons`. Remove antd so its styling can't leak in. Behaviour is plain React state.
3. **Tokens:** only Figma variables (Type/…, Background/…, Status/…, Primary/…, effect-overlay, effect-underline). Font Noto Sans (Inter on the consent screen, as designed).
4. **Content:** verbatim copy from the frames. Dropdown options are only the values shown: NCD `10%`, experience `3 years or less`, claims `1`, reg plates `SKC5500A`/`SGT5899C`/`SVT02934G`, make `AION ES ELECTRIC`, year `2025`, power `100`.
5. **Date fields:** the frames show a typed `DD/MM/YYYY` field with a calendar icon; no calendar popup is designed. Build a text input with a `DD/MM/YYYY` mask, and **ask the user** before adding any calendar popup.
6. **Things not in the design** (Need Assistance?, Have an Agent ID?, Terms of Use, and details for SGT5899C/SVT02934G): leave them inert or empty and list them for the user rather than invent anything.
7. Files: keep the `unicar-prototype/` folder; replace `src/` content (`App.tsx` step state, `components/*.tsx`, `screens/QuoteForm.tsx`, `screens/SingpassConsent.tsx`, `data/mock.ts`, `index.css` tokens). Drop the `antd`, `@ant-design/icons` and `dayjs` deps.

## Verification
- `npm run build` passes.
- Playwright (Chromium at `/opt/pw-browsers`, viewport 1440) walks steps 1→7 plus the tooltip hover and screenshots each. **Compare each screenshot side by side with the Figma `get_screenshot` of the same frame** and fix every mismatch (assets, copy, spacing, colors, states) before handing over.
- Commit and push to `claude/focused-knuth-g16mib`, then send the user the step screenshots next to the Figma frames.
