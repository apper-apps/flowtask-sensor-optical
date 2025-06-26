/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#6366F1',
        secondary: '#8B5CF6',
        accent: '#EC4899',
        surface: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827'
        },
        priority: {
          high: {
            from: '#EF4444',
            to: '#F97316',
            bg: '#FEF2F2',
            text: '#DC2626'
          },
          medium: {
            from: '#3B82F6',
            to: '#8B5CF6',
            bg: '#EFF6FF',
            text: '#2563EB'
          },
          low: {
            from: '#10B981',
            to: '#06B6D4',
            bg: '#F0FDF4',
            text: '#059669'
          }
        }
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      animation: {
        'confetti': 'confetti 0.6s ease-out',
        'progress-ring': 'progress-ring 1s ease-out'
      },
      keyframes: {
        confetti: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(360deg)', opacity: '0' }
        },
        'progress-ring': {
          '0%': { 'stroke-dashoffset': '251' },
          '100%': { 'stroke-dashoffset': 'var(--progress-offset)' }
        }
      }
    }
  },
  plugins: []
}