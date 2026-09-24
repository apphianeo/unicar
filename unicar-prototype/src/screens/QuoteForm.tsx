import { useState, type ReactNode } from "react";
import { Button, DatePicker, Input, Popover, Radio, Select } from "antd";
import type { Dayjs } from "dayjs";
import {
  AlertInfoIcon,
  CalendarIcon,
  ChevronDown,
  ChevronUp,
  CloseIcon,
  DiscountIcon,
  InfoIcon,
  PlusIcon,
  TickIcon,
} from "../assets";
import {
  claimsOptions,
  copy,
  drivingExperienceOptions,
  makeOptions,
  ncdOptions,
  promo,
  singpassVehicles,
  yearOptions,
} from "../data/mock";

export type YesNo = "yes" | "no";

export type FormState = {
  reg?: string;
  make?: string;
  power?: string;
  year?: string;
  offPeak: YesNo;
  start?: Dayjs | null;
  end?: Dayjs | null;
  ncd?: string;
  experience?: string;
  claims?: string;
  driveAtWork: YesNo;
  promoApplied: boolean;
  promoInput: string;
};

// empty  = frame 8383:5191 (before Singpass)
// filled = frames 8517:3153 → 8390:8064 (one vehicle retrieved, vehicle fields locked)
// multi  = frames 8543:25408 → 25868 → 26182 (3 vehicles retrieved, user picks one)
export type FormMode = "empty" | "filled" | "multi";

type Props = {
  mode: FormMode;
  form: FormState;
  setForm: (patch: Partial<FormState>) => void;
  vehicleLocked: boolean;
  onSelectVehicle: (reg: string) => void;
  onCheckPrice: () => void;
};

const toOptions = (values: string[]) => values.map((v) => ({ value: v, label: v }));

function Field({ label, info, children }: { label: string; info?: ReactNode | true; children: ReactNode }) {
  return (
    <div className="flex-1 min-w-0 flex flex-col gap-3">
      <div className="flex items-center gap-2 h-[21px]">
        <span className="text-[14px] leading-[1.5] text-text-primary">{label}</span>
        {info === true && <InfoIcon />}
        {info && info !== true && (
          <Popover content={<p className="w-[256px] text-[14px] leading-[1.5]">{info}</p>} placement="right" arrow>
            <span className="flex cursor-pointer">
              <InfoIcon />
            </span>
          </Popover>
        )}
      </div>
      {children}
    </div>
  );
}

function YesNoRadio({ value, onChange }: { value: YesNo; onChange: (v: YesNo) => void }) {
  return (
    <Radio.Group value={value} onChange={(e) => onChange(e.target.value)} className="h-12 flex items-center">
      <Radio value="yes">Yes</Radio>
      <Radio value="no">No</Radio>
    </Radio.Group>
  );
}

const Row = ({ children }: { children: ReactNode }) => <div className="flex gap-6 w-full">{children}</div>;

const sectionTitle = "text-[18px] font-semibold leading-[1.5] text-text-primary";

