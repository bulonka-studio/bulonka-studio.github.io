// Fails if any built HTML/JS/CSS file contains a reference to a known
// third-party tracking host. Add new domains to FORBIDDEN as needed.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const FORBIDDEN = [
  'google-analytics.com',
  'googletagmanager.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'connect.facebook.net',
  'segment.com',
  'segment.io',
  'mixpanel.com',
  'hotjar.com',
  'amplitude.com',
  'sentry.io',
  'cloudflareinsights.com',
];
const SCAN_EXT = new Set(['.html', '.js', '.css', '.svg', '.json', '.xml']);

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

let failed = false;
for (const file of walk('dist')) {
  if (!SCAN_EXT.has(extname(file))) continue;
  const body = readFileSync(file, 'utf8');
  for (const host of FORBIDDEN) {
    if (body.includes(host)) {
      console.error(`FAIL: ${file} contains forbidden host "${host}"`);
      failed = true;
    }
  }
}

if (failed) process.exit(1);
console.log('OK no third-party tracking hosts in dist/');
