/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F2',
        paper: '#FBFAF7', // 카드 배경 (modern airline 페이퍼 톤)
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
        ink: '#1F2A24',
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
        script: ['Italianno', 'cursive'],
        serif: ['"Cormorant Garamond"', 'serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        page: '520px',
      },
      letterSpacing: {
        widest2: '0.2em',
      },
    },
  },
  plugins: [],
};
