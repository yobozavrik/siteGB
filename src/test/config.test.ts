import { describe, it, expect } from "vitest";
import { SITE_URL, PHONE, PHONE_DISPLAY, EMAIL, SOCIALS, MIN_ORDER_UAH, DELIVERY_FREE_FROM_UAH } from "@/config/site";

describe("site config", () => {
  it("SITE_URL is an absolute origin without a trailing slash", () => {
    expect(SITE_URL).toMatch(/^https?:\/\/[^/]+$/);
  });

  it("phone is a bare international number and its display form matches", () => {
    expect(PHONE).toMatch(/^\+380\d{9}$/);
    expect(PHONE_DISPLAY.replace(/[^\d+]/g, "")).toBe(PHONE);
  });

  it("email looks like an email", () => {
    expect(EMAIL).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
  });

  it("every social link is a valid URL", () => {
    for (const url of Object.values(SOCIALS)) {
      expect(() => new URL(url)).not.toThrow();
    }
  });

  it("free-delivery threshold is above the minimum order", () => {
    expect(DELIVERY_FREE_FROM_UAH).toBeGreaterThan(MIN_ORDER_UAH);
    expect(MIN_ORDER_UAH).toBeGreaterThan(0);
  });
});
