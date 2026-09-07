import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";

import { getRouter } from "./router";
import "./styles.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("No se encontró el elemento raíz de OCUPAMOR.");
}

// Marca el documento antes del primer render. Android WebView puede bloquear
// el cursor, el teclado y la composición de texto cuando un input vive dentro
// de una capa animada con transform. La hoja de estilos usa esta marca para
// evitar esas capas solo en la aplicación nativa, sin cambiar la versión web.
document.documentElement.dataset.capacitor = "android";

const router = getRouter();

// Sin StrictMode: en la WebView de Android el doble render de desarrollo
// duplica efectos y encarece cada interacción con el teclado.
createRoot(rootElement).render(<RouterProvider router={router} />);