/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#F7F5F0',
          dark: '#121212',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#F0EFEA',
          card: '#FAF9F6',
          muted: '#EAE7E0',
          dark: '#1A1A1A',
          'dark-subtle': '#222222',
          'dark-card': '#1E1E1E',
          'dark-muted': '#282828',
        },
        border: {
          DEFAULT: '#E5E2DC',
          strong: '#D0CCC3',
          dark: '#262626',
          'dark-strong': '#333333',
        },
        charcoal: {
          DEFAULT: '#171717',
          light: '#2B2B2B',
          muted: '#4A4843',
        },
        muted: {
          DEFAULT: '#737067',
          light: '#9C9990',
          dark: '#A09D95',
        },
        accent: {
          DEFAULT: '#FF5A36',
          hover: '#E54724',
          subtle: '#FFF1ED',
          'dark-subtle': '#331D17',
          lime: '#E8F086',
          sand: '#EAE5D9',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Newsreader', '"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'paper-sm': '0 1px 2px rgba(23, 23, 23, 0.04)',
        'paper': '0 2px 8px -1px rgba(23, 23, 23, 0.05), 0 0 0 1px rgba(23, 23, 23, 0.04)',
        'paper-card': '0 4px 20px -2px rgba(23, 23, 23, 0.06), 0 0 0 1px rgba(23, 23, 23, 0.05)',
        'paper-lift': '0 12px 32px -4px rgba(23, 23, 23, 0.08), 0 0 0 1px rgba(23, 23, 23, 0.05)',
        'dark-card': '0 4px 20px -2px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
