import { describe, it, expect } from "vitest";
import { blogPosts } from "@/data/blogPosts";
import { landingPages } from "@/data/landingPages";
import { products, categories } from "@/data/catalog";

// Regression guard: this repo was forked from the "Kratea" energy-drink storefront.
// None of the Kratea domain vocabulary may survive in Galya Baluvana content data.
const FORBIDDEN = /kratea|red bull|gaba|кава-кава|канна|енергетик|таурин|адаптоген/i;

const scan = (label: string, blob: string) =>
  it(`${label} has no leftover Kratea vocabulary`, () => {
    const hit = blob.match(FORBIDDEN);
    expect(hit, hit ? `found "${hit[0]}"` : undefined).toBeNull();
  });

describe("content is Galya Baluvana, not Kratea", () => {
  scan("blogPosts", JSON.stringify(blogPosts));
  scan("landingPages", JSON.stringify(landingPages));
  scan("catalog", JSON.stringify({ products, categories }));

  it("blog slugs are unique and every post has a description + excerpt", () => {
    const slugs = blogPosts.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const p of blogPosts) {
      expect(p.description.length).toBeGreaterThan(20);
      expect(p.excerpt.length).toBeGreaterThan(20);
      expect(p.content.length).toBeGreaterThan(2);
    }
  });

  it("landing pages have unique paths and required SEO fields", () => {
    const paths = landingPages.map((p) => p.path);
    expect(new Set(paths).size).toBe(paths.length);
    for (const p of landingPages) {
      expect(p.path.startsWith("/")).toBe(true);
      expect(p.title.length).toBeGreaterThan(15);
      expect(p.description.length).toBeGreaterThan(20);
      expect(p.h1.length).toBeGreaterThan(5);
      expect(["keyword", "city"]).toContain(p.category);
    }
  });
});
