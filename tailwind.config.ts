import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm neutrals — the backbone of the palette
        warm: {
          50: "#FAFAF8",
          100: "#F5F4F0",
          200: "#EDEBE6",
          300: "#E0DDD6",
          400: "#C8C3BA",
          500: "#A8A198",
          600: "#8C8580",
          700: "#6B6560",
          800: "#3D3833",
          900: "#1C1B18",
        },
        // Refined gold/champagne accent
        gold: {
          50: "#FAF8F3",
          100: "#F0EBE0",
          200: "#E0D5C0",
          300: "#C9B896",
          400: "#B8A88A",
          500: "#A6957A",
        },
        // Muted sage — for buttons and subtle accents
        sage: {
          50: "#F4F6F4",
          100: "#E5EBE5",
          200: "#CCDBCC",
          300: "#A8C0A8",
          400: "#7FA37F",
          500: "#5E7E5E",
          600: "#4D674D",
          700: "#3E5440",
        },
        // Soft rose for errors only
        rose: {
          400: "#D48A8A",
          500: "#C47070",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
