import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        tech: {
          950: "#06080e",
          900: "#0b0f19",
          850: "#101626",
          800: "#172033",
          700: "#222f4b",
          600: "#33446b",
          cyan: "#00f0ff",
          emerald: "#10b981",
          violet: "#8b5cf6",
          amber: "#f59e0b",
        },
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(0, 240, 255, 0.25)",
        "glow-emerald": "0 0 25px -5px rgba(16, 185, 129, 0.25)",
        "glow-violet": "0 0 25px -5px rgba(139, 92, 246, 0.25)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
