// Postbuild: generate per-route static HTML files in dist/ so Googlebot
// sees correct <title>, <meta description>, canonical, OG tags, and
// above-the-fold content WITHOUT executing JavaScript.
// React hydrates over the static HTML once JS loads.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { blogPosts } from "../src/data/blogPosts";
import { landingPages } from "../src/data/landingPages";

const BASE_URL = "https://kratea-official.com";
const DIST = resolve("dist");
const SHELL_PATH = resolve(DIST, "index.html");

if (!existsSync(SHELL_PATH)) {
  console.warn("[prerender] dist/index.html not found — skipping.");
  process.exit(0);
}

const shell = readFileSync(SHELL_PATH, "utf-8");

interface Route {
  path: string; // "/about", "/blog/foo", "/"
  title: string;
  description: string;
  h1: string;
  intro: string;
}

const staticRoutes: Route[] = [
  {
    path: "/",
    title: "KRATEA — Функціональні напої | Power of Nature",
    description:
      "KRATEA — натуральні функціональні напої з кава-кава, канни та GABA. Енергія, спокій та гармонія від GoldProduct.",
    h1: "KRATEA — функціональні напої з силою природи",
    intro:
      "Натуральні напої KRATEA з кава-кава, канни та GABA. М'яка енергія, фокус і спокій без цукру та синтетичного кофеїну. Доставка по всій Україні.",
  },
  {
    path: "/about",
    title: "Про KRATEA — натуральні функціональні напої від GoldProduct",
    description:
      "Історія KRATEA: бренд функціональних напоїв з натуральними адаптогенами. Наша місія, склад та філософія.",
    h1: "Про KRATEA",
    intro:
      "KRATEA — український бренд функціональних напоїв з натуральними адаптогенами кава-кава, канни та GABA.",
  },
  {
    path: "/where-to-buy",
    title: "Де купити KRATEA — магазини та доставка по Україні",
    description:
      "Купити KRATEA у Києві, Львові, Одесі, Харкові, Дніпрі та по всій Україні. Список партнерських магазинів та онлайн-доставка.",
    h1: "Де купити KRATEA",
    intro:
      "KRATEA доступний у партнерських мережах магазинів по всій Україні, а також з онлайн-доставкою Новою Поштою.",
  },
  {
    path: "/collaboration",
    title: "Співпраця з KRATEA — оптові поставки та партнерство",
    description:
      "Оптові поставки KRATEA для магазинів, кафе та фітнес-клубів. Умови партнерства та форма заявки.",
    h1: "Співпраця з KRATEA",
    intro:
      "Запрошуємо магазини, кафе, фітнес-клуби та дистриб'юторів до співпраці з брендом KRATEA.",
  },
  {
    path: "/contact",
    title: "Контакти KRATEA — зв'яжіться з нами",
    description:
      "Зв'яжіться з командою KRATEA. Телефон, email, соціальні мережі — ми на зв'язку щодня.",
    h1: "Контакти",
    intro: "Зв'яжіться з командою KRATEA — ми відповімо протягом дня.",
  },
  {
    path: "/blog",
    title: "Блог KRATEA — функціональні напої, адаптогени та здоров'я",
    description:
      "Статті про функціональні напої, натуральні адаптогени, кава-кава, GABA, канну та здоровий стиль життя від експертів KRATEA.",
    h1: "Блог KRATEA",
    intro:
      "Корисні статті про натуральні адаптогени, функціональні напої та здоровий стиль життя.",
  },
];

const blogRoutes: Route[] = blogPosts.map((p) => ({
  path: `/blog/${p.slug}`,
  title: (p.metaTitle ?? p.title) + " | KRATEA",
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

const all: Route[] = [...staticRoutes, ...blogRoutes, ...landingRoutes];

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderHtml(route: Route): string {
  const url = `${BASE_URL}${route.path}`;
  const title = escapeHtml(route.title);
  const desc = escapeHtml(route.description);
  const h1 = escapeHtml(route.h1);
  const intro = escapeHtml(route.intro);

  let html = shell;

  // Replace <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);

  // Replace meta description
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${desc}" />`
  );

  // Inject canonical + per-route OG tags right after the <title>
  const injected = `
    <link rel="canonical" href="${url}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:url" content="${url}" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${desc}" />`;
  html = html.replace(/<\/title>/, `</title>${injected}`);

  // Inject above-the-fold content inside #root. React's createRoot().render()
  // replaces children on mount, so this only shows to no-JS crawlers and
  // during the brief pre-hydration moment.
  const seoBlock = `<div style="position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden" aria-hidden="true"><h1>${h1}</h1><p>${intro}</p></div>`;
  html = html.replace(
    /<div id="root"><\/div>/,
    `<div id="root">${seoBlock}</div>`
  );

  return html;
}

let count = 0;
for (const route of all) {
  const html = renderHtml(route);
  // "/" -> dist/index.html, "/about" -> dist/about/index.html, etc.
  const outDir =
    route.path === "/" ? DIST : resolve(DIST, route.path.replace(/^\//, ""));
  const outFile = resolve(outDir, "index.html");
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, html);
  count++;
}

console.log(`[prerender] wrote ${count} static HTML files.`);
