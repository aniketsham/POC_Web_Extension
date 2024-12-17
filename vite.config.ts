import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    postcss: "./postcss.config.js",
  },
  build: {
    target: "esnext",

    rollupOptions: {
      input: {
        popup: "./popup/index.html",
        options: "./options/index.html",
      },
      output: {
        entryFileNames: "assets/[name].js",
      },
    },
  },
});
