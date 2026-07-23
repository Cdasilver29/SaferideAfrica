/**
 * SafeRide UI tokens. Single source of truth.
 * tailwind.config.js mirrors these values; change them here first,
 * then sync the config. Nothing else in the app hardcodes a hex.
 */

export const color = {
  // Tarmac neutrals
  asphalt: "#14181F",
  asphalt800: "#1E242E",
  asphalt700: "#2A3140",
  // Road-marking white, slightly warm so large fields don't glare
  chalk: "#F7F8F5",
  chalkDim: "#ECEEE9",
  // Signage amber. Primary action color, echoes KE plate yellow
  amber: "#FFB700",
  amberDeep: "#DF9E00",
  // Go-signal green. Success + WhatsApp affordances only
  signal: "#1FA85B",
  // Text
  ink: "#14181F",
  inkMuted: "#5A6272",
  inkOnDark: "#F7F8F5",
  inkOnDarkMuted: "#9AA3B2",
  // Feedback
  danger: "#D64545",
} as const;

/**
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

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  pill: 999,
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
  section: 72,
  sectionMobile: 48,
} as const;

/**
 * Type scale. Display = Archivo (signage voice), Body = Inter.
 * Load via @expo-google-fonts/archivo and @expo-google-fonts/inter
 * in app/_layout.tsx alongside the existing fonts.
 */
export const font = {
  display: "Archivo_700Bold",
  displayMedium: "Archivo_600SemiBold",
  body: "Inter_400Regular",
  bodyMedium: "Inter_500Medium",
  bodyBold: "Inter_700Bold",
} as const;

export const breakpoint = {
  md: 768,
  lg: 1024,
} as const;
