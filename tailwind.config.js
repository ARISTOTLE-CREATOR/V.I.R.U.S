/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tv-dark': '#0f0f0f',
        'tv-gray': '#1e1e1e',
        'tv-accent': '#e50914',
      }
    },
  },
  plugins: [],
}