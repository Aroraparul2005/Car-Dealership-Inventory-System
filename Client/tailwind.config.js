/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0b0d10",
          900: "#111418",
          800: "#171b21",
          700: "#20262e",
          600: "#2c343e",
        },
        brand: {
          50: "#fff8ed",
          100: "#ffefd4",
          300: "#ffc46b",
          400: "#ffab3d",
          500: "#f9900e",
          600: "#e07407",
          700: "#b95608",
        },
      },
      fontFamily: {
        display: ["'Bebas Neue'", "system-ui", "sans-serif"],
        sans: ["Barlow", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(249,144,14,.35), 0 18px 40px -18px rgba(249,144,14,.55)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(14px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: { "fade-up": "fade-up .5s cubic-bezier(.2,.7,.3,1) both" },
    },
  },
  plugins: [],
};
