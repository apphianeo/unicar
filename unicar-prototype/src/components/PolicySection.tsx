import { assets } from "../assets";
import { claimsOptions, experienceOptions, promoCode, tooltips } from "../data/mock";
import { Button, TextButton } from "./Button";
import { DateField, Divider, Dropdown, parseDate, PromoField, RadioGroup } from "./Form";

export type Policy = {
  startDate: string;
  endDate: string;
  ncd?: string;
  experience?: string;
  claims?: string;
  // "I drive at work" is only asked when the applicant is the main driver.
  mainDriver: "Yes" | "No";
  driveAtWork: "Yes" | "No";
};

// Inline error messages, one per required field.
export const errors = {
  regNo: "Please enter your vehicle registration number",
  make: "Please select your vehicle make and model",
  power: "Please enter your vehicle's power rating/engine capacity",
  year: "Please select your year of registration",
  ncd: "Please select your no claims discount (NCD)",
  experience: "Please select your years of driving experience",
  claims: "Please select the number of claims made in the last 3 years",
  startDate: "Please select your insurance start date",
  endDate: "Please select your insurance end date",
};
export type ErrorKey = keyof typeof errors;

export const emptyPolicy: Policy = { startDate: "", endDate: "", mainDriver: "Yes", driveAtWork: "No" };

const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, d.getDate());
const today = new Date(new Date().setHours(0, 0, 0, 0));

// A new start date fills the end date 365 days later; the user can still change it.
export const defaultEndDate = (start: Date) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + 365);

// Period of insurance: the end date must be 9 to 18 months after the start date.
export function endDateRange(startDate: string) {
  const start = parseDate(startDate);
  return { min: start && addMonths(start, 9), max: start && addMonths(start, 18) };
}

const plural = (n: number, unit: string) => `${n} ${unit}${n === 1 ? "" : "s"}`;

// "Total duration: 1 year" under the end date (8724:30964), in years, months and days.
export function durationText(startDate: string, endDate: string) {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  if (!start || !end || end <= start) return undefined;
  let months = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();
  if (days < 0) {
    months -= 1;
    days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
  }
  const parts = [
    Math.floor(months / 12) && plural(Math.floor(months / 12), "year"),
    months % 12 && plural(months % 12, "month"),
    days && plural(days, "day"),
  ].filter(Boolean);
  return `Total duration: ${parts.join(" ")}`;
}

const sectionTitle = "whitespace-nowrap text-[18px] font-semibold leading-[1.5] text-text-primary";

// "About you" and "About your policy" (8724:30894), revealed one at a time so the form doesn't overwhelm: About you
// appears once NCD is chosen, About your policy once driving experience and claims are chosen. Then the promo and
// Check Price, a primary button throughout: pressed early, it shows inline errors on the empty fields (err).
export function PolicySection({
  policy,
  onPolicy,
  showAboutYou,
  err,
  onCheckPrice,
}: {
  policy: Policy;
  onPolicy: (p: Partial<Policy>) => void;
  showAboutYou: boolean;
  // Error message for a field if errors are showing and it is empty.
  err: (key: ErrorKey, empty: boolean) => string | undefined;
  onCheckPrice: () => void;
}) {
  const { min: endMin, max: endMax } = endDateRange(policy.startDate);
  const showPolicy = showAboutYou && !!policy.experience && !!policy.claims;
  return (
    <>
      {showAboutYou && (
        <>
          <Divider />
          <div className="flex w-full flex-col items-start gap-[24px]">
            <p className={sectionTitle}>About you</p>
            <div className="flex w-full items-start gap-[24px]">
              <RadioGroup
                label="Are you the main driver?"
                info={false}
                value={policy.mainDriver}
                onChange={(mainDriver) => onPolicy({ mainDriver })}
                className="min-w-px flex-[1_0_0] self-stretch"
              />
              {/* Only asked of the main driver. */}
              {policy.mainDriver === "Yes" ? (
                <RadioGroup
                  label="Do you drive at work?"
                  info={false}
                  value={policy.driveAtWork}
                  onChange={(driveAtWork) => onPolicy({ driveAtWork })}
                  className="h-[81px] min-w-px flex-[1_0_0]"
                />
              ) : (
                <div className="h-[81px] min-w-px flex-[1_0_0]" />
              )}
            </div>
            <div className="flex w-full items-start gap-[24px]">
              <Dropdown
                label="Years of driving experience"
                value={policy.experience}
                error={err("experience", !policy.experience)}
                options={experienceOptions}
                onSelect={(experience) => onPolicy({ experience })}
              />
              <Dropdown
                label="Claims made in the last 3 years"
                info
                tooltip={tooltips.claims}
                value={policy.claims}
                error={err("claims", !policy.claims)}
                options={claimsOptions}
                onSelect={(claims) => onPolicy({ claims })}
              />
            </div>
          </div>
        </>
      )}
      {showPolicy && (
        <>
          <Divider />
          <div className="flex w-full flex-col items-start gap-[24px]">
            <p className={sectionTitle}>About your policy</p>
            <div className="flex w-full items-start gap-[24px]">
              <DateField
                label="Insurance start date"
                value={policy.startDate}
                error={err("startDate", !parseDate(policy.startDate))}
                initialMonth={today}
                onChange={(startDate) => onPolicy({ startDate })}
              />
              <DateField
                label="Insurance end date"
                info
                tooltip={tooltips.endDate}
                value={policy.endDate}
                rangeStart={policy.startDate}
                minDate={endMin}
                maxDate={endMax}
                helper={durationText(policy.startDate, policy.endDate)}
                error={err("endDate", !parseDate(policy.endDate))}
                onChange={(endDate) => onPolicy({ endDate })}
              />
            </div>
          </div>
        </>
      )}
      <Divider />
      <div className="flex w-full flex-col items-start gap-[12px]">
        <PromoField code={promoCode} />
        <TextButton icon={assets.icPlus}>Have an Agent ID?</TextButton>
      </div>
      <Button variant="primary" onClick={onCheckPrice}>
        Check Price
      </Button>
    </>
  );
}
