import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Truck,
  Shield,
  Clock,
  Leaf,
  Flower,
  Flower2,
  Sparkles,
  Sun,
} from "lucide-react";

const heroWords = ["Frescas", "Únicas", "Hermosas"];

const features = [
  { icon: Truck, title: "Entrega a domicilio", desc: "Llevamos tus flores directo a la puerta" },
  { icon: Clock, title: "Mismo día", desc: "Pedidos antes de las 2pm" },
  { icon: Shield, title: "Frescura garantizada", desc: "O te devolvemos tu dinero" },
  { icon: Leaf, title: "100% naturales", desc: "Sin flores artificiales" },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-brand-100/40 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-rose-100/30 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col items-start"
          >
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1.5 rounded-full mb-6">
                <Flower2 className="w-3.5 h-3.5" />
                Flores frescas · Ciudad de México
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.08] tracking-tight mb-6"
            >
              Flores
              <br />
              <span className="text-brand-600">que hablan</span>
              <br />
              por ti
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg text-gray-500 max-w-md mb-8 leading-relaxed"
            >
              Las flores más frescas de México, seleccionadas y entregadas en tu puerta el mismo
              día.
            </motion.p>

            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <Link
                to="/productos"
                className="group inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-2xl transition-all duration-200 hover:shadow-lg hover:shadow-brand-600/25 hover:-translate-y-0.5"
              >
                Ver colección
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/productos"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-700 font-medium px-4 py-3 rounded-2xl hover:bg-brand-50 transition-colors"
              >
                Ver categorías
              </Link>
            </motion.div>
          </motion.div>

          {/* Visual — decorative flower grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hidden lg:grid grid-cols-2 gap-4"
          >
            {[
              { Icon: Flower2, color: "text-brand-500", bg: "bg-brand-50" },
              { Icon: Flower, color: "text-rose-400", bg: "bg-rose-50" },
              { Icon: Sparkles, color: "text-amber-400", bg: "bg-amber-50" },
              { Icon: Sun, color: "text-orange-400", bg: "bg-orange-50" },
            ].map(({ Icon, color, bg }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                className={`flex items-center justify-center rounded-3xl bg-white shadow-sm border border-gray-100 aspect-square ${i % 2 === 1 ? "mt-6" : ""}`}
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                  className={`w-16 h-16 rounded-2xl ${bg} flex items-center justify-center`}
                >
                  <Icon className={`w-8 h-8 ${color}`} strokeWidth={1} />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={container}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map(({ icon: Icon, title, desc }) => (
              <motion.div key={title} variants={fadeUp} className="flex flex-col items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-brand-600" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-20 bg-gradient-to-br from-brand-600 to-brand-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto px-4 text-center"
        >
          <p className="text-brand-200 text-sm font-medium mb-3">¿Tienes una ocasión especial?</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Haz que cada momento sea memorable
          </h2>
          <p className="text-brand-200 mb-8">
            Bodas, cumpleaños, aniversarios — tenemos el arreglo perfecto para ti.
          </p>
          <Link
            to="/productos"
            className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-6 py-3 rounded-2xl hover:bg-brand-50 transition-colors"
          >
            Explorar todo <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      {/* Word marquee */}
      <section className="py-10 bg-brand-50 overflow-hidden border-y border-brand-100">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex gap-12 whitespace-nowrap"
        >
          {[...Array(4)].flatMap(() =>
            heroWords.map((w) => (
              <span
                key={Math.random()}
                className="inline-flex items-center gap-6 text-brand-800/30 font-black text-4xl uppercase tracking-widest"
              >
                {w}
                <span className="w-2 h-2 rounded-full bg-brand-300/40 inline-block" />
              </span>
            )),
          )}
        </motion.div>
      </section>
    </div>
  );
}
