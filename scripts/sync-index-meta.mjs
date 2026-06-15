import { readFile, writeFile } from 'node:fs/promises';
import { wedding } from '../src/config/wedding.js';

const INDEX_PATH = new URL('../index.html', import.meta.url);
const DEPLOY_ORIGIN = 'https://teacherchae.github.io';

function absoluteUrl(path) {
  return path.startsWith('http') ? path : `${DEPLOY_ORIGIN}${path}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function replaceFirst(html, pattern, replacement, label) {
  if (!pattern.test(html)) throw new Error(`Could not update ${label} in index.html`);
  return html.replace(pattern, replacement);
}

const title = wedding.share.title;
const description = wedding.share.description;
const image = absoluteUrl(wedding.share.image);

let html = await readFile(INDEX_PATH, 'utf8');

html = replaceFirst(html, /<meta name="viewport" content="[^"]*" \/>/, '<meta name="viewport" content="width=device-width, initial-scale=1.0" />', 'viewport');
html = replaceFirst(html, /<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`, 'title');
html = replaceFirst(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`, 'description');
html = replaceFirst(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escapeHtml(title)}" />`, 'og:title');
html = replaceFirst(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escapeHtml(description)}" />`, 'og:description');
html = replaceFirst(html, /<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${escapeHtml(image)}" />`, 'og:image');
html = replaceFirst(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${escapeHtml(title)}" />`, 'twitter:title');
html = replaceFirst(html, /<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${escapeHtml(description)}" />`, 'twitter:description');
html = replaceFirst(html, /<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${escapeHtml(image)}" />`, 'twitter:image');

await writeFile(INDEX_PATH, html);
console.log(`동기화: index.html metadata ← ${title}`);
