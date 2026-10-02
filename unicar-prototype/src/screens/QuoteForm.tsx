import { Dropdown, RadioGroup, TextField } from "../components/Form";
import { ClearFormCard, RetrieveSingpassCard } from "../components/InfoCard";
import { PageShell } from "../components/Layout";
import { errors, PolicySection, type ErrorKey, type Policy } from "../components/PolicySection";
import { useState } from "react";
import { makeOptions, ncdOptions, powerByMake, singpassVehicle, tooltips, yearOptions } from "../data/mock";
import { parseDate } from "../components/Form";

export type ManualVehicle = { regNo: string; make?: string; power: string; year?: string };

// The quote form (8723:26351 … 8724:30894): About your vehicle, then About you and About your policy revealed as the
// fields above them are filled. In one of three states:
// - "singpass": after Singpass consent (8641:3667 onwards). Vehicle details are filled and locked; the Singpass
//   card with Clear Form stays on top.
// - "cleared": after Clear Form. Vehicle details are keyed in; the card offers Retrieve with Singpass (8642:19917).
// - "manual": Fill Manually from the landing page (8636:3287 onwards). Vehicle details are keyed in; the same
//   Retrieve with Singpass card sits on top so the user can still switch to Singpass.

export type FormMode = "singpass" | "cleared" | "manual";

type Props = {
  mode: FormMode;
  vehicle: ManualVehicle;
  offPeak: "Yes" | "No";
  policy: Policy;
  onVehicle: (v: Partial<ManualVehicle>) => void;
  onOffPeak: (v: "Yes" | "No") => void;
  onPolicy: (p: Partial<Policy>) => void;
  onClearForm: () => void;
  onRetrieve: () => void;
  onCheckPrice: () => void;
};

export default function QuoteForm({ mode, vehicle, offPeak, policy, onVehicle, onOffPeak, onPolicy, onClearForm, onRetrieve, onCheckPrice }: Props) {
  const filled = mode === "singpass";
  // In the manual state, picking a make fills in its power rating and locks it (8649:7800).
  const lockedPower = !filled && vehicle.make ? powerByMake[vehicle.make] : undefined;
  const vehicleDone = filled || (!!vehicle.regNo && !!vehicle.make && !!(lockedPower ?? vehicle.power) && !!vehicle.year);
  const canCheckPrice =
    vehicleDone &&
    !!policy.ncd &&
    !!policy.experience &&
    !!policy.claims &&
    !!parseDate(policy.startDate) &&
    !!parseDate(policy.endDate);
  // Check Price is always the primary button. Pressed with fields still empty, it marks each visible empty field
  // with an inline error and scrolls to the first one.
  // Only fields that were on screen and empty at the press are flagged, so a section revealed afterwards starts clean.
  const [flagged, setFlagged] = useState<ErrorKey[]>([]);
  const err = (key: ErrorKey, empty: boolean) => (flagged.includes(key) && empty ? errors[key] : undefined);
  const checkPrice = () => {
    if (canCheckPrice) return onCheckPrice();
    const showAboutYou = !!policy.ncd;
    const showPolicy = showAboutYou && !!policy.experience && !!policy.claims;
    const empty: Record<ErrorKey, boolean> = {
      regNo: !filled && !vehicle.regNo,
      make: !filled && !vehicle.make,
      power: !filled && !(lockedPower ?? vehicle.power),
      year: !filled && !vehicle.year,
      ncd: !policy.ncd,
      experience: showAboutYou && !policy.experience,
      claims: showAboutYou && !policy.claims,
      startDate: showPolicy && !parseDate(policy.startDate),
      endDate: showPolicy && !parseDate(policy.endDate),
    };
    setFlagged((Object.keys(empty) as ErrorKey[]).filter((k) => empty[k]));
    requestAnimationFrame(() =>
      document.querySelector("[data-field-error]")?.scrollIntoView({ behavior: "smooth", block: "center" }),
    );
  };

  const form = (
    <div className="flex w-full flex-col items-end justify-center gap-[32px] rounded-[12px] bg-bg-white p-[16px] drop-shadow-overlay">
      <div className="flex w-full flex-col items-start gap-[24px]">
        <p className="whitespace-nowrap text-[18px] font-semibold leading-[1.5] text-text-primary">About your vehicle</p>
        <div className="flex w-full items-start gap-[24px]">
          {filled ? (
            <TextField label="Vehicle registration number" placeholder="" value={singpassVehicle.regNo} disabled />
          ) : (
            <TextField
              label="Vehicle registration number"
              placeholder="Enter vehicle registration number"
              value={vehicle.regNo}
              error={err("regNo", !vehicle.regNo)}
              onChange={(regNo) => onVehicle({ regNo })}
            />
          )}
          <Dropdown
            label="Vehicle make and model"
            info
            tooltip={tooltips.make}
            value={filled ? singpassVehicle.make : vehicle.make}
            disabled={filled}
            error={err("make", !filled && !vehicle.make)}
            options={makeOptions}
            onSelect={(make) => onVehicle({ make, power: powerByMake[make] ?? "" })}
          />
        </div>
        <div className="flex w-full items-start gap-[24px]">
          <TextField
            label="Power rating/engine capacity"
            placeholder="Power rating/engine capacity"
            value={filled ? singpassVehicle.power : (lockedPower ?? vehicle.power)}
            disabled={filled || !!lockedPower}
            disabledTone={filled ? "disabled" : "tertiary"}
            error={err("power", !filled && !(lockedPower ?? vehicle.power))}
            onChange={(power) => onVehicle({ power })}
          />
          <Dropdown
            label="Year of registration"
            info
            tooltip={tooltips.year}
            value={filled ? singpassVehicle.year : vehicle.year}
            disabled={filled}
            error={err("year", !filled && !vehicle.year)}
            options={yearOptions}
            onSelect={(year) => onVehicle({ year })}
          />
        </div>
        <div className="flex w-full items-start gap-[24px]">
          <Dropdown
            label="No claims discount (NCD)"
            info
            tooltip={tooltips.ncd}
            value={policy.ncd}
            error={err("ncd", !policy.ncd)}
            options={ncdOptions}
            onSelect={(ncd) => onPolicy({ ncd })}
          />
          <RadioGroup
            label="Off-peak car"
            tooltip={tooltips.offPeak}
            value={offPeak}
            onChange={onOffPeak}
            className="h-[81px] min-w-px flex-[1_0_0]"
          />
        </div>
      </div>
      <PolicySection
        policy={policy}
        onPolicy={onPolicy}
        showAboutYou={!!policy.ncd}
        err={err}
        onCheckPrice={checkPrice}
      />
    </div>
  );

  return (
    <PageShell>
      {mode === "singpass" && (
        <ClearFormCard
          onClear={() => {
            setFlagged([]);
            onClearForm();
          }}
        />
      )}
      {(mode === "cleared" || mode === "manual") && <RetrieveSingpassCard onRetrieve={onRetrieve} />}
      {form}
    </PageShell>
  );
}
