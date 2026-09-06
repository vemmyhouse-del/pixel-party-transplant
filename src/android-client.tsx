import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";

import { getRouter } from "./router";
import "./styles.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("No se encontró el elemento raíz de OCUPAMOR.");
}

const router = getRouter();

// Sin StrictMode: en la WebView de Android el doble render de desarrollo
// duplica efectos y encarece cada interacción con el teclado.
createRoot(rootElement).render(<RouterProvider router={router} />);