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
          purple: '#6B2D8B',
          'purple-dark': '#5A1D7B',
          'purple-light': '#8B45B3',
          green: '#1B8A3B',
          'green-dark': '#147330',
          'green-light': '#22A84A',
        }
      },
    },
  },
  plugins: [],
};
export default config;