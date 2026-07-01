#!/usr/bin/env python3
"""
responsive_images.py

Emits responsive width variants (480, 768, 1200 wide) as webp for the heavy
web images that ResponsiveImage.web.tsx serves via srcset: the gallery set and
the Services photo. About uses gallery images, so it is covered too.

sharp (used by compress_public.js) is not installed in this environment, so we
use Pillow, matching the Phase 14 conversion approach. Same intent as the plan:
a repeatable repo script that produces width variants on disk.

  - Never upscales beyond the source width.
  - Skips a variant that already exists (idempotent).
  - Leaves the original file untouched (it stays as the <img src> fallback).

Usage:
  python scripts/responsive_images.py
"""

import os
import re
import glob
from PIL import Image

WIDTHS = [480, 768, 1200]
QUALITY = 80

# Heavy web images wired to ResponsiveImage (gallery grid, About, Services).
TARGETS = sorted(glob.glob(os.path.join("public", "gallery", "*.webp"))) + [
    os.path.join("public", "student-driver.webp"),
]

VARIANT_RE = re.compile(r"-(480|768|1200)\.webp$")

made = 0
skipped = 0
sample = []

for src in TARGETS:
    name = os.path.basename(src)
    if VARIANT_RE.search(name):
        continue  # already a variant, don't recurse on our own output
    if not os.path.exists(src):
        print(f"  missing source: {src}")
        continue

    base, _ = os.path.splitext(src)
    im = Image.open(src).convert("RGB")

    for w in WIDTHS:
        out = f"{base}-{w}.webp"
        if os.path.exists(out):
            skipped += 1
            continue
        tw = min(w, im.width)  # never upscale
        th = round(im.height * tw / im.width)
        im.resize((tw, th), Image.LANCZOS).save(out, "WEBP", quality=QUALITY, method=6)
        made += 1
        if len(sample) < 6:
            sample.append(
                f"    {os.path.basename(out):26s} {tw}x{th}  {os.path.getsize(out)/1024:6.1f} KB"
            )

print(f"\nResponsive variants: {made} written, {skipped} already present.")
if sample:
    print("Sample outputs:")
    print("\n".join(sample))
