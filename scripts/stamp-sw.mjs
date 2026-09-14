/* Stamps a build id into dist/sw.js after `expo export`.
 *
 * public/sw.js is copied into dist verbatim, so it never passes through a
 * bundler and carries a '__BUILD_ID__' placeholder instead. This rewrites that
 * placeholder so each build names its cache differently and the worker's
 * activate handler can drop the previous build's assets. Run it as part of the
 * build, after the export: see package.json build:web and vercel.json.
 *
 * The id is a digest of the export's own hashed asset filenames, so it changes
 * exactly when the bundle changes and a rebuild that produced identical output
 * does not force every visitor to re-download. If the export has no static
 * assets to hash, it falls back to a timestamp, which over-invalidates rather
 * than under-invalidates.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const DIST = path.resolve('dist');
const SW_PATH = path.join(DIST, 'sw.js');
const STATIC_DIR = path.join(DIST, '_expo', 'static');

// Matches the placeholder and an already-stamped value alike, so re-running
// this on the same file re-stamps instead of failing.
const BUILD_ID_LINE = /const BUILD_ID = '([^']*)';/;

function fail(message) {
  console.error('stamp-sw: ' + message);
  process.exit(1);
}

/** Every file under dist/_expo/static, as dist-relative posix paths. */
function collectAssets(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectAssets(full, acc);
    else acc.push(path.relative(DIST, full).split(path.sep).join('/'));
  }
  return acc;
}

function buildId() {
  if (!fs.existsSync(STATIC_DIR)) {
    return 'ts' + Date.now().toString(36);
  }
  const assets = collectAssets(STATIC_DIR);
  if (assets.length === 0) {
    return 'ts' + Date.now().toString(36);
  }
  // Metro content-hashes these filenames, so the sorted list is a fingerprint
  // of the build without having to read any file contents.
  return crypto.createHash('sha256').update(assets.sort().join('\n')).digest('hex').slice(0, 12);
}

if (!fs.existsSync(SW_PATH)) {
  fail('dist/sw.js not found. Run the export before stamping.');
}

const source = fs.readFileSync(SW_PATH, 'utf8');
const match = source.match(BUILD_ID_LINE);

if (!match) {
  fail("no \"const BUILD_ID = '...';\" line in dist/sw.js. Did public/sw.js change shape?");
}

const id = buildId();
fs.writeFileSync(SW_PATH, source.replace(BUILD_ID_LINE, "const BUILD_ID = '" + id + "';"), 'utf8');

console.log('stamp-sw: dist/sw.js cache is now saferide-shell-' + id + ' (was ' + match[1] + ')');
