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
        solarized: {
          base3: '#fdf6e3',
          base2: '#eee8d5',
          base1: '#93a1a1',
          base0: '#839496',
          base00: '#657b83',
          base01: '#586e75',
          base02: '#073642',
          base03: '#002b36',
          yellow: '#b58900',
          orange: '#cb4b16',
          red: '#dc322f',
          magenta: '#d33682',
          violet: '#6c71c4',
          blue: '#268bd2',
          cyan: '#2aa198',
          green: '#859900',
        },
        claude: {
          bg: '#fdfaee',
          card: '#ffffff',
          border: '#e6e2d3',
          text: '#2d2d2d',
          accent: '#da7756',
          hover: '#f2eee0',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Merriweather"', '"Georgia"', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'float': '0 10px 30px -5px rgba(0, 0, 0, 0.08)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
      }
    },
  },
  plugins: [],
}
