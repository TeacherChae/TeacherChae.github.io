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
        // Figma 글꼴 토큰(--font-*)을 참조. 폴백 스택은 tokens.css 안에 포함됨.
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
        mono: ['var(--font-mono)'],
      },
      fontSize: {
        // 이름 있는 글자크기 토큰 → `text-kicker`, `text-label` 등으로 사용.
        opening: 'var(--font-size-opening)',
        hero: 'var(--font-size-hero)',
        day: 'var(--font-size-day)',
        name: 'var(--font-size-name)',
        venue: 'var(--font-size-venue)',
        kicker: 'var(--font-size-kicker)',
        quote: 'var(--font-size-quote)',
        label: 'var(--font-size-label)',
      },
      spacing: {
        // 간격 토큰 → `px-gutter`, `w-hairline-width`, `h-control-height` 등으로 사용.
        gutter: 'var(--spacing-gutter)',
        'control-height': 'var(--spacing-control-height)',
        'hairline-width': 'var(--spacing-hairline-width)',
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
