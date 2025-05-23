import PrimeUI from 'tailwindcss-primeui'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: ['dark'],
  theme: {
    extend: {},
  },
  important: true,
  plugins: [PrimeUI],
}
