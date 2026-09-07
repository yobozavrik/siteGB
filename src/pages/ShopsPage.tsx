import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { MapPin, Clock, Phone, Search, ExternalLink, Sparkles, X } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import SEO from "@/components/SEO";
import ShopsMap from "@/components/ShopsMap";
import { shops, districts, totalShops, productionShops } from "@/data/shops";
import { SITE_URL, PHONE_DISPLAY, PHONE } from "@/config/site";

const ALL = "Усі райони";
const tel = (p: string) => `tel:${p.replace(/[\s()\-]/g, "")}`;
const mapsUrl = (address: string, city: string, query?: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || `${address}, ${city}`)}`;

const ShopsPage = () => {
  const [params, setParams] = useSearchParams();
  const reduce = useReducedMotion();

  const [selectedDistrict, setSelectedDistrict] = useState(ALL);
  const [query, setQuery] = useState("");
  const [onlyProduction, setOnlyProduction] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(params.get("shop"));

  const cardRefs = useRef<Record<string, HTMLElement | null>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return shops.filter((s) => {
      const matchDistrict = selectedDistrict === ALL || s.district.includes(selectedDistrict);
      const matchSearch =
        q === "" ||
        s.address.toLowerCase().includes(q) ||
        s.district.toLowerCase().includes(q) ||
        s.features.some((f) => f.toLowerCase().includes(q));
      const matchProduction = !onlyProduction || s.isProduction;
      return matchDistrict && matchSearch && matchProduction;
    });
  }, [selectedDistrict, query, onlyProduction]);

  // Keep ?shop= in the URL so a chosen store is shareable / deep-linkable.
  useEffect(() => {
    const next = new URLSearchParams(params);
    if (activeId) next.set("shop", activeId);
    else next.delete("shop");
    if (next.toString() !== params.toString()) setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  // Scroll the matching card into view when a pin is picked on the map.
  useEffect(() => {
    if (!activeId) return;
    const el = cardRefs.current[activeId];
    if (el) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
  }, [activeId, reduce]);

  const resetFilters = () => {
    setSelectedDistrict(ALL);
    setQuery("");
    setOnlyProduction(false);
  };

  const activeShop = activeId ? shops.find((s) => s.id === activeId) : null;

  return (
    <SiteLayout
      seo={
        <SEO
          title="Магазини Галя Балувана у Чернівцях — адреси, графік роботи та телефони"
          description={`Мережа ${totalShops} магазинів домашніх напівфабрикатів у Чернівцях. Інтерактивна мапа, адреси, графік роботи, відкрите виробництво за склом і телефони.`}
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
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: shops.map((s, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: {
                  "@type": "GroceryStore",
                  name: `Галя Балувана — ${s.address}`,
                  address: { "@type": "PostalAddress", streetAddress: s.address, addressLocality: s.city, addressCountry: "UA" },
                  telephone: s.phone,
                  geo: { "@type": "GeoCoordinates", latitude: s.lat, longitude: s.lng },
                },
              })),
            },
          ]}
        />
      }
    >
      <div className="gb-page mx-auto max-w-7xl px-6 py-14 md:px-10 lg:px-16">
        <header className="max-w-2xl">
          <span className="eyebrow">
            <MapPin size={13} /> Місто Чернівці
          </span>
          <h1 className="mt-3">
            Магазини <b>у Чернівцях</b>
          </h1>
          <p className="gb-page__lead">
            {totalShops} фірмових магазинів у різних районах міста. У {productionShops.length} із них страви ліплять
            просто на ваших очах — на кухні «за склом».
          </p>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          {/* ---- Left: filters + list ------------------------------------ */}
          <div className="order-2 lg:order-1">
            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                inputMode="search"
                placeholder="Пошук за вулицею, районом або послугою…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Пошук магазину"
                className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-10 text-sm outline-none transition focus:border-secondary focus:ring-4 focus:ring-secondary/15"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Очистити пошук"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* District chips + production toggle */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {districts.map((d) => (
                <button
                  key={d}
                  type="button"
                  className="gb-filter"
                  data-active={selectedDistrict === d}
                  onClick={() => setSelectedDistrict(d)}
                >
                  {d}
                </button>
              ))}
              <button
                type="button"
                className="gb-filter inline-flex items-center gap-1.5"
                data-active={onlyProduction}
                onClick={() => setOnlyProduction((v) => !v)}
              >
                <Sparkles size={13} /> Кухня за склом ({productionShops.length})
              </button>
            </div>

            <p className="mt-5 text-sm font-semibold text-muted-foreground">
              Знайдено локацій: <span className="text-foreground">{filtered.length}</span> із {totalShops}
            </p>

            {filtered.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                <MapPin className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
                <p className="font-semibold text-foreground">Нічого не знайшлося за цим запитом</p>
                <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
                  Спробуйте іншу вулицю або оберіть район зі списку вище — наприклад «Центр», «Південний» чи
                  «Гравітон».
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 text-sm font-semibold text-primary hover:underline"
                >
                  Скинути фільтри
                </button>
              </div>
            ) : (
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {filtered.map((s, i) => {
                  const isActive = s.id === activeId;
                  return (
                    <motion.li
                      key={s.id}
                      ref={(el) => {
                        cardRefs.current[s.id] = el;
                      }}
                      initial={reduce ? false : { opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.35, delay: Math.min(i, 6) * 0.04 }}
                    >
                      <article
                        onMouseEnter={() => setActiveId(s.id)}
                        onFocusCapture={() => setActiveId(s.id)}
                        className={`flex h-full flex-col justify-between rounded-2xl border bg-card p-5 transition-all ${
                          isActive
                            ? "border-secondary shadow-[0_16px_40px_-24px_hsl(25_22%_11%/0.35)]"
                            : "border-border hover:border-secondary/60"
                        }`}
                      >
                        <div>
                          <div className="mb-2 flex flex-wrap items-center gap-1.5">
                            <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                              {s.district}
                            </span>
                            {s.isProduction && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                                <Sparkles size={11} /> Кухня за склом
                              </span>
                            )}
                          </div>

                          <h2 className="flex items-start gap-2 text-base font-bold leading-snug text-foreground">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                            <span>{s.address}</span>
                          </h2>

                          <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 shrink-0 text-foreground/50" />
                            {s.hours}
                          </p>
                          <p className="mt-1.5 flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 shrink-0 text-foreground/50" />
                            <a href={tel(s.phone)} className="font-semibold text-foreground hover:text-primary">
                              {s.phone}
                            </a>
                          </p>

                          {s.features.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {s.features.map((f) => (
                                <span
                                  key={f}
                                  className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground/70"
                                >
                                  {f}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-3">
                          <button
                            type="button"
                            onClick={() => setActiveId(s.id)}
                            className="text-xs font-semibold text-secondary hover:text-primary"
                          >
                            Показати на мапі
                          </button>
                          <a
                            href={mapsUrl(s.address, s.city, s.mapQuery)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                          >
                            <ExternalLink size={12} /> Google Maps
                          </a>
                        </div>
                      </article>
                    </motion.li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* ---- Right: sticky map ------------------------------------- */}
          <div className="order-1 lg:order-2">
            <div className="lg:sticky lg:top-24">
              <ShopsMap shops={filtered} activeId={activeId} onSelect={setActiveId} className="h-[380px] lg:h-[560px]" />
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" /> Кухня за склом
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-secondary" /> Магазин
                </span>
                {activeShop && (
                  <span className="ml-auto font-semibold text-foreground">{activeShop.address}</span>
                )}
              </div>
              <a
                href={`tel:${PHONE}`}
                className="btn-primary mt-4 w-full"
              >
                <Phone size={16} /> Гаряча лінія: {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
};

export default ShopsPage;
