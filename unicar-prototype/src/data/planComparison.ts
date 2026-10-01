// Plan comparison content, from the UniCar policy wording (PW-V1-Sep2024, "Policy Benefits / Coverage" and
// Sections 2–6). Columns follow the prototype's plans: Preferred = Comprehensive Plus (any workshop), Essential =
// Comprehensive Value (authorised workshops only), then Third Party Fire & Theft and Third Party Only.

export const comparisonPlans = ["Preferred", "Essential", "Third Party Fire & Theft", "Third Party Only"];

type Values = [string, string, string, string];
export type ComparisonGroup = { title: string; values: Values; rows?: { label: string; values: Values }[] };

const covered = "Covered";
const none = "No cover";

export const comparisonTabs: { tab: string; groups: ComparisonGroup[] }[] = [
  {
    tab: "Vehicle damage",
    groups: [
      { title: "Any repair workshops", values: [covered, none, none, none] },
      { title: "Authorised repair workshops", values: [covered, covered, none, none] },
      { title: "Own damage (Section 1)", values: [covered, covered, "Fire and theft only", none] },
      { title: "Windscreen", values: [covered, covered, none, none] },
    ],
  },
  {
    tab: "Third party",
    groups: [
      {
        title: "Third party damage caused by insured driver (Section 2)",
        values: [covered, covered, covered, covered],
        rows: [
          { label: "Death of or bodily injury to any person", values: ["Unlimited", "Unlimited", "Unlimited", "Unlimited"] },
          { label: "Damage to property (any one event)", values: ["S$5,000,000", "S$5,000,000", "S$5,000,000", "S$5,000,000"] },
        ],
      },
    ],
  },
  {
    tab: "Medical & personal accident",
    groups: [
      {
        title: "Medical Expense (Section 3)",
        values: [covered, covered, none, none],
        rows: [{ label: "Each insured, driver or passenger", values: ["S$300", "S$300", none, none] }],
      },
      {
        title: "Personal Accident (Section 4)",
        values: [covered, covered, none, none],
        rows: [
          { label: "Insured driver (maximum for any one occurrence)", values: ["S$20,000", "S$20,000", none, none] },
          { label: "Unnamed passengers (maximum for any one occurrence)", values: ["S$10,000", "S$10,000", none, none] },
        ],
      },
    ],
  },
  {
    tab: "Optional benefits",
    groups: [
      { title: "No Claim Discount Protector (Section 5)", values: ["Optional", "Optional", none, none] },
      {
        title: "Loss of Use (Section 6)",
        values: ["Optional", "Optional", none, none],
        rows: [{ label: "Daily benefit while repair exceeds 3 days", values: ["Up to 5 days", "Up to 5 days", none, none] }],
      },
    ],
  },
  {
    tab: "Assistance",
    groups: [
      { title: "24-Hour Emergency Assistance Service", values: [covered, covered, "Fire only", none] },
      { title: "Accident Towing Services", values: [covered, covered, "Fire only", none] },
    ],
  },
];
