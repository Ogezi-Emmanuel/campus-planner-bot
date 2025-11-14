/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5', // Indigo 600
        secondary: '#6366F1', // Indigo 500
        accent: '#EC4899', // Pink 500
        background: '#F9FAFB', // Gray 50
        text: '#1F2937', // Gray 900
        lightText: '#6B7280', // Gray 500
      },
    },
  },
  plugins: [],
}