import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The site is served by GitHub Pages from the repository root of `main`, so the
// production build is written back into the repo root and committed.
export default defineConfig({
  root: "app",
  base: "/elev8/",
  plugins: [react()],
  build: {
    outDir: "..",
    assetsDir: "static",
    emptyOutDir: false,
    sourcemap: false,
  },
});
