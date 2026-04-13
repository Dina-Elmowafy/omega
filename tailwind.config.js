/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // السطر ده هو اللي بيفعل الدارك مود
  theme: {
    extend: {
      colors: {
        'omega-blue': '#1e3a8a',
        'omega-yellow': '#fbbf24',
        'omega-dark': '#0f172a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      }
    },
  },
  plugins: [],
};