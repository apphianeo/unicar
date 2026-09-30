import { Dropdown, RadioGroup, TextField } from "../components/Form";
import { ClearFormCard, RetrieveSingpassCard } from "../components/InfoCard";
import { PageShell } from "../components/Layout";
import { PolicySection, type Policy } from "../components/PolicySection";
import { makeOptions, powerByMake, singpassVehicle, tooltips, yearOptions } from "../data/mock";

export type ManualVehicle = { regNo: string; make?: string; power: string; year?: string };

// The quote form, in one of three states:
// - "singpass": after Singpass consent (8641:3667 onwards). Vehicle details are filled and locked; the Singpass
//   card with Clear Form stays on top.
// - "cleared": after Clear Form. Vehicle details are keyed in; the card offers Retrieve with Singpass (8642:19917).
// - "manual": Fill Manually from the landing page (8636:3287 onwards). Vehicle details are keyed in; no card.
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

  const form = (
    <div className="flex w-full flex-col items-end justify-center gap-[32px] rounded-[12px] bg-bg-white p-[16px] drop-shadow-overlay">
      <div className="flex w-full flex-col items-start gap-[24px]">
        <p className="whitespace-nowrap text-[18px] font-semibold leading-[1.5] text-text-primary">Vehicle details</p>
        <div className="flex w-full items-start gap-[24px]">
          {filled ? (
            <Dropdown label="Vehicle registration number" value={singpassVehicle.regNo} disabled />
          ) : (
            <TextField
              label="Vehicle registration number"
              placeholder="Enter vehicle registration number"
              value={vehicle.regNo}
              onChange={(regNo) => onVehicle({ regNo })}
            />
          )}
          <Dropdown
            label="Vehicle make and model"
            info
            tooltip={tooltips.make}
            value={filled ? singpassVehicle.make : vehicle.make}
            disabled={filled}
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
            onChange={(power) => onVehicle({ power })}
          />
          <Dropdown
            label="Year of registration"
            info
            tooltip={tooltips.year}
            value={filled ? singpassVehicle.year : vehicle.year}
            disabled={filled}
            options={yearOptions}
            onSelect={(year) => onVehicle({ year })}
          />
        </div>
        <div className="flex h-[81px] w-full items-start">
          <RadioGroup
            label="Off-peak car"
            tooltip={tooltips.offPeak}
            value={offPeak}
            onChange={onOffPeak}
            className="h-full w-[484px]"
          />
        </div>
      </div>
      <PolicySection policy={policy} onPolicy={onPolicy} onCheckPrice={onCheckPrice} />
    </div>
  );

  return (
    <PageShell>
      {mode === "singpass" && <ClearFormCard onClear={onClearForm} />}
      {mode === "cleared" && <RetrieveSingpassCard onRetrieve={onRetrieve} />}
      {form}
    </PageShell>
  );
}
