import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import heroFood from "@/assets/galya-hero-food.png";

const HeroSection = () => (
  <section className="relative min-h-[760px] flex items-center overflow-hidden bg-stone-950 text-white">
    <img src={heroFood} alt="Домашні напівфабрикати" className="absolute inset-0 h-full w-full object-cover object-center opacity-80" fetchPriority="high" />
    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/10" />
    <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-20">
      <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-bold tracking-[.28em] uppercase text-red-300 mb-5">Домашні напівфабрикати</motion.p>
      <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }} className="max-w-3xl text-5xl md:text-7xl font-black leading-[.95] tracking-tight">Приділіть свій час <span className="text-red-300">коханим</span></motion.h1>
      <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }} className="max-w-xl mt-7 text-lg leading-relaxed text-white/75">А про смачні домашні страви вже подбала Галя Балувана. Оберіть місто, щоб переглянути актуальне меню.</motion.p>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3 }} className="mt-9 flex flex-wrap gap-4"><a href="#menu" className="rounded-full bg-red-600 px-7 py-4 font-bold hover:bg-red-500 transition-colors">Переглянути меню</a><a href="#shops" className="rounded-full border border-white/45 px-7 py-4 font-bold hover:bg-white/10 transition-colors">Знайти магазин</a></motion.div>
    </div>
    <a href="#menu" aria-label="До меню" className="absolute z-10 bottom-8 left-1/2 -translate-x-1/2 text-white/70"><ArrowDown className="animate-bounce" /></a>
  </section>
);
export default HeroSection;
