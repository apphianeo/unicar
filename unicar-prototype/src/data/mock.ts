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
