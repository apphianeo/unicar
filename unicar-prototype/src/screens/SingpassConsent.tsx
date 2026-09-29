import { assets } from "../assets";

// Singpass consent (8525:3731). Sizes are the frame's own (it is drawn at 81% scale); the frame keeps 90px above and below.
export default function SingpassConsent({ onCancel, onAgree }: { onCancel: () => void; onAgree: () => void }) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#f7f7f7] py-[90px]">
      <div className="flex w-[636px] flex-col items-center gap-[25.926px]">
        <div className="flex w-full flex-col items-start border-[0.81px] border-solid border-line">
          <div className="flex w-full flex-col items-center justify-center gap-[29.167px] rounded-tl-[9.722px] rounded-tr-[9.722px] border-t-[4.051px] border-solid border-[#ed1a3b] bg-[#e6e5e8] p-[25.926px]">
            {/* Plain PNG (640×111): the supplied SVG tiled it, leaving a line of letter tops under the logo. */}
            <img src={assets.singpassLogo} alt="singpass" className="h-[33px] w-[182px] object-contain" />
            <div className="flex w-full items-center justify-center">
              <div className="min-w-px flex-[1_0_0] whitespace-pre-wrap font-inter text-[14.583px] font-normal not-italic leading-normal text-text-secondary">
                <p>
                  Singpass retrieves personal data from relevant government agencies to pre-fill the relevant fields,
                  making digital transactions faster and more convenient.
                </p>
                <p>{"​"}</p>
                <p className="font-bold text-text-primary">
                  United Overseas Insurance is requesting your information from Singpass to fill the form.
                </p>
              </div>
            </div>
          </div>
          {/* Frame 2053140958: the consent list PNG (1731×1528) cropped as in Figma, used directly so it stays sharp. */}
          <div className="flex w-full flex-col items-center justify-center rounded-bl-[9.722px] rounded-br-[9.722px] bg-bg-white p-[25.926px]">
            <div className="relative aspect-[584.148/480.734] w-full overflow-hidden">
              <img
                src={assets.consentList}
                alt="Date of Birth, Email Address, Mobile Number, Principal Name, Nationality/Citizenship, Registered Address, Sex, NRIC/FIN, and vehicle details"
                className="absolute left-[-36.12%] top-[-52.04%] h-[184.76%] w-[172.25%] max-w-none"
              />
            </div>
          </div>
        </div>
        <p className="whitespace-nowrap font-inter text-[12.963px] font-normal not-italic leading-normal text-text-secondary">
          Clicking the “I Agree” button permits the digital service to retrieve your data based on the
          <span className="text-[#dc2626]"> </span>
          {/* Terms of Use has no destination in the design, so it is inert. */}
          <span className="text-primary-sureblue">Terms of Use.</span>
        </p>
        <div className="flex items-start gap-[25.926px]">
          <button
            type="button"
            onClick={onCancel}
            className="flex h-[38.889px] cursor-pointer items-center justify-center rounded-[8px] border-[0.81px] border-solid border-line bg-bg-white px-[25.926px] py-[11.343px]"
          >
            <span className="whitespace-nowrap text-[12.96px] font-medium leading-[1.5] text-text-secondary">Cancel</span>
          </button>
          <button
            type="button"
            onClick={onAgree}
            className="flex h-[38.889px] cursor-pointer items-center justify-center rounded-[8px] bg-[#d93841] px-[25.926px] py-[11.343px]"
          >
            <span className="whitespace-nowrap text-[12.96px] font-medium leading-[1.5] text-white">I Agree</span>
          </button>
        </div>
      </div>
    </div>
  );
}
