import { Link } from "react-router-dom";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, MapPin, Hand, Eye, Clock3 } from "lucide-react";
import { categoriesSorted, productsByCategory } from "@/data/catalog";
import { blogPosts } from "@/data/blogPosts";
import { totalShops, productionShops } from "@/data/shops";
import { NETWORK_STATS } from "@/config/site";

const official = "https://galia-baluvana.com";
const storage = (file: string) => `${official}/storage/uploads/images/${file}`;
const HERO_IMG = storage("5LvLX25B2scRahWW3At6nj5Dp3X4OdhZbiQxPJ8C.jpg");

const categoryImages: Record<string, string> = {
  vareniki: storage("KdMZjg5dZ5QG6uQr7GodVtCN6UxR0n9kxekcYvuM/KdMZjg5dZ5QG6uQr7GodVtCN6UxR0n9kxekcYvuM_res600x400_opt.jpg"),
  pelmeni: storage("heUByTjRCe5gFfKrRkKrUYwv8PQVtncVrjuqK9i4/heUByTjRCe5gFfKrRkKrUYwv8PQVtncVrjuqK9i4_res600x400_opt.jpg"),
  mlyntsi: storage("KdMZjg5dZ5QG6uQr7GodVtCN6UxR0n9kxekcYvuM/KdMZjg5dZ5QG6uQr7GodVtCN6UxR0n9kxekcYvuM_res600x400_opt.jpg"),
  syrnyky: storage("1Vq3uTefVtVUIM2zSMETMnqqUVcWrX5YDHxI4dtf/1Vq3uTefVtVUIM2zSMETMnqqUVcWrX5YDHxI4dtf_res600x400_opt.jpg"),
  kotlety: storage("7FojIlejzfiFGAAIbyc90zp23Q3zAOv99aZfzZ6U/7FojIlejzfiFGAAIbyc90zp23Q3zAOv99aZfzZ6U_res600x400_opt.jpg"),
  golubtsi: storage("XexPEvNeq9NWpZFWzuWcSM8hyHCJoWsuRfFpi3F2/XexPEvNeq9NWpZFWzuWcSM8hyHCJoWsuRfFpi3F2_res600x400_opt.jpg"),
  kartoplyani: storage("XexPEvNeq9NWpZFWzuWcSM8hyHCJoWsuRfFpi3F2/XexPEvNeq9NWpZFWzuWcSM8hyHCJoWsuRfFpi3F2_res600x400_opt.jpg"),
  homilky: storage("bIGFP4fRUb6dtdv8aytk7MN4gr6F6NlPvvkpBDm9/bIGFP4fRUb6dtdv8aytk7MN4gr6F6NlPvvkpBDm9_res600x400_opt.jpg"),
  kovbasy: storage("2kqR3c2V2AKIqm1reEpzBTfXQxL7USblQwlJm1gY/2kqR3c2V2AKIqm1reEpzBTfXQxL7USblQwlJm1gY_res600x400_opt.jpg"),
  "pizza-pyrohy": storage("btGbtGY39D1Bm0LCrdLVvrOlmMDnGwgs5EXUeQjR/btGbtGY39D1Bm0LCrdLVvrOlmMDnGwgs5EXUeQjR_res600x400_opt.jpg"),
};

const craft = [
  { icon: Hand, title: "Ліпимо руками", text: "Кожен вареник і пельмень формує майстриня — тісто й начинку робимо щодня, малими партіями." },
  { icon: Eye, title: "Кухня за склом", text: `У ${productionShops.length} магазинах виробництво відкрите: видно кожен етап просто в торговому залі.` },
  { icon: Clock3, title: "Вечеря за 10 хвилин", text: "Готуються одразу з морозилки, без розморожування. Смак — як щойно зліплені вдома." },
];

const dateFmt = (iso: string) =>
  new Date(iso).toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" });

