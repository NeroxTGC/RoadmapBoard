const { resolveProjectPath } = require('wasp/dev')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    resolveProjectPath('./src/**/*.{js,jsx,ts,tsx}'),
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  colors.yellow[50],
          100: colors.yellow[100],
          200: colors.yellow[200],
          300: colors.yellow[300],
          400: colors.yellow[400],
          500: colors.yellow[500],
          600: colors.yellow[600],
          700: colors.yellow[700],
          800: colors.yellow[800],
          900: colors.yellow[900],
        },
        dark: {
          bg: '#1a1a1a',
          surface: '#2a2a2a',
          border: '#404040',
        }
      }
    },
  },
  plugins: [],
}