# UniCar prototype: Singpass autofill (get quote)

A clickable prototype of Figma `UniCar-Redesign`, section `8618:3276` ("User uses singpass autofill, Option 1").
Stack: Vite, React, TypeScript, Ant Design (themed with UOI design-system tokens) and Tailwind for layout.

```bash
npm install
npm run dev
```

## Flow
1. **Get quote**: empty vehicle details. Click **Retrieve with Singpass**.
2. **Singpass consent**: **Cancel** goes back; **I Agree** retrieves the data.
3. **Singpass filled**: vehicle fields are locked; Policy details appear.
4. Fill in the policy fields by hand. Hover the (i) next to *Insurance end date* to see the 9–18 month popover.
5. **Check Price** leads to the **3 vehicles found** state (info alert, Clear Form).
6. Open the registration dropdown.
7. Pick **SKC5500A**: make, power and year fill in and lock; complete the policy fields. **Clear Form** restarts.

## Notes
- Dropdowns contain only the values shown in the design.
- `www.figma.com` was blocked in the build environment. Image slots (logo, hero photo, Singpass button and logo, consent list) are labelled placeholders, and icons use Ant Design equivalents. All of them live in `src/assets.tsx`; swap the real exports in there.
- The design only shows details for SKC5500A, so picking SGT5899C or SVT02934G leaves the vehicle fields empty and editable.
