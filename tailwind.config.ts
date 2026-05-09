import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#06111f",
          900: "#071a2f",
          800: "#0b2440"
        },
        cyanx: "#19d3ff"
      },
      boxShadow: {
        premium: "0 24px 70px rgba(2, 12, 27, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
