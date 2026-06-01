/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F2',
        paper: '#FBFAF7',
        ink: '#111111',
        muted: '#77716A',
        forest: '#2F3F36',
        sage: {
          DEFAULT: '#8B9D7A',
          light: '#B8C5A9',
          dark: '#6B7B5E',
        },
        terracotta: {
          DEFAULT: '#C97D60',
          light: '#E0A48C',
          dark: '#A35E45',
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
        display: ['"Bodoni Moda"', '"Cormorant Garamond"', 'serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
        script: ['Italianno', 'cursive'],
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
