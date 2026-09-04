import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { CartProvider, useCart } from "@/context/CartContext";

const wrapper = ({ children }: { children: ReactNode }) => <CartProvider>{children}</CartProvider>;

const apple = { id: "can-apple", name: "Kratea Apple", price: 89, image: "/apple.png" };
const orange = { id: "can-orange", name: "Kratea Orange", price: 109, image: "/orange.png" };

const setup = () => renderHook(() => useCart(), { wrapper });

describe("CartContext", () => {
  it("starts empty", () => {
    const { result } = setup();
    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it("adds an item with quantity 1", () => {
    const { result } = setup();
    act(() => result.current.addItem(apple));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toMatchObject({ id: "can-apple", quantity: 1 });
  });

  it("increments quantity instead of duplicating an existing line", () => {
    const { result } = setup();
    act(() => {
      result.current.addItem(apple);
      result.current.addItem(apple);
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.totalItems).toBe(2);
  });

  it("keeps separate lines for different products", () => {
    const { result } = setup();
    act(() => {
      result.current.addItem(apple);
      result.current.addItem(orange);
    });
    expect(result.current.items).toHaveLength(2);
    expect(result.current.totalItems).toBe(2);
  });

  it("totals price across quantities", () => {
    const { result } = setup();
    act(() => {
      result.current.addItem(apple); // 89
      result.current.addItem(apple); // 178
      result.current.addItem(orange); // 287
    });
    expect(result.current.totalPrice).toBe(89 * 2 + 109);
  });

  it("removes a line entirely", () => {
    const { result } = setup();
    act(() => {
      result.current.addItem(apple);
      result.current.addItem(orange);
      result.current.removeItem("can-apple");
    });
    expect(result.current.items.map((i) => i.id)).toEqual(["can-orange"]);
  });

  it("updates quantity to an explicit value", () => {
    const { result } = setup();
    act(() => {
      result.current.addItem(apple);
      result.current.updateQuantity("can-apple", 5);
    });
    expect(result.current.items[0].quantity).toBe(5);
    expect(result.current.totalPrice).toBe(89 * 5);
  });

  // Regression guard: a quantity stepper hitting zero must drop the line,
  // never leave an item sitting in the cart with quantity 0.
  it("drops the line when quantity is set to zero or below", () => {
    const { result } = setup();
    act(() => {
      result.current.addItem(apple);
      result.current.updateQuantity("can-apple", 0);
    });
    expect(result.current.items).toHaveLength(0);

    act(() => {
      result.current.addItem(orange);
      result.current.updateQuantity("can-orange", -3);
    });
    expect(result.current.items).toHaveLength(0);
  });

  it("clears everything", () => {
    const { result } = setup();
    act(() => {
      result.current.addItem(apple);
      result.current.addItem(orange);
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
});
