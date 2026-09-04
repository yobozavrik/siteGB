import { describe, it, expect } from "vitest";
import { orderFormSchema, getFieldErrors, parseOrderItems, ORDER_STATUS_OPTIONS } from "@/lib/orders";

const base = {
  name: "Оксана",
  phone: "+380 67 123 45 67",
  email: "",
  timeSlot: "Завтра 12:00–14:00",
  paymentMethod: "cash" as const,
  comment: "",
};

const delivery = {
  ...base,
  deliveryType: "delivery" as const,
  city: "Київ",
  address: "вул. Ревуцького, 12, кв. 45",
  zone: "left-bank",
  shopId: "",
};

const pickup = {
  ...base,
  deliveryType: "pickup" as const,
  city: "",
  address: "",
  zone: "",
  shopId: "kyiv-pozniaky",
};

describe("orderFormSchema", () => {
  it("accepts a valid delivery order and normalises the phone", () => {
    const r = orderFormSchema.safeParse(delivery);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.phone).toBe("+380671234567");
  });

  it("accepts a valid pickup order", () => {
    expect(orderFormSchema.safeParse(pickup).success).toBe(true);
  });

  it("rejects a pickup order without a shop", () => {
    const r = orderFormSchema.safeParse({ ...pickup, shopId: "" });
    expect(r.success).toBe(false);
    if (!r.success) expect(getFieldErrors(r.error).shopId).toMatch(/магазин/i);
  });

  it("rejects a delivery order without city/address", () => {
    const r = orderFormSchema.safeParse({ ...delivery, city: "", address: "" });
    expect(r.success).toBe(false);
    if (!r.success) {
      const errs = getFieldErrors(r.error);
      expect(errs.city).toBeTruthy();
      expect(errs.address).toBeTruthy();
    }
  });

  it("rejects an invalid phone", () => {
    for (const phone of ["", "123", "+1 555 0100", "0" + "6".repeat(20)]) {
      expect(orderFormSchema.safeParse({ ...delivery, phone }).success, phone).toBe(false);
    }
  });

  it("rejects a bad email but allows an empty one", () => {
    expect(orderFormSchema.safeParse({ ...delivery, email: "not-an-email" }).success).toBe(false);
    expect(orderFormSchema.safeParse({ ...delivery, email: "" }).success).toBe(true);
    expect(orderFormSchema.safeParse({ ...delivery, email: "a@b.co" }).success).toBe(true);
  });

  it("requires a time slot and a known payment method", () => {
    expect(orderFormSchema.safeParse({ ...delivery, timeSlot: "" }).success).toBe(false);
    expect(orderFormSchema.safeParse({ ...delivery, paymentMethod: "bitcoin" }).success).toBe(false);
  });
});

describe("order item parsing", () => {
  it("parseOrderItems keeps valid rows and drops the batch on a bad one", () => {
    expect(parseOrderItems([{ id: "x", name: "Вареники", price: 120, quantity: 2 }])).toHaveLength(1);
    expect(parseOrderItems([{ id: "x", name: "Вареники", price: -1, quantity: 2 }])).toEqual([]);
    expect(parseOrderItems([])).toEqual([]);
  });

  it("exposes all five order statuses", () => {
    expect(ORDER_STATUS_OPTIONS.map((o) => o.value)).toEqual([
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ]);
  });
});
