/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  screens: {
    sm: "640px",

    md: "768px",

    lg: "1024px",

    xl: "1280px",

    "2xl": "1536px",
  },
  colors: {
    bgColor: "rgb(var(--color-bg) / <alpha-value>)",
    primary: "rgb(var(--color-primary) / <alpha-value>)",
    secondary: "rgb(var(--color-secondary) / <alpha-value>)",
    blue: "rgb(var(--color-blue) / <alpha-value>)",
    white: "rgb(var(--color-white) / <alpha-value>)",
    ascent: {
      1: "rgb(var(--color-ascent1) / <alpha-value>)",
      2: "rgb(var(--color-ascent2) / <alpha-value>)",
    },
  },
  extend: {},
};
