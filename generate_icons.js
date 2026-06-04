/**
 * generate_icons.js
 *
 * Generates all required Expo icon/splash assets from assets/images/saferide-logo.jpg.
 *
 * Outputs:
 *   assets/images/icon.png          — 1024×1024  iOS app icon (square, skyDeep bg)
 *   assets/images/adaptive-icon.png — 1024×1024  Android adaptive icon foreground
 *   assets/images/favicon.png       — 64×64      Web browser tab icon
 *   assets/images/splash.png        — 1284×2778  Splash / loading screen
 *
 * Usage:  node generate_icons.js
 */

const path  = require('path');
const sharp = require('sharp');

const SRC    = path.join(__dirname, 'assets/images/saferide-logo.jpg');
const OUT    = path.join(__dirname, 'assets/images');

const SKY_DEEP = { r: 1,   g: 165, b: 240, alpha: 1 };   // #01a5f0
const NAVY     = { r: 1,   g: 28,  b: 72,  alpha: 1 };   // #011c48
const WHITE    = { r: 255, g: 255, b: 255, alpha: 1 };

async function generate() {
  console.log('\nGenerating icons from saferide-logo.jpg...\n');

  // ── 1. icon.png — 1024×1024, logo centred on skyDeep background ────────────
  await sharp(SRC)
    .resize(820, 820, { fit: 'contain', background: SKY_DEEP })
    .extend({ top: 102, bottom: 102, left: 102, right: 102, background: SKY_DEEP })
    .png()
    .toFile(path.join(OUT, 'icon.png'));
  console.log('  ✅  icon.png          (1024×1024)');

  // ── 2. adaptive-icon.png — 1024×1024, logo on white (Android crops to circle)
  await sharp(SRC)
    .resize(780, 780, { fit: 'contain', background: WHITE })
    .extend({ top: 122, bottom: 122, left: 122, right: 122, background: WHITE })
    .png()
    .toFile(path.join(OUT, 'adaptive-icon.png'));
  console.log('  ✅  adaptive-icon.png (1024×1024)');

  // ── 3. favicon.png — 64×64, logo on skyDeep ────────────────────────────────
  await sharp(SRC)
    .resize(52, 52, { fit: 'contain', background: SKY_DEEP })
    .extend({ top: 6, bottom: 6, left: 6, right: 6, background: SKY_DEEP })
    .png()
    .toFile(path.join(OUT, 'favicon.png'));
  console.log('  ✅  favicon.png       (64×64)');

  // ── 4. splash.png — 1284×2778 (iPhone 14 Pro Max), logo on navy ────────────
  const logoSplash = await sharp(SRC)
    .resize(640, 640, { fit: 'contain', background: NAVY })
    .png()
    .toBuffer();

  await sharp({
    create: { width: 1284, height: 2778, channels: 4, background: NAVY },
  })
    .composite([{ input: logoSplash, gravity: 'center' }])
    .png()
    .toFile(path.join(OUT, 'splash.png'));
  console.log('  ✅  splash.png        (1284×2778)');

  console.log('\nDone! All icons written to assets/images/\n');
}

generate().catch(err => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
