/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0B1220',
        surface: '#131C2E',
        'surface-hover': '#1A263E',
        border: '#263043',
        'border-glow': '#3B4B6A',
        primary: '#4F8CFF',
        'primary-hover': '#3B79F0',
        success: '#20C7B5',
        warning: '#F5B942',
        danger: '#E85D75',
        'text-primary': '#F5F7FA',
        'text-secondary': '#A7B0C0',
        'text-muted': '#6C788E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'card': '16px',
        '2xl': '16px',
      },
      boxShadow: {
        'card': '0 8px 24px -4px rgba(0, 0, 0, 0.35)',
        'glow-primary': '0 0 20px -2px rgba(79, 140, 255, 0.25)',
        'glow-success': '0 0 20px -2px rgba(32, 199, 181, 0.25)',
        'glow-warning': '0 0 20px -2px rgba(245, 185, 66, 0.25)',
      }
    },
  },
  plugins: [],
}
