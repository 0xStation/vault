const colors = require("tailwindcss/colors")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      white: colors.white,
      slate: colors.slate,
    },
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        black: {
          100: "#212121",
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
      },
    },
  },
  plugins: [],
}
