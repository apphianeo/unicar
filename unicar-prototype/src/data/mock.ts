// Only the values that appear in the Figma frames.

// The one vehicle Singpass returns for this research prototype (8641:3667).
export const singpassVehicle = { regNo: "SKC5500A", make: "AION ES ELECTRIC", power: "100", year: "2025" };

export const ncdOptions = ["0%", "10%", "20%", "30%", "40%", "50%"];
export const experienceOptions = ["3 years or less", "4 to 8 years", "More than 8 years"];
export const claimsOptions = ["0", "1", "2", "3 or more"];

export const promoCode = "CAR60";

// Manual entry (section 8653:12505): only the options drawn in the Figma dropdowns.
export const makeOptions = [
  "AION ES ELECTRIC",
  "AION Y PLUS ELECTRIC",
  "ALFA ROMEO 159 2.2 JTS",
  "ALFA ROMEO 159 3.2 Q4",
  "ALFA ROMEO 159 SPORTSWAGON 2.2 JTS",
  "ALFA ROMEO GIULETTA 1.4",
  "ALFA ROMEO TONALE 1.5",
  "ASTON MARTIN DB11 V12 5.2",
];
export const yearOptions = ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019"];

// Power rating filled (and locked) by the chosen make. Values for the other models are still to come.
export const powerByMake: Record<string, string> = { "AION ES ELECTRIC": "100" };

// Tooltip copy. The end date text is from the Figma tooltip frame (8644:11047); the others are placeholder
// definitions for the research prototype.
export const tooltips = {
  make: "The manufacturer and model of your vehicle, as shown in your vehicle log card.",
  year: "The year your vehicle was first registered with the Land Transport Authority (LTA).",
  offPeak:
    "An off-peak car (red plate) can only be driven on weekday evenings, weekends and public holidays, unless a day licence is bought.",
  endDate: "You may select a minimum of 9 months and a maximum of 18 months for your period of insurance.",
  ncd: "A discount on your premium for every consecutive year without a claim, up to 50%.",
  claims: "The number of motor insurance claims made under your name in the last 3 years.",
  brandNew: "Select Yes if the vehicle is newly bought and has not been registered to a previous owner.",
  driveAtWork:
    "Select Yes if you use this vehicle for work other than travelling to and from your workplace, such as visiting clients or making deliveries.",
};

// Select Plan (8391:11581). Prices and ticks as drawn.
export type PlanId = "preferred" | "essential" | "tpft" | "tpo";
export const benefits = [
  "Choice of workshop",
  "Own damage - the motor vehicle",
  "Third party liability",
  "Other benefits",
  "Excess for authorised driver(s)",
];
// Annual premiums incl. GST before the promo. UniCar premiums are quoted per car and driver and aren't published,
// so these are estimates for a new electric car in Singapore; the card shows the price after the 60% promo.
export const plans: { id: PlanId; name: string; list: number; covers: boolean[]; popular?: boolean }[] = [
  { id: "preferred", name: "Preferred", list: 2180, covers: [true, true, true, true, true] },
  { id: "essential", name: "Essential", list: 1690, covers: [false, true, true, true, true], popular: true },
  { id: "tpft", name: "Third Party Fire & Theft", list: 1150, covers: [false, false, true, true, false] },
  { id: "tpo", name: "Third Party Only", list: 820, covers: [false, false, true, true, false] },
];

