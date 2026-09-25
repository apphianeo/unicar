import { useEffect, useRef, useState, type ReactNode } from "react";
import { assets } from "../assets";

const fieldBox =
  "flex h-[48px] w-full items-center gap-[8px] rounded-[8px] border border-solid border-line px-[16px] py-[12px]";
const bodyText = "text-[16px] font-normal leading-[1.5]";
// Focused look taken from the Dropdown "focused" variant (I8543:26154;69:7932).
const focusRing =
  "focus-within:border-primary-sureblue focus-within:shadow-[0_0_0_3px_rgba(0,94,184,0.2)]";
// Same look, applied while a dropdown or date picker is open (the 3px ring sits outside the 48px field).
const openRing = "border-primary-sureblue shadow-[0_0_0_3px_rgba(0,94,184,0.2)]";

// Popover (8571:17325): 16px to the right of the (i) icon, vertically centred on it.
export function Popover({ children }: { children: ReactNode }) {
  return (
    <div className="absolute left-[calc(100%+16px)] top-1/2 z-20 flex w-[280px] max-w-[280px] -translate-y-1/2 items-center drop-shadow-popover">
      <div className="flex min-w-px flex-[1_0_0] flex-col items-start gap-[8px] overflow-clip rounded-[8px] bg-bg-white p-[12px]">
        <p className="w-full text-[14px] font-normal leading-[1.5] text-text-primary">{children}</p>
      </div>
      <img
        src={assets.popoverArrow}
        alt=""
        width={8}
        height={16}
        className="absolute left-[-8px] top-[calc(50%+0.5px)] h-[16px] w-[8px] -translate-y-1/2"
      />
    </div>
  );
}

