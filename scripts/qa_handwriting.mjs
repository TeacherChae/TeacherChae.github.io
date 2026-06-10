// 손글씨 애니메이션 실브라우저 QA (PRD §7 인수 기준 자동 검증).
//
// 사용법:
//   npx vite --port 5199 &           # dev 서버
//   npm i --no-save puppeteer        # 미설치 시 (의존성에 저장하지 않음)
//   node scripts/qa_handwriting.mjs
// WSL에서 chrome이 libasound.so.2 없다고 죽으면:
//   apt-get download libasound2 && dpkg -x libasound2*.deb /tmp/locallibs
//   LD_LIBRARY_PATH=/tmp/locallibs/usr/lib/x86_64-linux-gnu node scripts/qa_handwriting.mjs
//
// 검증 항목: 획 수(23)·필기 순서(i 점→줄기)·줄기 위→아래 방향·
// liftDrama 휴지 실측·inked 마스크/폭대비/텍스처·t 가로획 가시성·Hero 통합.
import puppeteer from 'puppeteer';

const BASE = process.env.QA_BASE || 'http://localhost:5199';
const out = [];
const ok = (name, pass, detail = '') => {
  out.push({ name, pass });
  console.log(`${pass ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`);
};

const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1100, height: 900 });
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

const setRange = (idx, value) =>
  page.evaluate((idx, value) => {
    const el = document.querySelectorAll("input[type=range]")[idx];
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, value);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, idx, value);
const setSelect = (value) =>
  page.evaluate((value) => {
    const el = document.querySelector('select');
    Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(el, value);
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
const clickCheckbox = (idx) =>
  page.evaluate((idx) => document.querySelectorAll("input[type=checkbox]")[idx].click(), idx);
const clickReplay = () =>
  page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent.includes('다시 재생')).click());

const N = 23; // 19글리프 → 23획 (t=줄기+가로획, i=점+줄기)

async function measureRun(mode, timeoutMs = 30000) {
  await clickReplay();
  // 리마운트가 끝나 모든 획이 hidden 이 될 때까지 대기 (이전 상태 오염 방지)
  const settle = Date.now();
  while (Date.now() - settle < 2000) {
    const anyVisible = await page.evaluate((mode) => {
      const svg = document.querySelectorAll('section svg')[0];
      const sel = mode === 'inked' ? 'mask path' : 'g > g > path';
      return [...svg.querySelectorAll(sel)].some((p) => parseFloat(getComputedStyle(p).opacity) > 0.5);
    }, mode);
    if (!anyVisible) break;
    await new Promise((r) => setTimeout(r, 30));
  }
  // WSL2 의 Date.now() 는 시계 보정으로 뒤로 점프할 수 있다 →
  // 브라우저의 단조 시계(performance.now())로만 측정한다.
  const t0 = await page.evaluate(() => performance.now());
  const first = {};
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const { vis, now } = await page.evaluate((mode) => {
      const svg = document.querySelectorAll('section svg')[0];
      const sel = mode === 'inked' ? 'mask path' : 'g > g > path';
      return {
        vis: [...svg.querySelectorAll(sel)].map((p) => parseFloat(getComputedStyle(p).opacity) > 0.5),
        now: performance.now(),
      };
    }, mode);
    const t = Math.round(now - t0);
    vis.forEach((v, i) => { if (v && first[i] === undefined) first[i] = t; });
    if (vis.length > 0 && vis.every(Boolean)) break;
    await new Promise((r) => setTimeout(r, 50));
  }
  return first;
}

// 줄기(획 idx)가 위에서 시작해 아래로 향하는지 — pen path d 의 y 진행으로 판정
const stemDownward = (mode, idx) =>
  page.evaluate((mode, idx) => {
    const svg = document.querySelectorAll('section svg')[0];
    const sel = mode === 'inked' ? 'mask path' : 'g > g > path';
    const d = [...svg.querySelectorAll(sel)][idx].getAttribute('d');
    const ys = (d.match(/-?\d*\.?\d+/g) || []).map(Number).filter((_, k) => k % 2 === 1);
    const rng = Math.max(...ys) - Math.min(...ys);
    return ys[0] - Math.min(...ys) <= 0.15 * rng; // 시작점이 최상단 15% 이내
  }, mode, idx);

// ---------- 데모 페이지 ----------
await page.goto(`${BASE}/handwriting-demo.html`, { waitUntil: 'networkidle0' });
await page.waitForSelector('section svg path');
await setRange(0, 1600);

// A. centerline: 25획, 필기 순서(i: 점→줄기 2토막)
let first = await measureRun('centerline');
const idx = Object.keys(first).map(Number).sort((a, b) => a - b);
ok(`centerline ${N}획 모두 그려짐`, idx.length === N, `${idx.length}획`);
ok('획이 필기 순서대로 시작', idx.every((i) => i === 0 || (first[i] ?? 0) >= (first[i - 1] ?? 0)));
ok("'i' 점(11,19) → 줄기 순서", first[11] < first[12] && first[19] < first[20],
   `i1: ${first[11]}→${first[12]}ms, i2: ${first[19]}→${first[20]}ms`);
