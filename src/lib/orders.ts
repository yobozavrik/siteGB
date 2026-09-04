import { z } from "zod";
import type { CartItem } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";

const orderStatusValues = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;

export const orderStatusSchema = z.enum(orderStatusValues);
export type OrderStatus = z.infer<typeof orderStatusSchema>;

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Очікує",
  processing: "В обробці",
  shipped: "Відправлено",
  delivered: "Доставлено",
  cancelled: "Скасовано",
};

export const ORDER_STATUS_OPTIONS = orderStatusValues.map((value) => ({
  value,
  label: ORDER_STATUS_LABELS[value],
}));

export const orderItemSchema = z.object({
  id: z.string().trim().min(1).max(100),
  name: z.string().trim().min(1).max(120),
  flavor: z.string().trim().max(120),
  price: z.number().finite().nonnegative(),
  quantity: z.number().int().positive().max(99),
});

const orderItemsSchema = z.array(orderItemSchema).min(1, "Додайте хоча б один товар у кошик").max(50);

export type OrderItem = z.infer<typeof orderItemSchema>;

export const orderFormSchema = z.object({
  name: z.string().trim().min(2, "Вкажіть ім'я").max(100, "Ім'я занадто довге"),
  email: z.string().trim().email("Введіть коректний email").max(255, "Email занадто довгий"),
  phone: z.string().trim().max(40, "Телефон занадто довгий").optional().or(z.literal("")),
  country: z.string().trim().min(2, "Вкажіть країну").max(80, "Країна занадто довга"),
  city: z.string().trim().min(2, "Вкажіть місто").max(100, "Місто занадто довге"),
  address: z.string().trim().min(5, "Вкажіть адресу").max(255, "Адреса занадто довга"),
  comment: z.string().trim().max(500, "Коментар занадто довгий").optional().or(z.literal("")),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;

export interface OrderRecord {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  country: string;
  city: string;
  address: string;
  comment: string | null;
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
    name: item.name,
    flavor: item.flavor,
    price: Number(item.price),
    quantity: Number(item.quantity),
  }));

export const parseOrderItems = (items: unknown): OrderItem[] => {
  const parsedItems = orderItemsSchema.safeParse(items);
  return parsedItems.success ? parsedItems.data : [];
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
    return {
      error: parsedItems.error.issues[0]?.message ?? "Не вдалося зчитати товари із кошика.",
    };
  }

  const totalPrice = parsedItems.data.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (totalPrice <= 0) {
    return {
      error: "Сума замовлення має бути більшою за нуль.",
    };
  }

  const orderId = crypto.randomUUID();

  const { error } = await supabase
    .from("orders")
    .insert({
      id: orderId,
      customer_name: form.name,
      customer_email: form.email,
      customer_phone: form.phone?.trim() || null,
      country: form.country,
      city: form.city,
      address: form.address,
      comment: form.comment?.trim() || null,
      items: parsedItems.data,
      total_price: totalPrice,
      status: "pending" as OrderStatus,
    });

  if (error) {
    return {
      error: "Не вдалося зберегти замовлення. Спробуйте ще раз.",
    };
  }

  // Send Telegram notification (fire-and-forget, don't block the order)
  supabase.functions.invoke("telegram-order-notify", {
    body: {
      orderId,
      customerName: form.name,
      customerEmail: form.email,
      customerPhone: form.phone?.trim() || null,
      city: form.city,
      address: form.address,
      comment: form.comment?.trim() || null,
      items: parsedItems.data,
      totalPrice,
    },
  }).catch((err) => console.error("Telegram notification failed:", err));

  return {
    orderId,
  };
};
