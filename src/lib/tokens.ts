/**
 * SafeRide brand tokens. Single source of truth for the HeaderV3 palette.
 * tailwind.config.js mirrors these values; change them here first,
 * then sync the config. Nothing else in the app hardcodes a hex.
 *
 * BRAND tokens, HeaderV3. Real SafeRide values, not the screenshot
 * approximations from the brand-tokens spec file. Sourced from
 * src/lib/theme.ts and src/components/landing/constants.ts:
 *   primary  = theme.primary / constants.skyDeep
 *   accent   = theme.accent  / constants.yellow
 *   action   = constants.red (Call Now)
 *   ink      = theme.foreground / constants.dark
 * `deep` has no source-of-truth value: the palette defines one cyan only.
 * Derived here as a darker shade of primary for the tier 2 utility bar,
 * per the spec's fallback guidance. Flagged for confirmation.
 */
export const brand = {
  primary: "#01a5f0",   // SafeRide cyan, header + primary surfaces
  deep: "#016c9d",      // derived darker cyan, utility bar (not a source value)
  accent: "#ffd800",    // SafeRide yellow, wordmark + Enrol + active nav
  action: "#e11d2e",    // Call Now only
  ink: "#221f20",       // text on light surfaces
  onPrimary: "#ffffff", // text on primary + deep surfaces
} as const;
