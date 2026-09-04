import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ease = [0.16, 1, 0.3, 1] as const;

const stores = [
  'Мережа "Море Пива"',
  'Мережа "Чіз-Вайн"',
  'Мережа "НОВУС"',
  
  'Мережа "Лепрекон"',
  'Мережа "ТАбачини"',
  "Заклади HoReCa",
];

const WhereToBuySection = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle at 50% 50%, hsl(var(--primary)) 0%, transparent 50%)"
      }} />
      <div className="max-w-3xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-bold tracking-[0.3em] uppercase block mb-4">Наявність</span>
          <h2 className="text-4xl md:text-5xl font-black">Де купити?</h2>
        </motion.div>

        <div className="space-y-0 mb-10">
          {stores.map((store, i) => (
            <motion.div
              key={store}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease, delay: i * 0.08 }}
              className="flex items-center gap-4 py-5 border-b border-border/30 group hover:pl-2 transition-all"
            >
              <MapPin className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-lg font-medium">{store}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease, delay: 0.4 }}
          className="text-center"
        >
          <Link
            to="/where-to-buy"
            className="inline-flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all"
          >
            Детальніше <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default WhereToBuySection;
