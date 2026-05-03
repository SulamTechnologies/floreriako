import { useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { loginSchema, type LoginInput } from "../schemas";
import { GoogleButton } from "./GoogleButton";

const SITEKEY = import.meta.env["VITE_HCAPTCHA_SITEKEY"] as string;

export function LoginForm() {
  const signIn = useAuthStore((s) => s.signIn);
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaKey, setCaptchaKey] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setServerError(null);
    if (!captchaToken) {
      setServerError("Completa el captcha");
      return;
    }
    try {
      await signIn(data.email, data.password, captchaToken);
      navigate("/");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al iniciar sesión";
      setServerError(
        msg.includes("Invalid login credentials") ? "Email o contraseña incorrectos" : msg,
      );
      setCaptchaKey((k) => k + 1);
      setCaptchaToken(null);
    }
  }

  return (
    <div className="space-y-5">
      <GoogleButton label="Continuar con Google" />

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400 font-medium">o con email</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Correo electrónico
          </label>
          <input
            type="email"
            autoComplete="email"
            {...register("email")}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            placeholder="tu@email.com"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
          <input
            type="password"
            autoComplete="current-password"
            {...register("password")}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        <HCaptcha
          key={captchaKey}
          sitekey={SITEKEY}
          onVerify={(token) => setCaptchaToken(token)}
          onExpire={() => setCaptchaToken(null)}
        />

        <button
          type="submit"
          disabled={isSubmitting || !captchaToken}
          className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60 transition-colors"
        >
          {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
}
