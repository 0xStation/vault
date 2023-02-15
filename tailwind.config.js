const colors = require("tailwindcss/colors")
const fontFamily = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      white: colors.white,
      slate: colors.slate,
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-favoritpro)", fontFamily.sans],
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",
        black: {
          DEFAULT: "#0D0E11",
          100: "#0D0E11",
        },
        slate: {
          DEFAULT: "#F1F5F9",
        },
        violet: {
          DEFAULT: "#AD72FF",
          100: "#AD72FF",
        },
        green: {
          DEFAULT: "#50B488",
          100: "#50B488",
        },
        blue: {
          DEFAULT: "#5F6FFF",
          100: "#5F6FFF",
        },
        orange: {
          DEFAULT: "#FF9956",
          100: "#FF9956",
        },
        red: {
          DEFAULT: "#FF5650",
          100: "#FF5650",
        },
        yellow: {
          DEFAULT: "#F9C81B",
          100: "#F9C81B",
        },
        slate: {
          800: "#15181C",
        },
      },
    },
  },
  plugins: [],
}
