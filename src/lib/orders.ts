import { z } from "zod";
import type { CartItem } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { getShop } from "@/data/shops";

const orderStatusValues = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;

export const orderStatusSchema = z.enum(orderStatusValues);
export type OrderStatus = z.infer<typeof orderStatusSchema>;

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Очікує",
  processing: "Готуємо",
  shipped: "Передано в доставку",
  delivered: "Виконано",
  cancelled: "Скасовано",
};

export const ORDER_STATUS_OPTIONS = orderStatusValues.map((value) => ({
  value,
  label: ORDER_STATUS_LABELS[value],
}));

export const orderItemSchema = z.object({
  id: z.string().trim().min(1).max(100),
  slug: z.string().trim().max(120).optional(),
  name: z.string().trim().min(1).max(160),
  unit: z.string().trim().max(160).optional(),
  price: z.number().finite().nonnegative(),
  quantity: z.number().int().positive().max(99),
});

const orderItemsSchema = z.array(orderItemSchema).min(1, "Додайте хоча б один товар у кошик").max(50);

export type OrderItem = z.infer<typeof orderItemSchema>;

export const deliveryTypeSchema = z.enum(["delivery", "pickup"]);
export type DeliveryType = z.infer<typeof deliveryTypeSchema>;

export const paymentMethodSchema = z.enum(["cash", "card_courier", "online"]);
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cash: "Готівкою при отриманні",
  card_courier: "Карткою кур'єру",
  online: "Онлайн",
};

const phoneRegex = /^(\+?38)?0\d{9}$/;

export const orderFormSchema = z
  .object({
    name: z.string().trim().min(2, "Вкажіть ім'я").max(100, "Ім'я занадто довге"),
    phone: z
      .string()
      .trim()
      .transform((v) => v.replace(/[\s()-]/g, ""))
      .pipe(z.string().regex(phoneRegex, "Вкажіть коректний номер, напр. +380671234567")),
    email: z.string().trim().email("Введіть коректний email").max(255).optional().or(z.literal("")),
    deliveryType: deliveryTypeSchema,
    city: z.string().trim().max(100).optional().or(z.literal("")),
    address: z.string().trim().max(255).optional().or(z.literal("")),
    zone: z.string().trim().max(80).optional().or(z.literal("")),
    shopId: z.string().trim().max(80).optional().or(z.literal("")),
    timeSlot: z.string().trim().min(1, "Оберіть зручний час").max(120),
    paymentMethod: paymentMethodSchema,
    comment: z.string().trim().max(500, "Коментар занадто довгий").optional().or(z.literal("")),
  })
  .superRefine((v, ctx) => {
    if (v.deliveryType === "delivery") {
      if (!v.city || v.city.length < 2)
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["city"], message: "Вкажіть місто" });
      if (!v.address || v.address.length < 5)
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["address"], message: "Вкажіть адресу доставки" });
    } else {
      if (!v.shopId)
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["shopId"], message: "Оберіть магазин для самовивозу" });
    }
  });

export type OrderFormValues = z.infer<typeof orderFormSchema>;

export interface OrderRecord {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  country: string;
  city: string;
  address: string;
  comment: string | null;
  delivery_type: string | null;
  shop_id: string | null;
  time_slot: string | null;
  payment_method: string | null;
  items: OrderItem[];
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export const getFieldErrors = (error: z.ZodError) =>
  error.issues.reduce<Record<string, string>>((acc, issue) => {
    const field = issue.path[0];
    if (typeof field === "string" && !acc[field]) {
      acc[field] = issue.message;
    }
    return acc;
  }, {});

const normalizeCartItems = (items: CartItem[]): OrderItem[] =>
  items.map((item) => ({
    id: item.id,
    slug: item.slug,
    name: item.title,
    unit: item.unitLabel,
    price: Number(item.priceUAH),
    quantity: Number(item.quantity),
  }));

export const parseOrderItems = (items: unknown): OrderItem[] => {
  const parsed = orderItemsSchema.safeParse(items);
  return parsed.success ? parsed.data : [];
};

export const createOrder = async ({
  form,
  items,
}: {
  form: OrderFormValues;
  items: CartItem[];
}) => {
  const parsedItems = orderItemsSchema.safeParse(normalizeCartItems(items));
  if (!parsedItems.success) {
    return { error: parsedItems.error.issues[0]?.message ?? "Не вдалося зчитати товари із кошика." };
  }

  const totalPrice = parsedItems.data.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (totalPrice <= 0) {
    return { error: "Сума замовлення має бути більшою за нуль." };
  }

  // For pickup, fall back to the shop's own address so NOT NULL columns are satisfied
  // and the admin sees where to hand the order over.
  const shop = form.deliveryType === "pickup" && form.shopId ? getShop(form.shopId) : undefined;
  const city = form.deliveryType === "pickup" ? shop?.city ?? "—" : form.city || "—";
  const address =
    form.deliveryType === "pickup"
      ? `Самовивіз: ${shop ? `${shop.city}, ${shop.address}` : form.shopId}`
      : form.address || "—";

  const orderId = crypto.randomUUID();

  const { error } = await supabase.from("orders").insert({
    id: orderId,
    customer_name: form.name,
    customer_email: form.email?.trim() || null,
    customer_phone: form.phone,
    country: "Україна",
    city,
    address,
    comment: form.comment?.trim() || null,
    delivery_type: form.deliveryType,
    shop_id: form.deliveryType === "pickup" ? form.shopId || null : null,
    time_slot: form.timeSlot,
    payment_method: form.paymentMethod,
    items: parsedItems.data,
    total_price: totalPrice,
    status: "pending" as OrderStatus,
  });

  if (error) {
    return { error: "Не вдалося зберегти замовлення. Спробуйте ще раз." };
  }

  // Telegram notification — fire-and-forget, must not block the order.
  supabase.functions
    .invoke("telegram-order-notify", {
      body: {
        orderId,
        customerName: form.name,
        customerPhone: form.phone,
        customerEmail: form.email?.trim() || null,
        deliveryType: form.deliveryType,
        city,
        address,
        timeSlot: form.timeSlot,
        paymentMethod: form.paymentMethod,
        comment: form.comment?.trim() || null,
        items: parsedItems.data,
        totalPrice,
      },
    })
    .catch((err) => console.error("Telegram notification failed:", err));

  return { orderId };
};
