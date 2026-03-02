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
        cream: {
          50: "#FFFDF7",
          100: "#FFF9E8",
          200: "#FFF3D1",
          300: "#FFEBB3",
          400: "#FFE299",
        },
        sage: {
          50: "#F4F7F4",
          100: "#E3EBE3",
          200: "#C7D7C7",
          300: "#A3BFA3",
          400: "#7FA37F",
          500: "#5C875C",
          600: "#4A6D4A",
          700: "#3D5A3D",
        },
        gold: {
          50: "#FBF8F0",
          100: "#F5EDD8",
          200: "#EBDBB1",
          300: "#D4BC7A",
          400: "#C4A74F",
          500: "#B8963A",
        },
        rose: {
          50: "#FDF6F6",
          100: "#F9E8E8",
          200: "#F2D0D0",
          300: "#E5ABAB",
          400: "#D48A8A",
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
