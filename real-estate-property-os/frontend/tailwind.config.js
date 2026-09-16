/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        blueprint: {
          DEFAULT: "#16324F",
          dark: "#0E2038",
          light: "#2C4F73",
        },
        sand: {
          DEFAULT: "#FAF8F3",
          raised: "#FFFFFF",
          line: "#E6E1D4",
        },
        ink: {
          DEFAULT: "#1F2A37",
          soft: "#3A4553",
          faint: "#78808C",
        },
        brass: {
          DEFAULT: "#C08A28",
          light: "#F3E4C4",
        },
        forest: {
          DEFAULT: "#3F7D58",
          light: "#DEEBE2",
        },
        rose: {
          DEFAULT: "#B24C4C",
          light: "#F3DEDE",
        },
        flame: {
          DEFAULT: "#D96B2B",
          light: "#F7E1CF",
        },
        slate: {
          DEFAULT: "#6B7A8C",
          light: "#E6EAEE",
        },
      },
      fontFamily: {
        serif: ["Newsreader", "Georgia", "serif"],
        sans: ["Manrope", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        lg: "10px",
      },
    },
  },
  plugins: [],
};
