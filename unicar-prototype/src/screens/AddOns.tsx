import type { ReactNode } from "react";
import { assets } from "../assets";
import { FlowActions, FlowShell, GreenBadge, PageTitle, Switch } from "../components/Flow";
import { Dropdown } from "../components/Form";
import { addOns, addOnTabs, excessOptions, namedDriverOptions, type AddOnId, type AddOnTab } from "../data/mock";

const icons: Record<AddOnId, string> = {
  ncd: assets.addonNcd,
  excess: assets.addonExcess,
  drivers: assets.addonDrivers,
  replacement: assets.addonReplace,
  accessories: assets.addonAccessories,
  lossOfUse: assets.addonLoss,
  breakdown: assets.addonBreakdown,
};

export type AddOnState = { selected: AddOnId[]; excess: string; drivers: string };

// Select Add-Ons: Recommended (8394:12743), Vehicle Maintenance (8394:37745), Mobility & Roadside Services (8394:38117).
// Each card switches between the Default and Selected variants of 8535:21169; Policy excess and Additional named
// drivers show their dropdown when selected (8535:21158, 8535:21159).
export default function AddOns({
  summary,
  priceSummary,
  tab,
  onTab,
  state,
  onChange,
  onBack,
  onNext,
}: {
  summary: ReactNode;
  priceSummary: ReactNode;
  tab: AddOnTab;
  onTab: (t: AddOnTab) => void;
  state: AddOnState;
  onChange: (s: Partial<AddOnState>) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const toggle = (id: AddOnId, on: boolean) =>
    onChange({ selected: on ? [...state.selected, id] : state.selected.filter((s) => s !== id) });

  return (
    <FlowShell step={2} summary={summary}>
      <div className="flex w-full max-w-[1200px] flex-[1_0_auto] flex-col items-start gap-[24px]">
        <PageTitle title="Select Add-Ons" badge={<GreenBadge>NEW</GreenBadge>}>
          Supercharge plan coverage with exclusive add-ons
        </PageTitle>
        <div className="flex w-full flex-[1_0_auto] items-start gap-[24px]">
          <div className="flex min-w-px flex-[1_0_0] flex-col items-start justify-between gap-[24px] self-stretch">
            <div className="flex w-full flex-col items-start gap-[24px]">
              {/* Tabs, size medium (8394:37568) */}
              <div className="flex w-full items-start border-b border-solid border-line" role="tablist">
                {addOnTabs.map((t) => {
                  const active = t === tab;
                  return (
                    <button
                      key={t}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => onTab(t)}
                      className="flex cursor-pointer flex-col items-center gap-[12px] px-[12px]"
                    >
                      <span className="h-0 w-full" />
                      <span
                        className={`whitespace-nowrap text-center text-[14px] leading-[1.5] ${active ? "font-medium text-primary-sureblue" : "font-normal text-text-primary"}`}
                      >
                        {t}
                      </span>
                      <span className="relative h-0 w-full">
                        {active && <span className="absolute bottom-0 left-[-12px] right-[-12px] h-[2px] bg-primary-sureblue" />}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="flex w-full flex-col items-start gap-[24px]">
                {addOns
                  .filter((a) => a.tab === tab)
                  .map((a) => {
                    const on = state.selected.includes(a.id);
                    return (
                      <div
                        key={a.id}
                        className={`flex w-full flex-col items-start justify-center rounded-[12px] border border-solid bg-bg-white p-[16px] drop-shadow-overlay ${on ? "border-primary-sureblue" : "border-transparent"}`}
                      >
                        <div className="flex w-full flex-col items-start gap-[12px]">
                          <div className="flex w-full items-center gap-[24px]">
                            <div className="flex min-w-px flex-[1_0_0] items-center gap-[12px]">
                              <div className="flex size-[32px] shrink-0 items-center justify-center rounded-[8px] bg-bluebright-transparent">
                                <img src={icons[a.id]} alt="" width={18} height={18} className="size-[17.778px]" />
                              </div>
                              <p className="min-w-px flex-[1_0_0] text-[18px] font-semibold leading-[1.5] text-text-primary">{a.title}</p>
                            </div>
                            <div className="flex items-center justify-end gap-[12px]">
                              <p className="whitespace-nowrap text-[16px] font-semibold leading-[1.5] text-text-primary">{a.price}</p>
                              <Switch on={on} label={a.title} onChange={(v) => toggle(a.id, v)} />
                            </div>
                          </div>
                          <p className="w-full text-[14px] font-normal leading-[1.5] text-text-secondary">{a.description}</p>
                          {/* View coverage details has no destination in the design, so it is inert. */}
                          <p className="whitespace-nowrap text-[12px] font-normal leading-[1.4] text-primary-sureblue">
                            View coverage details
                          </p>
                          {on && (a.id === "excess" || a.id === "drivers") && (
                            <div className="flex w-full max-w-[320px] items-start">
                              <Dropdown
                                value={a.id === "excess" ? state.excess : state.drivers}
                                options={a.id === "excess" ? excessOptions : namedDriverOptions}
                                onSelect={(v) => onChange(a.id === "excess" ? { excess: v } : { drivers: v })}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            {/* The frames only show "Skip" (nothing selected); the button keeps that label. */}
            <FlowActions next="Skip" onBack={onBack} onNext={onNext} />
          </div>
          {priceSummary}
        </div>
      </div>
    </FlowShell>
  );
}
