/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFB6C1', // 浅粉红
        secondary: '#87CEFA', // 浅天蓝
        accent: '#98FB98', // 浅绿
        yellow: '#FFFACD', // 浅黄色
        purple: '#E6E6FA', // 浅紫色
        background: '#F8F9FA',
        text: '#333333',
      },
      boxShadow: {
        'cute': '0 4px 15px rgba(0, 0, 0, 0.05)',
        'cute-hover': '0 6px 20px rgba(0, 0, 0, 0.1)',
        'button': '0 4px 10px rgba(255, 182, 193, 0.3)',
        'button-hover': '0 6px 15px rgba(255, 182, 193, 0.4)',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scale-in': 'scaleIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'success-pulse': 'successPulse 1s ease-out',
      },
      keyframes: {
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        successPulse: {
          '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(152, 251, 152, 0.7)' },
          '70%': { transform: 'scale(1.05)', boxShadow: '0 0 0 10px rgba(152, 251, 152, 0)' },
          '100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(152, 251, 152, 0)' },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
        'transform-opacity': 'transform, opacity',
      },
    },
  },
  plugins: [],
}