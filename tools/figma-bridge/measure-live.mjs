// live 전 요소 실측 엔진: geometry(abs) + computed style + text.
// canonical: RSVP 펼침(참석 O 클릭). 결과 → /tmp/live_spec.json, 손글씨 → /tmp/handwriting.svg
import pkg from '/home/keonchae/wedding-invitation/node_modules/playwright-core/index.js';
const { chromium } = pkg;
import fs from 'node:fs';

const browser = await chromium.launch({ channel: 'chrome', args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.getByRole('button', { name: '탭하여 입장하기' }).click();
await page.waitForTimeout(9500);
// canonical RSVP: 참석 O 펼침
try { await page.getByRole('button', { name: 'O', exact: true }).first().click({ timeout: 2000 }); } catch {}
await page.waitForTimeout(500);
const docH = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < docH; y += 500) { await page.evaluate((yy) => scrollTo(0, yy), y); await page.waitForTimeout(120); }
await page.evaluate(() => scrollTo(0, 0));
await page.waitForTimeout(1000);

// handwriting svg
const svgEl = await page.$('svg[aria-label="We are getting married"]');
if (svgEl) { const html = await svgEl.evaluate((e) => e.outerHTML); fs.writeFileSync('/tmp/handwriting.svg', html); }

const spec = await page.evaluate(() => {
  const main = document.querySelector('main');
  const secs = [...main.querySelectorAll(':scope > section, :scope > footer')];
  const secTop = (el) => Math.round(el.getBoundingClientRect().top + scrollY);
  const sections = secs.map((el, i) => {
    const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
    const known = [['THE WEDDING OF','DateVenue'],['MARK','Invitation'],['오시는 길','Location'],['참석 여부','RSVP'],['방명록','Guestbook'],['마음 전하실 곳','Account'],['COUNTDOWN','Countdown'],['Arise My Love','Footer']];
    let name = i === 0 ? 'Hero' : '(?)';
    for (const [k, v] of known) if (t.includes(k)) name = v;
    if (name === '(?)' && el.querySelector('[aria-label="갤러리 사진 슬라이드"]')) name = 'Gallery';
    return { i, name, top: secTop(el), height: Math.round(el.getBoundingClientRect().height) };
  });
  const secOf = (top) => { let best = sections[0]; for (const s of sections) if (s.top <= top + 1) best = s; return best; };
  const cs = (el, p) => getComputedStyle(el)[p];
  const px = (v) => Math.round(parseFloat(v) || 0);
  const records = [];
  const seen = new Set();
  const all = [...main.querySelectorAll('*')];
  for (const el of all) {
    const tag = el.tagName;
    const isLeafText = el.childElementCount === 0 && (el.textContent || '').trim().length > 0;
    const isBox = ['IMG','BUTTON','A','INPUT','TEXTAREA','SVG'].includes(tag);
    const r = el.getBoundingClientRect();
    const isHair = r.height > 0 && r.height <= 2 && r.width > 8 && cs(el, 'backgroundColor') !== 'rgba(0, 0, 0, 0)';
    if (!isLeafText && !isBox && !isHair) continue;
    if (r.width < 1 || r.height < 1) continue;
    const top = Math.round(r.top + scrollY), left = Math.round(r.left), w = Math.round(r.width), h = Math.round(r.height);
    const text = (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60);
    const key = `${tag}|${top}|${left}|${w}|${h}|${text}`;
    if (seen.has(key)) continue; seen.add(key);
    const s = secOf(top);
    records.push({
      sec: s.name, secTop: s.top, offTop: top - s.top,
      tag, text, top, left, w, h,
      ff: cs(el, 'fontFamily').split(',')[0].replace(/["']/g, ''),
      fs: px(cs(el, 'fontSize')), fw: cs(el, 'fontWeight'),
      ls: cs(el, 'letterSpacing'), color: cs(el, 'color'),
      bg: cs(el, 'backgroundColor'), bdr: cs(el, 'borderColor'),
    });
  }
  return { docH: document.body.scrollHeight, sections, records };
});
fs.writeFileSync('/tmp/live_spec.json', JSON.stringify(spec, null, 2));
const bySec = {};
for (const r of spec.records) bySec[r.sec] = (bySec[r.sec] || 0) + 1;
console.log('sections:', JSON.stringify(spec.sections));
console.log('record counts:', JSON.stringify(bySec), 'total', spec.records.length);
console.log('svg bytes:', fs.existsSync('/tmp/handwriting.svg') ? fs.statSync('/tmp/handwriting.svg').size : 0);
await browser.close();
