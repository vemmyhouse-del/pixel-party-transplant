# Exportar OCUPAMOR a Android Studio

El proyecto original en Python/Kivy fue reescrito en **React + TypeScript**
(web), un lenguaje que sí se puede empaquetar como aplicación Android nativa
usando **Capacitor**. Se conservaron funcionalidades, colores, imágenes,
animaciones, voces y almacenamiento local.

## 1. Requisitos

- Node/Bun instalado
- Android Studio (con Android SDK y JDK 17)

## 2. Instalar Capacitor (una sola vez)

```bash
bun add @capacitor/core
bun add -d @capacitor/cli
bun add @capacitor/android
```

## 3. Generar el proyecto Android

IMPORTANTE: usa `build:android`, **no** `bun run build` (ese es el build web
con servidor y no deja el `index.html` en `.output/public`).

```bash
bun run build:android    # genera la SPA estática en .output/public (multiplataforma)
bunx cap sync android    # copia el sitio compilado al proyecto nativo
bunx cap open android    # abre Android Studio
```

Atajos:

```bash
bun run android:sync   # build + cap sync android
bun run android:open   # abre Android Studio
```

`build:android` ejecuta `scripts/build-android.mjs`: compila con
`vite.config.android.ts` en modo **SPA estática** (sin servidor Node/Nitro),
copia `dist/android-client` a `.output/public` con Node (funciona en Windows, macOS y
Linux) y verifica que exista `.output/public/index.html`, que es justo el
archivo que exige Capacitor. También activa el enrutado por hash (`/#/menu`)
para que las rutas no queden en blanco dentro del WebView.

La carpeta `android/` ya está incluida. Su manifiesto declara permiso de
Internet y admite conexiones HTTP/HTTPS mediante la configuración de seguridad
de red incluida.


Desde Android Studio puedes ejecutarlo en un emulador o dispositivo, y
generar el APK/AAB con **Build > Generate Signed Bundle / APK**.

Cada vez que cambies el código:

```bash
bun run build:android && bunx cap sync android
```

## 4. Notas sobre la voz (TTS)

La voz usa la API de síntesis del sistema en español (`es-ES` / `es-419`),
equivalente a `pyttsx3`/`gTTS` del proyecto original. En Android la voz la
provee el motor de Google Text-to-Speech; conviene tener instalado el paquete
de idioma español en el dispositivo.

## 5. Datos y progreso

El progreso, usuarios, misiones y ajustes se guardan en el almacenamiento
local del dispositivo (equivalente a los archivos JSON de `data_store.py`),
por lo que la aplicación funciona **sin internet**.
