import type { CSSProperties, ReactNode } from "react";
import {
  CalendarOutlined,
  CheckOutlined,
  CloseOutlined,
  DownOutlined,
  InfoCircleFilled,
  PlusOutlined,
  QuestionCircleOutlined,
  TagFilled,
  UpOutlined,
} from "@ant-design/icons";

/*
 * Every image/icon the design uses, in one place.
 *
 * The real exports live in Figma (UniCar-Redesign). www.figma.com is blocked by this
 * environment's network policy, so image slots render as labelled placeholders at the
 * exact size/position from the design, and icons use the Ant Design equivalents.
 * To swap in the real files: drop them in src/assets/ and replace the placeholder
 * return values below — no other file needs to change.
 */

function Placeholder({ label, style, children }: { label: string; style: CSSProperties; children?: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "repeating-linear-gradient(45deg,#e4e7ec,#e4e7ec 8px,#eef0f3 8px,#eef0f3 16px)",
        border: "1px dashed #9aa3af",
        color: "#6e6e6e",
        fontSize: 12,
        textAlign: "center",
        ...style,
      }}
    >
      {children ?? `[${label}]`}
    </div>
  );
}

// Header logo — Figma node "Logo", 60×30
export const UoiLogo = () => <Placeholder label="UOI logo" style={{ width: 60, height: 30, fontSize: 9 }} />;

// Hero photo behind the landing banner — Figma node "Header" image fill.
// Placeholder covers the photo area seen in the frames (≈485px below the 56px header).
export const HeroImage = () => (
  <Placeholder
    label="Hero photo"
    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 485, background: "#3a3f47", color: "#c9ced6" }}
  />
);

// "Retrieve with Singpass" button — Figma node "retrieve_with_singpass_full_red 1", 229×48
export const SingpassRetrieveButtonArt = () => (
  <Placeholder
    label="Retrieve with Singpass"
    style={{ width: 229, height: 48, borderRadius: 8, background: "#d93841", color: "#fff", border: "none", fontWeight: 600, fontSize: 14 }}
  >
    Retrieve with Singpass
  </Placeholder>
);

// Singpass wordmark on the consent screen — Figma node "image 242", 182×32
export const SingpassLogo = () => <Placeholder label="Singpass logo" style={{ width: 182, height: 32 }} />;

// Consent data-item list — Figma node "image 252" (it is an image in the design), 584 wide, 836:688
export const ConsentListImage = () => (
  <Placeholder label="Singpass consent data list (image)" style={{ width: "100%", aspectRatio: "836 / 688" }} />
);

// Icons
const muted = "#c9ced6";
export const InfoIcon = () => <InfoCircleFilled style={{ fontSize: 16, color: muted }} />;
export const AlertInfoIcon = () => <InfoCircleFilled style={{ fontSize: 16, color: "#1e40af" }} />;
export const ChevronDown = () => <DownOutlined style={{ fontSize: 14, color: "#6e6e6e" }} />;
export const ChevronUp = () => <UpOutlined style={{ fontSize: 14, color: "#6e6e6e" }} />;
export const CalendarIcon = () => <CalendarOutlined style={{ fontSize: 20, color: "#6e6e6e" }} />;
export const QuestionIcon = () => <QuestionCircleOutlined style={{ fontSize: 18, color: "#949494" }} />;
export const DiscountIcon = () => <TagFilled style={{ fontSize: 14, color: "#6e6e6e" }} />;
export const CloseIcon = () => <CloseOutlined style={{ fontSize: 12, color: "#6e6e6e" }} />;
export const PlusIcon = () => <PlusOutlined style={{ fontSize: 12, color: "#949494" }} />;
export const TickIcon = () => <CheckOutlined style={{ fontSize: 18, color: "#005eb8" }} />;
