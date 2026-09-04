import { useState } from "react";
import { MapPin, Clock, Phone } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import SEO from "@/components/SEO";
import UkraineMap from "@/components/UkraineMap";
import { shops, citiesWithCounts, totalShops, totalCities, productionShops } from "@/data/shops";
import { SITE_URL } from "@/config/site";

const ShopsPage = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>("Київ");

  const mapCities = citiesWithCounts.map((c) => ({
    name: c.city,
    x: c.x,
    y: c.y,
    stores: Array.from({ length: c.count }),
  }));

  const visible = selectedCity ? shops.filter((s) => s.city === selectedCity) : shops;

  return (
    <SiteLayout
      seo={
        <SEO
          title="Магазини Галя Балувана — адреси та графік по Україні"
          description={`${totalShops} магазинів у ${totalCities} містах. Виберіть місто, щоб побачити адреси, години роботи й телефони.`}
          path="/shops"
          jsonLd={[
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Головна", item: SITE_URL },
                { "@type": "ListItem", position: 2, name: "Магазини", item: `${SITE_URL}/shops` },
              ],
            },
          ]}
        />
      }
    >
      <div className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-sm font-bold uppercase tracking-[.25em] text-primary">Наші магазини</p>
        <h1 className="mt-3 text-4xl font-black md:text-5xl">Знайдіть Галя Балувана у своєму місті</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          {totalShops} магазинів у {totalCities} містах, у {productionShops.length} з них — виробництво
          за склом. Оберіть місто на мапі.
        </p>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="aspect-[100/85] w-full">
              <UkraineMap cities={mapCities} selectedCity={selectedCity} onCityClick={setSelectedCity} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {citiesWithCounts.map((c) => (
                <button
                  key={c.city}
                  onClick={() => setSelectedCity(c.city)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    selectedCity === c.city
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary"
                  }`}
                >
                  {c.city} · {c.count}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black">
              {selectedCity ?? "Усі міста"}{" "}
              <span className="text-sm font-normal text-muted-foreground">· {visible.length}</span>
            </h2>
            <div className="mt-4 space-y-3">
              {visible.map((s) => (
                <article key={s.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <p className="font-bold">
                        {s.address}
                        {s.district ? ` · ${s.district}` : ""}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" /> {s.hours}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" /> {s.phone}
                      </p>
                      {s.features.length > 0 && (
                        <p className="mt-2 flex flex-wrap gap-1.5">
                          {s.features.map((f) => (
                            <span key={f} className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                              {f}
                            </span>
                          ))}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
};

export default ShopsPage;
