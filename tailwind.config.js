/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "hsl(220, 90%, 50%)",
        accent: "hsl(170, 70%, 45%)",
        background: "hsl(220, 15%, 95%)",
        surface: "hsl(0, 0%, 100%)",
        'dark-bg': "hsl(220, 15%, 8%)",
        'dark-surface': "hsl(220, 15%, 12%)",
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
      },
      spacing: {
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
      },
      boxShadow: {
        'card': '0 2px 10px hsla(0, 0%, 0%, 0.1)',
        'modal': '0 8px 24px hsla(0, 0%, 0%, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 350ms cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}