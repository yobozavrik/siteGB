import SiteLayout from "@/components/SiteLayout";
import SEO from "@/components/SEO";
import OfficialHome from "@/components/OfficialHome";
import { faqItems } from "@/data/faq";
import { activeProducts, productImage } from "@/data/catalog";
import { SITE_URL, BRAND, PHONE, SHOW_PRICES } from "@/config/site";

const featured = activeProducts.filter((p) => p.tags.includes("hit")).slice(0, 3);

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.png`,
    description: "Магазин домашніх напівфабрикатів ручного ліплення.",
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND,
    url: SITE_URL,
  },
  {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: BRAND,
    servesCuisine: "Ukrainian",
    url: SITE_URL,
    image: `${SITE_URL}/og-image.jpg`,
    telephone: PHONE,
    priceRange: "₴₴",
    address: { "@type": "PostalAddress", addressCountry: "UA", addressLocality: "Чернівці" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
  ...featured.map((p) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    description: p.composition,
    image: `${SITE_URL}${productImage(p)}`,
    category: p.categorySlug,
    url: `${SITE_URL}/product/${p.slug}`,
    ...(SHOW_PRICES
      ? {
          offers: {
            "@type": "Offer",
            price: p.priceUAH,
            priceCurrency: "UAH",
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/product/${p.slug}`,
          },
        }
      : {}),
  })),
];

const Index = () => (
  <SiteLayout
    offsetHeader={false}
    seo={
      <SEO
        title="Галя Балувана Чернівці — домашні напівфабрикати ручного ліплення"
        description="Вареники, пельмені, млинці, сирники, голубці, котлети ручного ліплення у Чернівцях. Каталог продукції, адреси 14 магазинів у місті, відкрита кухня."
        path="/"
        jsonLd={jsonLd}
      />
    }
  >
    <OfficialHome />
  </SiteLayout>
);

export default Index;
