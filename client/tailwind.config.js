/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jac: {
          green: {
            light: '#E1F5EE',
            DEFAULT: '#1D9E75',
            dark: '#085041',
          },
          purple: {
            light: '#EEEDFE',
            DEFAULT: '#7F77DD',
            dark: '#3C3489',
          },
          orange: {
            light: '#FAEEDA',
            DEFAULT: '#BA7517',
            dark: '#633806',
          },
          red: {
            light: '#FAECE7',
            DEFAULT: '#D85A30',
            dark: '#712B13',
          }
        }
      }
    },
  },
  plugins: [],
}
