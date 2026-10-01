import { useState, type ReactNode } from "react";
import { assets } from "../assets";
import { FlowActions, FlowShell, GreenBadge, PageTitle } from "../components/Flow";
import { InfoAlert } from "../components/Form";
import { PlanComparisonDialog } from "../components/PlanComparisonDialog";
import { benefits, geographicalArea, money, policyWordingUrl, promoRate, planDiscountBadge, plans, type PlanId } from "../data/mock";

// Heights of the benefit rows (8394:14876 …): "Own damage - the motor vehicle" wraps to two lines.
const rowHeights = ["h-[21px]", "h-[42px]", "h-[21px]", "h-[21px]", "h-[21px]"];

// Select plan default (8391:11581). The selected plan's column gets the light gradient and a filled button.
export default function SelectPlan({
  summary,
  selected,
  onSelect,
  onBack,
  onNext,
}: {
  summary: ReactNode;
  selected: PlanId;
  onSelect: (id: PlanId) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [comparing, setComparing] = useState(false);
  return (
    <FlowShell step={1} summary={summary}>
      <PlanComparisonDialog open={comparing} onClose={() => setComparing(false)} />
      <div className="flex w-full max-w-[1200px] flex-col items-start gap-[60px]">
        <div className="flex w-full flex-col items-start gap-[24px]">
          <PageTitle title="Select Plan">
            Choose a car insurance plan designed for your vehicle's protection and customise it with additional options at
            any point in the process
          </PageTitle>

          <div className="flex w-full items-stretch justify-center overflow-hidden rounded-[12px] bg-bg-white drop-shadow-overlay">
            {/* Description column */}
            <div className="flex min-w-px flex-[1_0_0] flex-col items-start">
              <div className="flex h-[256px] w-full flex-col items-start justify-end px-[16px] py-[24px]">
                <p className="w-full text-[18px] font-semibold leading-[1.5] text-text-primary">Key benefit(s)</p>
              </div>
              <div className="h-px w-full shrink-0 bg-line" />
              <div className="flex w-full flex-col items-start gap-[32px] px-[16px] py-[24px]">
                {benefits.map((b, i) => (
                  // Single-line rows stay on one line, as drawn ("Excess for authorised driver(s)" is right at the column width).
                  <p
                    key={b}
                    className={`w-full text-[14px] font-semibold leading-[1.5] text-text-primary ${rowHeights[i]} ${rowHeights[i] === "h-[21px]" ? "whitespace-nowrap" : ""}`}
                  >
                    {b}
                  </p>
                ))}
              </div>
            </div>

            {plans.map((plan) => {
              const isSelected = plan.id === selected;
              return (
                <div key={plan.id} className="flex min-w-px flex-[1_0_0] items-stretch">
                  <div className="w-px shrink-0 self-stretch bg-line" />
                  <div className={`flex min-w-px flex-[1_0_0] flex-col items-start ${isSelected ? "bg-primary-gradient-light" : ""}`}>
                    <div className="flex h-[256px] w-full flex-col items-center justify-end gap-[24px] px-[16px] py-[24px]">
                      <div className="flex w-full flex-col items-start gap-[16px]">
                        {plan.popular && (
                          <div className="flex h-[24px] items-center">
                            <div className="flex h-[25px] items-center justify-center gap-[4px] rounded-[24px] bg-primary-gradient px-[8px] py-[4px]">
                              <img src={assets.star} alt="" width={12} height={12} className="size-[12px]" />
                              <p className="whitespace-nowrap text-center text-[12px] font-medium leading-[1.4] text-white">
                                Most popular
                              </p>
                            </div>
                          </div>
                        )}
                        <p className="w-full text-[20px] font-semibold leading-[1.2] text-text-primary">{plan.name}</p>
                        <div className="flex w-full flex-col items-start justify-end gap-[4px]">
                          <p className="whitespace-nowrap text-[18px] font-semibold leading-[1.5] text-text-primary">{money(plan.list * (1 - promoRate))}</p>
                          <div className="flex items-center gap-[8px]">
                            <p className="whitespace-nowrap text-[12px] font-medium leading-[1.4] text-text-secondary line-through">
                              {money(plan.list)}
                            </p>
                            <GreenBadge>{planDiscountBadge}</GreenBadge>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onSelect(plan.id)}
                        className={`flex w-full cursor-pointer items-center justify-center rounded-[8px] border border-solid border-primary-sureblue px-[24px] py-[12px] drop-shadow-overlay ${
                          isSelected ? "bg-primary-sureblue" : "bg-bg-white"
                        }`}
                      >
                        <span
                          className={`whitespace-nowrap text-[16px] font-medium leading-[1.5] ${isSelected ? "text-white" : "text-primary-sureblue"}`}
                        >
                          {isSelected ? "Selected" : "Select"}
                        </span>
                      </button>
                    </div>
                    <div className="h-px w-full shrink-0 bg-line" />
                    <div className="flex w-full flex-col items-center gap-[32px] px-[16px] py-[24px]">
                      {plan.covers.map((covered, i) => (
                        <div
                          key={benefits[i]}
                          className={`flex w-full flex-col items-center ${rowHeights[i]} ${rowHeights[i] === "h-[42px]" ? "" : "justify-center"}`}
                        >
                          <img
                            src={covered ? assets.planTick : assets.planCross}
                            alt={covered ? "Covered" : "Not covered"}
                            width={20}
                            height={20}
                            className="size-[20px] shrink-0"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <InfoAlert>{geographicalArea}</InfoAlert>

          <div className="flex w-full flex-col items-start gap-[8px]">
            <button
              type="button"
              onClick={() => setComparing(true)}
              className="flex h-[32px] cursor-pointer items-center gap-[8px] rounded-[12px]"
            >
              <span className="whitespace-nowrap text-center text-[14px] font-medium leading-[1.5] text-primary-sureblue">
                View Plan Comparison
              </span>
              <img src={assets.icForward} alt="" width={24} height={24} className="size-[24px]" />
            </button>
            <p className="flex h-[32px] items-center text-[14px] font-normal leading-[1.5] text-text-secondary">
              For full summary, please refer to&nbsp;
              <a href={policyWordingUrl} target="_blank" rel="noopener noreferrer" className="text-primary-sureblue">
                policy wording
              </a>
              .
            </p>
          </div>
        </div>
        <FlowActions next="Next: Add-Ons" onBack={onBack} onNext={onNext} />
      </div>
    </FlowShell>
  );
}
