/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#D6F3F4',
        accent: '#74B3CE',
        dark: '#004346',
        teal: '#508991',
        navy: '#172A3A',
      },
      backgroundImage: {
        'glass': 'linear-gradient(135deg, rgba(116,179,206,0.15), rgba(0,67,70,0.25))',
      }
    },
  },
  plugins: [],
}