import { assets } from "../assets";
import { Button } from "./Button";

const cardTitle = "Speed up application process with Singpass";
const cardText = "Retrieve your vehicle and personal details securely from Singpass or fill form manually";

// "Retrieve singpass" card after Singpass autofill (8636:3589): Clear Form lets the user fill in manually.
export function ClearFormCard({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex w-full items-start rounded-[8px] bg-bg-white p-[16px]">
      <div className="flex min-w-px flex-[1_0_0] items-center justify-between">
        <div className="flex flex-col items-start justify-center gap-[4px] whitespace-nowrap leading-[1.5]">
          <p className="text-[18px] font-semibold text-text-primary">{cardTitle}</p>
          <p className="text-[14px] font-normal text-text-secondary">{cardText}</p>
        </div>
        <Button variant="secondary" onClick={onClear}>
          Clear Form
        </Button>
      </div>
    </div>
  );
}

// "Retrieve singpass" card after Clear Form (8642:19917): lets the user go back to Singpass.
export function RetrieveSingpassCard({ onRetrieve }: { onRetrieve: () => void }) {
  return (
    <div className="flex w-full items-start rounded-[8px] bg-bg-white p-[16px]">
      <div className="flex min-w-px flex-[1_0_0] items-center gap-[12px]">
        <div className="flex min-w-px flex-[1_0_0] flex-col items-start justify-center gap-[4px] leading-[1.5]">
          <p className="whitespace-nowrap text-[18px] font-semibold text-text-primary">{cardTitle}</p>
          <p className="w-full text-[14px] font-normal text-text-secondary">{cardText}</p>
        </div>
        <button type="button" onClick={onRetrieve} className="h-[48px] w-[229px] shrink-0 cursor-pointer">
          <img src={assets.retrieveWithSingpass} alt="Retrieve with Singpass" width={229} height={48} />
        </button>
      </div>
    </div>
  );
}
