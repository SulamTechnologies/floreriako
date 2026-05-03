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
const AccountPage = lazy(() => import("@/pages/AccountPage"));
const CheckoutPage = lazy(() => import("@/pages/CheckoutPage"));
const CheckoutExitoPage = lazy(() => import("@/pages/CheckoutExitoPage"));
const OrderSuccessPage = lazy(() => import("@/pages/OrderSuccessPage"));
const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const AdminProductsPage = lazy(() => import("@/pages/admin/AdminProductsPage"));
const AdminOrdersPage = lazy(() => import("@/pages/admin/AdminOrdersPage"));

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
        path: "/checkout",
        element: <ProtectedRoute>{wrap(CheckoutPage)}</ProtectedRoute>,
      },
      {
        path: "/checkout/exito",
        element: <ProtectedRoute>{wrap(CheckoutExitoPage)}</ProtectedRoute>,
      },
      {
        path: "/pedido/:id",
        element: <ProtectedRoute>{wrap(OrderSuccessPage)}</ProtectedRoute>,
      },
      {
        path: "/cuenta",
        element: <ProtectedRoute>{wrap(AccountPage)}</ProtectedRoute>,
      },
    ],
  },
  // Admin — own layout, no Navbar
  {
    element: wrap(AdminLayout),
    children: [
      { path: "/admin", element: <Navigate to="/admin/productos" replace /> },
      { path: "/admin/productos", element: wrap(AdminProductsPage) },
      { path: "/admin/pedidos", element: wrap(AdminOrdersPage) },
    ],
  },
  // Auth pages — standalone (no Navbar)
  { path: "/login", element: wrap(LoginPage) },
  { path: "/registro", element: wrap(RegisterPage) },
  // Catch-all
  { path: "*", element: <Navigate to="/" replace /> },
]);
