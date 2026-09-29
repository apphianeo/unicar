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
  driveAtWork:
    "Select Yes if you use this vehicle for work other than travelling to and from your workplace, such as visiting clients or making deliveries.",
};
