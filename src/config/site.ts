// Single source of truth for brand-level constants.
// Anything shown in more than one place (header, footer, SEO, checkout, contacts)
// comes from here so there is exactly one line to change per fact.

const fromEnv = (import.meta.env.VITE_SITE_URL ?? "").trim();

/** Canonical production origin, no trailing slash. */
export const SITE_URL = (fromEnv || "https://galya-baluvana.vercel.app").replace(/\/$/, "");

export const BRAND = "Галя Балувана";
export const BRAND_TAGLINE = "Домашні напівфабрикати ручного ліплення";

/** Primary phone in international format. */
export const PHONE = "+380732000047";
/** Human-readable phone for display. */
export const PHONE_DISPLAY = "+380 73 200 00 47";
export const EMAIL = "hello@galya-baluvana.ua";
export const FRANCHISE_EMAIL = "partner@galya-baluvana.ua";

export const SOCIALS = {
  instagram: "https://www.instagram.com/galya.baluvana/",
  facebook: "https://www.facebook.com/galyabaluvana/",
  telegram: "https://t.me/galyabaluvana",
  viber: "viber://chat?number=%2B380732000047",
} as const;

/** Shown on the storefront; individual shops may differ (see src/data/shops.ts). */
export const WORK_HOURS = "Щодня 09:00–21:00";
export const DELIVERY_HOURS = "Щодня 10:00–20:30";
export const SUPPORT_HOURS = "Пн–Нд, у робочі години";

/** Order economics, in UAH. */
export const MIN_ORDER_UAH = 300;
export const DELIVERY_FREE_FROM_UAH = 1500;

export const CITY_PRIMARY = "Київ";

/**
 * Catalogue mode. When false, the site shows the assortment by category with no
 * prices and no online cart / checkout (prices depend on the shop — the real
 * "Галя Балувана" franchise model). Flip to true to enable priced online ordering.
 */
export const SHOW_PRICES = false;

export const site = {
  SITE_URL,
  BRAND,
  BRAND_TAGLINE,
  PHONE,
  PHONE_DISPLAY,
  EMAIL,
  FRANCHISE_EMAIL,
  SOCIALS,
  WORK_HOURS,
  DELIVERY_HOURS,
  SUPPORT_HOURS,
  MIN_ORDER_UAH,
  DELIVERY_FREE_FROM_UAH,
  CITY_PRIMARY,
} as const;

export default site;
