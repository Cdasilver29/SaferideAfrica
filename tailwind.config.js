/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Semantic tokens — resolve via CSS variables defined in global.css
        background:           'rgb(var(--background) / <alpha-value>)',
        foreground:           'rgb(var(--foreground) / <alpha-value>)',
        card:                 'rgb(var(--card) / <alpha-value>)',
        'card-foreground':    'rgb(var(--card-foreground) / <alpha-value>)',
        muted:                'rgb(var(--muted) / <alpha-value>)',
        'muted-foreground':   'rgb(var(--muted-foreground) / <alpha-value>)',
        border:               'rgb(var(--border) / <alpha-value>)',
        primary:              'rgb(var(--primary) / <alpha-value>)',
        'primary-foreground': 'rgb(var(--primary-foreground) / <alpha-value>)',
        accent:               'rgb(var(--accent) / <alpha-value>)',
        'accent-dark':        'rgb(var(--accent-dark) / <alpha-value>)',
        // Header strip tokens
        'top-bar':            'rgb(var(--top-bar-bg) / <alpha-value>)',
        'top-bar-fg':         'rgb(var(--top-bar-fg) / <alpha-value>)',
        'top-bar-fg-muted':   'rgb(var(--top-bar-fg-muted) / <alpha-value>)',
        'nav-resting':        'rgb(var(--nav-resting) / <alpha-value>)',
        'nav-scrolled':       'rgb(var(--nav-scrolled) / <alpha-value>)',
        // SafeRide brand palette (kept for inline-style constants in Navbar/etc.)
        sr: {
          blue:      '#0ea5e9',
          blueDark:  '#0369a1',
          blueDeep:  '#0284c7',
          yellow:    '#fbbf24',
          amber:     '#f59e0b',
          amberDark: '#d97706',
          gold:      '#b45309',
          dark:      '#78350f',
          darkBg:    '#0f172a',
          darkCard:  '#1e293b',
          darkBorder:'#334155',
          light:     '#f9fafb',
          muted:     '#6b7280',
          mutedDark: '#94a3b8',
        },
        // Kept for backward compat
        brand: {
          primary: '#0ea5e9',
          secondary: '#fbbf24',
          accent: '#f59e0b',
          dark: '#0f172a',
          light: '#f8fafc',
        },
      },
      fontFamily: {
        sans:    ['WorkSans-Regular', 'sans-serif'],
        medium:  ['WorkSans-Medium'],
        semibold:['WorkSans-SemiBold'],
        bold:    ['WorkSans-Bold'],
        heading: ['WorkSans-Bold'],
      },
    },
  },
  plugins: [],
};
