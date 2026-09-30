import { useEffect, useRef } from "react";
import lottie from "lottie-web/build/player/lottie_light";
import animationData from "../assets/success-animation.json";

// Success tick for the confirmation page (the Figma slot 8600:17431 holds a still of a LottieFiles success
// animation). This is LottieFiles' free "Successful" animation (assets.lottiefiles.com/packages/lf20_jbrw3hcz),
// played once. Its 16:9 canvas is scaled so the final circle fills the 120px slot; the burst spills past it.
export function SuccessAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const anim = lottie.loadAnimation({ container: ref.current, renderer: "svg", loop: false, autoplay: true, animationData });
    return () => anim.destroy();
  }, []);
  return (
    <div className="relative size-[120px] shrink-0" role="img" aria-label="Payment successful">
      <div ref={ref} className="pointer-events-none absolute left-[-228px] top-[-102px] h-[324px] w-[576px]" />
    </div>
  );
}
