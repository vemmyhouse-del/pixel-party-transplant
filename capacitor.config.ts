import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Configuración para exportar OCUPAMOR a Android Studio.
 *
 * Pasos (ver ANDROID.md):
 *   1. bun run build
 *   2. bunx cap add android
 *   3. bunx cap sync android
 *   4. bunx cap open android   (abre Android Studio)
 */
const config: CapacitorConfig = {
  appId: "com.ocupamor.escolar",
  appName: "OCUPAMOR",
  webDir: "dist/client",
  android: {
    allowMixedContent: false,
  },
  server: {
    androidScheme: "https",
  },
};

export default config;
