/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  // ─── Design language foundation (Phase 5) ──────────────────────────────────
  // Brand palette: primary sky #01a5f0, accent yellow #ffd800, foreground dark
  // #221f20. Colour lives only in tokens (the CSS variables in global.css); no
  // raw hex in components. Shape, Airbnb-style: rounded-button 8px, rounded-card
  // 16px (card-lg 20px), pill on search and chips. Spacing follows an 8px rhythm
  // (use even Tailwind steps: 2=8, 4=16, 6=24, 8=32, 12=48). Type is one family,
  // Manrope, with weight-only hierarchy (no second display font).
  theme: {
    extend: {
      colors: {
        // Semantic tokens — resolve via CSS variables defined in global.css
        background:              'rgb(var(--background) / <alpha-value>)',
        foreground:              'rgb(var(--foreground) / <alpha-value>)',
        card:                    'rgb(var(--card) / <alpha-value>)',
        'card-foreground':       'rgb(var(--card-foreground) / <alpha-value>)',
        muted:                   'rgb(var(--muted) / <alpha-value>)',
        'muted-foreground':      'rgb(var(--muted-foreground) / <alpha-value>)',
        border:                  'rgb(var(--border) / <alpha-value>)',
        ring:                    'rgb(var(--ring) / <alpha-value>)',
        primary:                 'rgb(var(--primary) / <alpha-value>)',
        'primary-foreground':    'rgb(var(--primary-foreground) / <alpha-value>)',
        secondary:               'rgb(var(--secondary) / <alpha-value>)',
        'secondary-foreground':  'rgb(var(--secondary-foreground) / <alpha-value>)',
        accent:                  'rgb(var(--accent) / <alpha-value>)',
        'accent-foreground':     'rgb(var(--accent-foreground) / <alpha-value>)',
        'accent-dark':           'rgb(var(--accent-dark) / <alpha-value>)',
        destructive:             'rgb(var(--destructive) / <alpha-value>)',
        'destructive-foreground':'rgb(var(--destructive-foreground) / <alpha-value>)',
        // UI System v2 palette, mirror of src/ui/tokens.ts (see docs/UI-SYSTEM.md)
        asphalt: { DEFAULT: '#14181F', 800: '#1E242E', 700: '#2A3140' },
        chalk:   { DEFAULT: '#F7F8F5', dim: '#ECEEE9' },
        amber:   { DEFAULT: '#FFB700', deep: '#DF9E00' },
        signal:  '#1FA85B',
        ink: {
          DEFAULT: '#14181F',
          muted: '#5A6272',
          'on-dark': '#F7F8F5',
          'on-dark-muted': '#9AA3B2',
        },
        danger: '#D64545',
        // HeaderV3 brand tokens, mirror of `brand` in src/ui/tokens.ts.
        'brand-primary':    '#01a5f0',
        'brand-deep':       '#016c9d',
        'brand-accent':     '#ffd800',
        'brand-action':     '#e11d2e',
        'brand-ink':        '#221f20',
        'brand-on-primary': '#ffffff',
      },
      fontFamily: {
        sans:    ['Manrope-Regular', 'sans-serif'],
        medium:  ['Manrope-Medium'],
        semibold:['Manrope-SemiBold'],
        bold:    ['Manrope-Bold'],
        heading: ['Manrope-Bold'],
        // UI System v2 typefaces, mirror of src/ui/tokens.ts (see docs/UI-SYSTEM.md)
        display:          ['Archivo_700Bold'],
        'display-medium': ['Archivo_600SemiBold'],
        body:             ['Inter_400Regular'],
        'body-medium':    ['Inter_500Medium'],
        'body-bold':      ['Inter_700Bold'],
      },
      // Type scale, [size, lineHeight]. Body 16/24 (1.5), headings tighter.
      fontSize: {
        xs:   ['12px', '16px'],
        sm:   ['14px', '20px'],
        base: ['16px', '24px'],
        lg:   ['18px', '28px'],
        xl:   ['20px', '28px'],
        '2xl':['24px', '32px'],
        '3xl':['30px', '36px'],
        '4xl':['36px', '40px'],
        '5xl':['48px', '52px'],
      },
      // Airbnb-style shape language. Named radii on top of Tailwind's defaults.
      borderRadius: {
        button:    '8px',
        card:      '16px',
        'card-lg': '20px',
        pill:      '9999px',
      },
    },
  },
  plugins: [],
};
