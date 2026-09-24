# UniCar prototype: Singpass autofill (get quote)

Clickable prototype of Figma `UniCar-Redesign`, section `8618:3276` ("User uses singpass autofill", Option 1),
built from the Figma markup and the UOI Design System variables. Stack: Vite, React, TypeScript, Tailwind.
No component library; behaviour is plain React state.

```bash
npm install
npm run dev
npm run build:preview   # one self-contained dist-preview/index.html for sharing
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

## Assets (`src/assets/`)
- Icons and the "Retrieve with Singpass" button are exported from the Figma nodes as-is.
- Supplied by the design team: `logo.svg` (UOI logo), `singpass-logo.svg`, `consent-list.svg` (the whole white
  list panel of the consent screen), and `hero.jpg` (the photo from `unicar.svg`).
- The Figma header fill (`8383:5200`, image `8bb609…`) is a composite: the photo darkened and fading into the page
  background. Until that export arrives, the raw photo is used.

## Date picker
Uses the UOI DS Date Picker "expanded" variants (start-date `1276:3259`, end-date `1276:3256`): it opens on focus,
the arrows change the month, and picking a day fills `DD/MM/YYYY`. The end-date calendar shows the range from the start date.
The month and year carets have no designed menu, so they are labels only.

## Not in the design, so left inert or empty
- *Need Assistance?*, *Have an Agent ID?*, *Terms of Use*, *Clear Form*, promo *Apply* and its ✕, and *Check Price* after step 5.
- SGT5899C and SVT02934G are listed but cannot be picked, because no details for them are designed.
- The vehicle dropdowns on the first screen have no options, since none are designed.
- Text inputs use the Dropdown "focused" look (blue border with a 3px ring) when focused.