const OfficialHome = () => {
  const reduce = useReducedMotion();
  const featured = categoriesSorted.slice(0, 8);
  const posts = blogPosts.slice(0, 3);

  const reveal: Variants = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  };
  const group: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

  return (
    <main>
      {/* ---- Hero -------------------------------------------------------- */}
      <section className="grain relative overflow-hidden bg-muted">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-14 pt-28 md:grid-cols-[1.02fr_1fr] md:px-10 md:pb-20 md:pt-32 lg:px-16">
          <div>
            <motion.span
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="eyebrow"
            >
              <MapPin size={13} /> Домашні напівфабрикати · Чернівці
            </motion.span>

            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="font-display mt-4 text-[clamp(2.6rem,6vw,4.6rem)] font-medium leading-[1.02] text-foreground"
            >
              Ручна ліпка,
              <br />
              <span className="text-primary">домашній</span> смак
            </motion.h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="lead mt-6"
            >
              Вареники, пельмені, млинці, сирники та котлети, які щодня ліплять руками у Чернівцях. Оберіть
              улюблене в каталозі й заберіть у найближчому з {totalShops} магазинів.
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link to="/menu" className="btn-primary">
                Дивитися каталог <ArrowRight size={16} />
              </Link>
              <Link to="/shops" className="btn-ghost">
                <MapPin size={16} /> {totalShops} магазинів у Чернівцях
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-border md:aspect-[5/6]"
          >
            <img
              src={HERO_IMG}
              alt="Домашні страви ручного ліплення Галя Балувана"
              width={1200}
              height={1440}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-6">
              <p className="font-display text-2xl text-paper">Смакує, як удома</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---- Craft strip --------------------------------------------- */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={group}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid gap-5 md:grid-cols-3"
          >
            {craft.map((c) => (
              <motion.div key={c.title} variants={reveal} className="craft-card p-7">
                <div className="mb-4 inline-flex rounded-xl bg-secondary/12 p-3 text-secondary">
                  <c.icon className="h-6 w-6" strokeWidth={1.6} />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---- Catalogue grid --------------------------------------- */}
      <section className="section-padding pt-0">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">Каталог</span>
              <h2 className="font-display mt-2 text-[clamp(1.9rem,3.4vw,2.8rem)] font-medium text-foreground">
                Оберіть свою категорію
              </h2>
            </div>
            <Link to="/menu" className="gb-text-link">
              Усе меню <ArrowRight size={16} />
            </Link>
          </div>

          <motion.div
            variants={group}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4"
          >
            {featured.map((c) => (
              <motion.div key={c.slug} variants={reveal}>
                <Link
                  to={`/menu/${c.slug}`}
                  className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl border border-border"
                >
                  {categoryImages[c.slug] ? (
                    <img
                      src={categoryImages[c.slug]}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-secondary/15" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
                  <div className="relative p-4">
                    <p className="font-display text-lg leading-tight text-paper">{c.title}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-paper/75">
                      {productsByCategory(c.slug).length} позицій
                      <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---- Shops teaser ---------------------------------------- */}
      <section className="grain relative overflow-hidden bg-ink text-paper">
        <div className="section-accent pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-[1fr_0.9fr] md:px-10 md:py-24 lg:px-16">
          <div>
            <span className="eyebrow text-honey">Магазини у Чернівцях</span>
            <h2 className="font-display mt-3 text-[clamp(2rem,3.6vw,3rem)] font-medium">
              {totalShops} магазинів у ваших районах
            </h2>
            <p className="mt-4 max-w-xl text-paper/75">
              Південний, Проспект, Гравітон, Центр, Автовокзал, Калинівський ринок. На сторінці магазинів —
              інтерактивна мапа, графік роботи й телефон кожної точки.
            </p>
            <Link
              to="/shops"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-paper px-6 py-3.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <MapPin size={16} /> Відкрити мапу магазинів
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {NETWORK_STATS.map((s) => (
              <div key={s.label} className="rounded-2xl border border-paper/15 bg-paper/5 p-4">
                <div className="font-display text-3xl text-honey md:text-4xl">{s.value}</div>
                <div className="mt-1 text-[11px] leading-tight text-paper/70">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Blog teaser ---------------------------------------- */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">Журнал</span>
              <h2 className="font-display mt-2 text-[clamp(1.9rem,3.4vw,2.8rem)] font-medium text-foreground">
                Корисне про домашню кухню
              </h2>
            </div>
            <Link to="/blog" className="gb-text-link">
              Усі матеріали <ArrowRight size={16} />
            </Link>
          </div>

          <motion.div
            variants={group}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-8 grid gap-5 md:grid-cols-3"
          >
            {posts.map((post) => (
              <motion.article key={post.slug} variants={reveal} className="craft-card flex flex-col p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-secondary">{post.category}</p>
                <h3 className="mt-3 flex-1 font-display text-xl leading-snug text-foreground">
                  <Link to={`/blog/${post.slug}`} className="hover:text-primary">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
                <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{dateFmt(post.date)}</span>
                  <span>{post.readingTime}</span>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default OfficialHome;
