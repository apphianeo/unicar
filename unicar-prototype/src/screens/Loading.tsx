import { useEffect } from "react";
import { assets } from "../assets";
import { Stepper } from "../components/Flow";
import { FooterShort, Header } from "../components/Layout";

// How long the loading screen shows before the plans appear.
const LOADING_MS = 2000;

// Select plan loading (8391:11773), shown after Check Price.
export default function Loading({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, LOADING_MS);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col items-start bg-bg-whitewashed">
      <Header center={<Stepper current={1} addOnsLabel="Add Ons" />} />
      <div className="flex w-full flex-[1_0_auto] items-center justify-center bg-bg-subtleoffwhite py-[32px]">
        <div className="flex flex-col items-center justify-center gap-[24px]" role="status">
          <div className="relative size-[60px] shrink-0">
            <img
              src={assets.spinner}
              alt=""
              width={70}
              height={70}
              className="absolute left-[-5px] top-[-5px] block size-[70px] max-w-none animate-spin [animation-duration:1.2s]"
            />
          </div>
          <p className="w-[354px] text-center text-[16px] font-medium leading-[1.5] text-text-primary">
            Hang tight, finding the best plan for your car…
          </p>
        </div>
      </div>
      <FooterShort />
    </div>
  );
}