ok("'i' 줄기 위→아래로 긋기 (centerline)",
   (await stemDownward('centerline', 12)) && (await stemDownward('centerline', 20)));

// B. 획간 휴지 liftDrama 0 vs 3
await setRange(3, 0);
await measureRun('centerline'); // 워밍업 런 — 프로그래매틱 입력의 상태 커밋을 보증
const span0 = (await measureRun('centerline'))[N - 1];
await setRange(3, 3);
await measureRun('centerline');
const span3 = (await measureRun('centerline'))[N - 1];
ok('liftDrama 0→3 에서 전체 시간 증가', span3 > span0 + 1000, `${span0}ms → ${span3}ms`);
await setRange(3, 1);

// C. inked variant
await clickCheckbox(1); // 가변 폭 잉크 (자동 리플레이)
await page.waitForSelector('section svg mask path');
const counts = await page.evaluate((N) => {
  const svg = document.querySelectorAll('section svg')[0];
  return { masks: svg.querySelectorAll('mask').length, inks: svg.querySelectorAll('g[fill] > path[mask]').length };
}, N);
ok(`inked: 마스크 ${N} + 잉크 path ${N}`, counts.masks === N && counts.inks === N, JSON.stringify(counts));
first = await measureRun('inked');
ok(`inked: ${N}획 모두 reveal`, Object.keys(first).length === N);
ok("inked: 'i' 점 먼저 + 줄기 하향", first[11] < first[12] && first[19] < first[20] && (await stemDownward('inked', 12)));
// 't' 가로획(8, 10) 가시성: ink 폴리곤 세로 두께 > 1 viewBox unit
const cross = await page.evaluate(() => {
  const svg = document.querySelectorAll('section svg')[0];
  return [8, 10].map((i) => {
    const b = [...svg.querySelectorAll('g[fill] > path[mask]')][i].getBBox();
    return +b.height.toFixed(2);
  });
});
ok("'t' 가로획 잉크가 보이는 두께", cross.every((h) => h > 1), `heights ${cross.join(', ')}`);
await page.screenshot({ path: '/tmp/qa_inked_c1.png', clip: { x: 150, y: 420, width: 800, height: 280 } });

// D. 폭 대비 ×2 전환
const d1 = await page.evaluate(() => document.querySelector('section svg g[fill] > path').getAttribute('d'));
await setSelect('2');
await new Promise((r) => setTimeout(r, 300));
const d2 = await page.evaluate(() => document.querySelector('section svg g[fill] > path').getAttribute('d'));
ok('폭 대비 ×2 전환 시 잉크 폴리곤 교체', d1 !== d2, `d 길이 ${d1.length}→${d2.length}`);
await measureRun('inked');
await page.screenshot({ path: '/tmp/qa_inked_c2.png', clip: { x: 150, y: 420, width: 800, height: 280 } });

// E. 텍스처
await clickCheckbox(2);
await new Promise((r) => setTimeout(r, 300));
const tex = await page.evaluate(() => {
  const svg = document.querySelectorAll('section svg')[0];
  return { filter: !!svg.querySelector('filter feTurbulence'), applied: !!svg.querySelector('g[filter]') };
});
ok('텍스처 필터 정의+적용', tex.filter && tex.applied, JSON.stringify(tex));
await measureRun('inked');
await page.screenshot({ path: '/tmp/qa_inked_texture.png', clip: { x: 150, y: 420, width: 800, height: 280 } });

ok('데모 콘솔/페이지 에러 0', errors.length === 0, errors.slice(0, 3).join(' | '));

// ---------- Hero(본 페이지, 진입 게이트 통과) ----------
const errBefore = errors.length;
await page.goto(`${BASE}/?motion=force`, { waitUntil: 'networkidle2' });
await page.waitForSelector('[role=button]', { timeout: 15000 });
await page.click('[role=button]');
await page.waitForSelector('svg[aria-label="We are getting married"]', { timeout: 15000 });
await new Promise((r) => setTimeout(r, 3000)); // 손글씨가 그려지는 중간 시점
const hero = await page.evaluate(() => {
  const svg = document.querySelector('svg[aria-label="We are getting married"]');
  if (!svg) return null;
  const paths = [...svg.querySelectorAll('g > g > path')];
  return { paths: paths.length, drawn: paths.filter((p) => parseFloat(getComputedStyle(p).opacity) > 0.5).length };
});
ok('Hero: 게이트 통과 후 손글씨 23획 + 그려지는 중', !!hero && hero.paths === N && hero.drawn > 0, JSON.stringify(hero));
await page.screenshot({ path: '/tmp/qa_hero.png' });
ok('Hero 콘솔/페이지 에러 0', errors.length === errBefore, errors.slice(errBefore).slice(0, 3).join(' | '));

await browser.close();
const fails = out.filter((r) => !r.pass).length;
console.log(`\n${out.length - fails}/${out.length} PASS`);
process.exit(fails ? 1 : 0);
