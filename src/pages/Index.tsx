import SiteLayout from "@/components/SiteLayout";
import SEO from "@/components/SEO";
import HeroSection from "@/components/HeroSection";
import FAQSection from "@/components/FAQSection";
import {
  MenuSection,
  HitsSection,
  WhySection,
  ProcessShowcase,
  ShopsSection,
  BlogSection,
  FeedbackSection,
  FranchiseSection,
} from "@/components/GalyaSections";
import { faqItems } from "@/data/faq";
import { activeProducts } from "@/data/catalog";
import { SITE_URL, BRAND, PHONE } from "@/config/site";

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
    address: { "@type": "PostalAddress", addressCountry: "UA", addressLocality: "Київ" },
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
    image: `${SITE_URL}${p.images[0]}`,
    category: p.categorySlug,
    offers: {
      "@type": "Offer",
      price: p.priceUAH,
      priceCurrency: "UAH",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/product/${p.slug}`,
    },
  })),
];

const Index = () => (
  <SiteLayout
    offsetHeader={false}
    seo={
      <SEO
        title="Галя Балувана — домашні напівфабрикати ручного ліплення"
        description="Вареники, пельмені, млинці, сирники ручного ліплення. Меню з цінами, доставка та самовивіз, карта магазинів по Україні."
        path="/"
        jsonLd={jsonLd}
      />
    }
  >
    <HeroSection />
    <MenuSection />
    <HitsSection />
    <WhySection />
    <ProcessShowcase />
    <ShopsSection />
    <BlogSection />
    <FAQSection />
    <FeedbackSection />
    <FranchiseSection />
  </SiteLayout>
);

export default Index;
