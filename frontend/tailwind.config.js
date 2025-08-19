/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#121822",
        foreground: "#E0E7FF",
        muted: "#8F9BB3",
        primary: "#BC8A5F",
        secondary: "#A47148",
        accent: {
          DEFAULT: "#8C6FFC",
          foreground: "#121822",
        },
        border: "#2E3A59",
        input: "#1F2937",
        ring: "#00FFD1",
      },
      boxShadow: {
        custom: "0 0 8px 2px rgba(0, 255, 209, 0.5)",
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
        heading: ["Space Grotesk", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.4s ease-out",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(30px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
    require("@tailwindcss/typography"),
  ],
};
