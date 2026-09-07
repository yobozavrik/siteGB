import { Link } from "react-router-dom";
import { Minus, Plus, X, ShoppingCart } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import SEO from "@/components/SEO";
import { useCart } from "@/context/CartContext";
import { FREE_DELIVERY_FROM, MIN_ORDER } from "@/data/delivery";

const CartPage = () => {
  const { items, updateQuantity, removeItem, totalPrice, totalItems, clearCart } = useCart();

  const toFree = Math.max(0, FREE_DELIVERY_FROM - totalPrice);
  const belowMin = totalPrice > 0 && totalPrice < MIN_ORDER;

  return (
    <SiteLayout seo={<SEO title="Кошик — Галя Балувана" description="Ваше замовлення домашніх напівфабрикатів." path="/cart" />}>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-3xl font-black">Кошик</h1>

        {items.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-border bg-card py-16 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground/40" />
            <p className="text-muted-foreground">Кошик порожній</p>
            <Link to="/menu" className="rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground">
              Перейти до меню
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
            <div>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-border py-4"
                >
                  <img
                    src={item.image}
                    alt=""
                    className="h-16 w-16 shrink-0 rounded-lg border border-border object-cover"
                  />
                  <div className="min-w-0 flex-1 basis-40">
                    <Link to={`/product/${item.slug}`} className="font-bold leading-tight hover:text-primary">
                      {item.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">{item.unitLabel}</p>
                    <p className="text-sm font-semibold text-primary">{item.priceUAH} ₴</p>
                  </div>
                  <div className="ml-auto flex items-center gap-3 sm:gap-4">
                    <div className="flex items-center overflow-hidden rounded-lg border border-border">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Менше" className="grid h-9 w-9 place-items-center hover:bg-muted">
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold tabular-nums">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Більше" className="grid h-9 w-9 place-items-center hover:bg-muted">
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="w-20 shrink-0 text-right font-black tabular-nums">{item.priceUAH * item.quantity} ₴</div>
                    <button onClick={() => removeItem(item.id)} aria-label="Прибрати" className="shrink-0 text-muted-foreground hover:text-destructive">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={clearCart} className="mt-4 text-sm text-muted-foreground hover:text-foreground">
                Очистити кошик
              </button>
            </div>

            <aside className="h-max rounded-2xl border border-border bg-card p-5">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Товари ({totalItems})</span>
                <span className="tabular-nums text-foreground">{totalPrice} ₴</span>
              </div>
              <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                <span>Доставка</span>
                <span>розрахуємо при оформленні</span>
              </div>
              {toFree > 0 ? (
                <p className="mt-3 rounded-lg bg-olive/10 px-3 py-2 text-xs font-semibold text-olive">
                  Додайте ще на {toFree} ₴ — і доставка безкоштовна
                </p>
              ) : (
                <p className="mt-3 rounded-lg bg-olive/10 px-3 py-2 text-xs font-semibold text-olive">
                  Безкоштовна доставка 🎉
                </p>
              )}
              <div className="mt-3 flex justify-between border-t border-border pt-3 text-lg font-black">
                <span>До сплати</span>
                <span className="tabular-nums">{totalPrice} ₴</span>
              </div>
              {belowMin && (
                <p className="mt-2 text-xs text-destructive">
                  Мінімальне замовлення — {MIN_ORDER} ₴
                </p>
              )}
              <Link
                to="/checkout"
                aria-disabled={belowMin}
                className={`mt-4 block rounded-xl py-3 text-center font-bold text-primary-foreground ${
                  belowMin ? "pointer-events-none bg-primary/40" : "bg-primary"
                }`}
              >
                Оформити замовлення
              </Link>
              <p className="mt-2 text-center text-[11px] text-muted-foreground">
                Або самовивіз із магазину — безкоштовно
              </p>
            </aside>
          </div>
        )}
      </div>
    </SiteLayout>
  );
};

export default CartPage;
