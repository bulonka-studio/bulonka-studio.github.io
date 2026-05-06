// Fails if any built page's JS or CSS exceeds the budget.
// Budgets are gzipped sizes per the spec §7.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname, basename, dirname } from 'node:path';
import { gzipSync } from 'node:zlib';

const JS_BUDGET = 50 * 1024;   // 50 kB gzipped
const CSS_BUDGET = 15 * 1024;  // 15 kB gzipped

function* walk(dir) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

const allFiles = [...walk('dist')];
const htmlFiles = allFiles.filter(f => extname(f) === '.html');

function gz(file) { return gzipSync(readFileSync(file)).length; }

function findReferenced(html, ext) {
  const bodies = readFileSync(html, 'utf8');
  // Match src="…" / href="…" / "…" referring to .js or .css
  const re = ext === '.js'
    ? /(?:src|href)=["']([^"']+\.js)["']/g
    : /(?:href)=["']([^"']+\.css)["']/g;
  const refs = [];
  let m;
  while ((m = re.exec(bodies)) !== null) refs.push(m[1]);
  return refs;
}

function resolveRef(ref, fromHtml) {
  // ref is like "/assets/foo.js" or "./assets/foo.js"
  const cleaned = ref.replace(/^\//, '');
  const candidates = [
    join('dist', cleaned),
    join(dirname(fromHtml), cleaned),
  ];
  for (const c of candidates) if (existsSync(c)) return c;
  return null;
}

let failed = false;
for (const html of htmlFiles) {
  const route = html.replace(/^dist/, '').replace(/index\.html$/, '') || '/';

  let jsTotal = 0;
  for (const ref of findReferenced(html, '.js')) {
    const f = resolveRef(ref, html);
    if (f) jsTotal += gz(f);
  }
  let cssTotal = 0;
  for (const ref of findReferenced(html, '.css')) {
    const f = resolveRef(ref, html);
    if (f) cssTotal += gz(f);
  }

  const jsKb = (jsTotal / 1024).toFixed(2);
  const cssKb = (cssTotal / 1024).toFixed(2);
  const jsOk = jsTotal <= JS_BUDGET;
  const cssOk = cssTotal <= CSS_BUDGET;
  console.log(`${route}  JS ${jsKb} kB ${jsOk ? '✓' : '✗'}   CSS ${cssKb} kB ${cssOk ? '✓' : '✗'}`);
  if (!jsOk || !cssOk) failed = true;
}

if (failed) {
  console.error(`\nFAIL: budget exceeded. Limits: JS ${JS_BUDGET / 1024} kB / CSS ${CSS_BUDGET / 1024} kB (gzipped)`);
  process.exit(1);
}
console.log('OK all bundles within budget');
