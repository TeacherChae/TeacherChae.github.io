/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F2',
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
        'korail-turquoise': '#00C4B3',
        'ktx-navy': '#1F3A8A',
        'train-paper': '#F4EFDC',
        'stamp-purple': '#5E2D8A',
        'platform-yellow': '#F5C518',
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
        script: ['Italianno', 'cursive'],
        serif: ['"Cormorant Garamond"', 'serif'],
        'serif-myeongjo': ['"Nanum Myeongjo"', 'serif'],
      },
      maxWidth: {
        page: '460px',
      },
      letterSpacing: {
        widest2: '0.2em',
      },
    },
  },
  plugins: [],
};
