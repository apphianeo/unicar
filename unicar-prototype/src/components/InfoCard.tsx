import { Button } from "./Button";

// "Retrieve singpass" card after retrieval (8636:3589)
export function ClearFormCard({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex w-full items-start rounded-[8px] bg-bg-white p-[16px]">
      <div className="flex min-w-px flex-[1_0_0] items-center justify-between">
        <div className="flex flex-col items-start justify-center gap-[4px] whitespace-nowrap leading-[1.5]">
          <p className="text-[18px] font-semibold text-text-primary">Speed up application process with Singpass</p>
          <p className="text-[14px] font-normal text-text-secondary">
            Retrieve your vehicle and personal details securely from Singpass or fill form manually
          </p>
        </div>
        {/* Clears what the user filled in; details retrieved from Singpass stay. */}
        <Button variant="secondary" onClick={onClear}>
          Clear Form
        </Button>
      </div>
    </div>
  );
}
