import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'grid-cols-2',
    'grid-cols-3',
    'grid-cols-4',
    'grid-cols-5',
    'grid-cols-6',
    'sm:grid-cols-3',
    'md:grid-cols-4',
    'lg:grid-cols-5',
    'xl:grid-cols-6',
  ],
  theme: {
    extend: {
      colors: {
        xpi: {
          purple: '#6B2D8B',
          'purple-dark': '#4a1f61',
          'purple-light': '#8B45B3',
          green: '#1B8A3B',
          'green-dark': '#156b2e',
          'green-light': '#22a849',
        }
      },
    },
  },
  plugins: [],
};
export default config;
