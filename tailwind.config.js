/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Dark base
        ink: {
          950: '#08090c',
          900: '#0d0f14',
          800: '#13161d',
          700: '#1a1e27',
          600: '#252b38',
          500: '#353d4f',
        },
        // Cyan/teal accent
        cyan: {
          50:  '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
        },
        // Warm accent
        amber: {
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
        },
        // Neutral
        slate: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      fontFamily: {
        display: ['Syne', 'system-ui', 'sans-serif'],
        sans:    ['DM Sans', 'system-ui', 'sans-serif'],
        mono:    ['DM Mono', 'monospace'],
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease-out forwards',
        'fade-in':    'fadeIn 0.4s ease-out forwards',
        'float':      'float 6s ease-in-out infinite',
        'scan':       'scan 3s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow':  'spin 20s linear infinite',
        'marquee':    'marquee 30s linear infinite',
      },
      keyframes: {
        fadeUp:  { '0%': { opacity: '0', transform: 'translateY(24px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        float:   { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        scan:    { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(400%)' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
    },
  },
  plugins: [],
}
