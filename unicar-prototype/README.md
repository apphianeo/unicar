# UniCar prototype: Singpass autofill (get quote)

Clickable prototype of Figma `UniCar-Redesign`, section `8618:3276` ("User uses singpass autofill", Option 1),
built from the Figma markup and the UOI Design System variables. Stack: Vite, React, TypeScript, Tailwind.
No component library; behaviour is plain React state.

```bash
npm install
npm run dev
```

## Flow
| # | Figma frame | What happens |
|---|---|---|
| 1 | `8383:5191` Get quote | Click **Retrieve with Singpass**. |
| 2 | `8387:7681` Singpass consent | **Cancel** goes back to 1; **I Agree** goes to 3. |
| 3 | `8517:3153` Singpass filled | Vehicle fields are locked. Fill the policy fields. |
| 4 | `8390:8064` fields filled | Hover the (i) next to *Insurance end date* for the popover (`8571:17306`). |
| 5 | `8543:25408` | **Check Price** shows the "We found 3 vehicles…" alert, with SKC5500A preselected and the other fields empty. |
| 6 | `8543:25868` | Open the registration dropdown. |
| 7 | `8543:26182` | Pick **SKC5500A**: make, power and year fill in and lock; fill the rest. |

## Assets (`public/assets/`)
The SVGs were exported from the Figma nodes as-is. The four raster images still need to be exported and dropped in
with these file names (the build works without them, but they show as broken images):

| File | Figma node | Size in design |
|---|---|---|
| `logo.png` | `8383:5196` Logo (300×150 source, FIT) | 60×30 |
| `hero.png` | `8383:5200` Header fill (720×758 source) | full width × 1516 |
| `singpass-logo.png` | `8387:7686` image 242 (640×111 source) | 182.238×31.607 |
| `consent-list.png` | `8387:7699` image 252 (1731×1528 source, cropped) | 584×481 |

## Not in the design, so left inert or empty
- *Need Assistance?*, *Have an Agent ID?*, *Terms of Use*, *Clear Form*, promo *Apply* and its ✕, and *Check Price* after step 5.
- SGT5899C and SVT02934G are listed but cannot be picked, because no details for them are designed.
- The vehicle dropdowns on the first screen have no options, since none are designed.
- Dates are typed `DD/MM/YYYY` fields; there is no calendar popup.
- Text inputs use the Dropdown "focused" look (blue border with a 3px ring) when focused.
