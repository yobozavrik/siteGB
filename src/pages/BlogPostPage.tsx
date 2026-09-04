import { motion } from "framer-motion";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SEO from "@/components/SEO";
import { blogPosts, getPostBySlug } from "@/data/blogPosts";
import { SITE_URL } from "@/config/site";

const ease = [0.16, 1, 0.3, 1] as const;

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) return <Navigate to="/blog" replace />;

  const url = `${SITE_URL}/blog/${post.slug}`;
  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.date,
      url,
      mainEntityOfPage: url,
      author: { "@type": "Organization", name: "Галя Балувана", url: SITE_URL },
      publisher: {
        "@type": "Organization",
        name: "Галя Балувана",
        logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.png` },
      },
      keywords: post.tags.join(", "),
      image: `${SITE_URL}/og-image.jpg`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Головна", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Блог", item: `${SITE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO title={`${post.metaTitle ?? post.title} — Галя Балувана`} description={post.description} path={`/blog/${post.slug}`} type="article" jsonLd={jsonLd} />
      <Header />
      <CartDrawer />

      <article className="pt-32 section-padding">
        <div className="max-w-3xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-primary mb-8">
            <ArrowLeft className="h-4 w-4" /> Назад до блогу
          </Link>

          <motion.header
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="mb-10"
          >
            <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/50 mb-4">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(post.date).toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" })}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readingTime}
              </span>
              <span className="inline-flex items-center gap-1 text-primary">
                <Tag className="h-3 w-3" />
                {post.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-6">{post.title}</h1>
            <p className="text-lg text-foreground/70 leading-relaxed">{post.description}</p>
          </motion.header>

          <div className="prose-content space-y-6">
            {post.content.map((block, idx) => {
              if (block.type === "p") return <p key={idx} className="text-foreground/80 leading-relaxed text-lg">{block.text}</p>;
              if (block.type === "h2") return <h2 key={idx} className="text-2xl md:text-3xl font-bold mt-10 mb-2">{block.text}</h2>;
              if (block.type === "h3") return <h3 key={idx} className="text-xl font-bold mt-6 mb-1">{block.text}</h3>;
              if (block.type === "ul")
                return (
                  <ul key={idx} className="space-y-2 pl-5 list-disc text-foreground/80">
                    {block.items.map((it, i) => <li key={i}>{it}</li>)}
                  </ul>
                );
              if (block.type === "quote")
                return (
                  <blockquote key={idx} className="border-l-4 border-primary pl-5 italic text-foreground/70 text-lg">
                    {block.text}
                  </blockquote>
                );
              return null;
            })}
          </div>

          <div className="mt-12 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span key={t} className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary/80">
                #{t.replace(/\s+/g, "")}
              </span>
            ))}
          </div>

          <div className="mt-12 glass-card p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">Замовити напівфабрикати</h2>
            <p className="text-foreground/60 mb-6">Домашнє ручного ліплення — з доставкою або самовивозом.</p>
            <Link to="/menu" className="inline-block px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition">
              Перейти до меню
            </Link>
          </div>

          {related.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Читайте також</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {related.map((r) => (
                  <Link key={r.slug} to={`/blog/${r.slug}`} className="glass-surface p-5 hover:border-primary/40 transition-colors">
                    <h3 className="font-bold mb-2">{r.title}</h3>
                    <p className="text-sm text-foreground/60 line-clamp-3">{r.excerpt}</p>
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

export default BlogPostPage;
