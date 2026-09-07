import { Link } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import SEO from "@/components/SEO";
import { totalShops, totalCities, productionShops } from "@/data/shops";
import { SITE_URL } from "@/config/site";

const stats = [
  { value: "2018", label: "рік заснування мережі" },
  { value: `${totalShops}`, label: "магазинів у Чернівцях" },
  { value: "0", label: "консервантів у складі" },
  { value: "30 діб", label: "термін зберігання" },
];

const AboutPage = () => (
  <SiteLayout
    seo={
      <SEO
        title="Про нас — відкрита кухня за склом | Галя Балувана Чернівці"
        description="Домашні напівфабрикати ручного ліплення у Чернівцях з натуральних продуктів. Виробництво працює за склом просто в залі магазину."
        path="/about"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "Про Галя Балувана Чернівці",
            url: `${SITE_URL}/about`,
          },
        ]}
      />
    }
  >
    <div className="gb-page mx-auto max-w-3xl px-6 py-16 md:px-12 lg:px-20">
      <h1>Про <b>нас</b></h1>

      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        Ми почали з простої ідеї: напівфабрикати мають бути такими, які не соромно приготувати
        мамі. Тому цех у нас не заховано — він за склом просто в залі магазину. Кожен чернівчанин бачить, з
        чого й як ми ліпимо.
      </p>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        Тісто розкачуємо й защипуємо руками. Начинки готуємо щодня з простих свіжих продуктів — картопля,
        гриби, сир, м'ясо, вишня. Ніякої сої, консервантів чи замінників жиру: саме тому термін
        зберігання — до 30 діб, а не пів року.
      </p>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        Зараз мережа у Чернівцях налічує {totalShops} фірмових магазинів, у {productionShops.length} з яких діє відкрите виробництво за склом.
      </p>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="gb-stat-card p-4 text-center">
            <div className="text-2xl font-black text-primary">{s.value}</div>
            <div className="mt-1 text-[11px] text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/menu" className="rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground">
          Перейти до меню
        </Link>
        <Link to="/shops" className="rounded-full border border-border px-6 py-3 font-bold">
          Знайти магазин
        </Link>
      </div>
    </div>
  </SiteLayout>
);

export default AboutPage;
