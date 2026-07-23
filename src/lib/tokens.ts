/**
 * SafeRide brand tokens. Single source of truth for the HeaderV3 palette.
 * tailwind.config.js mirrors these values; change them here first,
 * then sync the config. Nothing else in the app hardcodes a hex.
 *
 * The hexes themselves are NOT written here. Every brand colour is defined
 * once in src/lib/theme.ts (`brandHex`); this export only maps those raw hues
 * onto the brand key names HeaderV3 and _layout.tsx consume:
 *   primary   = SafeRide cyan, header + primary surfaces
 *   deep      = derived darker cyan, utility bar (brand-only, not a theme value)
 *   accent    = SafeRide yellow, wordmark + Enrol + active nav
 *   action    = Call Now red only (brand-only)
 *   ink       = text on light surfaces
 *   onPrimary = text on primary + deep surfaces
 */
import { brandHex } from './theme';

export const brand = {
  primary:   brandHex.primary,
  deep:      brandHex.deep,
  accent:    brandHex.accent,
  action:    brandHex.action,
  ink:       brandHex.ink,
  onPrimary: brandHex.onPrimary,
} as const;
