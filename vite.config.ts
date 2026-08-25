import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  root: "app",
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "../dist",
    // Vite's own output goes to static/ so it cannot collide with the PDFs that
    // app/public/assets copies into dist/assets.
    assetsDir: "static",
    emptyOutDir: true,
  },
});
