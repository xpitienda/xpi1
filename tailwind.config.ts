import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        xpi: {
          // Fondos morado pastel
          'pastel': '#F3E8FF',
          'pastel-dark': '#E9D5FF',
          // Botones y acentos morado
          'purple': '#6B2D8B',
          'purple-dark': '#4a1f61',
          'purple-light': '#8B45B3',
          // Verde para tarjetas y precios
          'green': '#1B8A3B',
          'green-dark': '#156b2e',
          'green-light': '#22A84A',
          'green-vibrant': '#22A84A',
        }
      },
    },
  },
  plugins: [],
};
export default config;