export const money = (n: number) =>
  `${n < 0 ? "–" : ""}S$${Math.abs(n).toLocaleString("en-SG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const planDiscountBadge = "–60%";
export const policyWordingUrl = "https://www.uoi.com.sg/assets/web-resources/uoi/pdfs/insurance/unicar-motor-insurance-policy.pdf";
export const geographicalArea =
  "Geographical area includes Singapore, West Malaysia, Southern Thailand (up to 80km from West Malaysia), Straits between Singapore and Tanjong Belungkor (Johor)";

// Add-ons (component set 8535:21169), by tab (8394:12743, 8394:37745, 8394:38117).
export type AddOnId = "ncd" | "excess" | "drivers" | "replacement" | "accessories" | "lossOfUse" | "breakdown";
export const addOnTabs = ["Recommended", "Vehicle Maintenance", "Mobility & Roadside Services"] as const;
export type AddOnTab = (typeof addOnTabs)[number];
export const addOns: { id: AddOnId; tab: AddOnTab; title: string; price: string; description: string }[] = [
  {
    id: "ncd",
    tab: "Recommended",
    title: "No claim discount (NCD) protector",
    price: "S$168.00",
    description:
      "Safeguard the No Claim Discount you have earned. Available when your NCD is 30% or above, this add-on keeps your discount intact at renewal even after a claim, so years of careful driving continue to reward you.",
  },
  {
    id: "excess",
    tab: "Recommended",
    title: "Policy excess",
    price: "From S$600.00",
    description:
      "Choose the excess that suits you. This is the amount you contribute towards each claim: select a higher excess to lower your premium, or a lower excess to reduce your out-of-pocket cost when you claim.",
  },
  {
    id: "drivers",
    tab: "Recommended",
    title: "Additional named drivers",
    price: "Free",
    description:
      "Share your car with confidence. Add family or friends as named drivers so they are fully covered behind the wheel, with your first two named drivers included at no extra cost.",
  },
  {
    id: "replacement",
    tab: "Vehicle Maintenance",
    title: "New for old replacement",
    price: "S$120.00",
    description:
      "Enjoy added peace of mind for your new vehicle. Should your car be stolen or declared a total loss within the eligible period, we will replace it with the same make and model rather than settle at its depreciated value.",
  },
  {
    id: "accessories",
    tab: "Vehicle Maintenance",
    title: "Added accessories",
    price: "S$65.00",
    description:
      "Extend your protection to the accessories that make your car your own. Non-standard fittings such as audio systems, rims and bodykits fall outside standard cover; this add-on safeguards them against loss or damage.",
  },
  {
    id: "lossOfUse",
    tab: "Mobility & Roadside Services",
    title: "Loss of use",
    price: "S$58.00",
    description:
      "Stay mobile while your car is being repaired after an accident. This add-on provides a daily transport allowance towards taxis or a rental vehicle, so your routine carries on with minimal disruption.",
  },
  {
    id: "breakdown",
    tab: "Mobility & Roadside Services",
    title: "24 hours breakdown assistance",
    price: "S$38.00",
    description:
      "Drive with confidence, knowing help is always within reach. Our 24 hour assistance covers towing, battery jump-starts, tyre changes and lockouts, whenever and wherever you need it.",
  },
];
// Dropdowns inside the selected add-ons (8535:21158, 8535:21159).
export const excessOptions = ["S$600.00 (Default)", "S$1000.00", "S$1100.00", "S$1350.00", "S$1600.00", "S$2100.00"];
export const namedDriverOptions = ["1 (free)", "2 (free)", "3 (+S$50.00)", "4 (+S$100.00)"];

// Premium change for a higher policy excess (estimates; 8697:12426 shows one option at –S$34.00).
export const excessDiscount: Record<string, number> = {
  "S$600.00 (Default)": 0,
  "S$1000.00": -34,
  "S$1100.00": -40,
  "S$1350.00": -55,
  "S$1600.00": -70,
  "S$2100.00": -95,
};

// What each add-on adds to the subtotal (all incl. GST). A higher policy excess lowers the premium; named drivers
// cost what the dropdown says.
export const addOnCost = (id: AddOnId, drivers: string, excess = "S$600.00 (Default)"): number => {
  if (id === "excess") return excessDiscount[excess] ?? 0;
  if (id === "drivers") return parseFloat(/\+S\$([\d.]+)/.exec(drivers)?.[1] ?? "0");
  return parseFloat(addOns.find((a) => a.id === id)!.price.replace("S$", ""));
};
export const addOnCount = (drivers: string) => parseInt(drivers, 10);

// Promo (CAR60) applied in every price summary: 60% off the subtotal (plan plus add-ons). Prices include GST.
export const promoRate = 0.6;

// Applicant details and chassis number returned by Singpass (8394:15054).
export const singpassApplicant = {
  name: "Chris Wong",
  dob: "05/01/1991",
  nric: "S9111012B",
  phoneCode: "+65",
  phone: "9123 4567",
  email: "chriswong@gmail.com",
  postalCode: "612345",
  address: "Blk 345 East Coast St 23",
  unit: "#09-124",
  chassis: "1HGCM82633A123456",
};
