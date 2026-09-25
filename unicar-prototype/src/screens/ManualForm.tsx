import { Dropdown, RadioGroup, TextField } from "../components/Form";
import { PageShell } from "../components/Layout";
import { PolicySection, type Policy } from "../components/PolicySection";
import { makeOptions, powerByMake, yearOptions } from "../data/mock";

export type ManualVehicle = { regNo: string; make?: string; power: string; year?: string };

// Fill Manually (section 8653:12505, 8636:3287 onwards): no Singpass card; vehicle details are keyed in.
export default function ManualForm({
  vehicle,
  offPeak,
  policy,
  onVehicle,
  onOffPeak,
  onPolicy,
}: {
  vehicle: ManualVehicle;
  offPeak: "Yes" | "No";
  policy: Policy;
  onVehicle: (v: Partial<ManualVehicle>) => void;
  onOffPeak: (v: "Yes" | "No") => void;
  onPolicy: (p: Partial<Policy>) => void;
}) {
  // Picking a make fills in its power rating and locks it (8649:7800).
  const lockedPower = vehicle.make ? powerByMake[vehicle.make] : undefined;

  return (
    <PageShell>
      <div className="flex w-full flex-col items-end justify-center gap-[32px] rounded-[12px] bg-bg-white p-[16px] drop-shadow-overlay">
        <div className="flex w-full flex-col items-start gap-[24px]">
          <p className="whitespace-nowrap text-[18px] font-semibold leading-[1.5] text-text-primary">Vehicle details</p>
          <div className="flex w-full items-start gap-[24px]">
            <TextField
              label="Vehicle registration number"
              placeholder="Enter vehicle registration number"
              value={vehicle.regNo}
              onChange={(regNo) => onVehicle({ regNo })}
            />
            <Dropdown
              label="Vehicle make and model"
              info
              value={vehicle.make}
              options={makeOptions}
              onSelect={(make) => onVehicle({ make, power: powerByMake[make] ?? "" })}
            />
          </div>
          <div className="flex w-full items-start gap-[24px]">
            <TextField
              label="Power rating/engine capacity"
              placeholder="Power rating/engine capacity"
              value={lockedPower ?? vehicle.power}
              disabled={!!lockedPower}
              disabledTone="tertiary"
              onChange={(power) => onVehicle({ power })}
            />
            <Dropdown
              label="Year of registration"
              info
              value={vehicle.year}
              options={yearOptions}
              onSelect={(year) => onVehicle({ year })}
            />
          </div>
          <div className="flex h-[81px] w-full items-start">
            <RadioGroup label="Off-peak car" value={offPeak} onChange={onOffPeak} className="h-full w-[484px]" />
          </div>
        </div>
        <PolicySection policy={policy} onPolicy={onPolicy} />
      </div>
    </PageShell>
  );
}
