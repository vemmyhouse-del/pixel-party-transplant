// Build móvil exclusivamente cliente. No carga TanStack Start ni Nitro, por
// lo que Vite nunca intenta tratar android.html como una entrada SSR.
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "./",
  plugins: [tsconfigPaths(), tailwindcss(), react()],
  build: {
    outDir: "dist/android-client",
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(process.cwd(), "android.html"),
    },
  },
});
