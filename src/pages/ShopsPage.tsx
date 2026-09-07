import { useState, useMemo } from "react";
import { MapPin, Clock, Phone, Search, ExternalLink, Sparkles } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import SEO from "@/components/SEO";
import { shops, districts, totalShops, productionShops } from "@/data/shops";
import { SITE_URL, PHONE_DISPLAY, PHONE } from "@/config/site";

const ShopsPage = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Усі райони");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyProduction, setOnlyProduction] = useState<boolean>(false);

  const filteredShops = useMemo(() => {
    return shops.filter((s) => {
      const matchDistrict = selectedDistrict === "Усі райони" || s.district.includes(selectedDistrict);
      const matchSearch =
        searchQuery.trim() === "" ||
        s.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchProduction = !onlyProduction || s.isProduction;

      return matchDistrict && matchSearch && matchProduction;
    });
  }, [selectedDistrict, searchQuery, onlyProduction]);

  return (
    <SiteLayout
      seo={
        <SEO
          title="Магазини Галя Балувана у Чернівцях — адреси, графік роботи та телефони"
          description={`Мережа ${totalShops} магазинів домашніх напівфабрикатів у Чернівцях. Адреси, графік роботи, відкрите виробництво за склом та телефони.`}
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
      <div className="gb-page mx-auto max-w-7xl px-6 py-16 md:px-12 lg:px-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-3">
              <MapPin size={14} /> Місто Чернівці
            </div>
            <h1>Наші <b>Магазини у Чернівцях</b></h1>
            <p className="gb-page__lead">
              {totalShops} фірмових магазинів у різних районах міста. У {productionShops.length} із них страви ліплять просто на ваших очах на кухні «за склом».
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`tel:${PHONE}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm hover:opacity-90 transition"
            >
              <Phone size={16} /> Гаряча лінія: {PHONE_DISPLAY}
            </a>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="mt-8 rounded-2xl bg-muted/40 p-6 border border-border/70">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Пошук за вулицею або районом (наприклад: Майдан, Руська, Центр)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {/* Toggle production only */}
            <button
              type="button"
              onClick={() => setOnlyProduction(!onlyProduction)}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition whitespace-nowrap ${
                onlyProduction
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground/80 hover:border-primary/50"
              }`}
            >
              <Sparkles size={14} /> Тільки відкрита кухня за склом ({productionShops.length})
            </button>
          </div>

          {/* District buttons */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground mr-1">Район:</span>
            {districts.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDistrict(d)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  selectedDistrict === d
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-background border border-border text-foreground/70 hover:border-primary/50"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Store Cards Grid */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-muted-foreground">
              Знайдено локацій: <span className="text-foreground font-bold">{filteredShops.length}</span>
            </p>
          </div>

          {filteredShops.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
              <MapPin className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="font-semibold">За вашим запитом магазинів не знайдено</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedDistrict("Усі райони");
                  setSearchQuery("");
                  setOnlyProduction(false);
                }}
                className="mt-3 text-xs font-bold text-primary hover:underline"
              >
                Скинути фільтри
              </button>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredShops.map((s) => {
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  s.mapQuery || `${s.address}, ${s.city}`
                )}`;

                return (
                  <article
                    key={s.id}
                    className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                          {s.district}
                        </span>
                        {s.isProduction && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 text-[11px] font-bold">
                            <Sparkles size={11} /> Кухня за склом
                          </span>
                        )}
                      </div>

                      <h2 className="text-lg font-black text-foreground group-hover:text-primary transition-colors flex items-start gap-2">
                        <MapPin className="mt-1 h-4 w-4 shrink-0 text-primary" />
                        <span>{s.address}</span>
                      </h2>

                      <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                        <p className="flex items-center gap-2">
                          <Clock className="h-4 w-4 shrink-0 text-foreground/60" />
                          <span>{s.hours}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone className="h-4 w-4 shrink-0 text-foreground/60" />
                          <a href={`tel:${s.phone.replace(/[\s()\-]/g, "")}`} className="font-semibold text-foreground hover:text-primary">
                            {s.phone}
                          </a>
                        </p>
                      </div>

                      {s.features.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {s.features.map((f) => (
                            <span
                              key={f}
                              className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground/75"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between gap-3">
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                      >
                        <ExternalLink size={13} /> Відкрити в Google Maps
                      </a>
                      <a
                        href={`tel:${s.phone.replace(/[\s()\-]/g, "")}`}
                        className="rounded-lg bg-muted px-3 py-1.5 text-xs font-bold text-foreground/80 hover:bg-primary hover:text-primary-foreground transition"
                      >
                        Зателефонувати
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
};

export default ShopsPage;
