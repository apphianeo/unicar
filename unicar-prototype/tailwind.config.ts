import type { Config } from "tailwindcss";

// Colours, type and effects are the UOI Design System variables used in the Figma frames.
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-sureblue": "var(--primary-color-primary-sureblue)",
        "text-primary": "var(--type-color-text-primary)",
        "text-secondary": "var(--type-color-text-secondary)",
        "text-tertiary": "var(--type-color-text-tertiary)",
        "text-disabled": "var(--type-color-text-disabled)",
        "bg-white": "var(--background-color-bg-white)",
        "bg-whitewashed": "var(--background-color-bg-whitewashed)",
        "disabled-bg": "var(--status-color-disabled-bg)",
        "status-info": "var(--status-color-status-info)",
        "statusbg-info": "var(--status-color-statusbg-info)",
        "status-success": "var(--status-color-status-success)",
        line: "var(--utility-color-line)",
      },
      backgroundImage: {
        // --primary-gradient-light from the UniTravel prototype
        "primary-gradient-light":
          "linear-gradient(90deg,rgba(0,94,184,.06) 0.62%,rgba(92,85,235,.06) 100%),linear-gradient(#fff,#fff)",
      },
      fontFamily: {
        sans: ['"Noto Sans"', "sans-serif"],
        inter: ['"Inter"', "sans-serif"],
      },
      dropShadow: {
        // effect-overlay: DROP_SHADOW #0000000D, y 1, radius 4
        overlay: "0px 1px 2px rgba(0,0,0,0.05)",
        // Popover effect-overlay: DROP_SHADOW #0000001F, radius 9
        popover: "0px 0px 4.5px rgba(0,0,0,0.12)",
      },
      boxShadow: {
        // effect-underline: INNER_SHADOW #00000017, y -1
        underline: "inset 0px -1px 0px 0px rgba(0,0,0,0.09)",
      },
    },
  },
} satisfies Config;
