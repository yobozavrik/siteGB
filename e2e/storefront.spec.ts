import { test, expect } from "@playwright/test";

test.describe("storefront", () => {
  test("home page renders the hero and primary call to action", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/KRATEA/i);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /замовити|order/i }).first()).toBeVisible();
  });

  test("primary navigation reaches every top-level page", async ({ page }) => {
    for (const path of ["/about", "/blog", "/where-to-buy", "/collaboration", "/contact"]) {
      const response = await page.goto(path);
      expect(response?.status(), `${path} should not 404`).toBeLessThan(400);
      await expect(page.locator("body")).toBeVisible();
    }
  });

  test("an unknown route renders the 404 page rather than a blank screen", async ({ page }) => {
    await page.goto("/this-route-does-not-exist");
    await expect(page.getByText(/404|не знайдено|not found/i).first()).toBeVisible();
  });

  test("product images actually load", async ({ page }) => {
    await page.goto("/");
    const broken = await page.evaluate(() =>
      Array.from(document.images)
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.currentSrc || img.src),
    );
    expect(broken, `broken images: ${broken.join(", ")}`).toEqual([]);
  });
});
