// import { defineConfig } from "vite";
// // https://vitejs.dev/config/
// export default defineConfig({
//   css: {
//     postcss: "postcss.config.js",
//   },
//   build: {
//     emptyOutDir: false,
//     rollupOptions: {
//       input: {
//         content: "./contentScript/contentScript.tsx",
//       },
//       output: {
//         entryFileNames: "assets/[name].js",
//         assetFileNames: "assets/[name]-[hash].[ext]",
//       },
//     },
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // Ensure the CSS is placed in dist
    emptyOutDir: false,
    rollupOptions: {
      input: {
        content: "./contentScript/contentScript.tsx",
      },
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
  css: {
    postcss: "./postcss.config.js",
  },
});
