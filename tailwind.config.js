/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Figma 변수에서 생성된 CSS 변수(src/styles/tokens.css)를 참조.
        // 채널(R G B) 형식이라 `text-ink/55` 같은 투명도 문법이 그대로 동작한다.
        paper: 'rgb(var(--color-paper) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
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
