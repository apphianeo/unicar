import type { ReactNode } from "react";
import { assets } from "../assets";
import { FlowActions, FlowShell, PageTitle } from "../components/Flow";
import { policyWordingUrl } from "../data/mock";

export type Field = { label: string; value: string };

// Review section card (8394:15430): title, Edit, then the answers two to a row.
function Section({ title, fields, onEdit }: { title: string; fields: Field[]; onEdit: () => void }) {
  return (
    <section className="flex w-full flex-col items-start gap-[24px] rounded-[12px] bg-bg-white p-[16px] drop-shadow-overlay">
      <div className="flex w-full items-center justify-between">
        <p className="whitespace-nowrap text-[20px] font-semibold leading-[1.2] text-text-primary">{title}</p>
        <button type="button" onClick={onEdit} className="cursor-pointer rounded-[12px]">
          <span className="whitespace-nowrap text-center text-[14px] font-medium leading-[1.5] text-primary-sureblue">Edit</span>
        </button>
      </div>
      <div className="grid w-full grid-cols-2 gap-[24px]">
        {fields.map((f) => (
          <div key={f.label} className="flex flex-col items-start justify-center gap-[8px] self-start">
            <p className="whitespace-nowrap text-[14px] font-medium leading-[1.5] text-text-secondary">{f.label}</p>
            <p className="text-[16px] font-normal leading-[1.5] text-text-primary">{f.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// T&C links in link blue (8394:15706).
const termsLink = "text-primary-sureblue";

const declarations: ReactNode[] = [
  "All the data/ information provided in this electronic proposal are true and that I have not misstated or suppressed any material facts",
  "I undertake to inform UOI of any material alteration to these facts whether occurring before or after completion of this contract of insurance",
  "I or any authorized, named or unnamed driver is a resident of Singapore holding a valid NRIC/FIN and Singapore issued Driving License",
  "No driver has his/her license suspended or cancelled within the last 3 years",
  "I am aware that UOI has the right to terminate this contract of insurance if I did not declare material facts such as my accident record if any at the time of application",
  <>
    I agree to the Terms and Conditions set in the{" "}
    <a href={policyWordingUrl} target="_blank" rel="noopener noreferrer" className={termsLink}>
      policy wording
    </a>
  </>,
  // The privacy notice has no link target in the design, so it is styled as a link but goes nowhere.
  <>
    I consent to United Overseas Insurance (“UOI”) in collecting, using, disclosing, and processing my personal data in
    accordance with UOI's <span className={termsLink}>privacy notice</span>
  </>,
];

// Review & Pay: default (8394:15430) and declaration ticked (8394:15715).
export default function Review({
  summary,
  priceSummary,
  applicant,
  extraDrivers,
  vehicle,
  agreed,
  onAgreed,
  onEditDrivers,
  onEditVehicle,
  onBack,
  onPay,
}: {
  summary: ReactNode;
  priceSummary: ReactNode;
  applicant: Field[];
  extraDrivers: Field[][];
  vehicle: Field[];
  agreed: boolean;
  onAgreed: (v: boolean) => void;
  onEditDrivers: () => void;
  onEditVehicle: () => void;
  onBack: () => void;
  onPay: () => void;
}) {
  return (
    <FlowShell step={4} summary={summary}>
      <div className="flex w-full max-w-[1200px] flex-col items-start gap-[24px]">
        <PageTitle title="Review & Pay" />
        <div className="flex w-full items-start gap-[24px]">
          <div className="flex min-w-px flex-[1_0_0] flex-col items-start justify-center gap-[60px]">
            <div className="flex w-full flex-col items-start gap-[24px]">
              <Section title="Applicant/main driver details" fields={applicant} onEdit={onEditDrivers} />
              {extraDrivers.map((d, i) => (
                <Section key={i} title={`Additional driver ${i + 1} details`} fields={d} onEdit={onEditDrivers} />
              ))}
              <Section title="Vehicle details" fields={vehicle} onEdit={onEditVehicle} />
              {/* Terms & Conditions (8394:15705): titled card, declarations in a bordered box at 14px, then the checkbox. */}
              <section className="flex w-full flex-col items-start gap-[24px] rounded-[12px] bg-bg-white p-[16px] drop-shadow-overlay">
                <p className="whitespace-nowrap text-[20px] font-semibold leading-[1.2] text-text-primary">Terms &amp; Conditions</p>
                <div className="flex w-full items-center justify-center rounded-[8px] border border-solid border-line p-[16px]">
                  <div className="min-w-px flex-[1_0_0] text-[14px] font-normal leading-[1.5] text-text-primary">
                    <p>I confirm that:</p>
                    <ul className="list-disc">
                      {declarations.map((d, i) => (
                        <li key={i} className="ms-[21px]">
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={agreed}
                  onClick={() => onAgreed(!agreed)}
                  className="flex w-full cursor-pointer items-center gap-[12px] text-left"
                >
                  <img
                    src={agreed ? assets.checkboxOn : assets.checkboxOff}
                    alt=""
                    width={20}
                    height={20}
                    className="size-[20px] shrink-0"
                  />
                  <span className="min-w-px flex-[1_0_0] text-[16px] font-normal leading-[1.5] text-text-primary">
                    I have read and agree to the above declarations and the policy terms &amp; conditions.
                  </span>
                </button>
              </section>
            </div>
            {/* Confirm & Pay goes on only once the declaration is ticked. */}
            <FlowActions next="Confirm & Pay" onBack={onBack} onNext={() => agreed && onPay()} />
          </div>
          {priceSummary}
        </div>
      </div>
    </FlowShell>
  );
}
