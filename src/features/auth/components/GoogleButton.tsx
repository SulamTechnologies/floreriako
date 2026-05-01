import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth";

export function GoogleButton({ label = "Continuar con Google" }: { label?: string }) {
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      // Browser redirects to Google — no further code runs here
    } catch {
      setError("No se pudo conectar con Google. Intenta de nuevo.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <motion.button
        type="button"
        onClick={handleClick}
        disabled={loading}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
      >
        {loading ? (
          <svg className="w-4 h-4 animate-spin text-gray-400" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : (
          /* Official Google "G" logo colors */
          <svg
            width="18"
            height="18"
            viewBox="0 0 48 48"
            aria-hidden="true"
            className="flex-shrink-0"
          >
            <path
              d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.332 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
              fill="#FFC107"
            />
            <path
              d="M6.306 14.691l6.571 4.819C14.655 15.108 19.001 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
              fill="#FF3D00"
            />
            <path
              d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.311 0-9.823-3.318-11.402-7.91l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
              fill="#4CAF50"
            />
            <path
              d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l6.19 5.238C42.021 35.292 44 30 44 24c0-1.341-.138-2.65-.389-3.917z"
              fill="#1976D2"
            />
          </svg>
        )}
        {loading ? "Redirigiendo..." : label}
      </motion.button>

      {error && <p className="text-xs text-red-600 text-center">{error}</p>}
    </div>
  );
}
