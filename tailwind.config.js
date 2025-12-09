/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}',"./App.tsx", "./components/**/*.{js,jsx,ts,tsx}"],
  presets:[require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        primary:'#0564f5',
        textPrimary:'#ffffff',
      },
    },
  },
  plugins: [],
}

