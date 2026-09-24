import { useEffect, useRef, useState, type ReactNode } from "react";
import { assets } from "../assets";

const fieldBox =
  "flex h-[48px] w-full items-center gap-[8px] rounded-[8px] border border-solid border-line px-[16px] py-[12px]";
const bodyText = "text-[16px] font-normal leading-[1.5]";
// Focused look taken from the Dropdown "focused" variant (I8543:26154;69:7932).
const focusRing =
  "focus-within:border-primary-sureblue focus-within:shadow-[0_0_0_3px_rgba(0,94,184,0.2)]";

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
  // Closed chevron colour differs per slot in the frames (#6E6E6E or #949494).
  chevron?: ChevronTone;
};

// Dropdown (Input field closed 69:7919, filled 90:1007, disabled 69:7952, focused + dropdown-overlay 69:7932/69:7854)
export function Dropdown({
  label,
  info,
  value,
  disabled,
  options,
  selectable,
  onSelect,
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

  const chevronIcon = disabled
    ? assets.icDownDisabled
    : chevron === "tertiary"
      ? assets.icDownTertiary
      : assets.icDown;

  const text = disabled
    ? "text-text-disabled"
    : value
      ? "text-text-primary"
      : "text-text-tertiary";

  return (
    <div ref={ref} className="relative flex min-w-px flex-[1_0_0] flex-col items-start gap-[12px]">
      <InputHeader label={label} info={info} />
      <button
        type="button"
        disabled={!canOpen}
        onClick={() => setOpen(true)}
        className={`${fieldBox} ${disabled ? "bg-disabled-bg" : "bg-bg-white"} ${canOpen ? "cursor-pointer" : "cursor-default"} text-left`}
      >
        <span className={`min-w-px flex-[1_0_0] ${bodyText} ${text}`}>{value || "Please select"}</span>
        <img src={chevronIcon} alt="" width={16} height={16} className="size-[16px] shrink-0" />
      </button>

      {open && options && (
        <div className="absolute left-0 top-0 z-10 flex w-full flex-col items-start gap-[8px]">
          <div className="flex w-full flex-col items-start gap-[12px]">
            <InputHeader label={label} info={info} />
            <div className="flex w-full flex-col items-start rounded-[8px] border-[3px] border-solid border-[rgba(0,94,184,0.2)]">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-[48px] w-full cursor-pointer items-center gap-[8px] rounded-[8px] border border-solid border-primary-sureblue bg-bg-white px-[16px] py-[12px] text-left"
              >
                <span className={`min-w-px flex-[1_0_0] ${bodyText} ${value ? "text-text-primary" : "text-text-tertiary"}`}>
                  {value || "Please select"}
                </span>
                <img src={assets.icUp} alt="" width={16} height={16} className="size-[16px] shrink-0" />
              </button>
            </div>
          </div>
          <div className="flex w-full items-start overflow-clip rounded-[8px] drop-shadow-overlay">
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
                    className={`flex w-full items-center gap-[10px] bg-bg-white p-[12px] text-left ${pickable ? "cursor-pointer" : "cursor-default"}`}
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
        </div>
      )}
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

// Date Picker (1276:2604 empty, 1276:2736 filled). Typed DD/MM/YYYY; no calendar popup is designed.
export function DateField({
  label,
  info,
  tooltip,
  value,
  onChange,
}: {
  label: string;
  info?: boolean;
  tooltip?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex min-w-px flex-[1_0_0] flex-col items-start gap-[12px]">
      <InputHeader label={label} info={info} tooltip={tooltip} />
      <div className={`${fieldBox} bg-bg-white ${focusRing}`}>
        <input
          value={value}
          inputMode="numeric"
          placeholder="DD/MM/YYYY"
          onChange={(e) => onChange(maskDate(e.target.value))}
          className={`min-w-px flex-[1_0_0] bg-transparent text-text-primary outline-none placeholder:text-text-tertiary ${bodyText}`}
        />
        <img src={assets.calendar} alt="" width={24} height={24} className="size-[24px] shrink-0" />
      </div>
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
