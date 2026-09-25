import type { ReactNode } from "react";
import { assets } from "../assets";

// Header (8383:5192)
export function Header() {
  return (
    <header className="relative flex w-full flex-col items-center bg-bg-white px-[24px] py-[12px] shadow-underline">
      <div className="flex w-full items-center justify-between">
        <div className="flex h-[30px] w-[124px] flex-col items-start">
          <img src={assets.logo} alt="UOI" className="h-[30px] w-[60px] object-contain" />
        </div>
        {/* Need Assistance? has no destination in the design, so it is inert. */}
        <div className="flex h-[32px] items-center gap-[4px]">
          <img src={assets.questionMark} alt="" width={20} height={20} className="size-[20px]" />
          <p className="whitespace-nowrap text-center text-[12px] font-medium leading-[1.4] text-text-tertiary">
            Need Assistance?
          </p>
        </div>
      </div>
    </header>
  );
}

// Footer Short (1310:25309)
export function FooterShort() {
  return (
    <footer className="flex w-full items-center justify-between whitespace-nowrap bg-primary-sureblue px-[24px] py-[16px] text-[14px] font-normal leading-[1.5] text-white">
      <p>Copyright © 2026 United Overseas Insurance Limited Co. Reg. No. 197100152R.</p>
      <p className="text-right">All Rights Reserved.</p>
    </footer>
  );
}

// Landing Banner (8383:5202)
export function LandingBanner() {
  return (
    <div className="flex w-full flex-col items-start gap-[16px]">
      <div className="flex items-center justify-center gap-[4px] rounded-[24px] bg-gradient-to-r from-[#005eb8] from-[0.618%] to-[#5c55eb] px-[8px] py-[4px]">
        <p className="whitespace-nowrap text-center text-[12px] font-medium leading-[1.4] text-white">
          🎉 60% off auto-applied! | Promo ends 31 May
        </p>
      </div>
      <div className="flex w-full flex-col items-start gap-[12px]">
        <p className="whitespace-nowrap text-[32px] font-semibold leading-[1.2] text-white">
          Ready to protect your rides with UniCar?
        </p>
        <p className="w-full text-[16px] font-medium leading-[1.5] text-white">
          Travel with peace of mind with UOI, trusted protection with millions paid in claims
        </p>
      </div>
    </div>
  );
}

// Page frame shared by the landing and quote screens. The hero follows the UniTravel prototype
// (apphianeo/purchase-flow): a fixed-height cropped photo (360px, 300px at ≤640px) with the light
// primary gradient panel filling below it, so the image doesn't rescale as fields appear.
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-bg-whitewashed">
      <Header />
      <section className="relative flex w-full flex-[1_0_auto] flex-col items-center px-[24px] py-[52px]">
        <img
          src={assets.hero}
          alt=""
          className="pointer-events-none absolute left-0 top-0 h-[360px] w-full object-cover object-center max-[640px]:h-[300px]"
        />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 top-[360px] rounded-t-[12px] bg-primary-gradient-light max-[640px]:top-[300px]" />
        <div className="relative flex w-full max-w-[1000px] flex-col items-start gap-[32px]">
          <LandingBanner />
          {children}
        </div>
      </section>
      <FooterShort />
    </div>
  );
}
