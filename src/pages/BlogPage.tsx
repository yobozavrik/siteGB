import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Clock, Tag } from "lucide-react";
import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SEO from "@/components/SEO";
import { blogPosts } from "@/data/blogPosts";
import { SITE_URL } from "@/config/site";

const ease = [0.16, 1, 0.3, 1] as const;

const typeFilters = [
  { value: "all", label: "Усі матеріали" },
  { value: "news", label: "Новини" },
  { value: "story", label: "Історії" },
  { value: "blog", label: "Блог" },
  { value: "lifehack", label: "Лайфхаки" },
] as const;

const BlogPage = () => {
  const [activeType, setActiveType] = useState<(typeof typeFilters)[number]["value"]>("all");
  const [activeYear, setActiveYear] = useState("all");
  const years = useMemo(
    () => [...new Set(blogPosts.map((post) => post.date.slice(0, 4)))].sort((a, b) => b.localeCompare(a)),
    [],
  );
  const visiblePosts = useMemo(
    () => blogPosts.filter((post) => (activeType === "all" || post.type === activeType) && (activeYear === "all" || post.date.startsWith(activeYear))),
    [activeType, activeYear],
  );
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Блог — Галя Балувана",
      url: `${SITE_URL}/blog`,
      description:
        "Як готувати й зберігати домашні напівфабрикати, меню на тиждень, поради для святкового столу.",
      blogPost: blogPosts.map((p) => ({
        "@type": "BlogPosting",
        headline: p.title,
        description: p.description,
        datePublished: p.date,
        url: `${SITE_URL}/blog/${p.slug}`,
        author: { "@type": "Organization", name: "Галя Балувана" },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Головна", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Новини", item: `${SITE_URL}/blog` },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Блог та Новини — Галя Балувана Чернівці"
        description="Новини мережі у Чернівцях, кулінарні секрети, рецепти та лайфхаки про домашні напівфабрикати ручного ліплення."
        path="/blog"
        type="website"
        jsonLd={jsonLd}
      />
      <Header />
      <CartDrawer />

      <section className="pt-20">
        <div className="gb-page max-w-6xl mx-auto px-6 py-16 md:px-12 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="text-center mb-16"
          >
            <h1>Блог та <b>Новини</b></h1>
            <p className="text-xl text-foreground/60 max-w-3xl mx-auto leading-relaxed">
              Новини мережі Галя Балувана Чернівці, секрети відкритої кухні, рецепти та корисні лайфхаки для ідеального приготування страв.
            </p>
          </motion.div>

          <div className="mb-10 space-y-4" aria-label="Фільтри блогу">
            <div className="flex flex-wrap justify-center gap-2">
              {typeFilters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveType(filter.value)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeType === filter.value ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary hover:bg-primary/20"}`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <button type="button" onClick={() => setActiveYear("all")} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${activeYear === "all" ? "bg-foreground text-background" : "bg-muted text-foreground/70 hover:bg-muted/70"}`}>Усі роки</button>
              {years.map((year) => (
                <button key={year} type="button" onClick={() => setActiveYear(year)} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${activeYear === year ? "bg-foreground text-background" : "bg-muted text-foreground/70 hover:bg-muted/70"}`}>{year}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visiblePosts.map((post, i) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.1 + i * 0.08 }}
                className="glass-card p-6 group hover:border-primary/40 transition-colors flex flex-col"
              >
                <div className="flex items-center gap-3 text-xs text-foreground/50 mb-3">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {post.displayDate ?? new Date(post.date).toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readingTime}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-xs text-primary mb-3">
                  <Tag className="h-3 w-3" />
                  {post.category}
                </span>
                <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="text-foreground/60 text-sm leading-relaxed mb-4 flex-1">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="text-[11px] px-2 py-1 rounded-full bg-primary/10 text-primary/80"
                    >
                      #{t.replace(/\s+/g, "")}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/blog/${post.slug}`}
                  className="text-sm font-semibold text-primary hover:underline mt-auto"
                  aria-label={`Читати: ${post.title}`}
                >
                  Читати статтю →
                </Link>
              </motion.article>
            ))}
          </div>
          {visiblePosts.length === 0 && <p className="py-14 text-center text-foreground/60">За цими фільтрами матеріалів поки немає.</p>}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPage;
