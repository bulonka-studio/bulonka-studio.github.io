// Fails if any source file references retired purple brand color.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const HEX_LITERALS = ['BB86FC', '6750A4', 'D4A8FF'];
const WORD_LITERALS = ['purple'];
const SCAN_DIRS = ['src', 'tests', 'public'];
const SCAN_EXT = new Set(['.js', '.mjs', '.vue', '.html', '.css', '.svg', '.json']);

function* walk(dir) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

let failed = false;

function scan(file, body) {
  for (const hex of HEX_LITERALS) {
    if (body.toLowerCase().includes(hex.toLowerCase())) {
      console.error(`FAIL: ${file} contains hex "${hex}"`);
      failed = true;
    }
  }
  for (const word of WORD_LITERALS) {
    const re = new RegExp(`(^|[^a-z])${word}(?![a-z])`, 'i');
    if (re.test(body)) {
      console.error(`FAIL: ${file} contains word "${word}"`);
      failed = true;
    }
  }
}

for (const dir of SCAN_DIRS) {
  for (const file of walk(dir)) {
    if (!SCAN_EXT.has(extname(file))) continue;
    scan(file, readFileSync(file, 'utf8'));
  }
}

for (const f of ['index.html', 'work/index.html', 'contact/index.html', 'vite.config.js']) {
  if (!existsSync(f)) continue;
  scan(f, readFileSync(f, 'utf8'));
}

if (failed) process.exit(1);
console.log('OK no purple references anywhere');
