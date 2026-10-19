/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dae6ff',
          400: '#7ea6ff',
          500: '#4f7cff',
          600: '#3560e8',
          700: '#2a4bb4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp .6s ease-out both',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'none' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
