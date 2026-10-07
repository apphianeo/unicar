import type { ReactNode } from "react";
import { assets } from "../assets";
import { FlowActions, FlowShell, PageTitle } from "../components/Flow";
import { DateField, Dropdown, InputHeader, RadioGroup, TextField } from "../components/Form";
import { experienceOptions, tooltips, type Applicant } from "../data/mock";

export type YesNo = "Yes" | "No";
export type ExtraDriver = { name: string; dob: string; nric: string; experience?: string };
export const emptyExtraDriver: ExtraDriver = { name: "", dob: "", nric: "" };

const lockedBox =
  "flex h-[48px] items-center gap-[8px] rounded-[8px] border border-solid border-line bg-disabled-bg px-[16px] py-[12px] field-disabled";
const lockedText = "min-w-px flex-[1_0_0] text-[16px] font-normal leading-[1.5] text-text-disabled";

// Driver details section card (8394:15060 …). The ic-up in the header has no collapsed state in the design, so it is inert.
// Earlier cards sit above later ones (z), so an open calendar or menu floats over the cards below it.
function Section({ title, z, children }: { title: string; z: number; children: ReactNode }) {
  return (
    <section style={{ zIndex: z }} className="relative flex w-full flex-col items-start gap-[24px] rounded-[12px] bg-bg-white p-[24px] drop-shadow-overlay">
      <div className="flex w-full items-center justify-between">
        <p className="whitespace-nowrap text-[20px] font-semibold leading-[1.2] text-text-primary">{title}</p>
        <img src={assets.icUp24} alt="" width={24} height={24} className="size-[24px] shrink-0" />
      </div>
      <div className="flex w-full flex-col items-start gap-[24px]">{children}</div>
    </section>
  );
}

const Row = ({ children }: { children: ReactNode }) => <div className="flex w-full items-start gap-[24px]">{children}</div>;
const half = "w-[calc(50%-12px)] shrink-0";

// Date of birth picker (purchase-flow DobField): no future dates; opens on January, 30 years back.
const today = new Date(new Date().setHours(0, 0, 0, 0));
const dobStart = new Date(today.getFullYear() - 30, 0, 1);

