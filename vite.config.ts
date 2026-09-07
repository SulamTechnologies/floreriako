import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

const FALLBACK_API = "https://floreriakoapi.vercel.app";

export default defineConfig(({ mode }) => {
  // `process.env` no trae las variables de los archivos .env: hay que cargarlas
  const env = loadEnv(mode, __dirname, "VITE_");

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        /**
         * En desarrollo el front llama a `/api/...` sobre su propio origen y
         * Vite reenvía la petición a la API. Así no hay CORS en local sin
         * importar el puerto que tome Vite, y no hace falta abrir la lista de
         * orígenes permitidos de la API de producción.
         */
        "/api": {
          target: env["VITE_API_URL"] ?? FALLBACK_API,
          changeOrigin: true,
          secure: true,
        },
      },
    },
    build: {
      sourcemap: false,
      rolldownOptions: {
        output: {
          // Separar las dependencias grandes de nuestro código: cambiar la app
          // no invalida la caché de React ni de Supabase en el navegador.
          codeSplitting: {
            groups: [
              { name: "react", test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
              { name: "router", test: /node_modules[\\/]react-router/ },
              { name: "motion", test: /node_modules[\\/]framer-motion|motion-dom|motion-utils/ },
              { name: "supabase", test: /node_modules[\\/]@supabase/ },
              { name: "query", test: /node_modules[\\/]@tanstack/ },
            ],
          },
        },
      },
    },
  };
});
