import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const outputPath = path.resolve('public/videos/calligraphy-hero.webm');
const posterPath = path.resolve('public/images/calligraphy-poster.png');
const playwrightEntry = pathToFileURL(
  'C:/Users/brian/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/playwright@1.60.0/node_modules/playwright/index.mjs'
).href;
const { chromium } = await import(playwrightEntry);

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});
const page = await browser.newPage({ viewport: { width: 1080, height: 1440 } });

const result = await page.evaluate(async () => {
  const width = 1080;
  const height = 1440;
  const duration = 5600;
  const fps = 60;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  document.body.style.margin = '0';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const css = {
    cream: '#FAF7F2',
    forest: '#2F3F36',
    ink: '#1F2A24',
    sage: '#8B9D7A',
    sageDark: '#6B7B5E',
    terracotta: '#C97D60',
  };

  const strokes = [
    { start: 420, end: 1250, width: 16, color: css.ink, points: [[178, 632], [244, 486], [330, 505], [283, 659], [220, 765], [382, 711]] },
    { start: 980, end: 1780, width: 12, color: css.ink, points: [[367, 701], [432, 591], [493, 628], [433, 740], [506, 761]] },
    { start: 1500, end: 2300, width: 11, color: css.ink, points: [[514, 730], [575, 571], [628, 597], [593, 758], [681, 733]] },
    { start: 2100, end: 3060, width: 10, color: css.ink, points: [[707, 704], [768, 571], [853, 603], [801, 720], [705, 812], [902, 778]] },
    { start: 3000, end: 3800, width: 8, color: css.sageDark, points: [[333, 858], [472, 836], [614, 855], [760, 830]] },
    { start: 3350, end: 4350, width: 9, color: css.terracotta, points: [[386, 912], [465, 1001], [574, 901], [665, 993], [759, 901]] },
  ];

  const leaves = [
    { x: 244, y: 891, r: -0.55, t: 2450 },
    { x: 826, y: 866, r: 0.42, t: 2720 },
    { x: 535, y: 1036, r: 0.08, t: 4200 },
  ];

  const ease = (x) => 1 - Math.pow(1 - Math.max(0, Math.min(1, x)), 3);

  function drawBackground(time) {
    ctx.fillStyle = css.cream;
    ctx.fillRect(0, 0, width, height);

    const pulse = 0.5 + Math.sin(time / 900) * 0.5;
    const glow = ctx.createRadialGradient(540, 720, 40, 540, 720, 650);
    glow.addColorStop(0, `rgba(139,157,122,${0.16 + pulse * 0.04})`);
    glow.addColorStop(0.45, 'rgba(184,197,169,0.09)');
    glow.addColorStop(1, 'rgba(250,247,242,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = 0.22;
    ctx.strokeStyle = css.sage;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(212, 1134);
    ctx.bezierCurveTo(364, 1074, 704, 1078, 866, 1140);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function pathSegments(points) {
    const segments = [];
    for (let i = 0; i < points.length - 2; i += 2) {
      segments.push([points[i], points[i + 1], points[i + 2]]);
    }
    return segments;
  }

  function drawPartialStroke(stroke, progress) {
    if (progress <= 0) return;
    const segments = pathSegments(stroke.points);
    const visible = progress * segments.length;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.shadowColor = 'rgba(31,42,36,0.16)';
    ctx.shadowBlur = 4;

    for (let index = 0; index < segments.length; index += 1) {
      const local = Math.max(0, Math.min(1, visible - index));
      if (local <= 0) break;
      const [from, control, to] = segments[index];
      ctx.beginPath();
      ctx.moveTo(from[0], from[1]);
      const steps = Math.max(2, Math.round(34 * local));
      for (let step = 1; step <= steps; step += 1) {
        const t = (step / 34) * local;
        const x = (1 - t) * (1 - t) * from[0] + 2 * (1 - t) * t * control[0] + t * t * to[0];
        const y = (1 - t) * (1 - t) * from[1] + 2 * (1 - t) * t * control[1] + t * t * to[1];
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    ctx.globalAlpha = Math.min(0.2, progress * 0.2);
    ctx.lineWidth = stroke.width * 2.4;
    ctx.strokeStyle = stroke.color;
    for (const [from, control, to] of segments) {
      ctx.beginPath();
      ctx.moveTo(from[0], from[1]);
      ctx.quadraticCurveTo(control[0], control[1], to[0], to[1]);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawLeaf({ x, y, r, t }, time) {
    const p = ease((time - t) / 620);
    if (p <= 0) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(r);
    ctx.scale(0.85 + p * 0.15, 0.85 + p * 0.15);
    ctx.globalAlpha = p * 0.78;
    ctx.fillStyle = css.sage;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(38, -36, 84, -22, 104, 0);
    ctx.bezierCurveTo(67, 30, 30, 26, 0, 0);
    ctx.fill();
    ctx.strokeStyle = 'rgba(47,63,54,0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(8, 0);
    ctx.quadraticCurveTo(47, -4, 92, 0);
    ctx.stroke();
    ctx.restore();
  }

  function drawTitle(time) {
    const p = ease((time - 4300) / 640);
    if (p <= 0) return;
    ctx.save();
    ctx.globalAlpha = p;
    ctx.fillStyle = css.forest;
    ctx.textAlign = 'center';
    ctx.letterSpacing = '10px';
    ctx.font = '32px Georgia, serif';
    ctx.fillText('KEONHEE  &  JUKYEONG', 540, 1148);
    ctx.globalAlpha = p * 0.62;
    ctx.font = '22px system-ui, sans-serif';
    ctx.letterSpacing = '7px';
    ctx.fillText('2026. 09. 05', 540, 1199);
    ctx.restore();
  }

  function render(time) {
    drawBackground(time);
    for (const stroke of strokes) {
      drawPartialStroke(stroke, ease((time - stroke.start) / (stroke.end - stroke.start)));
    }
    for (const leaf of leaves) drawLeaf(leaf, time);
    drawTitle(time);
  }

  const stream = canvas.captureStream(fps);
  const recorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9',
    videoBitsPerSecond: 4500000,
  });
  const chunks = [];
  recorder.ondataavailable = (event) => {
    if (event.data.size) chunks.push(event.data);
  };

  recorder.start();
  const start = performance.now();

  await new Promise((resolve) => {
    function frame(now) {
      const time = Math.min(duration, now - start);
      render(time);
      if (time >= duration) {
        recorder.stop();
        resolve();
        return;
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });

  await new Promise((resolve) => {
    recorder.onstop = resolve;
  });

  const poster = canvas.toDataURL('image/png');
  const blob = new Blob(chunks, { type: 'video/webm' });
  const video = await blob.arrayBuffer();
  return {
    video: Array.from(new Uint8Array(video)),
    poster,
  };
});

await browser.close();

await writeFile(outputPath, Buffer.from(result.video));
await writeFile(posterPath, Buffer.from(result.poster.split(',')[1], 'base64'));

console.log(`Wrote ${outputPath}`);
console.log(`Wrote ${posterPath}`);
