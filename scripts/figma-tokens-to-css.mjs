// tokens.json → src/styles/tokens.css 변환기.
// Figma에서 동기화한 tokens.json(=source of truth)을 CSS 커스텀 프로퍼티로 굽는다.
// 실행: `npm run tokens:build`
//
// 색 규칙:
//   - alpha === 1 인 기본 색(paper/ink)은 "R G B" 채널로 출력 → Tailwind의 `/55` 투명도 문법이 동작.
//   - alpha < 1 인 단계(ink-70 등)는 rgba() 로 출력 (원시 CSS 에서 바로 쓸 수 있게).
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'src/design/tokens.json');
const OUT = path.join(ROOT, 'src/styles/tokens.css');

const t = JSON.parse(await readFile(SRC, 'utf8'));

const lines = [];
lines.push('/* AUTO-GENERATED — Figma 변수에서 생성됨. 직접 수정하지 말 것. */');
lines.push('/* 갱신: Figma에서 변수 변경 → 동기화 → `npm run tokens:build` */');
lines.push(':root {');

lines.push('  /* color */');
for (const [name, c] of Object.entries(t.color || {})) {
  if (c.alpha === 1) {
    lines.push(`  --color-${name}: ${c.channels};`);
  } else {
    const [r, g, b] = c.channels.split(' ');
    lines.push(`  --color-${name}: rgba(${r}, ${g}, ${b}, ${c.alpha});`);
  }
}

lines.push('  /* spacing */');
for (const [name, v] of Object.entries(t.spacing || {})) {
  lines.push(`  --spacing-${name}: ${v}px;`);
}

lines.push('  /* font-size */');
for (const [name, v] of Object.entries(t.fontSize || {})) {
  lines.push(`  --font-size-${name}: ${v}px;`);
}

// 글꼴 패밀리: Figma 는 기본 이름만 저장 → 여기서 폴백 스택을 붙인다.
const FONT_FALLBACK = {
  display: 'Pretendard, serif',
  titleKo: 'serif',
  sans: 'system-ui, sans-serif',
  scripture: 'serif',
};
lines.push('  /* font-family */');
for (const [name, v] of Object.entries(t.fontFamily || {})) {
  const fallback = FONT_FALLBACK[name] || 'sans-serif';
  lines.push(`  --font-${name}: "${v}", ${fallback};`);
}

lines.push('}');
lines.push('');

await mkdir(path.dirname(OUT), { recursive: true });
await writeFile(OUT, lines.join('\n'));

// ── 복합 타입 토큰(type styles) → src/styles/type-styles.css ──────────────
// 코드 소유. 한 토큰이 폰트·크기·행간·자간·케이스를 묶는다(색 제외).
// size/font 는 Figma 토큰(--font-*)을, leading/tracking 은 코드 스케일을 참조.
// 나중에 Figma Text Styles 내보내기로 type-styles.json 을 채우면 그대로 승급된다.
const TYPES_SRC = path.join(ROOT, 'src/design/type-styles.json');
const TYPES_OUT = path.join(ROOT, 'src/styles/type-styles.css');
const styles = JSON.parse(await readFile(TYPES_SRC, 'utf8'));

const tlines = [];
tlines.push('/* AUTO-GENERATED — src/design/type-styles.json 에서 생성됨. 직접 수정하지 말 것. */');
tlines.push('/* 갱신: type-styles.json 수정 → `npm run tokens:build` */');
tlines.push('/* @layer 래퍼 없이 bare 규칙으로 둔다(파일별 PostCSS 처리 — @tailwind 미포함). @apply 는 정상 동작. */');
let styleCount = 0;
for (const [name, s] of Object.entries(styles)) {
  if (name.startsWith('_')) continue;
  const cls = [`font-${s.font}`, `text-${s.size}`, `leading-${s.leading}`, `tracking-${s.tracking}`];
  if (s.case === 'upper') cls.push('uppercase');
  tlines.push(`.type-${name} { @apply ${cls.join(' ')}; }`);
  styleCount += 1;
}
tlines.push('');
await writeFile(TYPES_OUT, tlines.join('\n'));

console.log(
  `생성: tokens.css (${Object.keys(t.color).length} colors, ${Object.keys(t.spacing).length} spacing, ` +
  `${Object.keys(t.fontSize).length} font-size) · type-styles.css (${styleCount} type styles)`,
);
