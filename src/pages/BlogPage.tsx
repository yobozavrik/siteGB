import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Clock, Tag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SEO from "@/components/SEO";
import { blogPosts } from "@/data/blogPosts";
import { SITE_URL } from "@/config/site";

const ease = [0.16, 1, 0.3, 1] as const;

const BlogPage = () => {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Рецепти та поради — Галя Балувана",
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
        { "@type": "ListItem", position: 2, name: "Блог", item: `${SITE_URL}/blog` },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Рецепти та поради — Галя Балувана"
        description="Як правильно варити й смажити заморожені напівфабрикати, скільки їх зберігати, меню на тиждень і поради для святкового столу."
        path="/blog"
        type="website"
        jsonLd={jsonLd}
      />
      <Header />
      <CartDrawer />

      <section className="pt-32 section-padding">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-black mb-6">Рецепти та поради</h1>
            <p className="text-xl text-foreground/60 max-w-3xl mx-auto leading-relaxed">
              Як готувати й зберігати домашні напівфабрикати, що приготувати на тиждень і на свято.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, i) => (
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
                    {new Date(post.date).toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" })}
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
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPage;
