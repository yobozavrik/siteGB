import { motion } from "framer-motion";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SEO from "@/components/SEO";
import { getLandingBySlug, landingPages } from "@/data/landingPages";

const SITE_URL = "https://kratea-official.com";
const ease = [0.16, 1, 0.3, 1] as const;

const LandingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  // Support both /slug routes and /:slug param
  const resolvedSlug = slug ?? window.location.pathname.replace(/^\//, "");
  const page = getLandingBySlug(resolvedSlug);

  if (!page) return <Navigate to="/" replace />;

  const url = `${SITE_URL}${page.path}`;
  const related = landingPages
    .filter((p) => p.slug !== page.slug && p.category === page.category)
    .slice(0, 3);

  // Generate FAQPage schema from page H2 sections (boosts rich results & indexing)
  const faqEntities: { question: string; answer: string }[] = [];
  for (let i = 0; i < page.sections.length; i++) {
    const s = page.sections[i];
    if (s.type === "h2" && s.text) {
      const next = page.sections[i + 1];
      let answer = "";
      if (next?.type === "p" && next.text) answer = next.text;
      else if (next?.type === "ul" && next.items) answer = next.items.join(". ");
      if (answer) faqEntities.push({ question: s.text, answer });
    }
  }

  const jsonLd: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.title,
      description: page.description,
      url,
      inLanguage: "uk-UA",
      isPartOf: { "@type": "WebSite", name: "KRATEA", url: SITE_URL },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Головна", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: page.h1, item: url },
      ],
    },
  ];

  if (faqEntities.length >= 2) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqEntities.slice(0, 6).map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={page.title}
        description={page.description}
        path={page.path}
        type="website"
        jsonLd={jsonLd}
      />
      <Header />
      <CartDrawer />

      <article className="pt-32 section-padding">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-primary mb-8">
            <ArrowLeft className="h-4 w-4" /> На головну
          </Link>

          <motion.header
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-6">{page.h1}</h1>
            <p className="text-lg text-foreground/70 leading-relaxed">{page.intro}</p>
          </motion.header>

          <div className="space-y-6">
            {page.sections.map((s, i) => {
              if (s.type === "h2")
                return <h2 key={i} className="text-2xl md:text-3xl font-bold mt-10 mb-2">{s.text}</h2>;
              if (s.type === "h3")
                return <h3 key={i} className="text-xl font-bold mt-6 mb-1">{s.text}</h3>;
              if (s.type === "p")
                return <p key={i} className="text-foreground/80 leading-relaxed text-lg">{s.text}</p>;
              if (s.type === "ul")
                return (
                  <ul key={i} className="space-y-3">
                    {s.items?.map((it, idx) => (
                      <li key={idx} className="flex gap-3 text-foreground/80 text-lg">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-1" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                );
              return null;
            })}
          </div>

          <div className="mt-12 glass-card p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">{page.ctaText}</h2>
            <p className="text-foreground/60 mb-6">Натуральні функціональні напої з доставкою по всій Україні. 199₴ за банку.</p>
            <Link to="/#products" className="inline-block px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition">
              Обрати смак
            </Link>
          </div>

          {related.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Читайте також</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {related.map((r) => (
                  <Link key={r.slug} to={r.path} className="glass-surface p-5 hover:border-primary/40 transition-colors">
                    <h3 className="font-bold mb-2">{r.h1}</h3>
                    <p className="text-sm text-foreground/60 line-clamp-3">{r.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default LandingPage;
