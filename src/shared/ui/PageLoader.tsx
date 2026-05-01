import { motion } from "framer-motion";
import { Flower2 } from "lucide-react";

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Flower2 className="w-8 h-8 text-brand-500" strokeWidth={1.5} />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-gray-400"
      >
        Cargando...
      </motion.p>
    </div>
  );
}
