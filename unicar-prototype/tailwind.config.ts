import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-tertiary": "var(--color-text-tertiary)",
        "text-disabled": "var(--color-text-disabled)",
        "bg-page": "var(--color-bg-whitewashed)",
        "bg-disabled": "var(--color-bg-disabled)",
        "bg-info": "var(--color-bg-info)",
        success: "var(--color-success)",
        line: "var(--color-line)",
      },
      fontFamily: { sans: ['"Noto Sans"', "sans-serif"] },
    },
  },
} satisfies Config;
