/**
 * compress_public.js
 *
 * Converts all JPG/PNG images under ./public to WebP (80% quality, max 1200px wide).
 * - Skips files that already have a matching .webp output.
 * - Deletes the original only after confirming the output was written correctly.
 * - Processes subdirectories recursively (e.g. public/gallery/).
 * - Prints a size-saving summary at the end.
 *
 * Usage:
 *   node compress_public.js           — processes public/
 *   node compress_public.js ./assets  — processes a different folder
 */

const fs   = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(process.argv[2] || path.join(__dirname, 'public'));

const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);

let totalOriginal = 0;
let totalOutput   = 0;
let converted     = 0;
let skipped       = 0;
let failed        = 0;

async function processDir(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await processDir(fullPath);
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (!EXTENSIONS.has(ext)) continue;

    const baseName    = path.basename(entry.name, ext);
    const outputPath  = path.join(dir, `${baseName}.webp`);

    // Skip if the .webp already exists
    if (fs.existsSync(outputPath)) {
      console.log(`  ⏭  skip   ${path.relative(ROOT, fullPath)} (already converted)`);
      skipped++;
      continue;
    }

    const origSize = (await fs.promises.stat(fullPath)).size;

    try {
      await sharp(fullPath)
        .resize({ width: 1200, withoutEnlargement: true })  // never upscale
        .webp({ quality: 80 })
        .toFile(outputPath);

      const outSize = (await fs.promises.stat(outputPath)).size;

      // Sanity check — output must be at least 1 KB
      if (outSize < 1024) {
        await fs.promises.unlink(outputPath).catch(() => {});
        throw new Error(`Output suspiciously small (${outSize} bytes)`);
      }

      totalOriginal += origSize;
      totalOutput   += outSize;
      converted++;

      const saved    = origSize - outSize;
      const pct      = ((saved / origSize) * 100).toFixed(1);
      const origKB   = (origSize / 1024).toFixed(0).padStart(6);
      const outKB    = (outSize  / 1024).toFixed(0).padStart(6);
      console.log(`  ✅ ${origKB} KB → ${outKB} KB  (-${pct}%)  ${path.relative(ROOT, fullPath)}`);

      // Safe to delete original now
      await fs.promises.unlink(fullPath);

    } catch (err) {
      failed++;
      console.error(`  ❌ FAILED  ${path.relative(ROOT, fullPath)}: ${err.message}`);
    }
  }
}

(async () => {
  console.log(`\nCompressing images in: ${ROOT}\n`);
  await processDir(ROOT);

  console.log('\n─────────────────────────────────────────');
  console.log(`  Converted : ${converted}`);
  console.log(`  Skipped   : ${skipped}  (already .webp)`);
  console.log(`  Failed    : ${failed}`);

  if (converted > 0) {
    const savedMB  = ((totalOriginal - totalOutput) / 1024 / 1024).toFixed(2);
    const origMB   = (totalOriginal / 1024 / 1024).toFixed(2);
    const outMB    = (totalOutput   / 1024 / 1024).toFixed(2);
    const pct      = (((totalOriginal - totalOutput) / totalOriginal) * 100).toFixed(1);
    console.log(`  Before    : ${origMB} MB`);
    console.log(`  After     : ${outMB} MB`);
    console.log(`  Saved     : ${savedMB} MB  (${pct}% smaller)`);
  }
  console.log('─────────────────────────────────────────\n');
})();
