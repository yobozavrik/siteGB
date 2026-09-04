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
        description="Повний асортимент по категоріях: вареники, пельмені, млинці, сирники, чебуреки, голубці, котлети, піца, випічка ручного ліплення."
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
    <div className="gb-page mx-auto max-w-7xl px-6 py-16 md:px-12 lg:px-20">
      <h1>Меню <b>Галя Балувана</b></h1>
      <p className="gb-page__lead">Перелік усієї продукції. Оберіть місто та магазин, щоб побачити актуальні ціни та наявність.</p>

      <div className="mt-8 flex flex-wrap gap-2">
        {categoriesSorted.map((c) => (
          <a
            key={c.slug}
            href={`#${c.slug}`}
            className="gb-filter"
          >
            {c.title}
          </a>
        ))}
      </div>

      {categoriesSorted.map((c) => (
        <section key={c.slug} id={c.slug} className="scroll-mt-24 pt-12">
          <div className="flex items-baseline justify-between gap-4">
            <h2>{c.title}</h2>
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
