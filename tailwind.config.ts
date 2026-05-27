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
          'purple-dark': '#2d1b4e',
          'purple-darker': '#1a0a2e',
          'purple-light': '#8B45B3',
          'purple-glow': '#6b3fa0',
          green: '#00d4aa',
          'green-dark': '#00b894',
          'green-light': '#00f5c4',
          blue: '#3b82f6',
          orange: '#f97316',
          cyan: '#06b6d4',
        }
      },
    },
  },
  plugins: [],
};
export default config;
