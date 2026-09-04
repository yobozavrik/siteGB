import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import SEO from "@/components/SEO";
import ProductCard from "@/components/catalog/ProductCard";
import {
  getCategory,
  productsByCategory,
  categoriesSorted,
  TAG_LABELS,
  type ProductTag,
} from "@/data/catalog";
import { SITE_URL, SHOW_PRICES } from "@/config/site";

type SortKey = "popular" | "price-asc" | "price-desc";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const cat = category ? getCategory(category) : undefined;

  const [activeTags, setActiveTags] = useState<ProductTag[]>([]);
  const [sort, setSort] = useState<SortKey>("popular");

  const all = useMemo(() => (cat ? productsByCategory(cat.slug) : []), [cat]);

  const filtered = useMemo(() => {
    let list = all;
    if (activeTags.length) list = list.filter((p) => activeTags.every((t) => p.tags.includes(t)));
    if (sort === "price-asc") list = [...list].sort((a, b) => a.priceUAH - b.priceUAH);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.priceUAH - a.priceUAH);
    return list;
  }, [all, activeTags, sort]);

  if (!cat) return <Navigate to="/menu" replace />;

  const availableTags = [...new Set(all.flatMap((p) => p.tags))] as ProductTag[];
  const toggle = (t: ProductTag) =>
    setActiveTags((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  return (
    <SiteLayout
      seo={
        <SEO
          title={`${cat.title} — Галя Балувана`}
          description={`${cat.title}: ${cat.blurb} ${all.length} позицій, ручне ліплення, доставка та самовивіз.`}
          path={`/menu/${cat.slug}`}
          jsonLd={[
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Головна", item: SITE_URL },
                { "@type": "ListItem", position: 2, name: "Меню", item: `${SITE_URL}/menu` },
                { "@type": "ListItem", position: 3, name: cat.title, item: `${SITE_URL}/menu/${cat.slug}` },
              ],
            },
          ]}
        />
      }
    >
      <div className="mx-auto max-w-7xl px-6 py-12">
        <nav className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">Головна</Link> /{" "}
          <Link to="/menu" className="hover:text-primary">Меню</Link> /{" "}
          <span className="text-foreground">{cat.title}</span>
        </nav>

        <h1 className="mt-3 text-3xl font-black md:text-4xl">{cat.title}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{cat.blurb}</p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {availableTags.map((t) => (
            <button
              key={t}
              onClick={() => toggle(t)}
              aria-pressed={activeTags.includes(t)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                activeTags.includes(t)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary"
              }`}
            >
              {TAG_LABELS[t]}
            </button>
          ))}
          {SHOW_PRICES && (
            <span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
              Сортувати
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-lg border border-border bg-card px-2 py-1.5 text-foreground"
              >
                <option value="popular">Спочатку популярні</option>
                <option value="price-asc">Дешевші</option>
                <option value="price-desc">Дорожчі</option>
              </select>
            </span>
          )}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-12 text-muted-foreground">За обраними фільтрами нічого не знайшлося.</p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <div className="mt-14 border-t border-border pt-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Інші категорії</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {categoriesSorted
              .filter((c) => c.slug !== cat.slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  to={`/menu/${c.slug}`}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary"
                >
                  {c.title}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
};

export default CategoryPage;
