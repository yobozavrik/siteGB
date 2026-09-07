// Postbuild: generate per-route static HTML files in dist/ so crawlers see the
// correct <title>, <meta description>, canonical, OG tags and above-the-fold
// heading WITHOUT executing JavaScript. React hydrates over it once JS loads.
// Also emits dist/sitemap.xml from the full route list.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { blogPosts } from "../src/data/blogPosts";
import { landingPages } from "../src/data/landingPages";
import { categoriesSorted, activeProducts } from "../src/data/catalog";

const BASE_URL = (process.env.VITE_SITE_URL || "https://galya-baluvana.vercel.app").replace(/\/$/, "");
const DIST = resolve("dist");
const SHELL_PATH = resolve(DIST, "index.html");

if (!existsSync(SHELL_PATH)) {
  console.warn("[prerender] dist/index.html not found — skipping.");
  process.exit(0);
}

const shell = readFileSync(SHELL_PATH, "utf-8");

interface Route {
  path: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
}

const staticRoutes: Route[] = [
  {
    path: "/",
    title: "Галя Балувана Чернівці — домашні напівфабрикати ручного ліплення",
    description:
      "Вареники, пельмені, млинці, сирники, голубці, котлети ручного ліплення у Чернівцях. Каталог продукції, 14 магазинів, відкрита кухня.",
    h1: "Домашні напівфабрикати у Чернівцях",
    intro:
      "Домашні напівфабрикати «Галя Балувана Чернівці»: тісто й начинки ручного ліплення, без сої та консервантів. 14 фірмових магазинів у місті.",
  },
  {
    path: "/menu",
    title: "Меню Галя Балувана Чернівці — каталог домашніх напівфабрикатів",
    description:
      "Повний асортимент по категоріях: вареники, пельмені, млинці, сирники, чебуреки, голубці, котлети, випічка ручного ліплення у Чернівцях.",
    h1: "Меню Галя Балувана Чернівці",
    intro: "Категорії домашніх страв ручного ліплення з натуральних продуктів. Склад, КБЖУ та спосіб приготування.",
  },
  {
    path: "/delivery",
    title: "Доставка та самовивіз — Галя Балувана Чернівці",
    description:
      "Зони й тарифи доставки по Чернівцях та передмістю, способи оплати, умови безкоштовного самовивозу з 14 магазинів у місті.",
    h1: "Доставка та самовивіз у Чернівцях",
    intro: "Доставка по місту у термобоксі. Самовивіз із 14 магазинів у Чернівцях — безкоштовно.",
  },
  {
    path: "/shops",
    title: "Магазини Галя Балувана у Чернівцях — адреси та графік роботи",
    description:
      "14 магазинів «Галя Балувана» у всіх районах Чернівців. Адреси, години роботи, відкрита кухня за склом та прямі контакти.",
    h1: "Магазини Галя Балувана у Чернівцях",
    intro: "Знайдіть найближчий магазин у вашому районі міста.",
  },
  {
    path: "/about",
    title: "Про нас — відкрита кухня за склом | Галя Балувана Чернівці",
    description:
      "Домашні напівфабрикати ручного ліплення з натуральних продуктів у Чернівцях. Виробництво працює за склом просто в залі магазину.",
    h1: "Відкрита кухня за склом",
    intro:
      "Тісто розкачуємо й защипуємо руками, начинки готуємо щодня. 14 магазинів у Чернівцях.",
  },
  {
    path: "/contacts",
    title: "Контакти — Галя Балувана Чернівці",
    description: "Телефони, Viber, Instagram та форма зворотного зв'язку у Чернівцях. Відповідаємо щодня.",
    h1: "Контакти у Чернівцях",
    intro: "Зв'яжіться з нами за телефоном +380 99 015 61 88 або напишіть у Viber.",
  },
  {
    path: "/franchise",
    title: "Франшиза Галя Балувана — відкрити магазин напівфабрикатів",
    description:
      "Умови франшизи мережі домашніх напівфабрикатів: рецептура, обладнання, навчання, маркетинг. Залиште заявку.",
    h1: "Відкрийте свій магазин «Галя Балувана»",
    intro: "Формат виробництво-магазин: цех ручного ліплення за склом і вітрина з напівфабрикатами.",
  },
  {
    path: "/blog",
    title: "Рецепти та поради — Галя Балувана",
    description:
      "Як готувати й зберігати домашні напівфабрикати, меню на тиждень, поради для святкового столу.",
    h1: "Рецепти та поради",
    intro: "Корисне про домашній смак: приготування, зберігання, планування меню.",
  },
];

const categoryRoutes: Route[] = categoriesSorted.map((c) => ({
  path: `/menu/${c.slug}`,
  title: `${c.title} — Галя Балувана`,
  description: `${c.title}: ${c.blurb} Ручне ліплення, доставка та самовивіз.`,
  h1: c.title,
  intro: c.blurb,
}));

const productRoutes: Route[] = activeProducts.map((p) => ({
  path: `/product/${p.slug}`,
  title: `${p.title} — Галя Балувана`,
  description: `${p.title}, ${p.unitLabel}. ${p.composition.slice(0, 140)}`,
  h1: p.title,
  intro: `${p.unitLabel}. ${p.cooking}`,
}));

const blogRoutes: Route[] = blogPosts.map((p) => ({
  path: `/blog/${p.slug}`,
  title: `${p.metaTitle ?? p.title} — Галя Балувана`,
  description: p.description,
  h1: p.title,
  intro: p.excerpt,
}));

const landingRoutes: Route[] = landingPages.map((p) => ({
  path: p.path,
  title: p.title,
  description: p.description,
  h1: p.h1,
  intro: p.intro,
}));

const all: Route[] = [
  ...staticRoutes,
  ...categoryRoutes,
  ...productRoutes,
  ...blogRoutes,
  ...landingRoutes,
];

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function renderHtml(route: Route): string {
  const url = `${BASE_URL}${route.path}`;
  const title = escapeHtml(route.title);
  const desc = escapeHtml(route.description);
  const h1 = escapeHtml(route.h1);
  const intro = escapeHtml(route.intro);

  let html = shell;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${desc}" />`,
  );

  const injected = `
    <link rel="canonical" href="${url}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:url" content="${url}" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${desc}" />`;
  html = html.replace(/<\/title>/, `</title>${injected}`);

  const seoBlock = `<div style="position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden" aria-hidden="true"><h1>${h1}</h1><p>${intro}</p></div>`;
  html = html.replace(/<div id="root"><\/div>/, `<div id="root">${seoBlock}</div>`);

  return html;
}

let count = 0;
for (const route of all) {
  const html = renderHtml(route);
  const outDir = route.path === "/" ? DIST : resolve(DIST, route.path.replace(/^\//, ""));
  const outFile = resolve(outDir, "index.html");
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, html);
  count++;
}

// sitemap.xml
const urls = ["/", ...all.filter((r) => r.path !== "/").map((r) => r.path)];
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) => `  <url><loc>${BASE_URL}${u}</loc></url>`).join("\n") +
  `\n</urlset>\n`;
writeFileSync(resolve(DIST, "sitemap.xml"), sitemap);

console.log(`[prerender] wrote ${count} static HTML files + sitemap.xml (${urls.length} urls).`);
