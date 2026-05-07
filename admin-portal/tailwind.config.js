/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#1e293b', // Matches Sidebar
          blue: '#3b82f6', // Matches Active Tab[cite: 1]
          light: '#f8fafc' // Matches Dashboard Background[cite: 1]
        }
      }
    },
  },
  plugins: [],
}