/**
 * Semantic colour tokens — values must stay in sync with global.css CSS variables.
 * Use this hook instead of isDark ? '#hex' : '#hex' scattered across components.
 */
import { useColorScheme } from 'nativewind';

const LIGHT = {
  background:      '#ffffff',
  foreground:      '#221f20',
  card:            '#ffffff',
  cardForeground:  '#221f20',
  muted:           '#ffffff',
  mutedForeground: 'rgba(34,31,32,0.6)',
  border:          'rgba(34,31,32,0.1)',
  primary:         '#01a5f0',
  primaryFg:       '#ffffff',
  accent:          '#ffd800',
  accentDark:      '#221f20',
} as const;

const DARK = {
  background:      '#221f20',
  foreground:      '#ffffff',
  card:            'rgba(255,255,255,0.06)',
  cardForeground:  '#ffffff',
  muted:           'rgba(255,255,255,0.06)',
  mutedForeground: 'rgba(255,255,255,0.7)',
  border:          'rgba(255,255,255,0.15)',
  primary:         '#01a5f0',
  primaryFg:       '#ffffff',
  accent:          '#ffd800',
  accentDark:      '#221f20',
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
