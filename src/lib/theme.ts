/**
 * Semantic colour tokens — values must stay in sync with global.css CSS variables.
 * Use this hook instead of isDark ? '#hex' : '#hex' scattered across components.
 */
import { useColorScheme } from 'nativewind';

const LIGHT = {
  background:      '#ffffff',
  foreground:      '#111827',
  card:            '#ffffff',
  cardForeground:  '#111827',
  muted:           '#f3f4f6',
  mutedForeground: '#4b5563',
  border:          '#e5e7eb',
  primary:         '#1877f2',
  primaryFg:       '#ffffff',
  accent:          '#facc15',
  accentDark:      '#d97706',
} as const;

const DARK = {
  background:      '#0b1220',
  foreground:      '#f8fafc',
  card:            '#111b2d',
  cardForeground:  '#f8fafc',
  muted:           '#1e293b',
  mutedForeground: '#94a3b8',
  border:          '#1e293b',
  primary:         '#1877f2',
  primaryFg:       '#ffffff',
  accent:          '#facc15',
  accentDark:      '#f59e0b',
} as const;

export type Theme = typeof LIGHT;

export function useTheme(): Theme & { isDark: boolean } {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  return { ...(isDark ? DARK : LIGHT), isDark };
}
