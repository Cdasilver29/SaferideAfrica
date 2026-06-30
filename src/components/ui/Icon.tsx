import React from 'react';
import type { LucideIcon, LucideProps } from 'lucide-react-native';

// ─── Lucide icon standardization (Phase 5) ─────────────────────────────────────
// One stroke width and one rounded line style across the product, plus a fixed
// size scale so icons keep a consistent rhythm. Rebuilt surfaces (Phases 8-11)
// render Lucide icons through this wrapper instead of setting size and stroke
// inline. Lucide already defaults to round caps and joins; we set them here so
// the standard is explicit and cannot drift.

export const ICON_SIZE = {
  xs: 16,
  sm: 18,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

export const ICON_STROKE = 2;

export type IconSize = keyof typeof ICON_SIZE;

type IconProps = Omit<LucideProps, 'size'> & {
  icon: LucideIcon;
  size?: IconSize | number;
};

export function Icon({ icon: Glyph, size = 'md', strokeWidth = ICON_STROKE, ...rest }: IconProps) {
  const px = typeof size === 'number' ? size : ICON_SIZE[size];
  return (
    <Glyph
      size={px}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    />
  );
}
