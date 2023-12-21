/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
  variants: {
    extend: {
      opacity: ['responsive', 'hover', 'focus', 'active', 'group-hover'],
    },
  },
}

