import type { ReactNode } from "react";
import { assets } from "../assets";
import { Button } from "./Button";
import { FooterShort, Header } from "./Layout";

export type StepNo = 1 | 2 | 3 | 4;

// Steps / Numbered (8391:11779): steps before the current one are ticked, the current one is blue, the rest grey.
// The loading frame (8391:11773) labels step 2 "Add Ons"; every later frame says "Add-Ons".
export function Stepper({ current, addOnsLabel = "Add-Ons" }: { current: StepNo; addOnsLabel?: string }) {
  const labels = ["Select Plan", addOnsLabel, "Driver Details", "Review & Pay"];
  return (
    <div className="flex items-center gap-x-[12px] self-stretch">
      {labels.map((label, i) => {
        const n = (i + 1) as StepNo;
        const state = n < current ? "done" : n === current ? "active" : "waiting";
        return (
          <div key={label} className="flex items-center gap-x-[12px]">
            {i > 0 && (
              // Tail: blue once the step before it is done, grey otherwise.
              <div className="relative h-0 w-[60px] shrink-0">
                <img
                  src={n - 1 < current ? assets.stepTailDone : assets.stepTailWaiting}
                  alt=""
                  width={62}
                  height={2}
                  className="absolute left-[-1px] top-[-1px] block h-[2px] w-[62px] max-w-none"
                />
              </div>
            )}
            <div className="flex shrink-0 items-center gap-[8px]">
              {state === "done" ? (
                <img src={assets.stepDone} alt="" width={24} height={24} className="size-[24px] shrink-0" />
              ) : (
                <div
                  className={`flex size-[24px] shrink-0 items-center justify-center rounded-full ${state === "active" ? "bg-primary-sureblue" : "bg-bg-whitewashed"}`}
                >
                  {/* leading-none puts the digit's visual centre on the circle's centre, as in 8391:11587; at 1.4 the
                      Noto Sans digits sit low. */}
                  <p
                    className={`text-center text-[12px] leading-none ${state === "active" ? "font-medium text-white" : "font-normal text-text-tertiary"}`}
                  >
                    {n}
                  </p>
                </div>
              )}
              <p
                className={`whitespace-nowrap text-[14px] leading-[1.5] ${
                  state === "active"
                    ? "font-medium text-primary-sureblue"
                    : state === "done"
                      ? "font-normal text-text-primary"
                      : "font-normal text-text-tertiary"
                }`}
              >
                {label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Header summary (8394:14597): the car and the period of insurance, stuck to the top while scrolling.
export function HeaderSummary({ make, period, onEdit }: { make: string; period: string; onEdit: () => void }) {
  return (
    <div className="sticky top-0 z-30 flex w-full items-center bg-bg-white px-[32px] py-[12px] shadow-underline">
      <div className="flex items-center gap-[24px]">
        <div className="flex items-center gap-[12px]">
          <img src={assets.car} alt="" width={16} height={16} className="size-[16px] shrink-0" />
          <p className="whitespace-nowrap text-[14px] font-normal leading-[1.5] text-text-primary">{make}</p>
        </div>
        <div className="w-px self-stretch bg-line" />
        <div className="flex items-center gap-[12px]">
          <img src={assets.summaryCalendar} alt="" width={16} height={16} className="size-[16px] shrink-0" />
          <p className="whitespace-nowrap text-[14px] font-normal leading-[1.5] text-text-primary">{period}</p>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="flex shrink-0 cursor-pointer items-center justify-center rounded-[8px] border border-solid border-primary-sureblue bg-bg-white px-[16px] py-[4px] drop-shadow-overlay"
        >
          <span className="whitespace-nowrap text-[14px] font-medium leading-[1.5] text-primary-sureblue">Edit</span>
        </button>
      </div>
    </div>
  );
}

// Page frame for the purchase steps (8391:11581 onwards).
export function FlowShell({
  step,
  summary,
  children,
}: {
  step: StepNo;
  summary: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col items-start bg-bg-whitewashed">
      <Header center={<Stepper current={step} />} />
      {summary}
      <main className="flex w-full flex-[1_0_auto] flex-col items-center p-[32px]">{children}</main>
      <FooterShort />
    </div>
  );
}

// Page title and subtitle (8391:11625)
export function PageTitle({ title, badge, children }: { title: string; badge?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex w-full flex-col items-start gap-[12px]">
      <div className="flex w-full items-center gap-[8px]">
        <p className="flex h-[32px] items-center whitespace-nowrap text-[32px] font-semibold leading-[1.2] text-text-primary">
          {title}
        </p>
        {badge}
      </div>
      <p className="w-full text-[16px] font-normal leading-[1.5] text-text-secondary">{children}</p>
    </div>
  );
}

// Back, Next (8391:11767). Save Draft has no destination in the design, so it is inert.
export function FlowActions({ next, onBack, onNext }: { next: string; onBack: () => void; onNext?: () => void }) {
  return (
    <div className="flex w-full items-center justify-between">
      <Button variant="secondary" onClick={onBack}>
        Back
      </Button>
      <div className="flex items-center gap-[24px]">
        <div className="flex h-[32px] flex-col items-center justify-center">
          <p className="whitespace-nowrap text-center text-[16px] font-medium leading-[1.5] text-primary-sureblue">Save Draft</p>
        </div>
        <Button variant="primary" onClick={onNext}>
          {next}
        </Button>
      </div>
    </div>
  );
}

// Switch (8006:1148): off #D2D5DA with the knob left, on Sure Blue with the knob right.
export function Switch({ on, onChange, label }: { on: boolean; onChange: (on: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-[22.222px] w-[40px] shrink-0 cursor-pointer rounded-full ${on ? "bg-primary-sureblue" : "bg-switch-off"}`}
    >
      <span
        className={`absolute top-[2.22px] size-[17.778px] rounded-full bg-white shadow-knob transition-[left] ${on ? "left-[20px]" : "left-[2.22px]"}`}
      />
    </button>
  );
}

// Badge, state new / discount (8310:9822, 8571:17514)
export function GreenBadge({ children }: { children: ReactNode }) {
  return (
    <div className="flex shrink-0 items-center justify-center rounded-[12px] bg-badge-new px-[8px] py-[4px]">
      <p className="whitespace-nowrap text-center text-[12px] font-medium leading-[1.4] text-white">{children}</p>
    </div>
  );
}

const money = (n: number) => `S$${n.toFixed(2)}`;

type SummaryRow = { label: string; value: string };

// Price summary card (8543:24280 on Add-Ons, I8540:23499 on Driver Details).
// The Driver Details frame drops "Your Car" and writes the headings in sentence case.
export function PriceSummary({
  variant,
  car,
  plan,
  addOns,
  subtotal,
  promoRate,
  gstRate,
  promoCode,
  onEditCar,
  onEditPlan,
  onEditAddOns,
}: {
  variant: "addons" | "driver";
  car?: SummaryRow[];
  plan: SummaryRow;
  addOns: SummaryRow[];
  subtotal: number;
  promoRate: number;
  gstRate: number;
  promoCode: string;
  onEditCar?: () => void;
  onEditPlan: () => void;
  onEditAddOns: () => void;
}) {
  const driver = variant === "driver";
  const discount = Math.round(subtotal * promoRate * 100) / 100;
  const total = Math.round((subtotal - discount) * (1 + gstRate) * 100) / 100;
  const was = Math.round(subtotal * (1 + gstRate) * 100) / 100;
  const heading = "whitespace-nowrap text-[14px] font-semibold leading-[1.5] text-text-primary";
  const rowLabel = "min-w-px flex-[1_0_0] text-[14px] font-normal leading-[1.5] text-text-secondary";
  const rowValue = "whitespace-nowrap text-[14px] font-medium leading-[1.5] text-text-primary";
  const line = <div className="h-px w-full shrink-0 bg-line" />;

  const Section = ({ title, onEdit, rows, gap }: { title: string; onEdit?: () => void; rows: ReactNode; gap: string }) => (
    <div className="flex w-full flex-col items-end justify-center gap-[16px]">
      <div className="flex w-full items-center justify-between">
        <p className={heading}>{title}</p>
        {onEdit ? (
          <button type="button" onClick={onEdit} className="cursor-pointer rounded-[12px]">
            <span className="whitespace-nowrap text-center text-[14px] font-medium leading-[1.5] text-primary-sureblue">Edit</span>
          </button>
        ) : (
          // Add-on Edit is greyed out until an add-on is chosen (8394:12743 vs 8398:39153).
          <p className="whitespace-nowrap text-center text-[14px] font-medium leading-[1.5] text-text-disabled">Edit</p>
        )}
      </div>
      <div className={`flex w-full flex-col items-start ${gap}`}>{rows}</div>
    </div>
  );

  const rows = (items: SummaryRow[]) =>
    items.map((r) => (
      <div key={r.label} className="flex w-full flex-wrap items-center gap-[12px]">
        <p className={rowLabel}>{r.label}</p>
        <p className={rowValue}>{r.value}</p>
      </div>
    ));

  return (
    <div className="sticky top-[81px] flex w-[360px] max-w-[360px] shrink-0 flex-col items-start justify-center drop-shadow-overlay">
      <div className="flex w-full flex-col items-start overflow-clip rounded-t-[12px] bg-primary-sureblue p-[24px]">
        <div className="flex w-full flex-col items-start justify-center gap-[4px] text-white">
          <p className="w-full text-[14px] font-semibold leading-[1.5]">{driver ? "Total amount" : "Total Amount"}</p>
          <div className="flex flex-col items-start gap-[4px] whitespace-nowrap">
            <p className="text-[32px] font-semibold leading-[1.2]">{money(total)}</p>
            <p className="text-[14px] font-normal leading-[1.5] line-through">{money(was)}</p>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-start rounded-b-[12px] bg-bg-white p-[24px]">
        <div className="flex w-full flex-col items-start gap-[24px]">
          {car && (
            <>
              <Section title="Your Car" onEdit={onEditCar} rows={rows(car)} gap="gap-[16px]" />
              {line}
            </>
          )}
          <Section title={driver ? "Your plan" : "Your Plan"} onEdit={onEditPlan} rows={rows([plan])} gap="gap-[12px]" />
          <Section
            title={driver ? "Add-on(s)" : "Add-On(s)"}
            onEdit={addOns.length ? onEditAddOns : undefined}
            rows={
              addOns.length ? (
                rows(addOns)
              ) : (
                <div className="flex w-full flex-wrap items-center gap-[12px]">
                  <p className={rowLabel}>None selected yet</p>
                </div>
              )
            }
            gap="gap-[12px]"
          />
          {line}
          <div className="flex w-full flex-col items-start gap-[16px]">
            <div className={`flex w-full items-center justify-between ${heading}`}>
              <p>Subtotal</p>
              <p>{money(subtotal)}</p>
            </div>
            <div className="flex w-full items-start justify-between">
              <div className="flex flex-col items-start gap-[8px]">
                <p className={heading}>{driver ? "Discount code" : "Discount Code"}</p>
                {/* The chip's ✕ has no designed behaviour, so it is inert. */}
                <div className="flex items-center justify-center gap-[12px] rounded-[8px] bg-summary-chip px-[8px] py-[4px]">
                  <div className="flex items-center gap-[8px]">
                    <img src={assets.discount} alt="" width={16} height={16} className="size-[16px]" />
                    <p className="whitespace-nowrap text-[14px] font-normal leading-[1.5] text-text-primary">{promoCode}</p>
                  </div>
                  <img src={assets.icClose} alt="" width={16} height={16} className="size-[16px]" />
                </div>
              </div>
              <p className="whitespace-nowrap text-[14px] font-medium leading-[1.5] text-status-success">–{money(discount)}</p>
            </div>
          </div>
          {line}
          <div className={`flex w-full items-center justify-between ${heading}`}>
            <p>Total (incl. GST)</p>
            <p>{money(total)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
