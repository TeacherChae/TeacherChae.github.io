// 청첩장 이미지 최적화 스크립트.
// public/images 의 원본 JPG 를 (1) 리사이즈된 .avif 와 (2) 리사이즈된 .jpg 폴백으로 변환한다.
// 사진은 AVIF 압축률이 가장 좋고(보통 mozjpeg 대비 −30~50%), 미지원 브라우저는 jpg 로 폴백한다.
// 원본은 git 에 커밋돼 있으므로 덮어써도 복구 가능. 한 번 실행: `npm run optimize:images`
// 재실행 시 이중 압축을 피하려면 먼저 `git checkout -- public/images` 로 원본을 복원할 것.
import sharp from 'sharp';
import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DIR = 'public/images';

// 표시 폭 기준 retina(×3) 까지 커버하는 최대 너비.
// 페이지 폭 ~430px → hero ~1290, 갤러리 카드 ~360px → ~1080, OG 썸네일 1200.
const WIDTHS = { hero: 1290, 'share-thumb': 1200 };
const DEFAULT_WIDTH = 1080;
const widthFor = (base) =>
  WIDTHS[base] ?? WIDTHS[base.replace(/-\d+$/, '')] ?? DEFAULT_WIDTH;

const files = (await readdir(DIR)).filter((f) => /\.jpe?g$/i.test(f));
let before = 0;
let after = 0;

for (const file of files) {
  const base = file.replace(/\.jpe?g$/i, '');
  const width = widthFor(base);
  const input = path.join(DIR, file);

  // .rotate() 로 EXIF 방향 보정. 같은 파이프라인을 clone 해 avif/jpg 동시 생성.
  const pipeline = sharp(input).rotate().resize({ width, withoutEnlargement: true });
  const avif = await pipeline.clone().avif({ quality: 58, effort: 4 }).toBuffer();
  const jpg = await pipeline.clone().jpeg({ quality: 82, mozjpeg: true }).toBuffer();

  await writeFile(path.join(DIR, `${base}.avif`), avif);
  await writeFile(input, jpg); // 원본 JPG 를 최적화본으로 덮어쓰기(폴백용)

  const kb = (n) => `${Math.round(n / 1024)}KB`;
  console.log(`${file.padEnd(18)} avif ${kb(avif.length).padStart(7)}  jpg ${kb(jpg.length).padStart(7)}`);
  before += jpg.length;
  after += avif.length;
}

console.log(`\n총 avif: ${Math.round(after / 1024)}KB  /  jpg 폴백: ${Math.round(before / 1024)}KB`);
