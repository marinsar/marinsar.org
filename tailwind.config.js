module.exports = {
  content: ['./src/**/*.{ts,js,tsx,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};
