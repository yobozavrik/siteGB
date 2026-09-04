import { test, expect } from "@playwright/test";

test.describe("storefront", () => {
  test("home page renders the hero and a primary call to action", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Галя Балувана/i);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /меню/i }).first()).toBeVisible();
  });

  test("primary navigation reaches every top-level page", async ({ page }) => {
    for (const path of [
      "/menu",
      "/menu/mlyntsi-vareniki",
      "/product/vareniki-z-vyshneyu",
      "/delivery",
      "/shops",
      "/about",
      "/blog",
      "/contacts",
      "/franchise",
    ]) {
      const response = await page.goto(path);
      expect(response?.status(), `${path} should not 404`).toBeLessThan(400);
      await expect(page.getByRole("heading", { level: 1 }).first(), `${path} has an h1`).toBeVisible();
    }
  });

  test("legacy Kratea routes redirect", async ({ page }) => {
    await page.goto("/where-to-buy");
    await expect(page).toHaveURL(/\/shops$/);
    await page.goto("/contact");
    await expect(page).toHaveURL(/\/contacts$/);
  });

  test("an unknown route renders the 404 page rather than a blank screen", async ({ page }) => {
    await page.goto("/this-route-does-not-exist");
    await expect(page.getByText(/404|не знайдено/i).first()).toBeVisible();
  });

  test("catalogue mode: no prices, no cart, /cart redirects to /menu", async ({ page }) => {
    await page.goto("/menu/mlyntsi-vareniki");
    await expect(page.getByText("₴")).toHaveCount(0);
    await expect(page.getByRole("link", { name: /кошик/i })).toHaveCount(0);
    await page.goto("/cart");
    await expect(page).toHaveURL(/\/menu$/);
  });

  test("product page tabs switch content", async ({ page }) => {
    await page.goto("/product/vareniki-z-kartopleyu-ta-grybamy");
    await page.getByRole("tab", { name: "Приготування" }).click();
    await expect(page.getByText(/після спливання/i).first()).toBeVisible();
  });

  test("images actually load on key pages", async ({ page }) => {
    for (const path of ["/", "/menu", "/product/vareniki-z-vyshneyu"]) {
      await page.goto(path);
      const broken = await page.evaluate(() =>
        Array.from(document.images)
          .filter((img) => img.complete && img.naturalWidth === 0)
          .map((img) => img.currentSrc || img.src),
      );
      expect(broken, `${path} broken images: ${broken.join(", ")}`).toEqual([]);
    }
  });
});
