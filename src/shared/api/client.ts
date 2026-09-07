import { supabase } from "@/shared/lib/supabase";
import type { ApiErrorResponse } from "@/types/api";

const SAFE_ERROR_MESSAGES: Record<number, string> = {
  400: "Solicitud inválida.",
  401: "No autorizado.",
  403: "Sin permiso para realizar esta acción.",
  404: "Recurso no encontrado.",
  422: "Los datos enviados son inválidos.",
  429: "Demasiadas solicitudes. Intenta más tarde.",
  500: "Error interno del servidor.",
};

function sanitizeErrorMessage(message: string | undefined, status: number): string {
  if (status >= 400 && status < 500 && status !== 401 && status !== 403) {
    return message ?? SAFE_ERROR_MESSAGES[status] ?? "Error desconocido.";
  }
  return SAFE_ERROR_MESSAGES[status] ?? "Ocurrió un error. Intenta de nuevo.";
}

/**
 * Base de la API.
 *
 * En desarrollo se deja vacía a propósito: las peticiones salen al mismo origen
 * del dev server y `vite.config.ts` las reenvía a la API real. Así no hay CORS
 * en local, sin importar el puerto que tome Vite, y no hace falta abrir la
 * lista de orígenes permitidos de la API de producción.
 *
 * En build se usa la URL absoluta de `VITE_API_URL`.
 */
const API_URL = import.meta.env.DEV ? "" : (import.meta.env["VITE_API_URL"] as string);

export class ApiClientError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details: unknown;

  constructor(code: string, message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function refreshAndRetry<T>(request: () => Promise<T>): Promise<T> {
  const { error } = await supabase.auth.refreshSession();
  if (error) throw new ApiClientError("UNAUTHORIZED", "Sesión expirada", 401);
  return request();
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.ok) {
    return res.json() as Promise<T>;
  }

  const body = (await res.json().catch(() => null)) as ApiErrorResponse | null;
  throw new ApiClientError(
    body?.error.code ?? "UNKNOWN",
    sanitizeErrorMessage(body?.error.message, res.status),
    res.status,
    body?.error.details,
  );
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  retry = true,
  signal?: AbortSignal,
): Promise<T> {
  const authHeader = await getAuthHeader();

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  if (res.status === 401 && retry) {
    return refreshAndRetry(() => request<T>(method, path, body, false, signal));
  }

  return handleResponse<T>(res);
}

export const api = {
  get: <T>(path: string, signal?: AbortSignal) => request<T>("GET", path, undefined, true, signal),
  post: <T>(path: string, body: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body: unknown) => request<T>("PUT", path, body),
  patch: <T>(path: string, body: unknown) => request<T>("PATCH", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
};
