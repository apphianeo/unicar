import type { ThemeConfig } from "antd";

// Ant Design theme mapped to UOI design-system tokens.
export const theme: ThemeConfig = {
  token: {
    colorPrimary: "#005eb8",
    colorText: "#212121",
    colorTextSecondary: "#6e6e6e",
    colorTextPlaceholder: "#949494",
    colorTextDisabled: "#bdbdbd",
    colorBgContainerDisabled: "#f5f5f5",
    colorBorder: "rgba(0,0,0,0.09)",
    colorSuccess: "#08754f",
    colorInfo: "#1e40af",
    colorInfoBg: "#eff6ff",
    fontFamily: '"Noto Sans", sans-serif',
    fontSize: 16,
    borderRadius: 8,
    controlHeight: 50,
    controlOutline: "rgba(0,94,184,0.2)",
    controlOutlineWidth: 3,
    lineHeight: 1.5,
  },
  components: {
    Input: { paddingInline: 15, activeShadow: "0 0 0 3px rgba(0,94,184,0.2)" },
    Select: {
      optionPadding: "12px",
      optionHeight: 48,
      optionFontSize: 16,
      optionSelectedBg: "#ffffff",
      optionSelectedColor: "#005eb8",
      optionSelectedFontWeight: 500,
      optionActiveBg: "#f6f8fc",
      activeOutlineColor: "rgba(0,94,184,0.2)",
    },
    DatePicker: { paddingInline: 15, activeShadow: "0 0 0 3px rgba(0,94,184,0.2)" },
    Radio: { radioSize: 20, dotSize: 10, wrapperMarginInlineEnd: 32 },
    Button: { primaryShadow: "none", defaultShadow: "none" },
    Popover: { fontSize: 14 },
  },
};
