import { describe, it, expect } from "vitest";
import {
  categories,
  products,
  pricePer100g,
  productsByCategory,
  getProduct,
  relatedProducts,
  productImage,
} from "@/data/catalog";

describe("catalog data", () => {
  it("has unique category slugs", () => {
    const slugs = categories.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has unique product ids and slugs", () => {
    const ids = products.map((p) => p.id);
    const slugs = products.map((p) => p.slug);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every product references a real category", () => {
    const catSlugs = new Set(categories.map((c) => c.slug));
    for (const p of products) {
      expect(catSlugs.has(p.categorySlug), `${p.slug} → ${p.categorySlug}`).toBe(true);
    }
  });

  it("slugs are URL-safe (lowercase latin, digits, dashes)", () => {
    for (const p of products) {
      expect(p.slug, p.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("every product has sane numbers, a resolvable image and full KBJU", () => {
    for (const p of products) {
      expect(p.priceUAH, p.slug).toBeGreaterThan(0);
      expect(p.weightGrams, p.slug).toBeGreaterThan(0);
      expect(productImage(p).startsWith("/"), p.slug).toBe(true);
      for (const key of ["kcal", "protein", "fat", "carb"] as const) {
        expect(p.kbju[key], `${p.slug}.${key}`).toBeGreaterThanOrEqual(0);
      }
      for (const field of ["composition", "cooking", "storage", "allergens"] as const) {
        expect(p[field].length, `${p.slug}.${field}`).toBeGreaterThan(3);
      }
    }
  });

  it("every category has at least one active product", () => {
    for (const c of categories) {
      expect(productsByCategory(c.slug).length, c.slug).toBeGreaterThan(0);
    }
  });

  it("pricePer100g computes correctly", () => {
    expect(pricePer100g({ priceUAH: 128, weightGrams: 500 })).toBe(26);
    expect(pricePer100g({ priceUAH: 189, weightGrams: 700 })).toBe(27);
  });

  it("getProduct and productImage resolve", () => {
    const p = getProduct("vareniki-z-vyshneyu");
    expect(p?.title).toContain("вишнею");
    expect(productImage({ images: [] })).toBe("/placeholder.svg");
  });

  it("relatedProducts returns others, never the product itself", () => {
    const rel = relatedProducts("vareniki-z-vyshneyu", 4);
    expect(rel.length).toBe(4);
    expect(rel.some((p) => p.slug === "vareniki-z-vyshneyu")).toBe(false);
  });
});
