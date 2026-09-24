import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// `vite build --mode preview` emits one self-contained index.html for sharing.
export default defineConfig(({ mode }) => ({
  plugins: mode === "preview" ? [react(), viteSingleFile()] : [react()],
  build: mode === "preview" ? { outDir: "dist-preview", assetsInlineLimit: Infinity } : {},
}));
