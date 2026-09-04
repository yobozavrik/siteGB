import { Link } from "react-router-dom";
import { ChefHat, HeartHandshake, Store, ArrowRight, MapPin } from "lucide-react";
import { categoriesSorted, activeProducts } from "@/data/catalog";
import { blogPosts } from "@/data/blogPosts";
import ProductCard from "@/components/catalog/ProductCard";
import { totalShops, totalCities } from "@/data/shops";

const reasons: [typeof ChefHat, string, string][] = [
  [ChefHat, "Відкрите виробництво", "Цех і процес приготування — за склом просто в магазині."],
  [HeartHandshake, "Домашні рецепти", "Тісто й начинки ручного ліплення, без сої та консервантів."],
  [Store, "Свіже щодня", "Ліпимо зранку, термін зберігання — до 30 діб, а не пів року."],
];

export const MenuSection = () => (
  <section id="menu" className="section-padding bg-background">
    <div className="mx-auto max-w-7xl">
      <p className="mb-4 text-sm font-bold uppercase tracking-[.25em] text-primary">Меню</p>
      <h2 className="text-4xl font-black md:text-5xl">
        Оберіть свій <span className="text-primary">смак</span>
      </h2>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Вісім категорій ручного ліплення. Ціни за упаковку і за 100 г — прямо в меню.
      </p>
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        {categoriesSorted.map((c, i) => (
          <Link
            key={c.slug}
            to={`/menu/${c.slug}`}
            className="group flex min-h-32 flex-col justify-between rounded-2xl bg-muted p-5 transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <span className="text-xs font-bold text-primary group-hover:text-white/80">0{i + 1}</span>
            <span className="font-bold leading-tight">{c.title}</span>
            <ArrowRight size={18} />
          </Link>
        ))}
      </div>
      <Link
        to="/menu"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 font-bold text-primary-foreground"
      >
        Все меню <ArrowRight size={18} />
      </Link>
    </div>
  </section>
);

export const HitsSection = () => {
  const hits = activeProducts.filter((p) => p.tags.includes("hit")).slice(0, 4);
  if (hits.length === 0) return null;
  return (
    <section className="section-padding bg-background pt-0">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-baseline gap-3">
          <p className="text-sm font-bold uppercase tracking-[.2em] text-primary">Хіти</p>
          <h2 className="text-2xl font-black md:text-3xl">Беруть найчастіше</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {hits.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export const WhySection = () => (
  <section id="why" className="section-padding bg-stone-950 text-white">
    <div className="mx-auto max-w-7xl">
      <p className="mb-4 text-sm font-bold uppercase tracking-[.25em] text-red-300">Чому саме ми</p>
      <h2 className="max-w-3xl text-4xl font-black md:text-5xl">Смак, який збирає рідних за одним столом</h2>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {reasons.map(([Icon, title, text]) => (
          <article key={title} className="rounded-2xl border border-white/15 p-7">
            <Icon className="text-red-300" />
            <h3 className="mt-8 text-2xl font-bold">{title}</h3>
            <p className="mt-3 leading-relaxed text-white/65">{text}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export const ShopsSection = () => (
  <section id="shops" className="section-padding bg-primary text-primary-foreground">
    <div className="mx-auto grid max-w-7xl items-end gap-10 md:grid-cols-[1fr_auto]">
      <div>
        <MapPin className="mb-5" />
        <p className="mb-4 text-sm font-bold uppercase tracking-[.25em] text-white/70">Наші магазини</p>
        <h2 className="text-4xl font-black md:text-5xl">Знайдіть Галя Балувана у своєму місті</h2>
        <p className="mt-5 max-w-xl text-lg text-white/80">
          {totalShops} магазинів у {totalCities} містах. На мапі видно, де працює виробництво за склом.
        </p>
      </div>
      <Link to="/shops" className="rounded-full bg-white px-7 py-4 font-bold text-primary hover:bg-white/90">
        Обрати місто
      </Link>
    </div>
  </section>
);

export const BlogSection = () => (
  <section id="blog" className="section-padding">
    <div className="mx-auto max-w-7xl">
      <p className="mb-4 text-sm font-bold uppercase tracking-[.25em] text-primary">Рецепти та поради</p>
      <h2 className="text-4xl font-black md:text-5xl">Корисне про домашній смак</h2>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {blogPosts.slice(0, 3).map((post, i) => (
          <article key={post.slug} className="rounded-2xl border border-border p-6">
            <span className="text-sm font-bold text-primary">0{i + 1}</span>
            <h3 className="mt-8 text-xl font-bold leading-tight">{post.title}</h3>
            <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
            <Link
              to={`/blog/${post.slug}`}
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary"
            >
              Читати <ArrowRight size={16} />
            </Link>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export const FeedbackSection = () => (
  <section id="feedback" className="section-padding bg-muted">
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="text-3xl font-black md:text-4xl">Зворотний зв'язок</h2>
      <p className="mt-4 text-lg text-muted-foreground">
        Залиште відгук або питання — менеджер відповість у робочий час.
      </p>
      <Link
        to="/contacts"
        className="mt-8 inline-flex rounded-full bg-primary px-7 py-4 font-bold text-primary-foreground"
      >
        Написати нам
      </Link>
    </div>
  </section>
);

export const FranchiseSection = () => (
  <section id="franchise" className="section-padding bg-stone-950 text-white">
    <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.3fr_1fr]">
      <div>
        <p className="mb-4 text-sm font-bold uppercase tracking-[.25em] text-red-300">Франшиза</p>
        <h2 className="text-4xl font-black md:text-5xl">Хочете відкрити свій магазин?</h2>
      </div>
      <div>
        <p className="leading-relaxed text-white/65">
          Передаємо рецептуру, обладнання, навчання й маркетинг. Залиште контакти, щоб отримати умови.
        </p>
        <Link
          to="/franchise"
          className="mt-6 inline-flex rounded-full border border-white/40 px-7 py-4 font-bold transition-colors hover:bg-white hover:text-stone-950"
        >
          Заявка на партнерство
        </Link>
      </div>
    </div>
  </section>
);
