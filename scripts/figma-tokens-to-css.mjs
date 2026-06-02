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
for (const [name, c] of Object.entries(t.color)) {
  if (c.alpha === 1) {
    lines.push(`  --color-${name}: ${c.channels};`);
  } else {
    const [r, g, b] = c.channels.split(' ');
    lines.push(`  --color-${name}: rgba(${r}, ${g}, ${b}, ${c.alpha});`);
  }
}

lines.push('  /* spacing */');
for (const [name, v] of Object.entries(t.spacing)) {
  lines.push(`  --spacing-${name}: ${v}px;`);
}

lines.push('  /* font-size */');
for (const [name, v] of Object.entries(t.fontSize)) {
  lines.push(`  --font-size-${name}: ${v}px;`);
}

lines.push('}');
lines.push('');

await mkdir(path.dirname(OUT), { recursive: true });
await writeFile(OUT, lines.join('\n'));
console.log(`tokens.css 생성: ${path.relative(ROOT, OUT)} (${Object.keys(t.color).length} colors, ${Object.keys(t.spacing).length} spacing, ${Object.keys(t.fontSize).length} font-size)`);
