/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    theme: {
      extend: {
        fontFamily: {
          sans: ["Inter", "sans-serif"],
          serif: ["Playfair Display", "serif"],
        },
      },
    },
    extend: {},
  },
  plugins: [],
};
