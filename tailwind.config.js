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
        'museum-cream': '#F7F2E8',
        'museum-ink': '#2B2B2B',
        'museum-accent': '#9C2B2E',
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
        script: ['Italianno', 'cursive'],
        serif: ['"Cormorant Garamond"', 'serif'],
        'display-serif': ['"Libre Caslon Display"', '"Playfair Display"', 'serif'],
        'museum-sans': ['Inter', 'system-ui', 'sans-serif'],
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
