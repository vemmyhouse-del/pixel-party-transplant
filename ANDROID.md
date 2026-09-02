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

```bash
bun run build            # genera dist/client
bunx cap add android     # crea la carpeta android/
bunx cap sync android    # copia el sitio compilado al proyecto nativo
bunx cap open android    # abre Android Studio
```

Desde Android Studio puedes ejecutarlo en un emulador o dispositivo, y
generar el APK/AAB con **Build > Generate Signed Bundle / APK**.

Cada vez que cambies el código:

```bash
bun run build && bunx cap sync android
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
