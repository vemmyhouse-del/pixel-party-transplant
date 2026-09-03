// Configuración de build EXCLUSIVA para empaquetar con Capacitor (Android).
//
//   bun run build:android      -> genera .output/public (SPA estática)
//   bunx cap sync android
//
// Diferencias con vite.config.ts (build web/servidor):
//  - spa.enabled: TanStack Start prerenderiza un "shell" HTML estático y el
//    router de React toma el control en el cliente (sin servidor Node/Nitro).
//  - preset "static": Nitro solo emite archivos estáticos en .output/public.
//  - VITE_CAPACITOR: activa el hash history en src/router.tsx para que las
//    rutas funcionen dentro del WebView (file:// no soporta history API).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: {
    preset: "static",
    output: {
      dir: ".output",
      publicDir: ".output/public",
    },
  },
  tanstackStart: {
    server: { entry: "server" },
    spa: {
      enabled: true,
      prerender: { crawlLinks: false },
    },
    prerender: { enabled: true, autoStaticPathsDiscovery: false },
    pages: [{ path: "/" }],
  },
});
