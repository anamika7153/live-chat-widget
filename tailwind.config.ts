import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        chat: {
          primary: '#3B82F6',
          'primary-hover': '#2563EB',
          secondary: '#F3F4F6',
          'secondary-text': '#1F2937',
        },
      },
      animation: {
        'typing-dot': 'typingDot 1.4s infinite ease-in-out',
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        typingDot: {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.6' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
