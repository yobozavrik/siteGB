import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
const ease = [0.16, 1, 0.3, 1] as const;
const officialHero = "https://galia-baluvana.com/storage/uploads/images/5LvLX25B2scRahWW3At6nj5Dp3X4OdhZbiQxPJ8C.jpg";

const HeroSection = () => (
  <section className="hero-shell relative overflow-hidden pt-[72px]">
    <motion.div
      initial={{ opacity: 0, scale: 1.08 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.6, ease }}
      className="absolute inset-y-0 right-0 hidden w-[58%] md:block"
    >
      <img
        src={officialHero}
        alt="Домашні напівфабрикати ручного ліплення — Галя Балувана"
        width={1536}
        height={1024}
        decoding="async"
        className="h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/12 to-transparent" />
    </motion.div>

    <div className="relative z-10 mx-auto grid min-h-[680px] max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-[.95fr_1.05fr] md:px-12 lg:px-20">
      <div className="max-w-2xl">
      <motion.p
        initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1, ease, delay: 0.2 }}
        className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-primary"
      >
        Домашні напівфабрикати
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 40, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease, delay: 0.4 }}
        className="font-display text-6xl leading-[0.88] tracking-[-0.05em] text-foreground md:text-7xl lg:text-8xl"
      >
        Домашній смак
        <br />
        для <span className="text-primary">своїх</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease, delay: 0.9 }}
        className="mt-7 max-w-xl text-base leading-relaxed text-foreground/70 md:text-lg"
      >
        Страви, які збирають родину за одним столом. Обирайте улюблене меню та знаходьте
        найближчий магазин.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease, delay: 1.1 }}
        className="mt-9 flex flex-col items-start gap-3 sm:flex-row"
      >
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-4 text-base font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Переглянути меню
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          to="/shops"
          className="inline-flex items-center gap-2 rounded-xl border border-foreground/15 px-6 py-4 text-base font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <MapPin className="h-4 w-4" />
          Знайти магазин
        </Link>
      </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease, delay: 0.25 }}
        className="hero-promo relative hidden min-h-[460px] overflow-hidden rounded-[2rem] md:block"
      >
        <img src={officialHero} alt="Страви Галя Балувана" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-white/80">Смакує вдома</p>
          <p className="font-display text-4xl leading-none">Улюблені страви<br />на щодень</p>
        </div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
