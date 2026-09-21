import type { Config } from "tailwindcss";

// Colours come from lib/brand.ts through CSS variables set in app/layout.tsx.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg-rgb) / <alpha-value>)",
        surface: "rgb(var(--surface-rgb) / <alpha-value>)",
        text: "rgb(var(--text-rgb) / <alpha-value>)",
        accent: "rgb(var(--accent-rgb) / <alpha-value>)",
        "accent-text": "rgb(var(--accent-text-rgb) / <alpha-value>)",
        accent2: "rgb(var(--accent2-rgb) / <alpha-value>)",
        "accent2-text": "rgb(var(--accent2-text-rgb) / <alpha-value>)",
        muted: "rgb(var(--muted-rgb) / <alpha-value>)",
        line: "rgb(var(--line-rgb) / <alpha-value>)",
        "line-strong": "rgb(var(--line-strong-rgb) / <alpha-value>)",
        tint: "rgb(var(--tint-rgb) / <alpha-value>)",
        tint2: "rgb(var(--tint2-rgb) / <alpha-value>)",
        danger: "rgb(var(--danger-rgb) / <alpha-value>)",
        "danger-tint": "rgb(var(--danger-tint-rgb) / <alpha-value>)",
      },
      fontFamily: {
        serif: ["var(--font-heading)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      fontSize: {
        h1: ["42px", { lineHeight: "1.08", letterSpacing: "-0.015em" }],
        h2: ["27px", { lineHeight: "1.18", letterSpacing: "-0.01em" }],
        h3: ["19px", { lineHeight: "1.3" }],
        body: ["16px", { lineHeight: "1.62" }],
        small: ["14px", { lineHeight: "1.5" }],
        tiny: ["12px", { lineHeight: "1.4" }],
      },
      borderRadius: { DEFAULT: "10px", lg: "10px", xl: "14px" },
      boxShadow: {
        // Depth comes from surface tone first; the shadow is only a hint.
        card: "0 1px 2px rgb(var(--text-rgb) / 0.04), 0 8px 20px -14px rgb(var(--text-rgb) / 0.18)",
        lift: "0 1px 2px rgb(var(--text-rgb) / 0.05), 0 14px 30px -16px rgb(var(--text-rgb) / 0.26)",
      },
      maxWidth: { content: "920px", rail: "300px" },
      spacing: { sidebar: "248px", rail: "296px" },
    },
  },
  plugins: [],
};

export default config;
