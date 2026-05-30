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
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
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
