import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flower2 } from "lucide-react";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { Seo } from "@/shared/seo";

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <Seo
        title="Crear cuenta"
        description="Crea tu cuenta para guardar direcciones y seguir tus pedidos."
        path="/registro"
        noIndex
      />
      {/* Left panel, decorative */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-brand-600 to-brand-800 p-12 text-white relative overflow-hidden">
        {/* Abstract decorative circles */}
        <div className="absolute -top-20 -left-20 w-56 h-56 rounded-full bg-white/5" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute top-1/2 left-8 w-16 h-16 rounded-full bg-white/5" />
        <div className="relative text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
            <Flower2 className="w-9 h-9" strokeWidth={1} />
          </div>
          <h2 className="text-3xl font-bold mb-3">Únete a Florería KO</h2>
          <p className="text-brand-200 max-w-xs">
            Crea tu cuenta y empieza a recibir las flores más frescas de México.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-brand-100 text-left max-w-xs">
            {["Entrega el mismo día", "Frescura garantizada", "Seguimiento en tiempo real"].map(
              (f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-300 shrink-0" />
                  {f}
                </li>
              ),
            )}
          </ul>
        </div>
      </div>

      {/* Right panel, form */}
      <div className="flex items-center justify-center px-4 py-12 bg-stone-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {/* Mobile brand */}
          <Link to="/" className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <Flower2 className="w-6 h-6 text-brand-600" strokeWidth={1.5} />
            <span className="text-lg font-bold text-gray-900">
              Florería <span className="text-brand-600">KO</span>
            </span>
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Crear cuenta</h1>
          <p className="text-sm text-gray-500 mb-8">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-brand-600 font-medium hover:text-brand-700">
              Inicia sesión
            </Link>
          </p>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <RegisterForm />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
