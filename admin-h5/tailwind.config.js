/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dailv': {
          DEFAULT: '#4A5D4E',
          light: '#6B7D6E',
          dark: '#334537',
          lighter: '#8A9A8B'
        },
        'status': {
          success: '#52C41A',
          warning: '#FAAD14',
          error: '#F5222D',
          info: '#1890FF'
        }
      }
    },
  },
  plugins: [],
}
