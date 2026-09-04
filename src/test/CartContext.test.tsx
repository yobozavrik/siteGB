import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { CartProvider, useCart } from "@/context/CartContext";

const wrapper = ({ children }: { children: ReactNode }) => <CartProvider>{children}</CartProvider>;

const vareniki = {
  id: "vareniki-z-vyshneyu",
  slug: "vareniki-z-vyshneyu",
  title: "Вареники з вишнею",
  unitLabel: "упаковка 0,5 кг",
  priceUAH: 152,
  image: "/placeholder.svg",
};
const pelmeni = {
  id: "pelmeni-domashni",
  slug: "pelmeni-domashni",
  title: "Пельмені «По-домашньому»",
  unitLabel: "упаковка 0,7 кг",
  priceUAH: 189,
  image: "/placeholder.svg",
};

const setup = () => renderHook(() => useCart(), { wrapper });

describe("CartContext", () => {
  beforeEach(() => localStorage.clear());

  it("starts empty", () => {
    const { result } = setup();
    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it("adds an item with quantity 1", () => {
    const { result } = setup();
    act(() => result.current.addItem(vareniki));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toMatchObject({ id: vareniki.id, quantity: 1 });
  });

  it("adds an explicit quantity", () => {
    const { result } = setup();
    act(() => result.current.addItem(vareniki, 3));
    expect(result.current.items[0].quantity).toBe(3);
  });

  it("increments quantity instead of duplicating an existing line", () => {
    const { result } = setup();
    act(() => {
      result.current.addItem(vareniki);
      result.current.addItem(vareniki);
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.totalItems).toBe(2);
  });

  it("keeps separate lines for different products", () => {
    const { result } = setup();
    act(() => {
      result.current.addItem(vareniki);
      result.current.addItem(pelmeni);
    });
    expect(result.current.items).toHaveLength(2);
    expect(result.current.totalItems).toBe(2);
  });

  it("totals price across quantities", () => {
    const { result } = setup();
    act(() => {
      result.current.addItem(vareniki);
      result.current.addItem(vareniki);
      result.current.addItem(pelmeni);
    });
    expect(result.current.totalPrice).toBe(152 * 2 + 189);
  });

  it("removes a line entirely", () => {
    const { result } = setup();
    act(() => {
      result.current.addItem(vareniki);
      result.current.addItem(pelmeni);
      result.current.removeItem(vareniki.id);
    });
    expect(result.current.items.map((i) => i.id)).toEqual([pelmeni.id]);
  });

  it("updates quantity to an explicit value", () => {
    const { result } = setup();
    act(() => {
      result.current.addItem(vareniki);
      result.current.updateQuantity(vareniki.id, 5);
    });
    expect(result.current.items[0].quantity).toBe(5);
    expect(result.current.totalPrice).toBe(152 * 5);
  });

  // Regression guard: a quantity stepper hitting zero must drop the line.
  it("drops the line when quantity is set to zero or below", () => {
    const { result } = setup();
    act(() => {
      result.current.addItem(vareniki);
      result.current.updateQuantity(vareniki.id, 0);
    });
    expect(result.current.items).toHaveLength(0);

    act(() => {
      result.current.addItem(pelmeni);
      result.current.updateQuantity(pelmeni.id, -3);
    });
    expect(result.current.items).toHaveLength(0);
  });

  it("clears everything", () => {
    const { result } = setup();
    act(() => {
      result.current.addItem(vareniki);
      result.current.addItem(pelmeni);
      result.current.clearCart();
    });
    expect(result.current.items).toEqual([]);
    expect(result.current.totalPrice).toBe(0);
  });

  it("toggles the cart drawer", () => {
    const { result } = setup();
    expect(result.current.isCartOpen).toBe(false);
    act(() => result.current.setIsCartOpen(true));
    expect(result.current.isCartOpen).toBe(true);
  });

  it("persists to localStorage and rehydrates on next mount", () => {
    const first = setup();
    act(() => first.result.current.addItem(vareniki, 2));
    first.unmount();

    const second = setup();
    expect(second.result.current.items).toHaveLength(1);
    expect(second.result.current.items[0]).toMatchObject({ id: vareniki.id, quantity: 2 });
    second.unmount();
  });

  it("survives a corrupt localStorage value", () => {
    localStorage.setItem("gb.cart.v1", "{not json");
    const { result } = setup();
    expect(result.current.items).toEqual([]);
    act(() => result.current.addItem(pelmeni));
    expect(result.current.items).toHaveLength(1);
  });
});
