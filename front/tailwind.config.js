// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        wine: '#631221',
        white: '#fff',
        black: '#000',
        gray: '#E1E3E3',
        transparent: 'transparent',
        red: '#FF0000',
        lightBlue: '#B8CAD4',
        green: '#5EE617',
        darkGray: '#292929',
      },
      fontFamily: {
        poppins: ['Poppins', 'Sans-serif'],
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
      },
      spacing: {
        1: '0.25rem',
        2: '0.5rem',
      },
    },
  },
  plugins: [],
};
// Path: tailwind.config.js
