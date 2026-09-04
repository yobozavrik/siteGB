// Delivery zones, payment methods and pickup terms. Static — shown on /delivery,
// /checkout and hinted on /cart.

import { DELIVERY_FREE_FROM_UAH, MIN_ORDER_UAH } from "@/config/site";

export interface DeliveryZone {
  id: string;
  name: string;
  costUAH: number | null; // null = calculated by carrier
  freeFromUAH: number | null;
  eta: string;
  note?: string;
}

export const deliveryZones: DeliveryZone[] = [
  {
    id: "left-bank",
    name: "Лівий берег Києва",
    costUAH: 60,
    freeFromUAH: DELIVERY_FREE_FROM_UAH,
    eta: "60–90 хв",
  },
  {
    id: "right-bank",
    name: "Правий берег Києва",
    costUAH: 90,
    freeFromUAH: 2000,
    eta: "90–120 хв",
  },
  {
    id: "suburb",
    name: "Приміська зона (до 15 км)",
    costUAH: null,
    freeFromUAH: null,
    eta: "узгоджується",
    note: "Вартість залежить від адреси, менеджер підтверджує при оформленні.",
  },
  {
    id: "np",
    name: "Інші міста України",
    costUAH: null,
    freeFromUAH: null,
    eta: "1–2 дні",
    note: "Нова Пошта у термо-упаковці. Оплата доставки за тарифом перевізника.",
  },
];

export interface PaymentMethod {
  id: "cash" | "card_courier" | "online";
  label: string;
  note?: string;
  forPickup: boolean;
  forDelivery: boolean;
}

export const paymentMethods: PaymentMethod[] = [
  { id: "cash", label: "Готівкою при отриманні", forPickup: true, forDelivery: true },
  { id: "card_courier", label: "Карткою кур'єру (термінал)", forPickup: false, forDelivery: true },
  { id: "online", label: "Онлайн — Mono / LiqPay / Apple Pay", note: "Посилання на оплату надійде після підтвердження", forPickup: true, forDelivery: true },
];

export const MIN_ORDER = MIN_ORDER_UAH;
export const FREE_DELIVERY_FROM = DELIVERY_FREE_FROM_UAH;

export const pickupNote =
  "Самовивіз — безкоштовно з будь-якого магазину мережі. Замовлення збираємо за 30–40 хв " +
  "і зберігаємо в морозильній вітрині до кінця дня.";

/** Time slots offered at checkout (today is filtered client-side by current hour). */
export const timeSlots = [
  "10:00–12:00",
  "12:00–14:00",
  "14:00–16:00",
  "16:00–18:00",
  "18:00–20:30",
];
