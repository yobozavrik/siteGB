import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Minus, Plus, Phone } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import SEO from "@/components/SEO";
import ProductCard from "@/components/catalog/ProductCard";
import Tag from "@/components/catalog/Tag";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getProduct,
  getCategory,
  relatedProducts,
  pricePer100g,
  productImage,
} from "@/data/catalog";
import { useCart } from "@/context/CartContext";
import { SITE_URL, SHOW_PRICES, PHONE, PHONE_DISPLAY } from "@/config/site";

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProduct(slug) : undefined;
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  if (!product) return <Navigate to="/menu" replace />;

  const cat = getCategory(product.categorySlug);
  const per100 = pricePer100g(product);
  const image = productImage(product);
  const related = relatedProducts(product.slug, 4);

  const add = () =>
    addItem(
      {
        id: product.id,
        slug: product.slug,
        title: product.title,
        unitLabel: product.unitLabel,
        priceUAH: product.priceUAH,
        image,
      },
      qty,
    );

  const url = `${SITE_URL}/product/${product.slug}`;

  return (
    <SiteLayout
      seo={
        <SEO
          title={`${product.title} — ${cat?.title ?? "меню"} | Галя Балувана`}
          description={`${product.title}, ${product.unitLabel}. ${product.composition.slice(0, 130)}`}
          path={`/product/${product.slug}`}
          type="product"
          jsonLd={[
            {
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.title,
              image: `${SITE_URL}${image}`,
              description: product.composition,
              category: cat?.title,
              ...(SHOW_PRICES
                ? {
                    offers: {
                      "@type": "Offer",
                      price: product.priceUAH,
                      priceCurrency: "UAH",
                      availability: "https://schema.org/InStock",
                      url,
                    },
                  }
                : {}),
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Головна", item: SITE_URL },
                { "@type": "ListItem", position: 2, name: "Меню", item: `${SITE_URL}/menu` },
                cat && {
                  "@type": "ListItem",
                  position: 3,
                  name: cat.title,
                  item: `${SITE_URL}/menu/${cat.slug}`,
                },
                { "@type": "ListItem", position: 4, name: product.title, item: url },
              ].filter(Boolean),
            },
          ]}
        />
      }
    >
      <div className="gb-page mx-auto max-w-6xl px-6 py-16 md:px-12 lg:px-20">
        <nav className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">Головна</Link> /{" "}
          <Link to="/menu" className="hover:text-primary">Меню</Link> /{" "}
          {cat && (
            <>
              <Link to={`/menu/${cat.slug}`} className="hover:text-primary">{cat.title}</Link> /{" "}
            </>
          )}
          <span className="text-foreground">{product.title}</span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-muted lg:max-w-none">
            <img src={image} alt={product.title} className="aspect-square w-full object-cover" />
          </div>

          <div>
            {product.tags.length > 0 && (
              <div className="mb-2 flex gap-1.5">
                {product.tags.map((t) => (
                  <Tag key={t} tag={t} />
                ))}
              </div>
            )}
            <h1>{product.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Ручне ліплення · {product.unitLabel} · заморожені −18 °C
            </p>

            {SHOW_PRICES ? (
              <>
                <div className="my-5 flex items-baseline gap-3 border-y border-border py-4">
                  <span className="text-3xl font-black tabular-nums">{product.priceUAH} ₴</span>
                  <span className="text-sm text-muted-foreground">
                    за упаковку · <b className="text-foreground tabular-nums">{per100} ₴ / 100 г</b>
                  </span>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex w-max items-center overflow-hidden rounded-xl border border-border">
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Менше" className="grid h-11 w-12 place-items-center hover:bg-muted">
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-bold tabular-nums">{qty}</span>
                    <button onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="Більше" className="grid h-11 w-12 place-items-center hover:bg-muted">
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    onClick={add}
                    className="flex-1 whitespace-nowrap rounded-xl bg-primary px-6 py-3.5 font-bold text-primary-foreground transition-transform active:scale-[0.98]"
                  >
                    Додати в кошик · {product.priceUAH * qty} ₴
                  </button>
                </div>
              </>
            ) : (
              <div className="my-5 rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <p className="text-sm font-medium text-foreground/80">
                  Страва виготовляється власноруч майстринями на відкритій кухні. Наявність та асортимент уточнюйте у найближчому магазині у Чернівцях або за телефоном гарячої лінії.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={`tel:${PHONE}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 transition"
                  >
                    <Phone size={14} /> {PHONE_DISPLAY}
                  </a>
                  <Link
                    to="/shops"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-foreground hover:border-primary transition"
                  >
                    14 магазинів у Чернівцях →
                  </Link>
                </div>
              </div>
            )}

            <Tabs defaultValue="composition" className="mt-8">
              <TabsList className="scrollbar-hide flex w-full max-w-full justify-start overflow-x-auto">
                <TabsTrigger value="composition">Склад</TabsTrigger>
                <TabsTrigger value="cooking">Приготування</TabsTrigger>
                <TabsTrigger value="storage">Зберігання</TabsTrigger>
                <TabsTrigger value="allergens">Алергени</TabsTrigger>
              </TabsList>
              <TabsContent value="composition" className="text-sm text-muted-foreground">
                {product.composition}
              </TabsContent>
              <TabsContent value="cooking" className="text-sm text-muted-foreground">
                {product.cooking}
              </TabsContent>
              <TabsContent value="storage" className="text-sm text-muted-foreground">
                {product.storage}
              </TabsContent>
              <TabsContent value="allergens" className="text-sm text-muted-foreground">
                {product.allergens}
              </TabsContent>
            </Tabs>

            <div className="mt-6 grid grid-cols-4 gap-2">
              {[
                ["ккал", product.kbju.kcal],
                ["білки", product.kbju.protein],
                ["жири", product.kbju.fat],
                ["вугл.", product.kbju.carb],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-border bg-card p-3 text-center">
                  <div className="text-base font-black tabular-nums">{value}</div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">Харчова цінність на 100 г</p>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-black">З цим беруть</h2>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
};

export default ProductPage;
