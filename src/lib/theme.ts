/**
 * Semantic colour tokens — values must stay in sync with global.css CSS variables.
 * Use this hook instead of isDark ? '#hex' : '#hex' scattered across components.
 */
import { useColorScheme } from 'nativewind';

/**
 * Raw brand hues. THE single source of truth for every brand hex in the app.
 * These are theme-invariant (identical in light and dark). The LIGHT/DARK maps
 * below reference them, and so does the `brand` token in tokens.ts, so each
 * brand hex is written down exactly once, here.
 *
 * `deep` and `action` have no semantic-theme role; they exist only for the
 * HeaderV3 brand palette (utility-bar cyan and the Call Now red) but live here
 * so the brand palette stays single-sourced.
 */
export const brandHex = {
  primary:   '#01a5f0',
  accent:    '#ffd800',
  ink:       '#221f20',
  onPrimary: '#ffffff',
  deep:      '#016c9d',
  action:    '#e11d2e',
} as const;

const LIGHT = {
  background:      brandHex.onPrimary,
  foreground:      brandHex.ink,
  card:            brandHex.onPrimary,
  cardForeground:  brandHex.ink,
  muted:           brandHex.onPrimary,
  mutedForeground: 'rgba(34,31,32,0.6)',
  border:          'rgba(34,31,32,0.1)',
  primary:         brandHex.primary,
  primaryFg:       brandHex.onPrimary,
  accent:          brandHex.accent,
  accentDark:      brandHex.ink,
} as const;

const DARK = {
  background:      brandHex.ink,
  foreground:      brandHex.onPrimary,
  card:            'rgba(255,255,255,0.06)',
  cardForeground:  brandHex.onPrimary,
  muted:           'rgba(255,255,255,0.06)',
  mutedForeground: 'rgba(255,255,255,0.7)',
  border:          'rgba(255,255,255,0.15)',
  primary:         brandHex.primary,
  primaryFg:       brandHex.onPrimary,
  accent:          brandHex.accent,
  accentDark:      brandHex.ink,
} as const;

export type Theme = {
  background:      string;
  foreground:      string;
  card:            string;
  cardForeground:  string;
  muted:           string;
  mutedForeground: string;
  border:          string;
  primary:         string;
  primaryFg:       string;
  accent:          string;
  accentDark:      string;
  isDark:          boolean;
};

export function useTheme(): Theme {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  return { ...(isDark ? DARK : LIGHT), isDark };
}
