// Plan comparison content, from the UniCar policy wording (PW-V1-Sep2024): the "Policy Benefits / Coverage" table
// says which plan has each section, and Sections 1–6 give the breakdown and limits. Columns follow the prototype's
// plans: Preferred = Comprehensive Plus (any workshop), Essential = Comprehensive Value (authorised workshops only),
// then Third Party Fire & Theft and Third Party Only.

export const comparisonPlans = ["Preferred", "Essential", "Third Party Fire & Theft", "Third Party Only"];

type Values = [string, string, string, string];
export type ComparisonGroup = { title: string; values: Values; rows?: { label: string; values: Values }[] };

const covered = "Covered";
const none = "No cover";
const fireTheft = "Fire and theft only";
const both = (v: string): Values => [v, v, none, none];
const all = (v: string): Values => [v, v, v, v];

export const comparisonTabs: { tab: string; groups: ComparisonGroup[] }[] = [
  {
    tab: "Own damage",
    groups: [
      {
        title: "Loss or damage to your car (Section 1)",
        values: [covered, covered, fireTheft, none],
        rows: [
          // Section 1.1: limited to the prevailing market value at the time of loss.
          { label: "Loss or damage, incl. flood and natural disasters", values: ["Up to market value", "Up to market value", fireTheft, none] },
          { label: "Protection and removal after an accident", values: ["S$500", "S$500", fireTheft, none] },
          { label: "Repairs you can authorise without approval", values: ["S$300", "S$300", fireTheft, none] },
        ],
      },
      {
        title: "Repair workshops",
        values: ["Any workshop", "Authorised only", none, none],
        rows: [
          { label: "Any repair workshops", values: [covered, none, none, none] },
          { label: "Authorised repair workshops", values: [covered, covered, none, none] },
        ],
      },
      {
        title: "Windscreen and window glass",
        values: both(covered),
        rows: [{ label: "Glass replaced without losing your NCD", values: both("Full cost") }],
      },
      {
        // Section 1.9: damage from an accident, so not part of fire and theft cover.
        title: "Private charging station (electric cars)",
        values: both(covered),
      },
    ],
  },
  {
    tab: "Third party",
    groups: [
      {
        title: "Liability to third parties (Section 2)",
        values: all(covered),
        rows: [
          { label: "Death of or bodily injury to any person", values: all("Unlimited") },
          { label: "Damage to property (any one event)", values: all("S$5,000,000") },
          { label: "Legal defence for a charge of causing death by driving", values: all("S$3,000") },
          { label: "Costs and expenses incurred with our consent", values: all(covered) },
        ],
      },
    ],
  },
  {
    tab: "Medical & personal accident",
    groups: [
      {
        title: "Medical Expense (Section 3)",
        values: both(covered),
        rows: [{ label: "Each insured, driver or passenger", values: both("S$300") }],
      },
      {
        title: "Personal Accident – insured driver (Section 4)",
        values: both(covered),
        rows: [
          { label: "Death", values: both("S$20,000") },
          { label: "Loss of sight in both eyes", values: both("S$20,000") },
          { label: "Loss of both hands or feet, or one hand and one foot", values: both("S$20,000") },
          { label: "Loss of one hand or foot and sight in one eye", values: both("S$20,000") },
          { label: "Loss of sight in one eye", values: both("S$10,000") },
          { label: "Loss of one hand or one foot", values: both("S$10,000") },
          { label: "Maximum for any one occurrence", values: both("S$20,000") },
        ],
      },
      {
        title: "Personal Accident – unnamed passengers (Section 4)",
        values: both(covered),
        rows: [
          { label: "Death", values: both("S$10,000") },
          { label: "Loss of sight in both eyes", values: both("S$10,000") },
          { label: "Loss of both hands or feet, or one hand and one foot", values: both("S$10,000") },
          { label: "Loss of one hand or foot and sight in one eye", values: both("S$10,000") },
          { label: "Loss of sight in one eye", values: both("S$5,000") },
          { label: "Loss of one hand or one foot", values: both("S$5,000") },
          { label: "Total disablement from work", values: both("S$50 a week, up to 26 weeks") },
          { label: "Maximum for any one occurrence", values: both("S$10,000") },
        ],
      },
    ],
  },
  {
    tab: "Optional benefits",
    groups: [
      {
        title: "No Claim Discount Protector (Section 5)",
        values: both("Optional"),
        rows: [
          { label: "Available with an NCD of", values: both("30%, 40% or 50%") },
          { label: "Claims allowed per period without losing NCD", values: both("1") },
        ],
      },
      {
        title: "Loss of Use (Section 6)",
        values: both("Optional"),
        rows: [{ label: "Daily benefit when repairs take over 3 days", values: both("Up to 5 days") }],
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
