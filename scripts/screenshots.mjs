// Dev tooling — capture README screenshots from a running preview server.
//   npm run build && npm run preview -- --port 4173 --strictPort   (in another shell)
//   node scripts/screenshots.mjs
// Not part of the test suite.

import { chromium } from "@playwright/test";
import { mkdirSync } from "fs";

const BASE = process.env.PREVIEW_URL || "http://127.0.0.1:4173";
const OUT = "docs/screenshots";
mkdirSync(OUT, { recursive: true });

const shots = [
  { name: "home", path: "/", full: false },
  { name: "products", path: "/menu", full: false, scrollTo: 900 },
  { name: "product", path: "/product/vareniki-z-kartopleyu-ta-grybamy", full: false },
  { name: "cart", path: "/cart", full: false, seedCart: true },
  { name: "checkout", path: "/checkout", full: false, seedCart: true },
  { name: "map", path: "/shops", full: false },
  { name: "delivery", path: "/delivery", full: false },
  { name: "about", path: "/about", full: false },
  { name: "blog", path: "/blog", full: false },
];

const CART_SEED = JSON.stringify([
  { id: "vareniki-z-kartopleyu-ta-grybamy", slug: "vareniki-z-kartopleyu-ta-grybamy", title: "Вареники з картоплею та грибами", unitLabel: "упаковка 0,5 кг · ~28 шт", priceUAH: 138, quantity: 2, image: "/placeholder.svg" },
  { id: "pelmeni-domashni", slug: "pelmeni-domashni", title: "Пельмені «По-домашньому»", unitLabel: "упаковка 0,7 кг", priceUAH: 189, quantity: 1, image: "/placeholder.svg" },
]);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

await page.goto(BASE);
await page.evaluate((seed) => localStorage.setItem("gb.cart.v1", seed), CART_SEED);

for (const s of shots) {
  await page.goto(BASE + s.path, { waitUntil: "networkidle" });
  if (s.scrollTo) await page.evaluate((y) => window.scrollTo(0, y), s.scrollTo);
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/${s.name}.jpg`, quality: 82, type: "jpeg", fullPage: s.full });
  console.log("✓", s.name);
}

// Support chat — open the widget on the home page.
await page.goto(BASE + "/", { waitUntil: "networkidle" });
const fab = page.getByRole("button", { name: /чат підтримки/i });
if (await fab.count()) {
  await fab.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/support-chat.jpg`, quality: 82, type: "jpeg" });
  console.log("✓", "support-chat");
}

await browser.close();
