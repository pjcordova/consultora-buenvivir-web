import type { Config } from "tailwindcss";

// Paleta base según los assets de Canva de Buen Vivir (motivo diente de león,
// verde / negro / crema). Reemplazar los códigos hex por los oficiales del
// manual de marca en cuanto Belén los confirme.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      colors: {
        "bv-verde": {
          DEFAULT: "#3F6B4A", // TODO: confirmar hex exacto de marca
          oscuro: "#26402C",
          claro: "#7FA487",
        },
        "bv-negro": "#1A1A17",
        "bv-crema": "#F4F1E9",
      },
      fontFamily: {
        // TODO: reemplazar por las tipografías definidas en el manual de marca
        sans: ["var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
      },
      borderRadius: {
        organic: "60% 40% 55% 45% / 45% 55% 40% 60%", // para formas tipo "diente de león"
      },
    },
  },
  plugins: [],
};

export default config;
