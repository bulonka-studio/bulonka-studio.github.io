// Fails if any source file or package.json references React.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const FORBIDDEN = ['react', 'react-dom', '@vitejs/plugin-react'];
// Note: scripts/ is intentionally excluded — this file's own FORBIDDEN literals
// would match itself. Application code (the thing we actually care about) lives
// in src/ and tests/.
const SCAN_DIRS = ['src', 'tests'];
const SCAN_EXT = new Set(['.js', '.mjs', '.vue', '.html', '.json', '.css']);

function* walk(dir) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

let failed = false;

// Check package.json
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const allDeps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
for (const dep of Object.keys(allDeps)) {
  if (FORBIDDEN.includes(dep)) {
    console.error(`FAIL: package.json depends on "${dep}"`);
    failed = true;
  }
}

// Check source dirs
for (const dir of SCAN_DIRS) {
  for (const file of walk(dir)) {
    if (!SCAN_EXT.has(extname(file))) continue;
    const body = readFileSync(file, 'utf8');
    for (const term of FORBIDDEN) {
      // word-boundary-ish match to avoid e.g. "reaction"
      const re = new RegExp(`(^|[^a-z])${term.replace(/[/]/g, '\\/')}(?![a-z-])`, 'i');
      if (re.test(body)) {
        console.error(`FAIL: ${file} mentions "${term}"`);
        failed = true;
      }
    }
  }
}

// Also scan root index.html and the two subpage HTMLs
for (const f of ['index.html', 'work/index.html', 'contact/index.html', 'vite.config.js']) {
  if (!existsSync(f)) continue;
  const body = readFileSync(f, 'utf8');
  for (const term of FORBIDDEN) {
    if (body.toLowerCase().includes(term.toLowerCase())) {
      console.error(`FAIL: ${f} mentions "${term}"`);
      failed = true;
    }
  }
}

if (failed) process.exit(1);
console.log('OK no React references anywhere');
