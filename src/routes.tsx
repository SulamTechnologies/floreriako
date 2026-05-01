/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AppLayout } from "@/shared/ui/AppLayout";
import { ProtectedRoute } from "@/shared/ui/ProtectedRoute";
import { PageLoader } from "@/shared/ui/PageLoader";
import HomePage from "@/pages/HomePage";

const ProductsPage = lazy(() => import("@/pages/ProductsPage"));
const ProductDetailPage = lazy(() => import("@/pages/ProductDetailPage"));
const CartPage = lazy(() => import("@/pages/CartPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));

function wrap(Component: React.ComponentType) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  // Pages with Navbar
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/productos", element: wrap(ProductsPage) },
      { path: "/productos/:slug", element: wrap(ProductDetailPage) },
      { path: "/carrito", element: wrap(CartPage) },
      {
        path: "/cuenta",
        element: (
          <ProtectedRoute>
            <div className="p-10 text-center text-gray-400">Cuenta — próximamente</div>
          </ProtectedRoute>
        ),
      },
    ],
  },
  // Auth pages — standalone (no Navbar)
  { path: "/login", element: wrap(LoginPage) },
  { path: "/registro", element: wrap(RegisterPage) },
  // Catch-all
  { path: "*", element: <Navigate to="/" replace /> },
]);
