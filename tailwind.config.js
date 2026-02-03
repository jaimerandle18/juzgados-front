/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",        // Next App Router
    "./pages/**/*.{js,ts,jsx,tsx}",      // Next Pages Router
    "./components/**/*.{js,ts,jsx,tsx}", // si tenés carpeta components
    "./src/**/*.{js,ts,jsx,tsx}",        // lo que ya tenías
  ],
  theme: {
    extend: {
      colors: {
        fondo: "#121212",
        rojo: "#B71C1C",
        grisOscuro: "#1E1E1E",
        grisClaro: "#B0B0B0",
        azulMarino: "#1f5691",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 12px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};
