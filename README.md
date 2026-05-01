# Floreria KO — Frontend

Aplicacion web de comercio electronico para Floreria KO, una floristeria ubicada en Mexico. Este repositorio contiene exclusivamente el cliente web: una Single Page Application construida con React 19 y TypeScript, que consume la API REST del repositorio `floreriakoAPI`.

---

## Descripcion general

La aplicacion permite a los usuarios navegar el catalogo de productos, agregar articulos al carrito, autenticarse con correo electronico o cuenta de Google, y proceder al pago mediante Stripe. El estado del carrito se sincroniza automaticamente con el servidor al iniciar sesion, fusionando los articulos agregados como invitado con el carrito persistido en la base de datos.

---

## Stack tecnologico

| Capa            | Tecnologia                                        |
| --------------- | ------------------------------------------------- |
| Framework UI    | React 19                                          |
| Lenguaje        | TypeScript 6 (strict)                             |
| Bundler         | Vite 8                                            |
| Estilos         | Tailwind CSS v4                                   |
| Enrutamiento    | React Router v7 (library mode)                    |
| Estado servidor | TanStack Query v5                                 |
| Estado cliente  | Zustand v5 (persistido en localStorage)           |
| Formularios     | React Hook Form + Zod                             |
| Animaciones     | Framer Motion                                     |
| Iconos          | Lucide React                                      |
| Notificaciones  | Sonner                                            |
| Autenticacion   | Supabase Auth (email/password + Google OAuth 2.0) |
| Despliegue      | Vercel                                            |

---

## Estructura del proyecto

```
src/
  features/
    auth/          # Formularios de login y registro, esquemas Zod, boton Google
    cart/          # Hooks de carrito, sincronizacion con servidor, drawer lateral
    products/      # Queries, tarjetas de producto, grid, skeletons
  pages/           # Paginas enrutadas: Home, Productos, Detalle, Carrito, Auth
  shared/
    api/           # Cliente fetch tipado con reintento automatico en 401
    lib/           # Supabase client, formateador de moneda MXN, utilidad cn()
    ui/            # Navbar, AppLayout, PageLoader, ProtectedRoute
  store/           # Zustand: auth, cart (persistido), ui (drawer)
  types/           # DTOs compartidos con el backend
```

---
