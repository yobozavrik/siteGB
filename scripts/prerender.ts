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
    title: "Галя Балувана — домашні напівфабрикати ручного ліплення",
    description:
      "Вареники, пельмені, млинці, сирники ручного ліплення. Меню з цінами, доставка та самовивіз, карта магазинів по Україні.",
    h1: "Приділіть свій час коханим",
    intro:
      "Домашні напівфабрикати «Галя Балувана»: тісто й начинки ручного ліплення, без сої та консервантів. Доставка по місту і самовивіз із магазину.",
  },
  {
    path: "/menu",
    title: "Меню — домашні напівфабрикати Галя Балувана",
    description:
      "Повне меню: вареники, пельмені, млинці, сирники, чебуреки, голубці, котлети та десерти. Ціни за упаковку і за 100 г.",
    h1: "Меню",
    intro: "Вісім категорій ручного ліплення з натуральних продуктів.",
  },
  {
    path: "/delivery",
    title: "Доставка та оплата — Галя Балувана",
    description:
      "Зони й тарифи доставки по Києву та Україні, способи оплати, умови самовивозу з магазину.",
    h1: "Доставка та оплата",
    intro: "Доставляємо щодня у день замовлення. Самовивіз із магазину — безкоштовно.",
  },
  {
    path: "/shops",
    title: "Магазини Галя Балувана — адреси та графік по Україні",
    description:
      "Магазини «Галя Балувана» у Києві, Львові, Одесі, Дніпрі, Харкові та інших містах. Адреси, години роботи, телефони.",
    h1: "Знайдіть Галя Балувана у своєму місті",
    intro: "Оберіть місто, щоб побачити адреси, графік і телефони магазинів.",
  },
  {
    path: "/about",
    title: "Про нас — кухня за склом | Галя Балувана",
    description:
      "Домашні напівфабрикати ручного ліплення з натуральних продуктів. Виробництво працює за склом просто в магазині.",
    h1: "Кухня за склом",
    intro:
      "Тісто розкачуємо й защипуємо руками, начинки готуємо щодня. Без сої, консервантів і замінників жиру.",
  },
  {
    path: "/contacts",
    title: "Контакти — Галя Балувана",
    description: "Телефон, пошта, соцмережі та форма зворотного зв'язку. Відповідаємо у робочі години.",
    h1: "Контакти",
    intro: "Зв'яжіться з нами — відповімо протягом робочого дня.",
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
  title: `${p.title} — купити, ${p.priceUAH} ₴ | Галя Балувана`,
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
