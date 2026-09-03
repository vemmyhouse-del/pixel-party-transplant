import { QueryClient } from "@tanstack/react-query";
import { createRouter, createHashHistory } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// En Capacitor la app se sirve desde el sistema de archivos del dispositivo,
// donde las rutas tipo /menu no existen como documentos. El hash history
// (/#/menu) evita pantallas en blanco dentro del WebView.
const isCapacitor = import.meta.env.VITE_CAPACITOR === "true";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    ...(isCapacitor && typeof window !== "undefined"
      ? { history: createHashHistory() }
      : {}),
  });

  return router;
};