// Input Header (284:2992 with info icon, 284:2998 without)
export function InputHeader({ label, info, tooltip }: { label: string; info?: boolean; tooltip?: string }) {
  const [hover, setHover] = useState(false);
  return (
    <div className="flex h-[21px] items-center gap-[8px]">
      <p className="whitespace-nowrap text-[14px] font-normal leading-[1.5] text-text-primary">{label}</p>
      {info && (
        <div
          className="relative size-[16px] shrink-0"
          onMouseEnter={() => tooltip && setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <img src={assets.info} alt="" width={16} height={16} className="block size-[16px]" />
          {hover && tooltip && <Popover>{tooltip}</Popover>}
        </div>
      )}
    </div>
  );
}

type ChevronTone = "default" | "tertiary";

type DropdownProps = {
  label: string;
  info?: boolean;
  value?: string;
  disabled?: boolean;
  options?: string[];
  // Options that can be picked; others are shown but inert.
  selectable?: string[];
  onSelect?: (value: string) => void;
  onOpen?: () => void;
  // Closed chevron colour differs per slot in the frames (#6E6E6E or #949494).
  chevron?: ChevronTone;
};

// Dropdown (Input field closed 69:7919, filled 90:1007, disabled 69:7952,
// focused + dropdown-overlay/40 69:7932 / 69:7854: menu 8px below the field, 48px rows, hover row #F6F6F6)
export function Dropdown({
  label,
  info,
  value,
  disabled,
  options,
  selectable,
  onSelect,
  onOpen,
  chevron = "default",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const canOpen = !disabled && !!options?.length;

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const chevronIcon = open
    ? assets.icUp
    : disabled
      ? assets.icDownDisabled
      : chevron === "tertiary"
        ? assets.icDownTertiary
        : assets.icDown;

  const text = disabled ? "text-text-disabled" : value ? "text-text-primary" : "text-text-tertiary";
  const look = disabled
    ? "bg-disabled-bg"
    : open
      ? `bg-bg-white ${openRing}`
      : "bg-bg-white";

  return (
    <div ref={ref} className="relative flex min-w-px flex-[1_0_0] flex-col items-start gap-[12px]">
      <InputHeader label={label} info={info} />
      <div className="relative w-full">
        <button
          type="button"
          disabled={!canOpen}
          onClick={() => {
            if (!open) onOpen?.();
            setOpen(!open);
          }}
          className={`${fieldBox} ${look} ${canOpen ? "cursor-pointer" : "cursor-default"} text-left`}
        >
          <span className={`min-w-px flex-[1_0_0] ${bodyText} ${text}`}>{value || "Please select"}</span>
          <img src={chevronIcon} alt="" width={16} height={16} className="size-[16px] shrink-0" />
        </button>

        {open && options && (
          <div className="absolute left-0 top-[calc(100%+8px)] z-10 flex w-full items-start overflow-clip rounded-[8px] drop-shadow-overlay">
            <div className="flex min-w-px flex-[1_0_0] flex-col items-start">
              {options.map((opt) => {
                const selected = opt === value;
                const pickable = !selectable || selectable.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={!pickable}
                    onClick={() => {
                      onSelect?.(opt);
                      setOpen(false);
                    }}
                    className={`flex h-[48px] w-full items-center gap-[10px] bg-bg-white p-[12px] text-left hover:bg-[#f6f6f6] ${pickable ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <span
                      className={`min-w-px flex-[1_0_0] text-[16px] leading-[1.5] ${selected ? "font-medium text-primary-sureblue" : "font-normal text-text-primary"}`}
                    >
                      {opt}
                    </span>
                    {selected && <img src={assets.icTick} alt="" width={24} height={24} className="size-[24px] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Input Field (text: 69:5632, disabled: 1196:3849)
export function TextField({
  label,
  placeholder,
  value,
  disabled,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  disabled?: boolean;
  onChange?: (v: string) => void;
}) {
  return (
    <div className="flex min-w-px flex-[1_0_0] flex-col items-start gap-[12px]">
      <InputHeader label={label} />
      <div className={`${fieldBox} ${disabled ? "bg-disabled-bg" : `bg-bg-white ${focusRing}`}`}>
        <input
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className={`min-w-px flex-[1_0_0] bg-transparent outline-none placeholder:text-text-tertiary ${bodyText} ${disabled ? "text-text-disabled" : "text-text-primary"}`}
        />
      </div>
    </div>
  );
}

function maskDate(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 8);
  return [d.slice(0, 2), d.slice(2, 4), d.slice(4, 8)].filter(Boolean).join("/");
}

export function parseDate(v: string) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);
  if (!m) return undefined;
  const d = new Date(+m[3], +m[2] - 1, +m[1]);
  return d.getMonth() === +m[2] - 1 ? d : undefined;
}

const pad = (n: number) => String(n).padStart(2, "0");
export const formatDate = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
const sameDay = (a?: Date, b?: Date) => !!a && !!b && a.toDateString() === b.toDateString();
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dayText = "whitespace-nowrap text-center text-[14px] font-medium leading-[28px] tracking-[-0.5px] [font-feature-settings:'salt'_1]";

// "Calender" inside Date Picker, state=expanded (UOI DS 1276:2631 start-date, 1276:2809 end-date)
function Calendar({
  selected,
  rangeStart,
  minDate,
  maxDate,
  onPick,
}: {
  selected?: Date;
  // End-date type: highlights the range from the start date to the selected date.
  rangeStart?: Date;
  // Days outside [minDate, maxDate] can't be picked (shown in Type/color-text-disabled).
  minDate?: Date;
  maxDate?: Date;
  onPick: (d: Date) => void;
}) {
  const initial = selected ?? minDate ?? rangeStart ?? new Date();
  const [month, setMonth] = useState(new Date(initial.getFullYear(), initial.getMonth(), 1));
  const selectedTime = selected?.getTime();
  useEffect(() => {
    if (selected) setMonth(new Date(selected.getFullYear(), selected.getMonth(), 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTime]);
  const firstDay = month.getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (Date | undefined)[] = [
    ...Array.from({ length: firstDay }, () => undefined),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)),
  ];
  while (cells.length < 42) cells.push(undefined);
  const weeks = Array.from({ length: 6 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
  const inRange = (d: Date) => !!rangeStart && !!selected && d >= rangeStart && d <= selected && rangeStart < selected;
  const shift = (n: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));
  const header = "whitespace-nowrap text-center text-[18px] font-bold capitalize leading-[28px] text-white [font-feature-settings:'salt'_1]";

  return (
    <div className="flex h-[267px] w-full flex-col items-start bg-bg-white">
      <div className="flex h-[48px] w-full items-center justify-between rounded-tl-[10px] rounded-tr-[10px] bg-primary-sureblue p-[20px]">
        <button type="button" onClick={() => shift(-1)} className="h-[24px] w-[15px] shrink-0 cursor-pointer">
          <img src={assets.chevronLeft} alt="Previous month" width={15} height={24} />
        </button>
        {/* The month and year carets have no designed menu, so they are labels only. */}
        <div className="flex items-center gap-[5px]">
          <p className={header}>{MONTHS[month.getMonth()]}</p>
          <img src={assets.sortDown} alt="" width={12} height={12} className="size-[12px]" />
        </div>
        <div className="flex items-center gap-[5px]">
          <p className={header}>{month.getFullYear()}</p>
          <img src={assets.sortDown} alt="" width={12} height={12} className="size-[12px]" />
        </div>
        <button type="button" onClick={() => shift(1)} className="h-[21px] w-[12px] shrink-0 cursor-pointer">
          <img src={assets.chevronRight} alt="Next month" width={12} height={21} />
        </button>
      </div>
      <div className="flex h-[219px] w-full flex-col items-center rounded-bl-[10px] rounded-br-[10px] border border-solid border-[rgba(0,0,0,0.08)] p-[10px]">
        <div className="flex min-h-px w-full flex-[1_0_0] items-start">
          {WEEKDAYS.map((w) => (
            <div key={w} className="flex min-w-px flex-[1_0_0] items-center justify-center rounded-[4px] pt-[2px]">
              <p className="whitespace-nowrap text-center text-[14px] font-bold leading-[28px] tracking-[-1px] text-text-secondary [font-feature-settings:'salt'_1]">
                {w}
              </p>
            </div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} className="flex min-h-px w-full flex-[1_0_0] items-center justify-center">
            {week.map((d, di) => {
              if (!d) return <div key={di} className="min-w-px flex-[1_0_0]" />;
              const isSel = sameDay(d, selected) || sameDay(d, rangeStart);
              const blocked = (!!minDate && d < minDate) || (!!maxDate && d > maxDate);
              const band = inRange(d);
              const bandShape = `${sameDay(d, rangeStart) ? "rounded-l-[24px]" : ""} ${sameDay(d, selected) ? "rounded-r-[24px]" : ""}`;
              return (
                <button
                  key={di}
                  type="button"
                  disabled={blocked && !isSel}
                  onClick={() => onPick(d)}
                  className={`flex h-[30px] min-w-px flex-[1_0_0] items-center justify-center ${blocked ? "cursor-default" : "cursor-pointer"} ${band ? `bg-[rgba(0,94,184,0.2)] ${bandShape}` : ""}`}
                >
                  {isSel ? (
                    <span className="flex size-[30px] items-center justify-center rounded-[40px] bg-primary-sureblue">
                      <span className={`${dayText} text-white`}>{pad(d.getDate())}</span>
                    </span>
                  ) : (
                    <span className={`${dayText} ${blocked ? "text-text-disabled" : "text-text-primary"}`}>{pad(d.getDate())}</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// Date Picker (collapsed 1276:2604, filled 1276:2736, expanded 1276:3259 / 1276:3256).
// Typing DD/MM/YYYY works too; the calendar opens on focus.
export function DateField({
  label,
  info,
  tooltip,
  value,
  rangeStart,
  minDate,
  maxDate,
  onChange,
  onOpen,
}: {
  label: string;
  info?: boolean;
  tooltip?: string;
  value: string;
  // For the end-date picker: the chosen start date, shown as the start of the range.
  rangeStart?: string;
  // Allowed range for this date (DD/MM/YYYY is rejected outside it).
  minDate?: Date;
  maxDate?: Date;
  onChange: (v: string) => void;
  onOpen?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={ref} className="relative flex min-w-px flex-[1_0_0] flex-col items-start gap-[12px]">
      <InputHeader label={label} info={info} tooltip={tooltip} />
      <div className={`${fieldBox} bg-bg-white ${open ? openRing : ""}`} onClick={() => { onOpen?.(); setOpen(true); }}>
        <input
          value={value}
          inputMode="numeric"
          placeholder="DD/MM/YYYY"
          onFocus={() => { onOpen?.(); setOpen(true); }}
          onChange={(e) => {
            const v = maskDate(e.target.value);
            const d = parseDate(v);
            // A complete date outside the allowed range isn't accepted.
            if (d && ((minDate && d < minDate) || (maxDate && d > maxDate))) return onChange("");
            onChange(v);
          }}
          className={`min-w-px flex-[1_0_0] bg-transparent text-text-primary outline-none placeholder:text-text-tertiary ${bodyText}`}
        />
        <img src={assets.calendar} alt="" width={24} height={24} className="size-[24px] shrink-0" />
      </div>
      {open && (
        // Calendar keeps the DS Date Picker size (265 x 267), left-aligned 8px under the field.
        <div className="absolute left-0 top-[calc(100%+8px)] z-10 w-[265px]">
          <Calendar
            selected={parseDate(value)}
            rangeStart={rangeStart ? parseDate(rangeStart) : undefined}
            minDate={minDate}
            maxDate={maxDate}
            onPick={(d) => {
              onChange(formatDate(d));
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

// Radio Item (unselected 8387:5685, selected 8388:2)
function RadioItem({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex shrink-0 cursor-pointer items-center justify-center gap-[12px]">
      {selected ? (
        <img src={assets.radioSelected} alt="" width={20} height={20} className="size-[20px] shrink-0" />
      ) : (
        <span className="size-[20px] shrink-0 rounded-[10px] border border-solid border-line bg-bg-white" />
      )}
      <span className="whitespace-nowrap text-left text-[16px] font-normal leading-[1.5] text-text-primary">{label}</span>
    </button>
  );
}

export function RadioGroup({
  label,
  value,
  onChange,
  className = "",
}: {
  label: string;
  value: "Yes" | "No";
  onChange: (v: "Yes" | "No") => void;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-start gap-[12px] ${className}`}>
      <InputHeader label={label} info />
      <div className="flex min-h-px w-full flex-[1_0_0] items-center gap-[32px]">
        {(["Yes", "No"] as const).map((opt) => (
          <RadioItem key={opt} label={opt} selected={value === opt} onClick={() => onChange(opt)} />
        ))}
      </div>
    </div>
  );
}

// Alert, type info, style flat (8383:4456)
export function InfoAlert({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full items-center rounded-[8px] bg-statusbg-info px-[16px] py-[12px] drop-shadow-overlay">
      <div className="flex min-w-px flex-[1_0_0] items-center gap-[8px]">
        <img src={assets.infoAlert} alt="" width={16} height={16} className="size-[16px] shrink-0" />
        <p className="whitespace-nowrap text-[14px] font-normal leading-[1.5] text-text-primary">{children}</p>
      </div>
    </div>
  );
}

// Input Button Field with Promo Entered (1229:350)
export function PromoField({ code }: { code: string }) {
  return (
    <div className="flex w-[320px] flex-col items-start gap-[8px]">
      <div className="flex h-[48px] w-full items-center justify-between rounded-[8px] border border-solid border-line bg-bg-white px-[16px] py-[12px]">
        <div className="flex items-center justify-center gap-[8px] rounded-[8px] bg-disabled-bg px-[8px] py-[4px]">
          <div className="flex items-center gap-[8px]">
            <img src={assets.discount} alt="" width={16} height={16} className="size-[16px]" />
            <p className="whitespace-nowrap text-[14px] font-normal leading-[1.5] text-text-primary">{code}</p>
          </div>
          <img src={assets.icClose} alt="" width={16} height={16} className="size-[16px]" />
        </div>
        <p className="whitespace-nowrap text-center text-[14px] font-medium leading-[1.5] text-primary-sureblue">Apply</p>
      </div>
      <p className="whitespace-nowrap text-[12px] font-medium leading-[1.4] text-status-success">Yay, 60% discount applied</p>
    </div>
  );
}

// Line 111
export function Divider() {
  return (
    <div className="relative h-0 w-full shrink-0">
      <img src={assets.line111} alt="" width={968} height={1} className="absolute left-0 top-[-1px] block h-px w-full" />
    </div>
  );
}
