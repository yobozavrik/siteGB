import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Store, ChevronDown, Sparkles, Building2, Map, Navigation, ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SEO from "@/components/SEO";

import UkraineMap from "@/components/UkraineMap";
import { cities, totalStores, totalCities, totalChains, chains } from "@/data/storeData";

const ease = [0.16, 1, 0.3, 1] as const;

const AnimatedCounter = ({ value, label, icon: Icon, delay }: { value: number; label: string; icon: typeof MapPin; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.7, ease, delay }}
    className="relative group"
  >
    <div className="absolute inset-0 rounded-3xl bg-primary/5 blur-xl group-hover:bg-primary/10 transition-all duration-700" />
    <div className="relative glass-card p-6 text-center hover:border-primary/30 transition-all duration-500 rounded-3xl">
      <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary mb-4 group-hover:from-primary/30 group-hover:to-primary/10 transition-all duration-500">
        <Icon className="h-6 w-6" />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.3, duration: 0.5 }}
        className="text-4xl font-black text-gradient-brand mb-2"
      >
        {value}+
      </motion.div>
      <p className="text-muted-foreground text-xs font-semibold uppercase tracking-[0.2em]">{label}</p>
    </div>
  </motion.div>
);

const WhereToBuyPage = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>("Київ");
  const [filterChain, setFilterChain] = useState<string | null>(null);
  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const selectedCityData = useMemo(
    () => cities.find((c) => c.name === selectedCity),
    [selectedCity]
  );

  const filteredStores = useMemo(() => {
    if (!selectedCityData) return [];
    if (!filterChain) return selectedCityData.stores;
    return selectedCityData.stores.filter((s) => s.chain === filterChain);
  }, [selectedCityData, filterChain]);

  const cityChains = useMemo(() => {
    if (!selectedCityData) return [];
    const chainSet = new Set(selectedCityData.stores.map((s) => s.chain));
    return Array.from(chainSet);
  }, [selectedCityData]);

  const displayedStores = showAllAddresses ? filteredStores : filteredStores.slice(0, 8);

  const getChainColor = (chainName: string) => {
    const chain = chains.find((c) => c.name === chainName);
    return chain?.color || "hsl(var(--muted-foreground))";
  };

  const handleCitySelect = (name: string) => {
    setSelectedCity(name);
    setFilterChain(null);
    setShowAllAddresses(false);
    mapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const siteUrl = "https://kratea-official.com";
  const whereToBuyJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "KRATEA",
      image: `${siteUrl}/og-image.jpg`,
      url: siteUrl,
      telephone: "+380 44 123 45 67",
      address: {
        "@type": "PostalAddress",
        addressCountry: "UA",
        addressLocality: "Київ",
      },
      areaServed: cities.map((c) => ({ "@type": "City", name: c.name })),
      priceRange: "199₴",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Де купити KRATEA — магазини в Україні"
        description="Знайдіть найближчі магазини, де можна купити функціональні напої KRATEA. Інтерактивна карта міст і партнерських мереж по всій Україні."
        path="/where-to-buy"
        jsonLd={whereToBuyJsonLd}
      />
      <Header />
      <CartDrawer />



      {/* Hero */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Multi-layer background */}
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: "radial-gradient(circle at 20% 20%, hsl(var(--primary)) 0%, transparent 35%), radial-gradient(circle at 80% 80%, hsl(var(--secondary)) 0%, transparent 35%), radial-gradient(circle at 50% 50%, hsl(var(--primary)) 0%, transparent 50%)"
        }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
        }} />
        
        {/* Floating decorative orbs */}
        <motion.div
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[15%] w-32 h-32 rounded-full bg-primary/10 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 15, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-10 right-[20%] w-40 h-40 rounded-full bg-secondary/10 blur-3xl"
        />

        <div className="max-w-6xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <Navigation className="h-3.5 w-3.5 text-primary" />
            <span className="text-primary text-xs font-bold tracking-[0.3em] uppercase">Карта наявності</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
            className="text-5xl font-black mb-6"
          >
            Де <span className="text-gradient-brand">купити</span>?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.25 }}
            className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed"
          >
            Інтерактивна карта точок продажу <span className="text-foreground font-semibold">KRATEA</span> по всій Україні
          </motion.p>
        </div>
      </section>

      {/* Stats infographic */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4">
          <AnimatedCounter value={totalStores} label="Точок продажу" icon={MapPin} delay={0.3} />
          <AnimatedCounter value={totalCities} label="Міст" icon={Building2} delay={0.45} />
          <AnimatedCounter value={totalChains} label="Мереж" icon={Store} delay={0.6} />
        </div>
      </section>

      {/* Partner chains showcase */}
      <section className="px-6 pb-16 relative">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "radial-gradient(circle at 50% 0%, hsl(var(--primary)) 0%, transparent 50%)"
        }} />
        <div className="max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="text-center mb-10"
          >
            <span className="text-primary text-xs font-bold tracking-[0.3em] uppercase block mb-3">Наші партнери</span>
            <h2 className="text-3xl font-black">Мережі-партнери</h2>
          </motion.div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {chains.map((chain, i) => {
              const storeCount = cities.reduce(
                (sum, city) => sum + city.stores.filter((s) => s.chain === chain.name).length, 0
              );
              const cityCount = cities.filter((c) => c.stores.some((s) => s.chain === chain.name)).length;

              return (
                <motion.div
                  key={chain.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease, delay: i * 0.08 }}
                  whileHover={{ y: -8, scale: 1.04 }}
                  className="relative group cursor-default"
                >
                  <div
                    className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ backgroundColor: chain.color, opacity: 0 }}
                  />
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500"
                    style={{ backgroundColor: chain.color }}
                  />
                  <div className="relative glass-card p-6 text-center hover:border-primary/20 transition-all duration-500 rounded-2xl overflow-hidden min-w-[140px] snap-center">
                    {/* Subtle accent line at top */}
                    <div
                      className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-0 group-hover:w-3/4 transition-all duration-500 rounded-full"
                      style={{ backgroundColor: chain.color }}
                    />
                    <div
                      className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-xl font-black transition-all duration-500 group-hover:scale-110 group-hover:rounded-xl"
                      style={{ backgroundColor: chain.color + "18", color: chain.color }}
                    >
                      {chain.name.charAt(0)}
                    </div>
                    <h3 className="text-sm font-bold mb-1.5 tracking-wide">{chain.name}</h3>
                    <p className="text-[11px] text-muted-foreground font-medium">
                      {storeCount} точок · {cityCount} міст
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Geography grid */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="text-center mb-10"
          >
            <span className="text-primary text-xs font-bold tracking-[0.3em] uppercase block mb-3">Оберіть місто</span>
            <h2 className="text-3xl font-black">Географія присутності</h2>
          </motion.div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {[...cities]
              .sort((a, b) => b.stores.length - a.stores.length)
              .map((city, i) => (
                <motion.button
                  key={city.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, ease, delay: i * 0.03 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleCitySelect(city.name)}
                  className={`glass-card p-4 text-left transition-all duration-300 rounded-2xl ${
                    selectedCity === city.name
                      ? "border-primary/40 glow-green bg-primary/5"
                      : "hover:border-primary/20"
                  }`}
                >
                  <div className="text-lg font-bold mb-1 truncate">{city.name}</div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 text-primary" />
                    <span>{city.stores.length} точок</span>
                  </div>
                </motion.button>
              ))}
          </div>
        </div>
      </section>

      {/* Interactive Map + City Detail */}
      <section className="px-6 pb-28 relative" ref={mapRef}>
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "radial-gradient(circle at 30% 50%, hsl(var(--primary)) 0%, transparent 40%), radial-gradient(circle at 70% 80%, hsl(var(--secondary)) 0%, transparent 35%)"
        }} />
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="text-center mb-10"
          >
            <span className="text-primary text-xs font-bold tracking-[0.3em] uppercase block mb-3">Інтерактивна карта</span>
            <h2 className="text-3xl font-black">Знайдіть найближчу точку</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
              className="md:col-span-3 glass-card p-4 relative overflow-hidden rounded-3xl"
            >
              {/* Map glow accent */}
              <div className="absolute -top-20 -left-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between mb-5 relative">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Map className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-xs font-bold tracking-[0.15em] uppercase text-muted-foreground">
                    Натисніть на місто
                  </span>
                </div>
                {selectedCity && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-xs font-semibold text-primary bg-primary/10 px-3.5 py-1.5 rounded-full border border-primary/20"
                  >
                    {selectedCity}
                  </motion.span>
                )}
              </div>

              <div className="aspect-[4/3] relative">
                <UkraineMap
                  cities={cities}
                  selectedCity={selectedCity}
                  onCityClick={handleCitySelect}
                />
              </div>

              {/* Chain legend */}
              <div className="mt-6 pt-5 border-t border-border/20 flex flex-wrap gap-4 justify-center">
                {chains.slice(0, 5).map((chain) => (
                  <div key={chain.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-2.5 h-2.5 rounded-full ring-2 ring-border/10" style={{ backgroundColor: chain.color }} />
                    <span className="font-medium">{chain.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* City detail panel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease, delay: 0.2 }}
              className="md:col-span-2 flex flex-col"
            >
              <AnimatePresence mode="wait">
                {selectedCityData ? (
                  <motion.div
                    key={selectedCityData.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease }}
                    className="flex flex-col h-full"
                  >
                    {/* City header */}
                    <div className="glass-card p-6 mb-4 rounded-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                      <div className="flex items-center gap-3 mb-4 relative">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10">
                          <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black">{selectedCityData.name}</h2>
                          <p className="text-xs text-muted-foreground font-medium">
                            {selectedCityData.stores.length} точок продажу
                          </p>
                        </div>
                      </div>

                      {/* Chain filter chips */}
                      <div className="flex flex-wrap gap-2 relative">
                        <button
                          onClick={() => setFilterChain(null)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border ${
                            !filterChain
                              ? "bg-primary text-primary-foreground border-primary/30 shadow-lg shadow-primary/20"
                              : "bg-muted/50 text-muted-foreground border-border/30 hover:bg-muted/80 hover:border-border/50"
                          }`}
                        >
                          Усі ({selectedCityData.stores.length})
                        </button>
                        {cityChains.map((chain) => {
                          const count = selectedCityData.stores.filter((s) => s.chain === chain).length;
                          return (
                            <button
                              key={chain}
                              onClick={() => setFilterChain(filterChain === chain ? null : chain)}
                              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border ${
                                filterChain === chain
                                  ? "bg-primary text-primary-foreground border-primary/30 shadow-lg shadow-primary/20"
                                  : "bg-muted/50 text-muted-foreground border-border/30 hover:bg-muted/80 hover:border-border/50"
                              }`}
                            >
                              {chain} ({count})
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Addresses list */}
                    <div className="glass-card p-4 flex-1 overflow-hidden rounded-2xl">
                      <div className="space-y-0.5 max-h-[400px] overflow-y-auto pr-2">
                        <AnimatePresence>
                          {displayedStores.map((store, i) => (
                            <motion.div
                              key={`${store.address}-${i}`}
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              transition={{ duration: 0.25, delay: i * 0.02 }}
                              className="flex items-center gap-3 py-3 px-3.5 rounded-xl hover:bg-muted/40 group transition-all duration-300"
                            >
                              <div
                                className="w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-offset-1 ring-offset-background"
                                style={{ backgroundColor: getChainColor(store.chain), boxShadow: `0 0 8px ${getChainColor(store.chain)}40` }}
                              />
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address + ", " + (selectedCityData?.name || ""))}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 min-w-0"
                              >
                                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{store.address}</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">{store.chain}</p>
                              </a>
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address + ", " + (selectedCityData?.name || ""))}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 group-hover:bg-primary/10 transition-all"
                              >
                                <ExternalLink className="h-3 w-3 text-primary" />
                              </a>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>

                      {filteredStores.length > 8 && (
                        <button
                          onClick={() => setShowAllAddresses(!showAllAddresses)}
                          className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-muted/30 hover:bg-muted/60 border border-border/20 hover:border-border/40 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all duration-300"
                        >
                          {showAllAddresses ? "Згорнути" : `Показати всі ${filteredStores.length} адрес`}
                          <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${showAllAddresses ? "rotate-180" : ""}`} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card p-8 text-center flex flex-col items-center justify-center h-full rounded-2xl"
                  >
                    <div className="p-4 rounded-2xl bg-muted/30 mb-4">
                      <MapPin className="h-10 w-10 text-muted-foreground/30" />
                    </div>
                    <p className="text-muted-foreground text-sm">Оберіть місто на карті</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WhereToBuyPage;
