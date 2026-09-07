import { createBrowserRouter } from "react-router-dom";
import { routeObjects } from "./route-tree";

/**
 * Router del cliente.
 *
 * `createBrowserRouter` toca `document` al crearse, así que el árbol de rutas
 * vive aparte en `route-tree.tsx`, el prerender del build lo importa sin
 * arrastrar la History API del navegador.
 */
export const router = createBrowserRouter(routeObjects);
