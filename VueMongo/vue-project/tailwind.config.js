export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // ou 'media'
  theme: {
    extend: {
      colors: {
        primary: {
          300: '#93c5fd', // blue-300
          500: '#3b82f6', // blue-500
          600: '#2563eb', // blue-600
          700: '#1d4ed8', // blue-700
          800: '#1e40af', // blue-800
        }
      }
    },
  },
  plugins: [],
}