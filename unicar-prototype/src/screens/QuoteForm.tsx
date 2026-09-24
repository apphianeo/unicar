import { assets } from "../assets";
import { Button, TextButton } from "../components/Button";
import {
  DateField,
  Divider,
  Dropdown,
  InfoAlert,
  PromoField,
  RadioGroup,
  TextField,
} from "../components/Form";
import { ClearFormCard, RetrieveSingpass } from "../components/InfoCard";
import { FooterShort, Header, LandingBanner } from "../components/Layout";
import {
  claimsOptions,
  experienceOptions,
  ncdOptions,
  promoCode,
  registrationNumbers,
  vehicleDetails,
} from "../data/mock";

// quote  = 8383:5191 Get quote
// filled = 8517:3153 Singpass filled / 8390:8064 fields filled
// found  = 8543:25408 vehicles found, 8543:25868 dropdown open, 8543:26182 vehicle picked
export type QuoteStep = "quote" | "filled" | "found";

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
  // Registration picked in the "found" state; its details lock once confirmed.
  regNo?: string;
  vehicleConfirmed: boolean;
  offPeak: "Yes" | "No";
  power: string;
  policy: Policy;
  onRetrieve: () => void;
  onCheckPrice: () => void;
  onPickVehicle: (regNo: string) => void;
  onOffPeak: (v: "Yes" | "No") => void;
  onPower: (v: string) => void;
  onPolicy: (p: Partial<Policy>) => void;
};

export default function QuoteForm(props: Props) {
  const { step, regNo, vehicleConfirmed, offPeak, power, policy, onPolicy } = props;
  const retrieved = step === "filled" ? vehicleDetails.SKC5500A : undefined;
  const picked = step === "found" && vehicleConfirmed && regNo ? vehicleDetails[regNo] : undefined;
  const locked = retrieved ?? picked;

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-bg-whitewashed">
      <Header />
      <section className="relative flex w-full flex-[1_0_auto] flex-col items-center overflow-hidden px-[24px] py-[52px]">
        {/* Supplied hero photo. The Figma header fill (8bb609…) also darkens it and fades into the page; that composite is still to come. */}
        <img src={assets.hero} alt="" className="pointer-events-none absolute left-0 top-0 w-full max-w-none" />
        <div className="relative flex w-full max-w-[1000px] flex-col items-start gap-[32px]">
          <LandingBanner />
          <div className="flex w-full flex-col items-start gap-[24px]">
            {step === "found" ? <ClearFormCard /> : <RetrieveSingpass onRetrieve={props.onRetrieve} />}

            <div className="flex w-full flex-col items-end justify-center gap-[32px] rounded-[12px] bg-bg-white p-[16px] drop-shadow-overlay">
              {step === "found" && (
                <InfoAlert>
                  We found 3 vehicles registered under your profile. Please select the vehicle registration number you
                  would like to insure.
                </InfoAlert>
              )}

              <div className="flex w-full flex-col items-start gap-[24px]">
                {step !== "found" && (
                  <p className="whitespace-nowrap text-[18px] font-semibold leading-[1.5] text-text-primary">
                    Vehicle details
                  </p>
                )}
                <div className="flex w-full items-start gap-[24px]">
                  {step === "found" ? (
                    <Dropdown
                      label="Vehicle registration number"
                      value={regNo}
                      options={registrationNumbers}
                      selectable={Object.keys(vehicleDetails)}
                      onSelect={props.onPickVehicle}
                    />
                  ) : (
                    <Dropdown label="Vehicle registration number" value={retrieved && "SKC5500A"} disabled={!!retrieved} />
                  )}
                  <Dropdown
                    label="Vehicle make and model"
                    info
                    value={locked?.make}
                    disabled={!!locked}
                    chevron={step === "found" ? "tertiary" : "default"}
                  />
                </div>
                <div className="flex w-full items-start gap-[24px]">
                  <TextField
                    label="Power rating/engine capacity"
                    placeholder="Enter power rating/engine capacity"
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

              {step !== "quote" && (
                <>
                  <div className="flex w-full flex-col items-start gap-[24px]">
                    <p className="whitespace-nowrap text-[18px] font-semibold leading-[1.5] text-text-primary">
                      Policy details
                    </p>
                    <div className="flex w-full items-start gap-[24px]">
                      <DateField
                        label="Insurance start date"
                        value={policy.startDate}
                        onChange={(startDate) => onPolicy({ startDate })}
                      />
                      <DateField
                        label="Insurance end date"
                        info
                        tooltip="You may select a minimum of 9 months and a maximum of 18 months for your period of insurance."
                        value={policy.endDate}
                        rangeStart={policy.startDate}
                        onChange={(endDate) => onPolicy({ endDate })}
                      />
                    </div>
                    <div className="flex w-full items-start gap-[24px]">
                      <Dropdown
                        label="No claims discount (NCD)"
                        info
                        value={policy.ncd}
                        options={ncdOptions}
                        onSelect={(ncd) => onPolicy({ ncd })}
                      />
                      <Dropdown
                        label="Years of driving experience"
                        value={policy.experience}
                        options={experienceOptions}
                        onSelect={(experience) => onPolicy({ experience })}
                      />
                    </div>
                    <div className="flex w-full items-start gap-[24px]">
                      <Dropdown
                        label="Claims made in the last 3 years"
                        info
                        value={policy.claims}
                        options={claimsOptions}
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
                  <Button variant="primary" onClick={step === "filled" ? props.onCheckPrice : undefined}>
                    Check Price
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      <FooterShort />
    </div>
  );
}
