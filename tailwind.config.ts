import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        earth: {
          50: "#faf6f1",
          100: "#f0e8dc",
          200: "#ddd0b8",
          300: "#c4a882",
          400: "#a8845a",
          500: "#8b6914",
          600: "#6b4f10",
          700: "#4a370b",
          800: "#2d2207",
          900: "#1a1404",
        },
        forest: {
          50: "#f0f7f0",
          100: "#d4ead4",
          200: "#a8d5a8",
          300: "#7cba7c",
          400: "#5a9e5a",
          500: "#3d8b3d",
          600: "#2d6b2d",
          700: "#1e4a1e",
          800: "#132e13",
          900: "#0a1a0a",
        },
        flame: {
          100: "#fef3c7",
          300: "#fbbf24",
          500: "#f97316",
          700: "#dc2626",
          900: "#7c2d12",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "flame-wobble": {
          "0%, 100%": { transform: "rotate(-3deg) scale(1)" },
          "25%": { transform: "rotate(3deg) scale(1.05)" },
          "50%": { transform: "rotate(-2deg) scale(0.98)" },
          "75%": { transform: "rotate(2deg) scale(1.03)" },
        },
        "flame-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.08)" },
        },
      },
      animation: {
        "flame-wobble": "flame-wobble 2s ease-in-out infinite",
        "flame-pulse": "flame-pulse 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
