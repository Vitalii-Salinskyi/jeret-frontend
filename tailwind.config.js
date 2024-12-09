/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        libre: ['"Libre Franklin"', "sans-serif"],
      },
      colors: {
        "auth-gray": "#4A4543",
        "black-main": "#141522",
        primary: {
          100: "#DCE4FF",
          200: "#BAC8FF",
          300: "#98ABFF",
          400: "#7E95FF",
          500: "#546FFF",
          600: "#3D53DB",
          700: "#2A3BB7",
          800: "#1A2793",
          900: "#10197A",
        },
      },
    },
  },
  plugins: [],
};
