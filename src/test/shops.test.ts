import { describe, it, expect } from "vitest";
import {
  shops,
  totalShops,
  cities,
  citiesWithCounts,
  shopsByCity,
  productionShops,
} from "@/data/shops";

describe("shops data", () => {
  it("has unique ids", () => {
    const ids = shops.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every shop has city, address, hours, phone", () => {
    for (const s of shops) {
      expect(s.city.length, s.id).toBeGreaterThan(1);
      expect(s.address.length, s.id).toBeGreaterThan(3);
      expect(s.hours.length, s.id).toBeGreaterThan(3);
      expect(s.phone).toMatch(/\+380/);
    }
  });

  it("map coordinates are within the 0–100 percentage box", () => {
    for (const s of shops) {
      expect(s.x, s.id).toBeGreaterThanOrEqual(0);
      expect(s.x, s.id).toBeLessThanOrEqual(100);
      expect(s.y, s.id).toBeGreaterThanOrEqual(0);
      expect(s.y, s.id).toBeLessThanOrEqual(100);
    }
  });

  it("totals and per-city grouping are consistent", () => {
    expect(totalShops).toBe(shops.length);
    expect(cities.length).toBeGreaterThanOrEqual(6);
    const summed = citiesWithCounts.reduce((n, c) => n + c.count, 0);
    expect(summed).toBe(totalShops);
    for (const c of cities) {
      expect(shopsByCity(c).length).toBe(citiesWithCounts.find((x) => x.city === c)?.count);
    }
  });

  it("at least one production (behind-glass) shop exists", () => {
    expect(productionShops.length).toBeGreaterThan(0);
  });
});
