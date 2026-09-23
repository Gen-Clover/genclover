/** @type {import('tailwindcss').Config} */

/**
 * Every colour resolves to a CSS custom property defined in src/index.css, once
 * for dark and once for `[data-theme="light"]`. That means components keep using
 * the same token names (`bg-ink-950`, `text-silver-400`) and the theme swap
 * happens entirely in CSS — no component needs a light-mode branch.
 *
 * Read the scales semantically, not literally:
 *   ink-950 → page background      ink-800/700/600 → dividers and borders
 *   ink-900 → muted section        ink-500         → oversized display numerals
 *   ink-850 → card surface
 *   silver-100 → headings ……… silver-600 → smallest meta text
 *
 * `dark:` is still available (see darkMode below) for the few places that need a
 * genuinely different hue per theme rather than an inverted neutral — the status
 * badges, for example.
 */
const themed = (name) => `rgb(var(--${name}) / <alpha-value>)`

const scale = (prefix, steps) =>
  Object.fromEntries(steps.map((step) => [step, themed(`${prefix}-${step}`)]))

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        ink: scale('ink', [950, 900, 850, 800, 750, 700, 600, 500]),
        silver: scale('silver', [100, 200, 300, 400, 500, 600]),
        accent: scale('accent', [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]),
        // Fixed brand red — the wordmark and clover must look identical in both
        // themes, so these deliberately do NOT follow the theme.
        brand: {
          red: '#E01F26',
          'red-light': '#FF5F64',
          'red-dark': '#8E0F14',
        },
      },
      fontFamily: {
        display: ['"Chakra Petch"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        brand: '0.18em',
        eyebrow: '0.22em',
      },
      maxWidth: {
        prose: '68ch',
      },
      boxShadow: {
        glow: '0 0 40px -8px rgb(var(--glow-accent) / 0.45)',
        'glow-sm': '0 0 20px -6px rgb(var(--glow-accent) / 0.4)',
        'glow-ring': '0 0 140px -20px rgb(var(--glow-accent) / var(--glow-ring-strength))',
        lift: '0 24px 60px -24px rgb(var(--shadow-color) / var(--shadow-strength))',
      },
      backgroundImage: {
        'accent-line':
          'linear-gradient(90deg, transparent, rgb(var(--accent-500) / 0.6), transparent)',
        'diagonal-sheen':
          'linear-gradient(115deg, transparent 0%, transparent 42%, rgb(var(--accent-500) / 0.10) 50%, transparent 58%, transparent 100%)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'ring-pulse': {
          '0%, 100%': { opacity: '0.45' },
          '50%': { opacity: '0.8' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'node-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.55' },
          '50%': { transform: 'scale(1.9)', opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'ring-pulse': 'ring-pulse 6s ease-in-out infinite',
        marquee: 'marquee 40s linear infinite',
        'node-pulse': 'node-pulse 2.4s cubic-bezier(0.16, 1, 0.3, 1) infinite',
      },
    },
  },
  plugins: [],
}
