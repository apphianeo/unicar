import { assets } from "../assets";
import { Button } from "./Button";

// "Retrieve singpass" card before retrieval (8391:11173)
export function RetrieveSingpass({ onRetrieve }: { onRetrieve: () => void }) {
  return (
    <div className="flex w-full items-start rounded-[8px] bg-bg-white p-[16px]">
      <div className="flex min-w-px flex-[1_0_0] items-center gap-[12px]">
        <div className="flex min-w-px flex-[1_0_0] flex-col items-start justify-center gap-[4px] leading-[1.5]">
          <p className="whitespace-nowrap text-[18px] font-semibold text-text-primary">
            Speed up form filling with Myinfo
          </p>
          <p className="w-full text-[14px] font-normal text-text-secondary">
            Retrieve your vehicle and personal details directly from Singpass and it will be filled across your
            application
          </p>
        </div>
        <button type="button" onClick={onRetrieve} className="h-[48px] w-[229px] shrink-0 cursor-pointer">
          <img src={assets.retrieveWithSingpass} alt="Retrieve with Singpass" width={229} height={48} />
        </button>
      </div>
    </div>
  );
}

// "Retrieve singpass" card after vehicles are found (8543:25682)
export function ClearFormCard() {
  return (
    <div className="flex w-full items-start rounded-[8px] bg-bg-white p-[16px]">
      <div className="flex min-w-px flex-[1_0_0] items-center justify-between">
        <div className="flex flex-col items-start justify-center gap-[4px] whitespace-nowrap leading-[1.5]">
          <p className="text-[18px] font-semibold text-text-primary">Speed up form filling with Myinfo</p>
          <p className="text-[14px] font-normal text-text-secondary">
            Myinfo enables you to retrieve your personal data directly from Singpass, making application convenient
          </p>
        </div>
        {/* What Clear Form does is not designed, so it is inert. */}
        <Button variant="secondary">Clear Form</Button>
      </div>
    </div>
  );
}
