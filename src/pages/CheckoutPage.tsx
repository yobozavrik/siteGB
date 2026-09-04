import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import SEO from "@/components/SEO";
import { useCart } from "@/context/CartContext";
import { toast } from "@/components/ui/use-toast";
import {
  createOrder,
  getFieldErrors,
  orderFormSchema,
  PAYMENT_LABELS,
  type DeliveryType,
  type PaymentMethod,
} from "@/lib/orders";
import { deliveryZones, paymentMethods, timeSlots } from "@/data/delivery";
import { shops, cities } from "@/data/shops";
import { supabaseConfigured } from "@/integrations/supabase/client";

interface FormState {
  name: string;
  phone: string;
  email: string;
  deliveryType: DeliveryType;
  city: string;
  address: string;
  zone: string;
  shopId: string;
  day: string;
  timeSlot: string;
  paymentMethod: PaymentMethod;
  comment: string;
}

const days = ["Сьогодні", "Завтра"];

const empty: FormState = {
  name: "",
  phone: "",
  email: "",
  deliveryType: "delivery",
  city: "Київ",
  address: "",
  zone: deliveryZones[0].id,
  shopId: "",
  day: "Завтра",
  timeSlot: "",
  paymentMethod: "cash",
  comment: "",
};

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const availablePayments = useMemo(
    () => paymentMethods.filter((p) => (form.deliveryType === "pickup" ? p.forPickup : p.forDelivery)),
    [form.deliveryType],
  );

  const submit = async () => {
    const candidate = {
      name: form.name,
      phone: form.phone,
      email: form.email,
      deliveryType: form.deliveryType,
      city: form.deliveryType === "delivery" ? form.city : "",
      address: form.deliveryType === "delivery" ? form.address : "",
      zone: form.deliveryType === "delivery" ? form.zone : "",
      shopId: form.deliveryType === "pickup" ? form.shopId : "",
      timeSlot: form.timeSlot ? `${form.day} ${form.timeSlot}` : "",
      paymentMethod: form.paymentMethod,
      comment: form.comment,
    };

    const parsed = orderFormSchema.safeParse(candidate);
    if (!parsed.success) {
      setErrors(getFieldErrors(parsed.error));
      return;
    }
    if (items.length === 0) {
      toast({ variant: "destructive", title: "Кошик порожній", description: "Додайте товари перед оформленням." });
      return;
    }

    setSubmitting(true);
    const result = await createOrder({ form: parsed.data, items });
    setSubmitting(false);

    if (result.error) {
      toast({ variant: "destructive", title: "Не вдалося оформити замовлення", description: result.error });
      return;
    }
    clearCart();
    navigate(`/order/${result.orderId}`);
  };

  if (items.length === 0) {
    return (
      <SiteLayout seo={<SEO title="Оформлення — Галя Балувана" description="Оформлення замовлення." path="/checkout" />}>
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <h1 className="text-2xl font-black">Кошик порожній</h1>
          <p className="mt-2 text-muted-foreground">Додайте страви, щоб оформити замовлення.</p>
          <Link to="/menu" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground">
            До меню
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const err = (k: string) => errors[k] && <p className="mt-1 text-xs text-destructive">{errors[k]}</p>;
  const field = "w-full rounded-xl border border-border bg-input px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <SiteLayout seo={<SEO title="Оформлення замовлення — Галя Балувана" description="Доставка або самовивіз, зручний час, оплата на вибір." path="/checkout" />}>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-3xl font-black">Оформлення</h1>

        {!supabaseConfigured && (
          <p className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            Приймання замовлень тимчасово недоступне (не налаштовано бекенд). Зателефонуйте
            нам, будь ласка — контакти в футері.
          </p>
        )}

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            <section>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">Контакти</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Ім'я</label>
                  <input className={field} value={form.name} onChange={(e) => set("name", e.target.value)} />
                  {err("name")}
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Телефон</label>
                  <input className={field} placeholder="+380 __ ___ __ __" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                  {err("phone")}
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs text-muted-foreground">Email (необов'язково)</label>
                  <input className={field} value={form.email} onChange={(e) => set("email", e.target.value)} />
                  {err("email")}
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">Спосіб отримання</h2>
              <div className="flex overflow-hidden rounded-xl border border-border text-sm font-bold">
                {(["delivery", "pickup"] as DeliveryType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => set("deliveryType", t)}
                    className={`flex-1 py-2.5 ${form.deliveryType === t ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                  >
                    {t === "delivery" ? "Доставка кур'єром" : "Самовивіз із магазину"}
                  </button>
                ))}
              </div>

              {form.deliveryType === "delivery" ? (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">Місто</label>
                    <input className={field} value={form.city} onChange={(e) => set("city", e.target.value)} />
                    {err("city")}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">Зона доставки</label>
                    <select className={field} value={form.zone} onChange={(e) => set("zone", e.target.value)}>
                      {deliveryZones.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.name}
                          {z.costUAH != null ? ` — ${z.costUAH} ₴` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs text-muted-foreground">Адреса (вулиця, будинок, квартира)</label>
                    <input className={field} value={form.address} onChange={(e) => set("address", e.target.value)} />
                    {err("address")}
                  </div>
                </div>
              ) : (
                <div className="mt-3">
                  <label className="mb-1 block text-xs text-muted-foreground">Магазин</label>
                  <select className={field} value={form.shopId} onChange={(e) => set("shopId", e.target.value)}>
                    <option value="">Оберіть магазин…</option>
                    {cities.map((city) => (
                      <optgroup key={city} label={city}>
                        {shops
                          .filter((s) => s.city === city)
                          .map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.city}, {s.address}
                            </option>
                          ))}
                      </optgroup>
                    ))}
                  </select>
                  {err("shopId")}
                </div>
              )}
            </section>

            <section>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">Дата й час</h2>
              <div className="flex flex-wrap gap-2">
                {days.map((d) => (
                  <button
                    key={d}
                    onClick={() => set("day", d)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                      form.day === d ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {timeSlots.map((s) => (
                  <button
                    key={s}
                    onClick={() => set("timeSlot", s)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold tabular-nums ${
                      form.timeSlot === s ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {err("timeSlot")}
            </section>

            <section>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">Оплата</h2>
              <div className="space-y-2">
                {availablePayments.map((p) => (
                  <label key={p.id} className="flex cursor-pointer items-center gap-3 text-sm">
                    <input
                      type="radio"
                      name="payment"
                      checked={form.paymentMethod === p.id}
                      onChange={() => set("paymentMethod", p.id)}
                      className="accent-primary"
                    />
                    {PAYMENT_LABELS[p.id]}
                    {p.note && <span className="text-xs text-muted-foreground">— {p.note}</span>}
                  </label>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">Коментар</h2>
              <textarea
                className={`${field} h-20 resize-none`}
                placeholder="Домофон, побажання до замовлення"
                value={form.comment}
                onChange={(e) => set("comment", e.target.value)}
              />
            </section>
          </div>

          <aside className="h-max rounded-2xl border border-border bg-card p-5">
            <div className="text-sm font-bold">Ваше замовлення</div>
            <div className="mt-3 space-y-2">
              {items.map((i) => (
                <div key={i.id} className="flex justify-between gap-3 text-sm text-muted-foreground">
                  <span className="truncate">
                    {i.title} ×{i.quantity}
                  </span>
                  <span className="tabular-nums text-foreground">{i.priceUAH * i.quantity} ₴</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between border-t border-border pt-3 text-lg font-black">
              <span>Разом</span>
              <span className="tabular-nums">{totalPrice} ₴</span>
            </div>
            <button
              onClick={submit}
              disabled={submitting}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-bold text-primary-foreground disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Підтвердити замовлення"}
            </button>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              Підтвердження надійде у Viber / SMS
            </p>
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
};

export default CheckoutPage;
