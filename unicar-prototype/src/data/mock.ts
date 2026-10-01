// Only the values that appear in the Figma frames.

// The one vehicle Singpass returns for this research prototype (8641:3667).
export const singpassVehicle = { regNo: "SKC5500A", make: "AION ES ELECTRIC", power: "100", year: "2025" };

export const ncdOptions = ["0%", "10%", "20%", "30%", "40%", "50%"];
export const experienceOptions = ["3 years or less", "4 to 8 years", "More than 8 years"];
export const claimsOptions = ["0", "1", "2", "3 or more"];

export const promoCode = "CAR60";

// Manual entry (section 8653:12505): make/model and the power rating (kW, electric) or engine capacity (cc) it fills
// in and locks. The first eight are the options drawn in Figma; the rest are common Singapore models added as
// examples, with figures from the manufacturers' published specs. Not UOI's vehicle list.
const vehicles: [string, string][] = [
  ["AION ES ELECTRIC", "100"],
  ["AION Y PLUS ELECTRIC", "150"],
  ["ALFA ROMEO 159 2.2 JTS", "2198"],
  ["ALFA ROMEO 159 3.2 Q4", "3195"],
  ["ALFA ROMEO 159 SPORTSWAGON 2.2 JTS", "2198"],
  ["ALFA ROMEO GIULETTA 1.4", "1368"],
  ["ALFA ROMEO TONALE 1.5", "1469"],
  ["ASTON MARTIN DB11 V12 5.2", "5204"],
  ["AUDI A3 SPORTBACK 1.0 TFSI", "999"],
  ["AUDI Q4 SPORTBACK E-TRON 40 ELECTRIC", "150"],
  ["BMW 216I GRAN COUPE 1.5", "1499"],
  ["BMW I4 EDRIVE35 ELECTRIC", "210"],
  ["BMW X1 SDRIVE18I 1.5", "1499"],
  ["BYD ATTO 3 ELECTRIC", "150"],
  ["BYD DOLPHIN ELECTRIC", "70"],
  ["BYD SEAL DYNAMIC ELECTRIC", "150"],
  ["HONDA CIVIC 1.5 TURBO", "1498"],
  ["HONDA HR-V 1.5 E:HEV", "1498"],
  ["HONDA VEZEL 1.5", "1496"],
  ["HYUNDAI AVANTE 1.6", "1598"],
  ["HYUNDAI IONIQ 5 ELECTRIC", "168"],
  ["KIA NIRO EV ELECTRIC", "150"],
  ["LEXUS NX350H 2.5 HYBRID", "2487"],
  ["MAZDA 3 HATCHBACK 1.5", "1496"],
  ["MERCEDES-BENZ A200 1.3", "1332"],
  ["MERCEDES-BENZ C180 1.5", "1496"],
  ["MERCEDES-BENZ EQA 250 ELECTRIC", "140"],
  ["MG 4 ELECTRIC", "125"],
  ["NISSAN KICKS E-POWER 1.2", "1198"],
  ["TESLA MODEL 3 RWD ELECTRIC", "208"],
  ["TESLA MODEL Y RWD ELECTRIC", "220"],
  ["TOYOTA COROLLA ALTIS 1.6", "1598"],
  ["TOYOTA COROLLA CROSS 1.8 HYBRID", "1798"],
  ["TOYOTA PRIUS 1.8 HYBRID", "1798"],
  ["TOYOTA SIENTA 1.5 HYBRID", "1490"],
  ["VOLKSWAGEN GOLF 1.5 ETSI", "1498"],
  ["VOLKSWAGEN ID.4 ELECTRIC", "150"],
  ["VOLVO XC40 RECHARGE ELECTRIC", "175"],
];
export const makeOptions = vehicles.map(([make]) => make);
export const yearOptions = ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019"];

// Power rating filled (and locked) by the chosen make.
export const powerByMake: Record<string, string> = Object.fromEntries(vehicles);

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