export default function QuoteForm({ mode, form, setForm, vehicleLocked, onSelectVehicle, onCheckPrice }: Props) {
  const [regOpen, setRegOpen] = useState(false);
  const regOptions = toOptions(singpassVehicles.map((v) => v.reg));

  const applyPromo = () => {
    if (form.promoInput.trim().toUpperCase() === promo.code) setForm({ promoApplied: true, promoInput: "" });
  };

  return (
    <div className="bg-white rounded-xl p-4 flex flex-col items-end gap-8 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      {mode === "multi" && (
        <div className="w-full flex items-center gap-2 bg-bg-info rounded-lg px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <AlertInfoIcon />
          <p className="text-[14px] leading-[1.5] text-text-primary">{copy.multiVehicleAlert}</p>
        </div>
      )}

      {/* Vehicle details */}
      <div className="w-full flex flex-col gap-6">
        {mode !== "multi" && <p className={sectionTitle}>Vehicle details</p>}
        <Row>
          <Field label="Vehicle registration number">
            <Select
              placeholder="Please select"
              value={form.reg}
              options={regOptions}
              disabled={mode === "filled"}
              open={regOpen}
              onDropdownVisibleChange={setRegOpen}
              suffixIcon={regOpen ? <ChevronUp /> : <ChevronDown />}
              onSelect={(v: string) => onSelectVehicle(v)}
              optionRender={(o) => (
                <div className="flex items-center justify-between">
                  <span>{o.label}</span>
                  {o.value === form.reg && <TickIcon />}
                </div>
              )}
            />
          </Field>
          <Field label="Vehicle make and model" info>
            <Select
              placeholder="Please select"
              value={form.make}
              options={toOptions(makeOptions)}
              disabled={vehicleLocked}
              suffixIcon={<ChevronDown />}
              onChange={(v) => setForm({ make: v })}
            />
          </Field>
        </Row>
        <Row>
          <Field label="Power rating/engine capacity">
            <Input
              placeholder="Enter power rating/engine capacity"
              value={form.power}
              disabled={vehicleLocked}
              onChange={(e) => setForm({ power: e.target.value })}
            />
          </Field>
          <Field label="Year of registration" info>
            <Select
              placeholder="Please select"
              value={form.year}
              options={toOptions(yearOptions)}
              disabled={vehicleLocked}
              suffixIcon={<ChevronDown />}
              onChange={(v) => setForm({ year: v })}
            />
          </Field>
        </Row>
        <div className="w-[484px]">
          <Field label="Off-peak car" info>
            <YesNoRadio value={form.offPeak} onChange={(v) => setForm({ offPeak: v })} />
          </Field>
        </div>
      </div>

      {mode !== "empty" && (
        <>
          {/* Policy details */}
          <div className="w-full flex flex-col gap-6">
            <p className={sectionTitle}>Policy details</p>
            <Row>
              <Field label="Insurance start date">
                <DatePicker
                  format="DD/MM/YYYY"
                  placeholder="DD/MM/YYYY"
                  value={form.start}
                  suffixIcon={<CalendarIcon />}
                  onChange={(d) => setForm({ start: d })}
                />
              </Field>
              <Field label="Insurance end date" info={copy.endDateTooltip}>
                <DatePicker
                  format="DD/MM/YYYY"
                  placeholder="DD/MM/YYYY"
                  value={form.end}
                  suffixIcon={<CalendarIcon />}
                  onChange={(d) => setForm({ end: d })}
                />
              </Field>
            </Row>
            <Row>
              <Field label="No claims discount (NCD)" info>
                <Select
                  placeholder="Please select"
                  value={form.ncd}
                  options={toOptions(ncdOptions)}
                  suffixIcon={<ChevronDown />}
                  onChange={(v) => setForm({ ncd: v })}
                />
              </Field>
              <Field label="Years of driving experience">
                <Select
                  placeholder="Please select"
                  value={form.experience}
                  options={toOptions(drivingExperienceOptions)}
                  suffixIcon={<ChevronDown />}
                  onChange={(v) => setForm({ experience: v })}
                />
              </Field>
            </Row>
            <Row>
              <Field label="Claims made in the last 3 years" info>
                <Select
                  placeholder="Please select"
                  value={form.claims}
                  options={toOptions(claimsOptions)}
                  suffixIcon={<ChevronDown />}
                  onChange={(v) => setForm({ claims: v })}
                />
              </Field>
              <Field label="I drive at work" info>
                <YesNoRadio value={form.driveAtWork} onChange={(v) => setForm({ driveAtWork: v })} />
              </Field>
            </Row>
          </div>

          <div className="w-full h-px bg-line" />

          {/* Promo code + agent */}
          <div className="w-full flex flex-col gap-3">
            <div className="w-[320px] flex flex-col gap-2">
              <div className="h-12 flex items-center justify-between gap-2 bg-white border border-solid border-line rounded-lg px-4">
                {form.promoApplied ? (
                  <span className="flex items-center gap-2 bg-bg-disabled rounded-lg px-2 py-1">
                    <DiscountIcon />
                    <span className="text-[14px] leading-[1.5]">{promo.code}</span>
                    <button
                      aria-label="Remove promo code"
                      className="flex p-0 border-0 bg-transparent cursor-pointer"
                      onClick={() => setForm({ promoApplied: false })}
                    >
                      <CloseIcon />
                    </button>
                  </span>
                ) : (
                  <input
                    className="flex-1 min-w-0 border-0 outline-none text-[14px] font-sans"
                    value={form.promoInput}
                    onChange={(e) => setForm({ promoInput: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                  />
                )}
                <button
                  className="p-0 border-0 bg-transparent cursor-pointer text-[14px] font-medium leading-[1.5] text-primary font-sans"
                  onClick={applyPromo}
                >
                  Apply
                </button>
              </div>
              {form.promoApplied && (
                <p className="text-[12px] font-medium leading-[1.4] text-success">{promo.successText}</p>
              )}
            </div>
            <button className="self-start flex items-center gap-2 p-0 border-0 bg-transparent cursor-pointer font-sans">
              <span className="text-[14px] font-medium leading-[1.5] text-text-tertiary">Have an Agent ID?</span>
              <PlusIcon />
            </button>
          </div>

          <Button type="primary" onClick={onCheckPrice} className="!h-auto !px-8 !py-[14px] !text-[16px] !font-medium">
            Check Price
          </Button>
        </>
      )}
    </div>
  );
}
