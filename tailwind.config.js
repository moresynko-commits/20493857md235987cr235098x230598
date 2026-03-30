module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        anton: ['Anton', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif']
      },
      animation: {
        'glow': 'glow 1.5s ease-in-out infinite alternate',
      }
    }
  },
  plugins: [],
};

