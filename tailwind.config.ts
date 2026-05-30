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
          // Fondos calidos crema
          'pastel': '#FAF3E6',
          'pastel-dark': '#F0E4CE',
          // Botones y acentos morado calido (ciruela)
          'purple': '#9A5B7D',
          'purple-dark': '#7C4562',
          'purple-light': '#B57498',
          // Verde calido (oliva) para tarjetas y precios
          'green': '#6E8B3D',
          'green-dark': '#566E2E',
          'green-light': '#86A552',
          'green-vibrant': '#7B9C42',
        }
      },
    },
  },
  plugins: [],
};
export default config;
