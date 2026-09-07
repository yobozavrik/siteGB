// Single source of truth for brand-level constants.
// Anything shown in more than one place (header, footer, SEO, checkout, contacts)
// comes from here so there is exactly one line to change per fact.

const fromEnv = (import.meta.env.VITE_SITE_URL ?? "").trim();

/** Canonical production origin, no trailing slash. */
export const SITE_URL = (fromEnv || "https://galya-baluvana.vercel.app").replace(/\/$/, "");

export const BRAND = "Галя Балувана";
export const BRAND_TAGLINE = "Домашні напівфабрикати ручного ліплення у Чернівцях";

/** Primary phone in international format. */
export const PHONE = "+380990156188";
/** Human-readable phone for display. */
export const PHONE_DISPLAY = "+380 99 015 61 88";
export const PHONE_ALT = "+380977756942";
export const PHONE_ALT_DISPLAY = "+380 97 775 69 42";
export const EMAIL = "chernivtsi@galya-baluvana.ua";
export const FRANCHISE_EMAIL = "partner@galya-baluvana.ua";

export const SOCIALS = {
  instagram: "https://www.instagram.com/galyabaluvana_chernivtsi/",
  facebook: "https://www.facebook.com/galyabaluvana.chernivtsi/",
  youtube: "https://www.youtube.com/@galyabaluvana",
  telegram: "https://t.me/galyabaluvana_cv",
  viber: "viber://chat?number=%2B380990156188",
} as const;

/** Network-level figures shown on the home stats block for Chernivtsi. */
export const NETWORK_STATS = [
  { value: "14", label: "магазинів у Чернівцях" },
  { value: "100%", label: "ручне ліплення" },
  { value: "200+", label: "страв у меню" },
] as const;

/** Shown on the storefront; individual shops may differ (see src/data/shops.ts). */
export const WORK_HOURS = "Пн–Пт 09:00–21:00, Сб–Нд 09:00–20:00";
export const DELIVERY_HOURS = "Щодня 10:00–20:00";
export const SUPPORT_HOURS = "Щодня з 09:00 до 20:00";

/** Order economics, in UAH (if prices are enabled). */
export const MIN_ORDER_UAH = 300;
export const DELIVERY_FREE_FROM_UAH = 1500;

export const CITY_PRIMARY = "Чернівці";

/**
 * Catalogue mode. When false, the site functions strictly as an interactive showcase/menu
 * without online cart or checkout.
 */
export const SHOW_PRICES = false;

export const site = {
  SITE_URL,
  BRAND,
  BRAND_TAGLINE,
  PHONE,
  PHONE_DISPLAY,
  PHONE_ALT,
  PHONE_ALT_DISPLAY,
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
