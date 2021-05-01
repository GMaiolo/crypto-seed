module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      boxShadow: {
        "very-chill": "0px 10px 20px rgb(0 0 0 / 5%);",
        chill: "rgb(0 0 0 / 5%) 0px 10px 20px;",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
