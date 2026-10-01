import type { ReactNode } from "react";

// Buttons (desktop, size large): primary 8391:11578, secondary 8543:25706
export function Button({
  variant,
  children,
  onClick,
  compact,
  disabled,
}: {
  variant: "primary" | "secondary";
  children: ReactNode;
  onClick?: () => void;
  // Primary disabled (type=primary disabled): #E0E0E0 fill, Type/color-text-disabled label.
  disabled?: boolean;
  // 24px side padding (confirmation 8600:17436) instead of 32px.
  compact?: boolean;
}) {
  const look = disabled
    ? "bg-btn-disabled text-text-disabled"
    : variant === "primary"
      ? "bg-primary-sureblue text-white"
      : "border border-solid border-line bg-bg-white text-text-secondary";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-[52px] shrink-0 ${disabled ? "cursor-default" : "cursor-pointer"} items-center justify-center rounded-[8px] ${compact ? "px-[24px]" : "px-[32px]"} py-[14px] ${look}`}
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
