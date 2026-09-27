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
          900: "#182216", // fondo del pie de página
          800: "#26331f",
        },
        parchment: "#eee7d4",
        moss: {
          DEFAULT: "#748c5c",
          soft: "#9db184",
        },
        honey: {
          DEFAULT: "#cf9f3d",
          deep: "#a8792b", // acento en itálica del título del hero
        },
        clayRose: "#c98a83",
        // Colores del logo (muestreados del archivo original)
        leaf: {
          DEFAULT: "#27a47e", // "buen"
          dark: "#1f8a69",
          deep: "#15715a", // fondos verdes con texto blanco
          lime: "#92c149", // "vivir"
          olive: "#82ad45", // botones sobre la foto del bosque
        },
        cream: "#f6f3eb", // fondos claros (header, secciones)
        butter: {
          DEFAULT: "#fdf8d4", // botón secundario
          border: "#e9dfa3",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Work Sans", "sans-serif"],
        redonda: ["Quicksand", "Work Sans", "sans-serif"], // menú: trazos redondeados
      },
    },
  },
  plugins: [],
};

export default config;
