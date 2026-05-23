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
        ink: '#2A2A2A',
        // Moonjar palette
        bone: '#FAF8F4',
        whisper: '#E8E4DC',
        clay: '#B89C7D',
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
        script: ['Italianno', 'cursive'],
        serif: ['"Cormorant Garamond"', 'serif'],
        'serif-ko': ['"Noto Serif KR"', 'serif'],
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
