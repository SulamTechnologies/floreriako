import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Package } from "lucide-react";
import { Link } from "react-router-dom";

export default function CheckoutExitoPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 220, damping: 14 }}
          className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-12 h-12 text-green-500" strokeWidth={1.5} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-2xl font-bold text-gray-900 mb-3"
        >
          ¡Pago recibido!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          className="text-gray-500 text-sm leading-relaxed mb-2"
        >
          Tu pedido está siendo procesado. En breve recibirás una confirmación y nos pondremos en
          contacto para coordinar la entrega.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 border border-gray-100 rounded-full px-3 py-1.5 mb-8 mt-2"
        >
          <Package className="w-3.5 h-3.5" />
          Puedes ver el estado en Mis pedidos
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link
            to="/cuenta"
            className="flex-1 text-center bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-2xl transition-colors"
          >
            Ver mis pedidos
          </Link>
          <Link
            to="/productos"
            className="flex-1 inline-flex items-center justify-center gap-1.5 border border-gray-200 hover:border-brand-300 text-gray-700 hover:text-brand-700 font-medium py-3 rounded-2xl transition-colors"
          >
            Seguir comprando <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
