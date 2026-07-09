/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0a',
        canvas: '#ffffff',
        accent: {
          DEFAULT: '#0a0a0a',
          dark: '#000000',
          light: '#f2f2f2',
        },
      },
      fontFamily: {
        serif: ['Fraunces', '"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 2px 24px -8px rgba(0, 0, 0, 0.10)',
        'card-hover': '0 8px 32px -8px rgba(0, 0, 0, 0.16)',
      },
    },
  },
  plugins: [],
}

