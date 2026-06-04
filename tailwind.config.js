/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // ───────────────────────────────────────────────────────────────
      // Figma-owned tokens — values flow from src/styles/tokens.css
      // (generated from src/design/tokens.json). Never hardcode values
      // here; only reference the CSS variables.
      // ───────────────────────────────────────────────────────────────
      colors: {
        // 채널(R G B) 형식이라 `text-ink/55` 같은 투명도 문법이 그대로 동작한다.
        paper: 'rgb(var(--color-paper) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
        mono: ['var(--font-mono)'],
      },
      fontSize: {
        // 반응형 디스플레이: 뷰포트로 스케일하되 상한은 Figma 토큰이 정한다.
        opening: 'clamp(4.4rem, 18vw, var(--font-size-opening))',
        hero: 'clamp(3.9rem, 19vw, var(--font-size-hero))',
        // 고정 타이포 스케일 (Figma 소유).
        day: 'var(--font-size-day)',
        name: 'var(--font-size-name)',
        venue: 'var(--font-size-venue)',
        kicker: 'var(--font-size-kicker)',
        quote: 'var(--font-size-quote)',
        body: 'var(--font-size-body)',
        small: 'var(--font-size-small)',
        micro: 'var(--font-size-micro)',
        label: 'var(--font-size-label)',
      },
      spacing: {
        gutter: 'var(--spacing-gutter)',
        'control-height': 'var(--spacing-control-height)',
        'hairline-width': 'var(--spacing-hairline-width)',
      },

      // ───────────────────────────────────────────────────────────────
      // Code-owned tokens — Figma Variables can't express letter-spacing,
      // line-height, or shadows, so this project's scales live here.
      // Keep them as a small, named scale (no arbitrary [..] in JSX).
      // ───────────────────────────────────────────────────────────────
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.035em',
        wide: '0.08em',
        wider: '0.16em',
        widest: '0.22em',
        ultra: '0.28em',
        editorial: '0.32em',
      },
      lineHeight: {
        flush: '0.86',
        cozy: '0.92',
        verse: '2.05',
      },
      dropShadow: {
        'hero-title': '0 2px 16px rgba(0, 0, 0, 0.35)',
        'hero-sub': '0 2px 12px rgba(0, 0, 0, 0.4)',
      },
      maxWidth: {
        page: '520px',
        content: '390px',
      },
    },
  },
  plugins: [],
};
