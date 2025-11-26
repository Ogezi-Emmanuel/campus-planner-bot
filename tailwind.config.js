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
        accent: '#7B1FA2', // Purple 700 for accent consistency
        background: '#FFFFFF', // Clean white background for professional look
        text: '#0F172A', // Slate 900 - strong contrast
        lightText: '#334155', // Slate 700 - better readability on light bg
        border: '#E0E0E0', // Light border color
      },
    },
  },
  plugins: [],
}