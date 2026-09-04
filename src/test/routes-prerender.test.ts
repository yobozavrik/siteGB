import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

// Drift guard: every top-level route the SPA serves must also be emitted as a
// static HTML file by scripts/prerender.ts, or crawlers get the bare shell.
const prerenderSrc = readFileSync(resolve(__dirname, "../../scripts/prerender.ts"), "utf-8");
const appSrc = readFileSync(resolve(__dirname, "../App.tsx"), "utf-8");

const TOP_LEVEL = [
  "/",
  "/menu",
  "/delivery",
  "/shops",
  "/about",
  "/contacts",
  "/franchise",
  "/blog",
];

describe("routes ↔ prerender", () => {
  it("every top-level route has a prerender entry", () => {
    for (const path of TOP_LEVEL) {
      expect(prerenderSrc.includes(`path: "${path}"`), `prerender missing ${path}`).toBe(true);
    }
  });

  it("prerender covers the dynamic route families via data", () => {
    expect(prerenderSrc).toMatch(/categoriesSorted\.map/);
    expect(prerenderSrc).toMatch(/activeProducts\.map/);
    expect(prerenderSrc).toMatch(/blogPosts\.map/);
    expect(prerenderSrc).toMatch(/landingPages\.map/);
  });

  it("App.tsx still declares the routes the guard checks", () => {
    for (const path of TOP_LEVEL.filter((p) => p !== "/")) {
      expect(appSrc.includes(`path="${path}"`), `App.tsx missing ${path}`).toBe(true);
    }
  });
});
