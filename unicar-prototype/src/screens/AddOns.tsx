import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { assets } from "../assets";
import { FlowActions, FlowShell, GreenBadge, PageTitle, Switch } from "../components/Flow";
import { Dropdown } from "../components/Form";
import { addOnCost, addOns, excessOptions, namedDriverOptions, type AddOnId } from "../data/mock";

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

// Select Add-Ons (8394:12743): "Your policy excess", always included with its amount dropdown, then every optional
// add-on in one list. Each optional card switches between the Default and Selected variants of 8535:21169; Additional
// named drivers shows its dropdown when selected (8535:21159).
export default function AddOns({
  summary,
  priceSummary,
  state,
  onChange,
  onBack,
  onNext,
}: {
  summary: ReactNode;
  priceSummary: ReactNode;
  state: AddOnState;
  onChange: (s: Partial<AddOnState>) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  // Which card's dropdown is open, and the extra room below the cards so its menu ends above the buttons (8398:39153).
  const [openMenu, setOpenMenu] = useState<AddOnId | null>(null);
  const [room, setRoom] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const list = listRef.current;
    const menu = list?.querySelector("[data-dropdown-menu]");
    if (!list || !menu || !openMenu) return setRoom(0);
    setRoom(Math.max(0, Math.ceil(menu.getBoundingClientRect().bottom - (list.getBoundingClientRect().bottom - room))));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openMenu]);

  const excessAddOn = addOns.find((a) => a.id === "excess")!;
  const optional = addOns.filter((a) => a.id !== "excess");

  const toggle = (id: AddOnId, on: boolean) => {
    if (!on && openMenu === id) setOpenMenu(null);
    onChange({ selected: on ? [...state.selected, id] : state.selected.filter((s) => s !== id) });
  };

  return (
    <FlowShell step={2} summary={summary}>
      <div className="flex w-full max-w-[1200px] flex-[1_0_auto] flex-col items-start gap-[24px]">
        <PageTitle title="Select Add-Ons" badge={<GreenBadge>NEW</GreenBadge>}>
          Supercharge plan coverage with exclusive add-ons
        </PageTitle>
        <div className="flex w-full flex-[1_0_auto] items-start gap-[24px]">
          <div className="flex min-w-px flex-[1_0_0] flex-col items-start justify-between gap-[24px] self-stretch">
            <div className="flex w-full flex-col items-start gap-[32px]">
              {/* Policy excess is part of every policy: no switch, and its amount dropdown always shows (S$600.00 by
                  default). It sits above the optional add-ons so its menu floats over them. */}
              <div className="relative z-[20] flex w-full flex-col items-start gap-[24px]">
                <p className="whitespace-nowrap text-[18px] font-semibold leading-[1.5] text-text-primary">Your policy excess</p>
                <div className="flex w-full flex-col items-start justify-center rounded-[12px] bg-bg-white p-[16px] drop-shadow-overlay">
                  <div className="flex w-full flex-col items-start gap-[12px]">
                    <div className="flex w-full items-center gap-[12px]">
                      <div className="flex size-[32px] shrink-0 items-center justify-center rounded-[8px] bg-bluebright-transparent">
                        <img src={icons.excess} alt="" width={18} height={18} className="size-[17.778px]" />
                      </div>
                      <p className="min-w-px flex-[1_0_0] text-[18px] font-semibold leading-[1.5] text-text-primary">{excessAddOn.title}</p>
                    </div>
                    <p className="w-full text-[14px] font-normal leading-[1.5] text-text-secondary">{excessAddOn.description}</p>
                    {/* View coverage details has no destination in the design, so it is inert. */}
                    <p className="whitespace-nowrap text-[12px] font-normal leading-[1.4] text-primary-sureblue">View coverage details</p>
                    <div className="flex w-full max-w-[320px] items-start">
                      <Dropdown
                        value={state.excess}
                        options={excessOptions}
                        onSelect={(v) => onChange({ excess: v })}
                        onOpenChange={(open) => setOpenMenu(open ? "excess" : null)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col items-start gap-[24px]">
                <p className="whitespace-nowrap text-[18px] font-semibold leading-[1.5] text-text-primary">Optional add-ons</p>
                <div ref={listRef} className="flex w-full flex-col items-start gap-[24px]" style={{ paddingBottom: room }}>
                  {optional.map((a, i) => {
                    const on = state.selected.includes(a.id);
                    // Named drivers show what the chosen number costs ("Free" for 1 or 2).
                    const driversCost = addOnCost("drivers", state.drivers);
                    const price = on && a.id === "drivers" && driversCost ? `S$${driversCost.toFixed(2)}` : a.price;
                    return (
                      <div
                        key={a.id}
                        // Earlier cards sit above later ones, so an open menu floats over the cards below it.
                        style={{ zIndex: optional.length - i }}
                        className={`relative flex w-full flex-col items-start justify-center rounded-[12px] border border-solid bg-bg-white p-[16px] drop-shadow-overlay ${on ? "border-primary-sureblue" : "border-transparent"}`}
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
                              <p className="whitespace-nowrap text-[16px] font-semibold leading-[1.5] text-text-primary">{price}</p>
                              <Switch on={on} label={a.title} onChange={(v) => toggle(a.id, v)} />
                            </div>
                          </div>
                          <p className="w-full text-[14px] font-normal leading-[1.5] text-text-secondary">{a.description}</p>
                          <p className="whitespace-nowrap text-[12px] font-normal leading-[1.4] text-primary-sureblue">
                            View coverage details
                          </p>
                          {on && a.id === "drivers" && (
                            <div className="flex w-full max-w-[320px] items-start">
                              <Dropdown
                                value={state.drivers}
                                options={namedDriverOptions}
                                onSelect={(v) => onChange({ drivers: v })}
                                onOpenChange={(open) => setOpenMenu(open ? a.id : null)}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <FlowActions
              next="Next: Driver Details"
              onBack={onBack}
              onNext={onNext}
            />
          </div>
          {priceSummary}
        </div>
      </div>
    </FlowShell>
  );
}
