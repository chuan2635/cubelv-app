import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#1C1C1E',
        surface: '#2C2C2E',
        divider: '#3A3A3C',
        'text-primary': '#FFFFFF',
        'text-secondary': '#8E8E93',
        brand: '#7B61FF',
        success: '#30D158',
        cancelled: '#636366',
        link: '#0A84FF',
      },
      borderRadius: {
        card: '12px',
        badge: '6px',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          'system-ui',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [typography],
}
