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
| `#manual` | `8636:3287` … | The Retrieve with Singpass card sits on top (goes through consent into the Singpass form); vehicle details keyed in. Picking a make fills in and locks its power rating (kW, electric) or engine capacity (cc): the 8 makes drawn in Figma plus 30 common Singapore models added as examples (`src/data/mock.ts`, figures from manufacturers' specs, not UOI's list). |
| `#loading` | `8391:11773` | After **Check Price**: spinner for 2 seconds, then Select Plan (the loading page is skipped by Back). |
| `#plan` | `8391:11581` | Essential is selected by default; **Select** moves the selection and the column highlight. **View Plan Comparison** opens a dialog laid out like the UniTravel one (InsureTravel `4326:32850`) with the benefits table from the UniCar policy wording (Preferred = Comprehensive Plus, Essential = Comprehensive Value). **Next: Add-Ons**. |
| `#addons` | `8394:12743`, `8398:39153` | "Your policy excess" first: always included, no switch, amount dropdown at S$500.00 by default. Then every optional add-on in one list (no tabs). Each switch turns its card to the Selected variant; Additional named drivers shows its dropdown, which floats over the cards below and makes room above the buttons. The price summary doesn't list the excess (it isn't a charge); the plan's premium reflects it, and the chosen add-ons are listed below. The button reads **Next: Driver Details**. |
| `#driver` | `8394:15054` | Applicant details from Singpass (locked), one "Additional driver" card per named driver chosen, vehicle details. Date of birth uses the purchase-flow picker: month and year grids from the header, no future dates. |
| `#review` | `8394:15430`, `8394:15715` | Everything entered so far, with Edit links back to Driver Details. **Confirm & Pay** works once the declaration is ticked. The 2C2P / Visa OTP screen in `8697:12426` is left out. |
| `#confirmation` | `8600:17327` | Thank-you page with LottieFiles' free "Successful" animation (played once) in the success slot; its buttons and "here" have no destination in the design. |

The summary bar shows the car and the policy dates entered on the form (the Figma values if left empty); its **Edit**
and "Your Car" **Edit** go back to the form, "Your Plan" **Edit** to Select Plan. Plan prices are estimates (UniCar premiums are quoted per car and driver and aren't published), all incl. GST: S$2,180 / 1,690 / 1,150 / 820 before the 60% promo. Add-on prices are the motor team's (8727:38739): NCD protector 10% of the plan premium (S$67.60 on Essential), Loss of use S$86, 24h breakdown S$32, New for old S$118, Accessories S$77, named drivers 1–2 free, 3 +S$40, 4 +S$80. Policy excess S$500 (default), S$1,250, S$1,500 or S$2,000; a higher excess takes a fixed, unshown percentage off the plan premium (placeholder rates 5% / 7.5% / 10% until confirmed). The CAR60 promo applies to the whole subtotal, plan and add-ons. Price summary: subtotal = plan + add-ons
(updated live), minus the 60% promo = total. "Add-On(s)" **Edit** turns blue once an add-on is chosen and goes to Add-Ons.
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

## Quote form rules
- Progressive disclosure (8723:26351 … 8724:30894): **About your vehicle** (incl. NCD and off-peak) first; **About you**
  (main driver, drive at work, driving experience, claims) once NCD is chosen; **About your policy** (dates, with
  "Total duration") once experience and claims are chosen. Check Price stays disabled until everything is filled.
- The start-date calendar opens on the current month; picking a start date fills the end date 365 days later, which
  can still be changed within 9 to 18 months.
- "Are you the main driver?" (default Yes) comes before "Do you drive at work?", which is only asked (here, on Driver
  Details and on Review) when the answer is Yes. Additional drivers aren't asked about driving at work.
- Policy excess is always part of the policy (S$500.00 unless changed), so its card has no switch.

## Date picker
Uses the UOI DS Date Picker "expanded" variants (start-date `1276:3259`, end-date `1276:3256`) at the DS size
(265 × 267, 8px under the field, left-aligned): it opens on focus,
the arrows change the month, and picking a day fills `DD/MM/YYYY`. The end-date calendar shows the range from the start date.
The month and year carets have no designed menu, so they are labels only.

## Not in the design, so left inert or empty
- *Need Assistance?*, *Have an Agent ID?*, *Terms of Use*, promo *Apply* and its ✕, *Save Draft*,
  *View coverage details*, the discount chip's ✕, the section chevrons on Driver Details, and
  *Next: Review & Pay* (next flow).
- Text inputs use the Dropdown "focused" look (blue border with a 3px ring) when focused.
