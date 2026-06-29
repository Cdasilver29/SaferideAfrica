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
