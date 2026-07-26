import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // Temporary premium palette — deep navy + warm sand (red removed)
          // Will be replaced once design-research workflow returns final style guide.
          red: '#1B3A5C',        // alias kept; now deep navy (premium construction industry standard)
          'red-dark': '#0F2742', // darker navy for hover states
          accent: '#1B3A5C',
          'accent-dark': '#0F2742',
          ink: '#111418',        // near-black, more refined than pure black
          mute: '#5B6168',
          sand: '#F4F1EB',       // editorial warm off-white
          line: '#E6E2DA',
        },
        // === Дизайн-система «Инженерный чертёж» (главная, 2026-07-26) ===
        // Тёмные плоскости = «синька» (чертёжная бумага), светлые = «миллиметровка».
        // Красного нет ни в одном оттенке — акцент янтарный (выноски на чертеже).
        bp: {
          950: '#071119', // самый глубокий — hero
          900: '#0A1A26', // тёмные секции
          800: '#0E2433',
          700: '#143045',
          line: '#1E3D52', // волосяные линии на тёмном
          text: '#9FB3C2', // приглушённый текст на тёмном
        },
        signal: {
          DEFAULT: '#E8A33D', // янтарь — выноски, размеры, акцент действия
          dark: '#C9862A',
          soft: '#F5D9A8',
        },
        paper: '#F6F4EF',   // светлый фон-миллиметровка
        hair: '#DFDBD2',    // волосяная линия на светлом
        graphite: '#141A1F',
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      maxWidth: {
        content: '1200px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-up': 'fadeUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
