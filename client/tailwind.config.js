/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/stories/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['var(--font-poppins)', 'system-ui', 'sans-serif'],
        'heading': ['var(--font-jost)', 'system-ui', 'sans-serif'],
        'normal': ['var(--font-poppins)'],
        'jost': ['var(--font-jost)'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        minsk: {
          '50': '#eff0fe',
          '100': '#e2e2fd',
          '200': '#cdcbfa',
          '300': '#afabf6',
          '400': '#9789f0',
          '500': '#876de7',
          '600': '#7851da',
          '700': '#6842c0',
          '800': '#55389b',
          '900': '#46337a',
          '950': '#2b1e48',
        },
      },
    },
  },
  plugins: [],
}