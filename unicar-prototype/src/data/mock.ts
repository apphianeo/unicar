// Only the values that appear in the Figma frames.
export const registrationNumbers = ["SKC5500A", "SGT5899C", "SVT02934G"];

// Retrieved details exist in the design for SKC5500A only.
export const vehicleDetails: Record<string, { make: string; power: string; year: string }> = {
  SKC5500A: { make: "AION ES ELECTRIC", power: "100", year: "2025" },
};

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
