# UniCar prototype: Singpass autofill (get quote)

Clickable prototype of Figma `UniCar-Redesign`, section `8653:12503` ("User uses singpass autofill"),
built from the Figma markup and the UOI Design System variables. Stack: Vite, React, TypeScript, Tailwind.
No component library; behaviour is plain React state.

```bash
npm install
npm run dev
npm run build:preview   # one self-contained dist-preview/index.html for sharing
```

## Flow
|## Flow
| Figma frame | What happens |
|---|---|
| `8517:2744` Get quote | **Retrieve with Singpass** opens the consent. **Fill Manually** leads to a flow that isn't designed yet (inert). |
| `8525:3731` Singpass consent | **Cancel** goes back; **I Agree** continues. |
| `8543:25408` | 3 vehicles found: info alert, SKC5500A preselected. |
| `8543:25868` | Registration dropdown open. |
| `8543:26182` | SKC5500A picked: make, power and year fill in and lock. |
| `8641:3667` … `8636:5316` | Vehicle details locked; the user fills the policy details (DS date pickers, NCD / experience / claims dropdowns). This layout starts when the user opens the first policy field. |

The hero follows the UniTravel prototype (`apphianeo/purchase-flow`): a 360px cropped photo (300px at ≤640px) with the
light primary gradient panel below it.

 (`src/assets/`)
- Icons and the "Retrieve with Singpass" button are exported from the Figma nodes as-is.
- Supplied by the design team: `logo.svg` (UOI logo), `singpass-logo.svg`, `consent-list.svg` (the whole white
  list panel of the consent screen), and `hero.jpg` (the photo from `unicar.svg`).
- The Figma header fill (`8383:5200`, image `8bb609…`) is a composite: the photo darkened and fading into the page
  background. Until that export arrives, the raw photo is used.

## Date picker
Uses the UOI DS Date Picker "expanded" variants (start-date `1276:3259`, end-date `1276:3256`) at the DS size
(265 × 267, 8px under the field, left-aligned): it opens on focus,
the arrows change the month, and picking a day fills `DD/MM/YYYY`. The end-date calendar shows the range from the start date.
The month and year carets have no designed menu, so they are labels only.

## Not in the design, so left inert or empty
- *Need Assistance?*, *Have an Agent ID?*, *Terms of Use*, *Clear Form*, promo *Apply* and its ✕, *Fill Manually*, and *Check Price*.
- SGT5899C and SVT02934G are listed but cannot be picked, because no details for them are designed.
- Text inputs use the Dropdown "focused" look (blue border with a 3px ring) when focused.
