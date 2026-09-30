import { assets } from "../assets";
import { Button } from "../components/Button";
import { FooterShort, Header } from "../components/Layout";

// Confirmation (8600:17327). Log In Customer Portal, Explore other products and "here" have no destination in the
// design, so they are inert.
export default function Confirmation() {
  return (
    <div className="flex min-h-screen w-full flex-col items-start bg-bg-whitewashed">
      <Header />
      <main className="flex w-full flex-[1_0_auto] flex-col items-center gap-[24px] px-[32px] py-[60px]">
        <div className="flex w-full max-w-[1200px] flex-col items-center gap-[24px]">
          {/* Still frame of the success animation used in the design. */}
          <div className="relative size-[120px] shrink-0 overflow-hidden rounded-[92.308px]">
            <img src={assets.success} alt="" width={120} height={120} className="block size-[120px]" />
          </div>
          <div className="flex w-full flex-col items-center gap-[16px] text-text-primary">
            <p className="whitespace-nowrap text-[20px] font-semibold leading-[1.2]">Thank you for your purchase, you’re ready to go.</p>
            <p className="w-full text-center text-[16px] font-normal leading-[1.5]">
              Thank you for insuring with United Overseas Insurance. Your Certificate of Insurance DHOF140000802599 will be
              accessible via UOI Customer Portal. For further assistance, your may contact call us{" "}
              <span className="text-primary-sureblue underline">here</span>.
            </p>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-[16px]">
            <Button variant="primary" compact>
              Log In Customer Portal
            </Button>
            <div className="flex h-[32px] flex-col items-center justify-center rounded-[12px]">
              <p className="whitespace-nowrap text-center text-[16px] font-medium leading-[1.5] text-primary-sureblue">
                Explore other products
              </p>
            </div>
          </div>
        </div>
      </main>
      <FooterShort />
    </div>
  );
}
