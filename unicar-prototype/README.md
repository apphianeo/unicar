# UniCar prototype: Singpass autofill (get quote)

Clickable prototype of Figma `UniCar-Redesign`, sections `8653:12503` ("User uses singpass autofill") and `8653:12505` (fill manually),
built from the Figma markup and the UOI Design System variables. Stack: Vite, React, TypeScript, Tailwind.
No component library; behaviour is plain React state.

```bash
npm install
npm run dev
npm run build:preview   # one self-contained dist-preview/index.html for sharing
```

## Flow
Each page has its own URL hash (`#consent`, `#quote`, `#manual`, `#loading`, `#plan`, `#addons`, `#driver`), so the
browser's Back and Forward buttons work.

| Page | Figma | What happens |
|---|---|---|
| Landing | `8517:2744` | **Retrieve with Singpass** opens the consent; **Fill Manually** opens the manual form. |
| `#consent` | `8525:3731` | **Cancel** goes back; **I Agree** fills in the (single) vehicle and opens the quote form. |
| `#quote` | `8641:3667` … | Singpass card with **Clear Form** stays on top; vehicle details are filled and locked; the user fills the policy details. |
| `#quote` after Clear Form | `8642:19917` | Every field (vehicle, off-peak, policy details) is emptied; the card offers **Retrieve with Singpass**, which goes through consent again. |
| `#manual` | `8636:3287` … | No card; vehicle details keyed in (make/model and year from the options drawn in Figma; AION ES ELECTRIC fills power 100 and locks it). |
| `#loading` | `8391:11773` | After **Check Price**: spinner for 2 seconds, then Select Plan (the loading page is skipped by Back). |
| `#plan` | `8391:11581` | Essential is selected by default; **Select** moves the selection and the column highlight. **Next: Add-Ons**. |
| `#addons` | `8394:12743`, `8394:37745`, `8394:38117`, `8398:39153` | Three tabs. Each switch turns its card to the Selected variant; Policy excess (price then shows the chosen amount) and Additional named drivers show their dropdown, which floats over the cards below and makes room above the buttons. The price summary lists the chosen add-ons with an amount on the right. The button reads **Skip**, or **Next: Driver Details** once an add-on is on. |
| `#driver` | `8394:15054` | Applicant details from Singpass (locked), one "Additional driver" card per named driver chosen, vehicle details. |

The summary bar shows the car and the policy dates entered on the form (the Figma values if left empty); its **Edit**
and "Your Car" **Edit** go back to the form, "Your Plan" **Edit** to Select Plan. Price summary: subtotal = plan + paid add-ons
(updated live; policy excess adds nothing, named drivers 3 and 4 add S$50 / S$100), then 60% promo, then 9% GST (this
reproduces the Figma numbers for Essential). "Add-On(s)" **Edit** turns blue once an add-on is chosen and goes to Add-Ons.
*policy wording* on Select Plan opens the UniCar policy PDF in a new tab.

Every (i) icon opens a popover on hover, focus or tap. The end-date text is from `8644:11047`; the others are placeholder
definitions (`src/data/mock.ts`). Dropdown menus all stop at 6 rows (288px) and scroll beyond that.

Hero: the photo (with 20% black over it) fills the top 50% of the screen; the UniTravel light primary gradient panel
(`apphianeo/purchase-flow`) fills the rest. The insurance end date must be 9 to 18 months after the start date: other days
are greyed out in the calendar, a typed date outside that range isn't accepted, and changing the start date clears an end
date that no longer fits.

## Assets (`src/assets/`)
- Icons and the "Retrieve with Singpass" button are exported from the Figma nodes as-is.
- Supplied by the design team: `logo.svg` (UOI logo) and `hero.jpg` (the photo from `unicar.svg`). `singpass-logo.png`
  and `consent-list.png` are the images inside the supplied SVGs, used directly: the SVG wrappers made them blurry and
  tiled the logo (a line of letter tops under it).
- The Figma header fill (`8383:5200`, image `8bb609…`) is a composite: the photo darkened and fading into the page
  background. Until that export arrives, the raw photo is used.

## Date picker
Uses the UOI DS Date Picker "expanded" variants (start-date `1276:3259`, end-date `1276:3256`) at the DS size
(265 × 267, 8px under the field, left-aligned): it opens on focus,
the arrows change the month, and picking a day fills `DD/MM/YYYY`. The end-date calendar shows the range from the start date.
The month and year carets have no designed menu, so they are labels only.

## Not in the design, so left inert or empty
- *Need Assistance?*, *Have an Agent ID?*, *Terms of Use*, promo *Apply* and its ✕, *Save Draft*, *View Plan Comparison*,
  *View coverage details*, the discount chip's ✕, the section chevrons on Driver Details, and
  *Next: Review & Pay* (next flow).
- Text inputs use the Dropdown "focused" look (blue border with a 3px ring) when focused.
