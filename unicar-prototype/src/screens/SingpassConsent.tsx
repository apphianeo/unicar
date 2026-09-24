import { ConsentListImage, SingpassLogo } from "../assets";

// Frame 8387:7681 — Singpass consent (shown after "Retrieve with Singpass").
export default function SingpassConsent({ onCancel, onAgree }: { onCancel: () => void; onAgree: () => void }) {
  return (
    <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center py-[91px] font-['Inter',sans-serif]">
      <div className="w-[636px] flex flex-col items-center gap-[26px]">
        <div className="w-full border-[0.8px] border-solid border-line rounded-[10px] overflow-hidden">
          <div className="bg-[#e6e5e8] border-0 border-t-4 border-solid border-[#ed1a3b] rounded-t-[10px] p-[26px] flex flex-col items-center gap-[29px]">
            <SingpassLogo />
            <div className="w-full text-[14.6px] text-text-secondary">
              <p>
                Singpass retrieves personal data from relevant government agencies to pre-fill the relevant fields,
                making digital transactions faster and more convenient.
              </p>
              <p>&#8203;</p>
              <p className="font-bold text-text-primary">
                United Overseas Insurance is requesting your information from Singpass to fill the form.
              </p>
            </div>
          </div>
          <div className="bg-white p-[26px]">
            <ConsentListImage />
          </div>
        </div>

        <p className="text-[13px] text-text-secondary">
          Clicking the “I Agree” button permits the digital service to retrieve your data based on the{" "}
          <a className="text-primary no-underline cursor-pointer">Terms of Use.</a>
        </p>

        <div className="flex gap-[26px]">
          <button
            onClick={onCancel}
            className="h-[39px] px-[26px] rounded-lg bg-white border-[0.8px] border-solid border-line text-[13px] font-medium text-text-secondary font-sans cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onAgree}
            className="h-[39px] px-[26px] rounded-lg bg-[#d93841] border-0 text-[13px] font-medium text-white font-sans cursor-pointer"
          >
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
}
