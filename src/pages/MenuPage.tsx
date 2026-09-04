import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import SEO from "@/components/SEO";
import ProductCard from "@/components/catalog/ProductCard";
import { categoriesSorted, productsByCategory, totalProducts } from "@/data/catalog";
import { SITE_URL } from "@/config/site";

const MenuPage = () => (
  <SiteLayout
    seo={
      <SEO
        title="Меню — домашні напівфабрикати Галя Балувана"
        description="Повне меню: вареники, пельмені, млинці, сирники, чебуреки, голубці, котлети та десерти ручного ліплення. Ціни за упаковку і за 100 г."
        path="/menu"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Головна", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "Меню", item: `${SITE_URL}/menu` },
            ],
          },
        ]}
      />
    }
  >
    <div className="mx-auto max-w-7xl px-6 py-12">
      <p className="text-sm font-bold uppercase tracking-[.25em] text-primary">Меню</p>
      <h1 className="mt-3 text-4xl font-black md:text-5xl">Оберіть свій смак</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        {totalProducts} позицій ручного ліплення. Ціни та наявність можуть відрізнятися залежно від
        магазину — уточнюйте при оформленні.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {categoriesSorted.map((c) => (
          <a
            key={c.slug}
            href={`#${c.slug}`}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary"
          >
            {c.title}
          </a>
        ))}
      </div>

      {categoriesSorted.map((c) => (
        <section key={c.slug} id={c.slug} className="scroll-mt-24 pt-12">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-2xl font-black">{c.title}</h2>
            <Link
              to={`/menu/${c.slug}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Усі <ArrowRight size={15} />
            </Link>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{c.blurb}</p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {productsByCategory(c.slug).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ))}
    </div>
  </SiteLayout>
);

export default MenuPage;
