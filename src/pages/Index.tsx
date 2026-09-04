import SiteLayout from "@/components/SiteLayout";
import SEO from "@/components/SEO";
import HeroSection from "@/components/HeroSection";
import {
  MenuSection,
  HitsSection,
  WhySection,
  ShopsSection,
  BlogSection,
  FeedbackSection,
  FranchiseSection,
} from "@/components/GalyaSections";
import { SITE_URL } from "@/config/site";

const Index = () => (
  <SiteLayout
    offsetHeader={false}
    seo={
      <SEO
        title="Галя Балувана — домашні напівфабрикати ручного ліплення"
        description="Вареники, пельмені, млинці, сирники ручного ліплення. Меню з цінами, доставка та самовивіз, карта магазинів по Україні."
        path="/"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "FoodEstablishment",
            name: "Галя Балувана",
            servesCuisine: "Ukrainian",
            url: SITE_URL,
            image: `${SITE_URL}/og-image.jpg`,
            priceRange: "₴₴",
          },
        ]}
      />
    }
  >
    <HeroSection />
    <MenuSection />
    <HitsSection />
    <WhySection />
    <ShopsSection />
    <BlogSection />
    <FeedbackSection />
    <FranchiseSection />
  </SiteLayout>
);

export default Index;
