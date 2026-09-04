import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import heroFood from "@/assets/galya-hero-food.png";

const ease = [0.16, 1, 0.3, 1] as const;

const HeroSection = () => (
  <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden">
    <motion.div
      initial={{ opacity: 0, scale: 1.08 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.6, ease }}
      className="absolute inset-0"
    >
      <img
        src={heroFood}
        alt="Домашні напівфабрикати ручного ліплення — Галя Балувана"
        width={1536}
        height={1024}
        fetchPriority="high"
        decoding="async"
        className="h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/85 via-stone-950/60 to-background" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
    </motion.div>

    <div className="relative z-10 mx-auto max-w-5xl px-6 pt-24 text-center">
      <motion.p
        initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1, ease, delay: 0.2 }}
        className="mb-4 text-sm font-black uppercase tracking-[0.4em] text-primary-foreground/90"
        style={{ textShadow: "0 2px 16px rgba(0,0,0,0.6)" }}
      >
        Домашні напівфабрикати
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 40, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease, delay: 0.4 }}
        className="text-5xl font-black leading-[0.95] tracking-tight text-white md:text-7xl lg:text-8xl"
        style={{ textShadow: "0 6px 44px rgba(0,0,0,0.7), 0 0 100px rgba(0,0,0,0.45)" }}
      >
        Приділіть свій час
        <br />
        <span className="text-gradient-brand" style={{ textShadow: "none" }}>коханим</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease, delay: 0.9 }}
        className="mx-auto mt-6 max-w-2xl text-base text-white/80 md:text-lg"
        style={{ textShadow: "0 2px 14px rgba(0,0,0,0.6)" }}
      >
        А про смачні домашні страви подбала Галя Балувана. Тісто розкачуємо й защипуємо
        руками — щодня, у вас на очах.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease, delay: 1.1 }}
        className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
      >
        <Link
          to="/menu"
          className="glow-primary rounded-full bg-primary px-12 py-4 text-lg font-bold text-primary-foreground transition-all hover:brightness-110 active:scale-95"
        >
          Переглянути меню
        </Link>
        <a
          href="#menu"
          className="flex items-center gap-2 font-medium text-white/70 transition-colors hover:text-white"
        >
          <ChevronDown className="h-5 w-5 animate-bounce" />
          Дізнатись більше
        </a>
      </motion.div>
    </div>

    <motion.div
      animate={{ y: [0, 8, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
    >
      <ChevronDown className="h-8 w-8 text-white/40" />
    </motion.div>
  </section>
);

export default HeroSection;
