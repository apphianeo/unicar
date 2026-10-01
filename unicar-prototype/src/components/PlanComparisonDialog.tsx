import { useEffect, useState } from "react";
import { assets } from "../assets";
import { comparisonPlans, comparisonTabs } from "../data/planComparison";

// Plan comparison dialog, laid out like the UniTravel one (InsureTravel file 4326:32850): title and close, category
// chips, a sticky row of plan names, then benefit groups separated by lines. Content from the UniCar policy wording.
export function PlanComparisonDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState(comparisonTabs[0].tab);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  if (!open) return null;
  const groups = comparisonTabs.find((t) => t.tab === tab)!.groups;
  const valueCell = "flex min-h-[40px] min-w-px flex-[1_0_0] items-center justify-center text-center text-[16px] font-medium leading-[1.5] text-text-primary";

  return (
    // Overlay as in the purchase-flow comparison modal; clicking outside the dialog closes it.
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(15,23,42,0.55)] p-[32px]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Compare UniCar Plans"
        className="flex max-h-[88vh] w-full max-w-[1200px] flex-col overflow-hidden rounded-[16px] bg-bg-white shadow-[0_24px_80px_rgba(0,0,0,0.25)]"
      >
        <div className="flex w-full flex-col items-start gap-[24px] border-b border-solid border-line p-[24px]">
          <div className="flex w-full items-center gap-[12px]">
            <p className="min-w-px flex-[1_0_0] text-[20px] font-semibold leading-[1.2] text-black">Compare UniCar Plans</p>
            <button type="button" aria-label="Close" onClick={onClose} className="size-[24px] shrink-0 cursor-pointer">
              <img src={assets.icClose24} alt="" width={24} height={24} className="block size-[24px]" />
            </button>
          </div>
          <div className="flex flex-wrap items-start gap-[12px]">
            {comparisonTabs.map(({ tab: t }) => {
              const active = t === tab;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`flex cursor-pointer items-center justify-center rounded-[24px] px-[12px] py-[8px] text-center text-[14px] leading-[1.5] ${
                    active ? "bg-primary-sureblue font-medium text-white" : "border border-solid border-line bg-bg-white font-normal text-text-primary"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
        <div className="ds-scroll min-h-px flex-[1_0_0] overflow-y-auto">
          <div className="sticky top-0 z-10 flex items-center bg-[#fafafa] px-[32px] py-[8px]">
            <div className="h-[34px] w-[400px] shrink-0" />
            {comparisonPlans.map((p) => (
              <p key={p} className="min-w-px flex-[1_0_0] text-center text-[16px] font-semibold leading-[1.5] text-text-primary">
                {p}
              </p>
            ))}
          </div>
          <div className="flex flex-col items-start gap-[16px] px-[32px] pb-[32px] pt-[12px]">
            {groups.map((g, i) => (
              <div key={g.title} className="flex w-full flex-col gap-[16px]">
                {i > 0 && <div className="h-px w-full bg-[#e5e5e5]" />}
                <div className="flex w-full flex-col gap-[4px]">
                  <div className="flex w-full items-center gap-px">
                    <p className="flex min-h-[40px] w-[400px] shrink-0 items-center text-[16px] font-bold leading-[1.5] text-text-primary">
                      {g.title}
                    </p>
                    {g.values.map((v, j) => (
                      <p key={j} className={valueCell}>
                        {v}
                      </p>
                    ))}
                  </div>
                  {g.rows?.map((r) => (
                    <div key={r.label} className="flex w-full items-center gap-px">
                      <p className="flex min-h-[40px] w-[400px] shrink-0 items-center text-[16px] font-medium leading-[1.5] text-text-primary">
                        {r.label}
                      </p>
                      {r.values.map((v, j) => (
                        <p key={j} className={valueCell}>
                          {v}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
