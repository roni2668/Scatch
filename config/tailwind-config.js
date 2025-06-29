// tailwind.config.js
module.exports = {
  darkMode: 'class', // ✅ use class strategy (not media)
  content: ['./views/**/*.ejs', './public/**/*.js'], // add your file paths
  theme: {
    extend: {},
  },
  plugins: [],
}
