import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // 👈 THIS is what you need
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;