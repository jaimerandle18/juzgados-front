/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",        // Next App Router
    "./pages/**/*.{js,ts,jsx,tsx}",      // Next Pages Router
    "./components/**/*.{js,ts,jsx,tsx}", // si tenés carpeta components
    "./src/**/*.{js,ts,jsx,tsx}",        // lo que ya tenías
  ],
  future: {
    // Envuelve todos los `hover:*` de Tailwind en @media (hover: hover).
    // Efecto: los estilos de hover sólo se aplican en dispositivos con
    // puntero preciso (mouse/trackpad). En mobile (touch) no se aplican,
    // así no quedan pegados después de un tap.
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      animation: {
        marquee: "marquee 70s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
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
