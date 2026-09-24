// Only values that appear in the Figma frames (UniCar-Redesign, section 8618:3276).

export type Vehicle = {
  reg: string;
  make?: string;
  power?: string;
  year?: string;
};

// Singpass/Myinfo vehicle records. Only SKC5500A's details are shown in the design;
// the other two plates appear only in the registration dropdown (frame 8543:25868).
export const singpassVehicles: Vehicle[] = [
  { reg: "SKC5500A", make: "AION ES ELECTRIC", power: "100", year: "2025" },
  { reg: "SGT5899C" },
  { reg: "SVT02934G" },
];

export const makeOptions = ["AION ES ELECTRIC"];
export const yearOptions = ["2025"];
export const ncdOptions = ["10%"];
export const drivingExperienceOptions = ["3 years or less"];
export const claimsOptions = ["1"];

export const promo = {
  code: "CAR60",
  successText: "Yay, 60% discount applied",
};

export const copy = {
  badge: "🎉 60% off auto-applied! | Promo ends 31 May",
  title: "Ready to protect your rides with UniCar?",
  subtitle: "Travel with peace of mind with UOI, trusted protection with millions paid in claims",
  myinfoTitle: "Speed up form filling with Myinfo",
  myinfoRetrieveDesc:
    "Retrieve your vehicle and personal details directly from Singpass and it will be filled across your application",
  myinfoClearDesc:
    "Myinfo enables you to retrieve your personal data directly from Singpass, making application convenient",
  multiVehicleAlert:
    "We found 3 vehicles registered under your profile. Please select the vehicle registration number you would like to insure.",
  endDateTooltip:
    "You may select a minimum of 9 months and a maximum of 18 months for your period of insurance.",
  footerLeft: "Copyright © 2026 United Overseas Insurance Limited Co. Reg. No. 197100152R.",
  footerRight: "All Rights Reserved.",
};
