import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: "#12170f",
          800: "#26331f",
        },
        parchment: "#eee7d4",
        moss: {
          DEFAULT: "#748c5c",
          soft: "#9db184",
        },
        honey: "#cf9f3d",
        clayRose: "#c98a83",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Work Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
