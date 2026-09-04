// Build estático para Capacitor (Android) — multiplataforma (Windows/macOS/Linux).
//
//   bun run build:android
//
// 1. Compila solo el cliente con Vite            -> dist/android-client
// 2. Copia la salida y renombra android.html     -> .output/public/index.html
// 3. Verifica que exista .output/public/index.html (lo que exige Capacitor)
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const clientDir = resolve(root, "dist/android-client");
const outDir = resolve(root, ".output/public");

const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const build = spawnSync(npx, ["vite", "build", "--config", "vite.config.android.ts"], {
  stdio: "inherit",
  env: { ...process.env, VITE_CAPACITOR: "true" },
  shell: process.platform === "win32",
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

if (!existsSync(clientDir)) {
  console.error(`[android] No se encontró la carpeta compilada: ${clientDir}`);
  process.exit(1);
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(resolve(root, ".output"), { recursive: true });
cpSync(clientDir, outDir, { recursive: true });

const indexHtml = resolve(outDir, "index.html");
const androidHtml = resolve(outDir, "android.html");

if (existsSync(androidHtml)) {
  renameSync(androidHtml, indexHtml);
}

if (!existsSync(indexHtml)) {
  console.error("[android] Falta index.html en .output/public — Capacitor fallará.");
  process.exit(1);
}

console.log("[android] Listo: .output/public/index.html generado.");
console.log("[android] Ahora ejecuta: bunx cap sync android");
