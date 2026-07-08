import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper:  '#F4EEE4',
        paper2: '#EBE2D3',
        paper3: '#E2D7C4',
        card:   '#FFFFFF',
        ink:    '#211D18',
        ink2:   '#6B6153',
        ink3:   '#9A9082',
        clay:   '#C75B2A',
        'clay-deep':   '#A8451B',
        'clay-soft':   '#F4E2D6',
        verified:      '#1A7A4A',
        'verified-soft': '#E2EFE6',
        line: 'rgba(33,29,24,0.12)',
      },
      fontFamily: {
        sans: ['var(--font-hanken)', '"Hanken Grotesk"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card:  '18px',
        input: '11px',
        pill:  '999px',
      },
    },
  },
  plugins: [],
};

export default config;
