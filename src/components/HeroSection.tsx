import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowDown } from "lucide-react";
import heroFood from "@/assets/galya-hero-food.png";

const HeroSection = () => (
  <section className="relative flex min-h-[640px] items-center overflow-hidden bg-stone-950 text-white">
    <img
      src={heroFood}
      alt="Домашні напівфабрикати ручного ліплення"
      className="absolute inset-0 h-full w-full object-cover object-center opacity-80"
      fetchPriority="high"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/10" />
    <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-16">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 text-sm font-bold uppercase tracking-[.28em] text-red-300"
      >
        Домашні напівфабрикати
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-3xl text-5xl font-black leading-[.95] tracking-tight md:text-7xl"
      >
        Приділіть свій час <span className="text-red-300">коханим</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-7 max-w-xl text-lg leading-relaxed text-white/75"
      >
        А про смачні домашні страви подбала Галя Балувана. Ліпимо руками, щодня, у вас на очах.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-9 flex flex-wrap gap-4"
      >
        <Link to="/menu" className="rounded-full bg-primary px-7 py-4 font-bold transition-colors hover:brightness-110">
          Переглянути меню
        </Link>
        <Link to="/shops" className="rounded-full border border-white/45 px-7 py-4 font-bold transition-colors hover:bg-white/10">
          Знайти магазин
        </Link>
      </motion.div>
    </div>
    <a href="#menu" aria-label="До меню" className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/70">
      <ArrowDown className="animate-bounce" />
    </a>
  </section>
);

export default HeroSection;
