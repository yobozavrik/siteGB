import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChefHat,
  Hand,
  Leaf,
  Snowflake,
  MapPin,
  Truck,
  Store,
  ShoppingCart,
} from "lucide-react";
import { categoriesSorted, productsByCategory, activeProducts, pricePer100g, productImage } from "@/data/catalog";
import { blogPosts } from "@/data/blogPosts";
import { totalShops, totalCities, productionShops } from "@/data/shops";
import { useCart } from "@/context/CartContext";
import { SHOW_PRICES, NETWORK_STATS } from "@/config/site";

const ease = [0.16, 1, 0.3, 1] as const;

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <motion.span
    initial={{ opacity: 0, letterSpacing: "0.5em" }}
    whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
    viewport={{ once: true }}
    transition={{ duration: 1, ease }}
    className="mb-4 block text-sm font-bold uppercase tracking-[0.3em] text-primary"
  >
    {children}
  </motion.span>
);

/* ---------------------------------------------------------------- Menu ---- */

export const MenuSection = () => (
  <section id="menu" className="section-padding relative overflow-hidden">
    <div className="section-accent pointer-events-none absolute inset-0 opacity-[0.04]" />
    <div className="relative mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
        className="mb-14 text-center"
      >
        <Eyebrow>Меню</Eyebrow>
        <h2 className="text-4xl font-black md:text-6xl">
          Оберіть свій <span className="text-gradient-brand">смак</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Вісім категорій ручного ліплення. Ціна показується за упаковку і за 100 г.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {categoriesSorted.map((c, i) => (
          <motion.div
            key={c.slug}
            initial={{ opacity: 0, y: 50, rotateX: 12 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease, delay: (i % 4) * 0.08 }}
            whileHover={{ y: -10 }}
          >
            <Link
              to={`/menu/${c.slug}`}
              className="glass-card group flex h-full min-h-40 flex-col justify-between p-6 transition-colors hover:border-primary/40"
            >
              <span className="text-xs font-black text-primary">0{i + 1}</span>
              <span className="text-lg font-black leading-tight">{c.title}</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                {productsByCategory(c.slug).length} позицій
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
        className="mt-10 text-center"
      >
        <Link
          to="/menu"
          className="glow-primary inline-flex items-center gap-2 rounded-full bg-primary px-10 py-4 font-bold text-primary-foreground transition-all hover:brightness-110 active:scale-95"
        >
          Все меню <ArrowRight size={18} />
        </Link>
      </motion.div>
    </div>
  </section>
);

/* ---------------------------------------------------------------- Hits ---- */

export const HitsSection = () => {
  const { addItem } = useCart();
  const hits = activeProducts.filter((p) => p.tags.includes("hit")).slice(0, 3);
  if (hits.length === 0) return null;
  const eyebrow = "Популярні страви";
  const heading = SHOW_PRICES ? "Беруть найчастіше" : "Обирають найчастіше";

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="mb-14 text-center"
        >
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="text-4xl font-black md:text-6xl">{heading}</h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {hits.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 60, rotateX: 15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease, delay: i * 0.15 }}
              whileHover={{ y: -12 }}
              className="glass-card group flex flex-col items-center p-8 text-center"
            >
              <div className="relative mb-6">
                <div className="glow-warm absolute inset-0 -z-10 rounded-full opacity-40 blur-2xl transition-opacity group-hover:opacity-70" />
                <img
                  src={productImage(p)}
                  alt={p.title}
                  className="h-40 w-40 rounded-2xl border border-border object-cover drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="text-xl font-black leading-tight">{p.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{p.unitLabel}</p>

              {SHOW_PRICES ? (
                <>
                  <p className="mt-4 font-mono text-2xl font-black">
                    {p.priceUAH} <span className="text-sm font-medium text-muted-foreground">₴</span>
                  </p>
                  <p className="text-xs text-muted-foreground tabular-nums">{pricePer100g(p)} ₴ / 100 г</p>
                  <motion.button
                    onClick={() =>
                      addItem({
                        id: p.id,
                        slug: p.slug,
                        title: p.title,
                        unitLabel: p.unitLabel,
                        priceUAH: p.priceUAH,
                        image: productImage(p),
                      })
                    }
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-muted py-3.5 text-sm font-bold uppercase tracking-wider transition-all hover:bg-primary hover:text-primary-foreground"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    В кошик
                  </motion.button>
                </>
              ) : (
                <Link
                  to={`/product/${p.slug}`}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline"
                >
                  Детальніше <ArrowRight size={15} />
                </Link>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------- Why we ---- */

const reasons = [
  { icon: Leaf, title: "Якість", desc: "Тісто й начинки з простих продуктів, без сої, консервантів і замінників жиру." },
  { icon: ChefHat, title: "Асортимент", desc: "Понад 200 страв: вареники, пельмені, млинці, котлети, піца, випічка, готові страви." },
  { icon: Hand, title: "Відкрите виробництво", desc: "Цех працює за склом просто в торговому залі — видно кожен етап ручної ліпки." },
];

export const WhySection = () => (
  <section id="why" className="section-padding relative overflow-hidden">
    <div className="section-accent pointer-events-none absolute inset-0 opacity-[0.04]" />
    <div className="relative mx-auto max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease }}
        className="mb-14 text-center"
      >
        <Eyebrow>Чому Галя Балувана</Eyebrow>
        <h2 className="text-4xl font-black md:text-5xl">
          Смак, який збирає рідних за <span className="text-gradient-brand">одним столом</span>
        </h2>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        className="grid grid-cols-1 gap-6 md:grid-cols-3"
      >
        {reasons.map((r) => (
          <motion.div
            key={r.title}
            variants={{
              hidden: { opacity: 0, y: 40, scale: 0.96 },
              visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease } },
            }}
            whileHover={{ y: -6 }}
            className="glass-card group p-8 transition-all duration-500 hover:border-primary/30"
          >
            <div className="flex items-start gap-4">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="rounded-xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary/20"
              >
                <r.icon className="h-6 w-6" />
              </motion.div>
              <div>
                <h3 className="mb-2 text-xl font-bold">{r.title}</h3>
                <p className="text-sm leading-relaxed text-foreground/60">{r.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

/* --------------------------------------------------------------- Stats ---- */

export const StatsSection = () => (
  <section className="section-padding relative overflow-hidden bg-stone-950 text-white">
    <div className="section-accent absolute inset-0 opacity-20" />
    <div className="relative mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
        className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3"
      >
        {NETWORK_STATS.map((s) => (
          <div key={s.label}>
            <div className="font-mono text-5xl font-black text-gradient-brand md:text-6xl">{s.value}</div>
            <div className="mt-2 text-sm text-white/60">{s.label}</div>
          </div>
        ))}
      </motion.div>
      <p className="relative mt-6 text-center text-xs text-white/40">
        Дані національної мережі «Галя Балувана».
      </p>
    </div>
  </section>
);

/* -------------------------------------------------------- Process band ---- */

const usps = [
  { icon: Snowflake, title: "Заморожені −18 °C", desc: "Готуються одразу з морозилки, без розморожування" },
  { icon: Truck, title: "Доставка в день замовлення", desc: "Кур'єром по місту або Новою Поштою по Україні" },
  { icon: Store, title: "Самовивіз безкоштовно", desc: "Замовлення готове за 30–40 хвилин" },
];

export const ProcessShowcase = () => (
  <section className="section-padding relative overflow-hidden">
    <div className="section-accent pointer-events-none absolute inset-0 opacity-[0.04]" />
    <div className="relative mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
        className="mb-12 text-center"
      >
        <Eyebrow>Як це працює</Eyebrow>
        <h2 className="text-4xl font-black md:text-6xl">Кухня за склом</h2>
      </motion.div>

      <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -50, rotate: -2 }}
          whileInView={{ opacity: 1, x: 0, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease }}
          whileHover={{ scale: 1.02, rotate: 1 }}
          className="group relative aspect-[4/3] overflow-hidden rounded-3xl md:aspect-square"
        >
          <img
            src="/img/why-galya.jpg"
            alt="Виробництво напівфабрикатів за склом"
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent" />
          <div className="absolute inset-x-6 bottom-6 text-white">
            <p className="text-2xl font-black md:text-3xl">Ліпимо руками</p>
            <p className="mt-1 text-white/70">Тісто й начинки готуємо на очах у покупців</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50, rotate: 2 }}
          whileInView={{ opacity: 1, x: 0, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease, delay: 0.15 }}
          whileHover={{ scale: 1.02, rotate: -1 }}
          className="relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-3xl bg-stone-950 p-8 text-white"
        >
          <div className="section-accent absolute inset-0 opacity-20" />
          <div className="relative">
            <p className="font-mono text-5xl font-black text-primary">30 діб</p>
            <p className="mt-2 text-2xl font-black">Термін зберігання</p>
            <p className="mt-1 text-white/60">
              Короткий — бо у складі немає консервантів, фосфатів і замінників жиру.
            </p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {usps.map((u, i) => (
          <motion.div
            key={u.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease, delay: 0.1 * i }}
            whileHover={{ y: -6 }}
            className="glass-card group p-6 text-center transition-all duration-500 hover:border-primary/30"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/20">
              <u.icon className="h-7 w-7 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-bold">{u.title}</h3>
            <p className="text-sm text-foreground/50">{u.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* --------------------------------------------------------------- Shops ---- */

export const ShopsSection = () => (
  <section id="shops" className="section-padding relative overflow-hidden bg-stone-950 text-white">
    <div className="section-accent absolute inset-0 opacity-25" />
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease }}
      className="relative mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1fr_auto]"
    >
      <div>
        <MapPin className="mb-5 text-primary" />
        <span className="mb-4 block text-sm font-bold uppercase tracking-[0.3em] text-white/60">
          Наші магазини
        </span>
        <h2 className="text-4xl font-black md:text-5xl">
          Знайдіть Галя Балувана у <span className="text-gradient-brand">своєму місті</span>
        </h2>
        <p className="mt-5 max-w-xl text-lg text-white/70">
          {totalShops} магазинів у {totalCities} містах, у {productionShops.length} з них —
          виробництво за склом. На мапі видно, де саме.
        </p>
      </div>
      <Link
        to="/shops"
        className="rounded-full bg-white px-10 py-4 font-bold text-stone-950 transition-transform hover:scale-105 active:scale-95"
      >
        Обрати місто
      </Link>
    </motion.div>
  </section>
);

/* ---------------------------------------------------------------- Blog ---- */

export const BlogSection = () => (
  <section id="blog" className="section-padding relative overflow-hidden">
    <div className="relative mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
        className="mb-14 text-center"
      >
        <Eyebrow>Рецепти та поради</Eyebrow>
        <h2 className="text-4xl font-black md:text-6xl">Корисне про домашній смак</h2>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {blogPosts.slice(0, 3).map((post, i) => (
          <motion.article
            key={post.slug}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease, delay: i * 0.1 }}
            whileHover={{ y: -8 }}
            className="glass-card group flex flex-col p-6 transition-colors hover:border-primary/30"
          >
            <span className="font-black text-primary">0{i + 1}</span>
            <h3 className="mt-6 text-xl font-bold leading-tight">{post.title}</h3>
            <p className="mt-3 line-clamp-3 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
            <Link
              to={`/blog/${post.slug}`}
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary"
            >
              Читати <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

/* ----------------------------------------------------------- Feedback ---- */

export const FeedbackSection = () => (
  <section id="feedback" className="section-padding relative overflow-hidden bg-muted">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease }}
      className="relative mx-auto max-w-3xl text-center"
    >
      <Eyebrow>Зворотний зв'язок</Eyebrow>
      <h2 className="text-3xl font-black md:text-4xl">Питання, відгук чи побажання?</h2>
      <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
        Напишіть нам — менеджер відповість у робочий час. Або запитайте помічника в чаті.
      </p>
      <Link
        to="/contacts"
        className="glow-primary mt-8 inline-flex rounded-full bg-primary px-10 py-4 font-bold text-primary-foreground transition-all hover:brightness-110 active:scale-95"
      >
        Написати нам
      </Link>
    </motion.div>
  </section>
);

/* ---------------------------------------------------------- Franchise ---- */

export const FranchiseSection = () => (
  <section id="franchise" className="section-padding relative overflow-hidden bg-stone-950 text-white">
    <div className="section-accent absolute inset-0 opacity-20" />
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease }}
      className="relative mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.3fr_1fr]"
    >
      <div>
        <span className="mb-4 block text-sm font-bold uppercase tracking-[0.3em] text-white/60">
          Франшиза
        </span>
        <h2 className="text-4xl font-black md:text-6xl">
          Хочете відкрити <span className="text-gradient-brand">свій магазин?</span>
        </h2>
      </div>
      <div className="flex flex-col justify-center">
        <p className="leading-relaxed text-white/65">
          Передаємо рецептуру, обладнання, навчання й маркетинг. Залиште контакти — надішлемо умови.
        </p>
        <Link
          to="/franchise"
          className="mt-6 inline-flex w-max rounded-full border border-white/40 px-10 py-4 font-bold transition-colors hover:bg-white hover:text-stone-950"
        >
          Заявка на партнерство
        </Link>
      </div>
    </motion.div>
  </section>
);
