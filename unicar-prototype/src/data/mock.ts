// Only the values that appear in the Figma frames.
export const registrationNumbers = ["SKC5500A", "SGT5899C", "SVT02934G"];

// Retrieved details exist in the design for SKC5500A only.
export const vehicleDetails: Record<string, { make: string; power: string; year: string }> = {
  SKC5500A: { make: "AION ES ELECTRIC", power: "100", year: "2025" },
};

export const ncdOptions = ["10%"];
export const experienceOptions = ["3 years or less"];
export const claimsOptions = ["1"];

export const promoCode = "CAR60";
