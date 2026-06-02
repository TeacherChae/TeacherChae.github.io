/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FBFAF7',
        ink: '#111111',
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
        display: ['"Bodoni Moda"', 'serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        page: '520px',
      },
      letterSpacing: {
        widest2: '0.2em',
        editorial: '0.32em',
      },
    },
  },
  plugins: [],
};
