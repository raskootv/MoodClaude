import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdf8e8',
          100: '#f9edc5',
          200: '#f3db8a',
          300: '#edc94f',
          400: '#d4a853',
          500: '#c49b3c',
          600: '#a67c2e',
          700: '#7f5e23',
          800: '#5c4319',
          900: '#3a2a10',
        },
        dark: {
          50: '#f5f5f5',
          100: '#e0e0e0',
          200: '#b0b0b0',
          300: '#808080',
          400: '#505050',
          500: '#2a2a2a',
          600: '#1f1f1f',
          700: '#1a1a1a',
          800: '#141414',
          900: '#0a0a0a',
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
