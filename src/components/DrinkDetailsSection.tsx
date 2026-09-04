import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Sparkles, Brain, Heart, Moon } from "lucide-react";
import canGrapefruit from "@/assets/can-grapefruit-new.png";
import canOrange from "@/assets/can-orange-new.png";
import canApple from "@/assets/can-apple-new.png";

const ease = [0.16, 1, 0.3, 1] as const;

const drinks = [
  {
    name: "Grapefruit",
    color: "grapefruit",
    icon: Heart,
    tagline: "Емоційний підйом",
    ingredients: "Kava Kava • L-тіанін • Гліцин • Магній",
    highlights: ["Покращує настрій", "Знижує тривожність", "Відкритість у спілкуванні"],
    bestFor: "Зустрічі, заходи, творчість",
    canImage: canGrapefruit,
  },
  {
    name: "Orange",
    color: "orange",
    icon: Brain,
    tagline: "Розслаблена концентрація",
    ingredients: "Канна • Пуер • L-тіанін • Гліцин",
    highlights: ["Рівна енергія", "Зниження напруги", "Стійка увага"],
    bestFor: "Робота, зустрічі, дорога",
    canImage: canOrange,
  },
  {
    name: "З соком яблука",
    color: "apple",
    icon: Moon,
    tagline: "Глибоке відновлення",
    ingredients: "GABA • CBD • L-тіанін • Гліцин",
    highlights: ["Внутрішній спокій", "Розслаблення тіла", "Якісний відпочинок"],
    bestFor: "Вечір, після тренувань, перед сном",
    canImage: canApple,
  },
];

const colorMap: Record<string, string> = {
  grapefruit: "bg-grapefruit",
  orange: "bg-orange",
  apple: "bg-apple",
};

const glowMap: Record<string, string> = {
  grapefruit: "hsl(var(--grapefruit))",
  orange: "hsl(var(--orange))",
  apple: "hsl(var(--apple))",
};

const DrinkDetailsSection = () => {
  const [active, setActive] = useState(0);
  const d = drinks[active];

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `radial-gradient(circle at 50% 30%, ${glowMap[d.color]} 0%, transparent 60%)`
      }} />

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-14"
        >
          <span className="text-primary text-sm font-bold tracking-[0.3em] uppercase block mb-4">
            <Sparkles className="inline h-4 w-4 mr-2" />
            Деталі
          </span>
          <h2 className="text-4xl md:text-5xl font-black">
            Про кожен <span className="text-gradient-brand">смак</span>
          </h2>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease, delay: 0.2 }}
          className="flex justify-center gap-3 mb-12"
        >
          {drinks.map((item, i) => (
            <motion.button
              key={item.name}
              onClick={() => setActive(i)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-7 py-3 rounded-full font-bold text-sm tracking-wide transition-all duration-300 ${
                active === i
                  ? `${colorMap[item.color]} text-primary-foreground shadow-lg`
                  : "bg-muted/60 text-muted-foreground hover:bg-muted"
              }`}
            >
              {item.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.5, ease }}
            className="glass-card p-10 md:p-14 relative overflow-hidden"
          >
            {/* Subtle glow */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-10" style={{ background: glowMap[d.color] }} />

            <div className="relative flex flex-col md:flex-row items-start gap-10">
              {/* Left: Info */}
              <div className="flex-1 space-y-8 md:pl-6">
                {/* Icon + Name + Tagline */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease, delay: 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="p-3 rounded-2xl" style={{ background: `${glowMap[d.color]}20` }}>
                    <d.icon className="h-7 w-7" style={{ color: glowMap[d.color] }} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black">{d.name}</h3>
                    <p className="text-muted-foreground font-medium">{d.tagline}</p>
                  </div>
                </motion.div>

                {/* Склад + Найкраще для — side by side */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease, delay: 0.2 }}
                  className="flex flex-col sm:flex-row gap-8"
                >
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-[0.2em] mb-2 font-bold" style={{ color: glowMap[d.color] }}>Склад</p>
                    <p className="font-semibold text-foreground/80">{d.ingredients}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-[0.2em] mb-2 font-bold" style={{ color: glowMap[d.color] }}>Найкраще для</p>
                    <p className="font-semibold text-foreground/80">{d.bestFor}</p>
                  </div>
                </motion.div>

                {/* Як відчувається — centered below */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease, delay: 0.3 }}
                  className="text-center md:-ml-6"
                >
                  <p className="text-xs uppercase tracking-[0.2em] mb-4 font-bold" style={{ color: glowMap[d.color] }}>Як відчувається</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {d.highlights.map((h, i) => (
                      <motion.div
                        key={h}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, ease, delay: 0.35 + i * 0.08 }}
                        className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
                      >
                        <div className="w-2 h-2 rounded-full shrink-0 transition-transform group-hover:scale-150" style={{ background: glowMap[d.color] }} />
                        <span className="font-medium text-foreground/80">{h}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right: Can with rolling animation */}
              <div className="flex-shrink-0 flex items-center justify-center md:w-64 mx-auto md:mx-0">
                <motion.div
                  key={`can-${active}`}
                  initial={{ opacity: 0, x: 80, rotate: 45 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  exit={{ opacity: 0, x: -80, rotate: -45 }}
                  transition={{ duration: 0.7, ease }}
                  className="relative"
                >
                  <div
                    className="absolute inset-0 -z-10 blur-[60px] opacity-30 scale-125"
                    style={{ background: glowMap[d.color] }}
                  />
                  <motion.img
                    src={d.canImage}
                    alt={d.name}
                    className="w-40 h-56 md:w-48 md:h-64 object-contain drop-shadow-2xl"
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 2, -2, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default DrinkDetailsSection;
