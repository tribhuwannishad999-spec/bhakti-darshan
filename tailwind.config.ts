import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { saffron: "#E8751A", maroon: "#5B0F1B", gold: "#D4A017", cream: "#FFF6E5", plum: "#5B3A8C" },
      fontFamily: { display: ["var(--font-display)", "serif"], body: ["var(--font-body)", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
