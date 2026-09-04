import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Configuración para exportar OCUPAMOR a Android Studio.
 *
 * Pasos (ver ANDROID.md):
 *   1. bun run build:android
 *   2. bunx cap sync android
 *   3. bunx cap open android   (abre Android Studio)
 */
const config: CapacitorConfig = {
  appId: "com.ocupamor.escolar",
  appName: "OCUPAMOR",
  webDir: ".output/public",
  android: {
    allowMixedContent: true,
  },
  server: {
    androidScheme: "https",
  },
};

export default config;