// Enter Driver Details (8394:15054). After Singpass the applicant details are filled and locked; in the manual flow
// nothing is prefilled and they are typed in. One "Additional driver" card per named driver chosen on Add-Ons.
export default function DriverDetails({
  summary,
  priceSummary,
  make,
  regNo,
  applicant: a,
  fromSingpass,
  onApplicant,
  mainDriver,
  driveAtWork,
  onDriveAtWork,
  extraDrivers,
  onExtraDriver,
  brandNew,
  onBrandNew,
  financing,
  onFinancing,
  onBack,
  onNext,
}: {
  summary: ReactNode;
  priceSummary: ReactNode;
  make: string;
  regNo: string;
  applicant: Applicant;
  fromSingpass: boolean;
  onApplicant: (a: Partial<Applicant>) => void;
  // "I drive at work" is only asked when the applicant said they are the main driver on the quote form.
  mainDriver: YesNo;
  driveAtWork: YesNo;
  onDriveAtWork: (v: YesNo) => void;
  extraDrivers: ExtraDriver[];
  onExtraDriver: (i: number, d: Partial<ExtraDriver>) => void;
  brandNew: YesNo;
  onBrandNew: (v: YesNo) => void;
  financing: YesNo;
  onFinancing: (v: YesNo) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  // A field locked with its Singpass value, or empty and editable in the manual flow.
  const field = (label: string, key: keyof Applicant, placeholder: string) =>
    fromSingpass ? (
      <TextField label={label} required placeholder="" value={a[key]} disabled />
    ) : (
      <TextField label={label} required placeholder={placeholder} value={a[key]} onChange={(v) => onApplicant({ [key]: v })} />
    );
  return (
    <FlowShell step={3} summary={summary}>
      <div className="flex w-full max-w-[1200px] flex-col items-start gap-[24px]">
        <PageTitle title="Enter Driver Details">
          Please provide the driver(s) and vehicle information as applicable to complete your car insurance details
        </PageTitle>
        <div className="flex w-full items-start gap-[24px]">
          <div className="flex min-w-px flex-[1_0_0] flex-col items-start justify-center gap-[60px]">
            <div className="flex w-full flex-col items-start gap-[24px]">
              <Section title="Applicant/main driver details" z={extraDrivers.length + 2}>
                <Row>
                  {field("Full name as per NRIC/FIN", "name", "Enter full name")}
                  {fromSingpass ? (
                    <div className="flex min-w-px flex-[1_0_0] flex-col items-start gap-[12px]">
                      <InputHeader label="Date of birth" required />
                      <div className={`${lockedBox} w-full`}>
                        <p className={lockedText}>{a.dob}</p>
                        <img src={assets.calendarDisabled} alt="" width={24} height={24} className="size-[24px] shrink-0" />
                      </div>
                    </div>
                  ) : (
                    // Same date-of-birth picker as the additional drivers.
                    <DateField
                      label="Date of birth"
                      required
                      value={a.dob}
                      pickMonthYear
                      maxDate={today}
                      initialMonth={dobStart}
                      onChange={(dob) => onApplicant({ dob })}
                    />
                  )}
                </Row>
                <Row>
                  {field("NRIC/FIN", "nric", "Enter NRIC/FIN")}
                  <div className="flex min-w-px flex-[1_0_0] flex-col items-start gap-[12px]">
                    <InputHeader label="Phone no." required />
                    <div className="flex w-full items-start gap-[8px]">
                      {/* +65 is the country code, so it stays fixed in both flows. */}
                      <div className={`${lockedBox} shrink-0`}>
                        <p className="whitespace-nowrap text-[16px] font-normal leading-[1.5] text-text-disabled">{a.phoneCode}</p>
                      </div>
                      {fromSingpass ? (
                        <div className={`${lockedBox} min-w-px flex-[1_0_0]`}>
                          <p className={lockedText}>{a.phone}</p>
                        </div>
                      ) : (
                        // No header of its own: "Phone no." above covers both boxes.
                        <TextField label="" placeholder="Enter phone no." value={a.phone} onChange={(phone) => onApplicant({ phone })} />
                      )}
                    </div>
                  </div>
                </Row>
                <Row>
                  {field("Email address", "email", "Enter email address")}
                  {field("Postal code", "postalCode", "Enter postal code")}
                </Row>
                <Row>
                  {field("Address", "address", "Enter address")}
                  {field("Unit no.", "unit", "Enter unit no.")}
                </Row>
                {mainDriver === "Yes" && (
                  <Row>
                    <RadioGroup
                      label="I drive at work"
                      tooltip={tooltips.driveAtWork}
                      value={driveAtWork}
                      onChange={onDriveAtWork}
                      className={`h-[81px] ${half}`}
                    />
                  </Row>
                )}
              </Section>

              {extraDrivers.map((d, i) => (
                <Section key={i} title={`Additional driver ${i + 1} details`} z={extraDrivers.length + 1 - i}>
                  <Row>
                    <TextField
                      label="Full name as per NRIC/FIN"
                      required
                      placeholder="Enter full name"
                      value={d.name}
                      onChange={(name) => onExtraDriver(i, { name })}
                    />
                    <DateField
                      label="Date of birth"
                      required
                      value={d.dob}
                      pickMonthYear
                      maxDate={today}
                      initialMonth={dobStart}
                      onChange={(dob) => onExtraDriver(i, { dob })}
                    />
                  </Row>
                  <Row>
                    <TextField
                      label="NRIC/FIN"
                      required
                      placeholder="Enter NRIC/FIN"
                      value={d.nric}
                      onChange={(nric) => onExtraDriver(i, { nric })}
                    />
                    <Dropdown
                      label="Years of driving experience"
                      value={d.experience}
                      options={experienceOptions}
                      onSelect={(experience) => onExtraDriver(i, { experience })}
                    />
                  </Row>
                </Section>
              ))}

              <Section title="Vehicle details" z={0}>
                <Row>
                  <Dropdown label="Vehicle make and model" info tooltip={tooltips.make} value={make} disabled />
                  {fromSingpass ? (
                    <TextField label="Chassis number" placeholder="" value={a.chassis} disabled />
                  ) : (
                    <TextField label="Chassis number" placeholder="Enter chassis number" value={a.chassis} onChange={(chassis) => onApplicant({ chassis })} />
                  )}
                </Row>
                <Row>
                  <TextField label="Vehicle registration number" placeholder="" value={regNo} disabled />
                  <RadioGroup
                    label="Brand new vehicle?"
                    tooltip={tooltips.brandNew}
                    value={brandNew}
                    onChange={onBrandNew}
                    className="min-w-px flex-[1_0_0] self-stretch"
                  />
                </Row>
                <Row>
                  <RadioGroup
                    label="Is your car under financing?"
                    info={false}
                    value={financing}
                    onChange={onFinancing}
                    className={`h-[81px] ${half}`}
                  />
                </Row>
              </Section>
            </div>
            <FlowActions next="Next: Review & Pay" onBack={onBack} onNext={onNext} />
          </div>
          {priceSummary}
        </div>
      </div>
    </FlowShell>
  );
}
