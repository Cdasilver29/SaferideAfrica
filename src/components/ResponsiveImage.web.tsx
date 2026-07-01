import React from 'react';
import { Image as RNImage, StyleSheet } from 'react-native';
import type { ResponsiveImageProps } from './ResponsiveImage';

const DEFAULT_WIDTHS = [480, 768, 1200];

// Web sources are { uri: '/path.webp' }. Bundled requires resolve to a number or
// { uri } with a hashed name we cannot build a srcset from, so those fall back
// to a plain react-native Image.
function resolveUri(source: unknown): string | undefined {
  if (typeof source === 'number') return undefined;
  if (Array.isArray(source)) return (source[0] as { uri?: string })?.uri;
  return (source as { uri?: string })?.uri;
}

// Emits a native <img> with srcset + sizes for the responsive width variants
// produced by scripts/responsive_images.py (base-480.webp, base-768.webp, ...).
// The original file stays as the src fallback for browsers without srcset.
export function ResponsiveImage({
  source,
  alt = '',
  sizes,
  widths = DEFAULT_WIDTHS,
  resizeMode = 'cover',
  style,
  fill,
  lazy = true,
}: ResponsiveImageProps) {
  const uri = resolveUri(source);

  // Only build a srcset for our own /*.webp public images.
  const canSrcset = !!uri && /\.webp$/i.test(uri);
  const base = uri && canSrcset ? uri.replace(/\.webp$/i, '') : '';
  const srcSet = canSrcset
    ? widths.map((w) => `${base}-${w}.webp ${w}w`).join(', ')
    : undefined;

  if (!uri) {
    // Bundled asset (e.g. native fallback path shared by both platforms): render
    // a normal Image so nothing breaks.
    return (
      <RNImage source={source} accessibilityLabel={alt} resizeMode={resizeMode} style={style} />
    );
  }

  const flat = (StyleSheet.flatten(style) || {}) as Record<string, unknown>;
  const domStyle: React.CSSProperties = {
    display: 'block',
    objectFit: resizeMode,
    width: (flat.width as React.CSSProperties['width']) ?? '100%',
    height: (flat.height as React.CSSProperties['height']) ?? (fill ? '100%' : undefined),
    borderRadius: flat.borderRadius as React.CSSProperties['borderRadius'],
    backgroundColor: flat.backgroundColor as string | undefined,
    ...(fill
      ? { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }
      : null),
  };

  return (
    <img
      src={uri}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading={lazy ? 'lazy' : undefined}
      decoding="async"
      draggable={false}
      style={domStyle}
    />
  );
}

export default ResponsiveImage;
