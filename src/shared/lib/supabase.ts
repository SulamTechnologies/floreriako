import { createClient } from "@supabase/supabase-js";

const url = import.meta.env["VITE_SUPABASE_URL"] as string;
const anonKey = import.meta.env["VITE_SUPABASE_ANON_KEY"] as string;

if (!url || !anonKey) {
  throw new Error("Missing Supabase env vars: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
}

/**
 * Fuera del navegador (prerender del build) hay que desactivar la sesión
 * persistente y el auto-refresh: `autoRefreshToken` levanta un `setInterval`
 * que mantiene vivo el event loop y el proceso de build nunca termina.
 */
const isBrowser = typeof window !== "undefined";

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: isBrowser,
    autoRefreshToken: isBrowser,
    detectSessionInUrl: isBrowser,
  },
});
