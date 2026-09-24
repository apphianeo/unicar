import type { ReactNode } from "react";

// Buttons (desktop, size large): primary 8391:11578, secondary 8543:25706
export function Button({
  variant,
  children,
  onClick,
}: {
  variant: "primary" | "secondary";
  children: ReactNode;
  onClick?: () => void;
}) {
  const look =
    variant === "primary"
      ? "bg-primary-sureblue text-white"
      : "border border-solid border-line bg-bg-white text-text-secondary";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[52px] shrink-0 cursor-pointer items-center justify-center rounded-[8px] px-[32px] py-[14px] ${look}`}
    >
      <span className="whitespace-nowrap text-[16px] font-medium leading-[1.5]">{children}</span>
    </button>
  );
}

// Text button with a right icon, "Have an Agent ID?" (8290:76). Its destination is not designed.
export function TextButton({ children, icon }: { children: ReactNode; icon: string }) {
  return (
    <div className="flex items-center justify-center gap-[8px] rounded-[12px]">
      <p className="whitespace-nowrap text-center text-[14px] font-medium leading-[1.5] text-text-tertiary">
        {children}
      </p>
      <img src={icon} alt="" width={16} height={16} className="size-[16px]" />
    </div>
  );
}
