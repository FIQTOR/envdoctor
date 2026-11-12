/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        bg: 'var(--bg)', panel: 'var(--panel)', line: 'var(--line)', fg: 'var(--fg)',
        mute: 'var(--mute)', ac: 'var(--ac)', pale: 'var(--pale)', btn: 'var(--btn)',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,.03)',
        soft: '0 4px 20px -2px rgba(17,75,50,.08)',
      },
    },
  },
  plugins: [],
}
