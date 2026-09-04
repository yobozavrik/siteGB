import { motion } from "framer-motion";
import powerOfNature from "@/assets/power-of-nature.jpg";
import pocketCans from "@/assets/pocket-cans.jpg";
import { Sparkles, Heart, Shield } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const usps = [
  { icon: Sparkles, title: "100% натуральний", desc: "Лише природні інгредієнти без штучних добавок" },
  { icon: Heart, title: "Для тіла і розуму", desc: "Покращує настрій, концентрацію та загальне самопочуття" },
  { icon: Shield, title: "Сертифіковано", desc: "Відповідає всім нормам якості та безпеки в Україні" },
];

const ImageShowcase = () => {
  return (
    <section className="section-padding overflow-hidden relative">
      {/* Background accent */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "radial-gradient(circle at 50% 50%, hsl(var(--primary)) 0%, transparent 60%)"
      }} />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-12"
        >
          <span className="text-primary text-sm font-bold tracking-[0.3em] uppercase block mb-4">Чому обирають нас</span>
          <h2 className="text-4xl md:text-6xl font-black mb-4">Сила природи у кожній банці</h2>
        </motion.div>

        {/* Equal-sized image grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50, rotate: -2 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease }}
            whileHover={{ scale: 1.02, rotate: 1 }}
            className="relative rounded-3xl overflow-hidden aspect-square md:aspect-[4/3] group"
          >
            <img src={powerOfNature} alt="Power of Nature — KRATEA в лісі" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6, ease }}
              className="absolute bottom-6 left-6 right-6"
            >
              <p className="text-2xl md:text-3xl font-black text-foreground">Power of Nature</p>
              <p className="text-foreground/60 mt-1">Натхнення з глибин природи</p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50, rotate: 2 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease, delay: 0.15 }}
            whileHover={{ scale: 1.02, rotate: -1 }}
            className="relative rounded-3xl overflow-hidden aspect-[4/3] group"
          >
            <img src={pocketCans} alt="KRATEA завжди під рукою" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45, duration: 0.6, ease }}
              className="absolute bottom-6 left-6 right-6"
            >
              <p className="text-2xl md:text-3xl font-black text-foreground">Завжди під рукою</p>
              <p className="text-foreground/60 mt-1">Зручний формат 0.33L на кожен день</p>
            </motion.div>
          </motion.div>
        </div>

        {/* USP Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {usps.map((usp, i) => (
            <motion.div
              key={usp.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease, delay: 0.1 * i }}
              whileHover={{ y: -6 }}
              className="glass-card p-6 text-center group hover:border-primary/30 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <usp.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">{usp.title}</h3>
              <p className="text-foreground/50 text-sm">{usp.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageShowcase;
