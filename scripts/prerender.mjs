// Injects prerendered page HTML into the built dist/*.html files so all
// pages render fully with JavaScript disabled (spec §2, §12).
// Runs after `vite build --ssr src/entries/ssr.js --outDir dist-ssr`.
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { render } from '../dist-ssr/ssr.js';

const targets = [
  ['home', 'dist/index.html'],
  ['work', 'dist/work/index.html'],
  ['contact', 'dist/contact/index.html'],
];

for (const [name, file] of targets) {
  const html = await render(name);
  if (html.length < 500) throw new Error(`prerender: suspiciously small output for "${name}" (${html.length} chars)`);
  const doc = readFileSync(file, 'utf8');
  const marker = '<div id="app"></div>';
  if (!doc.includes(marker)) throw new Error(`prerender: ${file} has no empty #app marker`);
  writeFileSync(file, doc.replace(marker, `<div id="app">${html}</div>`));
  console.log(`prerendered ${file} (${(html.length / 1024).toFixed(1)} kB markup)`);
}

rmSync('dist-ssr', { recursive: true, force: true });
console.log('OK prerender complete');
