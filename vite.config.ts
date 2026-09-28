import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Catálogo público das funcionalidades do Ciclo 1. Estático: o conteúdo vem de
// src/data/funcionalidades.json, importado no build. Nada é buscado em runtime.
export default defineConfig({
  plugins: [react()],
  server: { port: 5178, host: "0.0.0.0" }
});
