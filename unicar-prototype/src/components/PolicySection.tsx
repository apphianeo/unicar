import { assets } from "../assets";
import { claimsOptions, experienceOptions, ncdOptions, promoCode } from "../data/mock";
import { Button, TextButton } from "./Button";
import { DateField, Divider, Dropdown, parseDate, PromoField, RadioGroup } from "./Form";

export type Policy = {
  startDate: string;
  endDate: string;
  ncd?: string;
  experience?: string;
  claims?: string;
  driveAtWork: "Yes" | "No";
};

export const emptyPolicy: Policy = { startDate: "", endDate: "", driveAtWork: "No" };

const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, d.getDate());

// Period of insurance: the end date must be 9 to 18 months after the start date.
export function endDateRange(startDate: string) {
  const start = parseDate(startDate);
  return { min: start && addMonths(start, 9), max: start && addMonths(start, 18) };
}

// Policy details, promo and Check Price: the same in the Singpass and manual flows.
export function PolicySection({
  policy,
  onPolicy,
  onStartPolicy,
}: {
  policy: Policy;
  onPolicy: (p: Partial<Policy>) => void;
  onStartPolicy?: () => void;
}) {
  const { min: endMin, max: endMax } = endDateRange(policy.startDate);
  return (
    <>
    <div className="flex w-full flex-col items-start gap-[24px]">
      <p className="whitespace-nowrap text-[18px] font-semibold leading-[1.5] text-text-primary">Policy details</p>
      <div className="flex w-full items-start gap-[24px]">
        <DateField
          label="Insurance start date"
          value={policy.startDate}
          onOpen={onStartPolicy}
          onChange={(startDate) => onPolicy({ startDate })}
        />
        <DateField
          label="Insurance end date"
          info
          tooltip="You may select a minimum of 9 months and a maximum of 18 months for your period of insurance."
          value={policy.endDate}
          rangeStart={policy.startDate}
          minDate={endMin}
          maxDate={endMax}
          onOpen={onStartPolicy}
          onChange={(endDate) => onPolicy({ endDate })}
        />
      </div>
      <div className="flex w-full items-start gap-[24px]">
        <Dropdown
          label="No claims discount (NCD)"
          info
          value={policy.ncd}
          options={ncdOptions}
          onOpen={onStartPolicy}
          onSelect={(ncd) => onPolicy({ ncd })}
        />
        <Dropdown
          label="Years of driving experience"
          value={policy.experience}
          options={experienceOptions}
          onOpen={onStartPolicy}
          onSelect={(experience) => onPolicy({ experience })}
        />
      </div>
      <div className="flex w-full items-start gap-[24px]">
        <Dropdown
          label="Claims made in the last 3 years"
          info
          value={policy.claims}
          options={claimsOptions}
          onOpen={onStartPolicy}
          onSelect={(claims) => onPolicy({ claims })}
        />
        <RadioGroup
          label="I drive at work"
          value={policy.driveAtWork}
          onChange={(driveAtWork) => onPolicy({ driveAtWork })}
          className="min-w-px flex-[1_0_0] self-stretch"
        />
      </div>
    </div>
    <Divider />
    <div className="flex w-full flex-col items-start gap-[12px]">
      <PromoField code={promoCode} />
      <TextButton icon={assets.icPlus}>Have an Agent ID?</TextButton>
    </div>
    {/* The screen after Check Price isn't designed yet. */}
    <Button variant="primary">Check Price</Button>
    </>
  );
}
