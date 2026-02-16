/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'slokbot': {
          primary: '#FF6B6B',
          secondary: '#4ECDC4',
          dark: '#1A1A2E',
          darker: '#0F0F1E',
          gold: '#FFD700',
        },
        'rarity': {
          common: '#9d9d9d',
          uncommon: '#1eff00',
          rare: '#0070dd',
          epic: '#a335ee',
          legendary: '#ff8000',
        }
      },
      fontFamily: {
        'game': ['"Press Start 2P"', 'cursive'],
      }
    },
  },
  plugins: [],
}
