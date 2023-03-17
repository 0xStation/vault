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
      screens: {
        sm: "580px",
      },
      fontFamily: {
        sans: ["Graphik", "sans-serif"],
        serif: ["Merriweather", "serif"],
        lores: ["LoRes9PlusOT", "Monospace"],
        grotesque: ["TerminalGrotesque", "Monospace"],
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",
        black: {
          DEFAULT: "#0D0E11",
          100: "#0D0E11",
        },
        gray: {
          DEFAULT: "#646464",
          40: "#979797", // concrete 115
          50: "#646464", // concrete 100
          80: "#4d4d4dff", // wet-concrete 115
          90: "#2E2E2E", // wet-concrete
          100: "#1A1A1A", // wet-concrete 90
        },
        slate: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          500: "#64748B",
          800: "#15181C",
        },
        violet: {
          DEFAULT: "#AD72FF",
          80: "#684499",
          100: "#AD72FF",
          80: "684499",
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
