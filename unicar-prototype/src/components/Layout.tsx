import type { ReactNode } from "react";
import { HeroImage, QuestionIcon, UoiLogo } from "../assets";
import { copy } from "../data/mock";

// Header + hero banner + footer shared by every "Get quote" frame.
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg-page">
      <header className="bg-white px-6 py-3 shadow-[inset_0_-1px_0_0_rgba(0,0,0,0.09)]">
        <div className="flex items-center justify-between">
          <div className="w-[124px]">
            <UoiLogo />
          </div>
          <button className="flex items-center gap-1 h-8 bg-transparent border-0 p-0 cursor-pointer">
            <QuestionIcon />
            <span className="text-[12px] font-medium leading-[1.4] text-text-tertiary">Need Assistance?</span>
          </button>
        </div>
      </header>

      <main className="relative flex-1 flex flex-col items-center px-6 py-[52px] overflow-hidden">
        <HeroImage />
        <div className="relative w-full max-w-[1000px] flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <span
              className="self-start rounded-[24px] px-2 py-1 text-[12px] font-medium leading-[1.4] text-white"
              style={{ background: "linear-gradient(to right, #005eb8 0.6%, #5c55eb)" }}
            >
              {copy.badge}
            </span>
            <div className="flex flex-col gap-3 text-white">
              <h1 className="m-0 text-[32px] font-semibold leading-[1.2]">{copy.title}</h1>
              <p className="text-[16px] font-medium leading-[1.5]">{copy.subtitle}</p>
            </div>
          </div>
          {children}
        </div>
      </main>

      <footer className="bg-primary px-6 py-4 flex items-center justify-between text-[14px] leading-[1.5] text-white">
        <p>{copy.footerLeft}</p>
        <p>{copy.footerRight}</p>
      </footer>
    </div>
  );
}
