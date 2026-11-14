/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#3B3540",
        blush: {
          bg: "#FCF5F4",
          accent: "#E7A9B5",
        },
        sage: {
          bg: "#F4F7F2",
          accent: "#A9C5A7",
        },
        lavender: {
          bg: "#F6F4FB",
          accent: "#B9ABE3",
        },
      },
      fontFamily: {
        sans: ["Urbanist", "sans-serif"],
        serif: ["EB Garamond", "serif"],
      },
    },
  },
  plugins: [],
};
