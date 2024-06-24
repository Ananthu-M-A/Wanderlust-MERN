/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: theme => ({
        'img': "url('/hero-cover1.jpg')",
      }),
      colors:{
        headerColor: '#2067da'
      }
    },
  },
  plugins: [],
}

