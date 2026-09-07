import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flower2 } from "lucide-react";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { Seo } from "@/shared/seo";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <Seo
        title="Iniciar sesión"
        description="Accede a tu cuenta para ver tus pedidos y repetir una compra."
        path="/login"
        noIndex
      />
      {/* Left panel, decorative */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-brand-700 to-brand-900 p-12 text-white relative overflow-hidden">
        {/* Abstract decorative circles */}
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute top-1/3 right-8 w-20 h-20 rounded-full bg-white/5" />
        <div className="relative text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
            <Flower2 className="w-9 h-9" strokeWidth={1} />
          </div>
          <h2 className="text-3xl font-bold mb-3">Bienvenido de vuelta</h2>
          <p className="text-brand-200 max-w-xs">
            Las flores más frescas de México, entregadas en tu puerta.
          </p>
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

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Iniciar sesión</h1>
          <p className="text-sm text-gray-500 mb-8">
            ¿No tienes cuenta?{" "}
            <Link to="/registro" className="text-brand-600 font-medium hover:text-brand-700">
              Regístrate gratis
            </Link>
          </p>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <LoginForm />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