// Add-ons (component set 8535:21169), in the order of the Select Add-Ons frames (8394:12743, 8727:38739): Policy excess
// first in its own section, then the optional add-ons in one list. Prices are the motor team's (8727:38739).
export type AddOnId = "ncd" | "excess" | "drivers" | "replacement" | "accessories" | "lossOfUse" | "breakdown";
export const addOns: { id: AddOnId; title: string; price: string; description: string }[] = [
  {
    id: "excess",
    title: "Policy excess",
    price: "",
    description:
      "Choose the excess that suits you. This is the amount you contribute towards each claim: select a higher excess to lower your premium, or a lower excess to reduce your out-of-pocket cost when you claim.",
  },
  {
    id: "drivers",
    title: "Additional named drivers",
    price: "Free",
    description:
      "Share your car with confidence. Add family or friends as named drivers so they are fully covered behind the wheel, with your first two named drivers included at no extra cost.",
  },
  {
    id: "ncd",
    title: "No claim discount (NCD) protector",
    // 10% of the plan premium, worked out per plan (addOnCost).
    price: "",
    description:
      "Safeguard the No Claim Discount you have earned. Available when your NCD is 30% or above, this add-on keeps your discount intact at renewal even after a claim, so years of careful driving continue to reward you.",
  },
  {
    id: "lossOfUse",
    title: "Loss of use",
    price: "S$86.00",
    description:
      "Stay mobile while your car is being repaired after an accident. This add-on provides a daily transport allowance towards taxis or a rental vehicle, so your routine carries on with minimal disruption.",
  },
  {
    id: "breakdown",
    title: "24 hours breakdown assistance",
    price: "S$32.00",
    description:
      "Drive with confidence, knowing help is always within reach. Our 24 hour assistance covers towing, battery jump-starts, tyre changes and lockouts, whenever and wherever you need it.",
  },
  {
    id: "replacement",
    title: "New for old replacement",
    price: "S$118.00",
    description:
      "Enjoy added peace of mind for your new vehicle. Should your car be stolen or declared a total loss within the eligible period, we will replace it with the same make and model rather than settle at its depreciated value.",
  },
  {
    id: "accessories",
    title: "Added accessories",
    price: "S$77.00",
    description:
      "Extend your protection to the accessories that make your car your own. Non-standard fittings such as audio systems, rims and bodykits fall outside standard cover; this add-on safeguards them against loss or damage.",
  },
];
// Dropdown options: policy excess (8739:11294) and named drivers (8535:21169).
export const excessOptions = ["S$500.00 (Default)", "S$1,250.00", "S$1,500.00", "S$2,000.00"];
export const namedDriverOptions = ["1 (free)", "2 (free)", "3 (+S$40.00)", "4 (+S$80.00)"];

// A higher policy excess takes a fixed percentage off the plan premium, which customers aren't shown. Placeholder
// rates until the motor team confirms them.
export const excessRate: Record<string, number> = { "S$1,250.00": 0.05, "S$1,500.00": 0.075, "S$2,000.00": 0.1 };

// The NCD protector costs 10% of the plan premium (S$67.60 on Essential at S$676.00, 8727:38739).
const ncdRate = 0.1;

// What each add-on adds to the subtotal (all incl. GST), given the chosen plan's list price. Named drivers cost what
// the dropdown says; the rest are fixed prices.
export const addOnCost = (id: AddOnId, drivers: string, planList: number, excess = excessOptions[0]): number => {
  if (id === "excess") return -Math.round(planList * (excessRate[excess] ?? 0) * 100) / 100;
  if (id === "drivers") return parseFloat(/\+S\$([\d.]+)/.exec(drivers)?.[1] ?? "0");
  // The premium the NCD protector is priced on is the plan after any excess reduction and the promo.
  if (id === "ncd") return Math.round(planList * (1 - (excessRate[excess] ?? 0)) * (1 - promoRate) * ncdRate * 100) / 100;
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
