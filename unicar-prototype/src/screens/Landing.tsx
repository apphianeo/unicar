import { assets } from "../assets";
import { PageShell } from "../components/Layout";

// Get quote (8517:2744): Main Container 8521:3651
export default function Landing({ onRetrieve }: { onRetrieve: () => void }) {
  return (
    <PageShell>
      <div className="flex h-[320px] w-full flex-col items-center justify-center gap-[32px] rounded-[12px] bg-bg-white p-[16px] drop-shadow-overlay">
        <div className="flex w-full flex-col items-center justify-center gap-[24px]">
          <div className="flex w-full flex-col items-start gap-[12px] text-center">
            <p className="w-full text-[20px] font-semibold leading-[1.2] text-text-primary">
              Speed up application process with Singpass
            </p>
            <p className="w-full text-[14px] font-normal leading-[1.5] text-text-secondary">
              Retrieve your vehicle and personal details securely from Singpass or fill form manually
            </p>
          </div>
          <div className="flex flex-col items-start gap-[24px]">
            <button type="button" onClick={onRetrieve} className="h-[48px] w-[300px] shrink-0 cursor-pointer">
              <img src={assets.retrieveWithSingpass300} alt="Retrieve with Singpass" width={300} height={48} />
            </button>
            <div className="flex w-full items-center justify-center gap-[16px]">
              <img src={assets.line124} alt="" width={124} height={1} className="h-px min-w-px flex-[1_0_0]" />
              <p className="whitespace-nowrap text-center text-[14px] font-normal leading-[1.5] text-text-tertiary">OR</p>
              <img src={assets.line124} alt="" width={124} height={1} className="h-px min-w-px flex-[1_0_0]" />
            </div>
            {/* Fill Manually leads to a flow that isn't designed yet, so it is inert for now. */}
            <button
              type="button"
              className="flex w-[300px] cursor-pointer items-center justify-center rounded-[8px] border border-solid border-primary-sureblue bg-bg-white px-[24px] py-[12px] drop-shadow-overlay"
            >
              <span className="whitespace-nowrap text-[16px] font-medium leading-[1.5] text-primary-sureblue">
                Fill Manually
              </span>
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
