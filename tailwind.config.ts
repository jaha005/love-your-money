import type { Config } from "tailwindcss";

// Boje dolaze iz lib/brand.ts kroz CSS varijable koje postavlja app/layout.tsx.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg-rgb) / <alpha-value>)",
        text: "rgb(var(--text-rgb) / <alpha-value>)",
        accent: "rgb(var(--accent-rgb) / <alpha-value>)",
        muted: "rgb(var(--muted-rgb) / <alpha-value>)",
        line: "rgb(var(--line-rgb) / <alpha-value>)",
        tint: "rgb(var(--tint-rgb) / <alpha-value>)",
        danger: "rgb(var(--danger-rgb) / <alpha-value>)",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        h1: ["40px", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        h2: ["28px", { lineHeight: "1.2" }],
        h3: ["20px", { lineHeight: "1.3" }],
        body: ["17px", { lineHeight: "1.6" }],
        small: ["14px", { lineHeight: "1.5" }],
        tiny: ["12px", { lineHeight: "1.4" }],
      },
      borderRadius: { DEFAULT: "8px", lg: "8px", xl: "8px" },
      maxWidth: { content: "960px", rail: "300px" },
      spacing: { sidebar: "260px", rail: "300px" },
    },
  },
  plugins: [],
};

export default config;
