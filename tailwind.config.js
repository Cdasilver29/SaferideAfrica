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
        // SafeRide brand palette
        sr: {
          blue:      '#0ea5e9',   // sky-500 primary
          blueDark:  '#0369a1',   // sky-700
          blueDeep:  '#0284c7',   // sky-600
          yellow:    '#fbbf24',   // amber-400
          amber:     '#f59e0b',   // amber-500
          amberDark: '#d97706',   // amber-600
          gold:      '#b45309',   // amber-700
          dark:      '#78350f',   // amber-900 — course band
          darkBg:    '#0f172a',   // navy-950 — dark sections
          darkCard:  '#1e293b',   // navy-800
          darkBorder:'#334155',   // navy-700
          light:     '#f9fafb',   // very light bg
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
        sans:    ['WorkSans_400Regular', 'sans-serif'],
        medium:  ['WorkSans_500Medium'],
        semibold:['WorkSans_600SemiBold'],
        bold:    ['WorkSans_700Bold'],
        heading: ['WorkSans_700Bold'],
      },
    },
  },
  plugins: [],
};
