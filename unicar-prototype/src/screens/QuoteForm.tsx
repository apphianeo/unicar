import { assets } from "../assets";
import { Button, TextButton } from "../components/Button";
import { DateField, Divider, Dropdown, InfoAlert, PromoField, RadioGroup, TextField } from "../components/Form";
import { ClearFormCard } from "../components/InfoCard";
import { PageShell } from "../components/Layout";
import { claimsOptions, experienceOptions, ncdOptions, promoCode, registrationNumbers, vehicleDetails } from "../data/mock";

// found   = 8543:25408 (3 vehicles found) and 8543:25868 (registration dropdown open)
// picked  = 8543:26182 (vehicle picked: details locked)
// details = 8641:3667 onwards (Vehicle details locked, policy fields being filled)
export type QuoteStep = "found" | "picked" | "details";

export type Policy = {
  startDate: string;
  endDate: string;
  ncd?: string;
  experience?: string;
  claims?: string;
  driveAtWork: "Yes" | "No";
};

type Props = {
  step: QuoteStep;
  regNo?: string;
  offPeak: "Yes" | "No";
  power: string;
  policy: Policy;
  onPickVehicle: (regNo: string) => void;
  onStartPolicy: () => void;
  onOffPeak: (v: "Yes" | "No") => void;
  onPower: (v: string) => void;
  onPolicy: (p: Partial<Policy>) => void;
};

export default function QuoteForm(props: Props) {
  const { step, regNo, offPeak, power, policy, onPolicy, onStartPolicy } = props;
  const locked = step !== "found" && regNo ? vehicleDetails[regNo] : undefined;

  return (
    <PageShell>
      {/* Row 2 groups the card and form with a 24px gap; row 3 frames space them 32px apart. */}
      <div className={`flex w-full flex-col items-start ${step === "details" ? "gap-[32px]" : "gap-[24px]"}`}>
        <ClearFormCard />

        <div className="flex w-full flex-col items-end justify-center gap-[32px] rounded-[12px] bg-bg-white p-[16px] drop-shadow-overlay">
          {step === "found" && (
            <InfoAlert>
              We found 3 vehicles registered under your profile. Please select the vehicle registration number you would
              like to insure.
            </InfoAlert>
          )}

          <div className="flex w-full flex-col items-start gap-[24px]">
            {step === "details" && (
              <p className="whitespace-nowrap text-[18px] font-semibold leading-[1.5] text-text-primary">Vehicle details</p>
            )}
            <div className="flex w-full items-start gap-[24px]">
              {step === "details" ? (
                <Dropdown label="Vehicle registration number" value={regNo} disabled />
              ) : (
                <Dropdown
                  label="Vehicle registration number"
                  value={regNo}
                  options={registrationNumbers}
                  selectable={Object.keys(vehicleDetails)}
                  onSelect={props.onPickVehicle}
                />
              )}
              <Dropdown
                label="Vehicle make and model"
                info
                value={locked?.make}
                disabled={!!locked}
                chevron="tertiary"
              />
            </div>
            <div className="flex w-full items-start gap-[24px]">
              <TextField
                label="Power rating/engine capacity"
                placeholder="Power rating/engine capacity"
                value={locked ? locked.power : power}
                disabled={!!locked}
                onChange={props.onPower}
              />
              <Dropdown label="Year of registration" info value={locked?.year} disabled={!!locked} />
            </div>
            <div className="flex h-[81px] w-full items-start">
              <RadioGroup label="Off-peak car" value={offPeak} onChange={props.onOffPeak} className="h-full w-[484px]" />
            </div>
          </div>

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
        </div>
      </div>
    </PageShell>
  );
}
