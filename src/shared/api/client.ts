import { supabase } from "@/shared/lib/supabase";
import type { ApiErrorResponse } from "@/types/api";

const API_URL = import.meta.env["VITE_API_URL"] as string;

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
    body?.error.message ?? "Error desconocido",
    res.status,
    body?.error.details,
  );
}

async function request<T>(method: string, path: string, body?: unknown, retry = true): Promise<T> {
  const authHeader = await getAuthHeader();

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && retry) {
    return refreshAndRetry(() => request<T>(method, path, body, false));
  }

  return handleResponse<T>(res);
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body: unknown) => request<T>("PUT", path, body),
  patch: <T>(path: string, body: unknown) => request<T>("PATCH", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
};
