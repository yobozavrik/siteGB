import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "@/components/ui/use-toast";
import { createOrder, getFieldErrors, orderFormSchema, type OrderFormValues } from "@/lib/orders";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const emptyForm: OrderFormValues = {
  name: "",
  email: "",
  phone: "",
  country: "Україна",
  city: "",
  address: "",
  comment: "",
};

const CheckoutModal = ({ isOpen, onClose }: CheckoutModalProps) => {
  const { items, totalPrice, clearCart, setIsCartOpen } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [form, setForm] = useState<OrderFormValues>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleSubmit = async () => {
    const parsedForm = orderFormSchema.safeParse(form);

    if (!parsedForm.success) {
      setErrors(getFieldErrors(parsedForm.error));
      return;
    }

    if (items.length === 0) {
      toast({
        variant: "destructive",
        title: "Кошик порожній",
        description: "Додайте товар у кошик перед оформленням замовлення.",
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const result = await createOrder({
      form: parsedForm.data,
      items,
    });

    setIsSubmitting(false);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Не вдалося оформити замовлення",
        description: result.error,
      });
      return;
    }

    setIsSuccess(true);
    clearCart();

    setTimeout(() => {
      setIsSuccess(false);
      setIsCartOpen(false);
      onClose();
      setForm(emptyForm);
      setErrors({});
    }, 3000);
  };

  const handleChange = (field: keyof OrderFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const inputClass = (field: keyof OrderFormValues) =>
    `w-full rounded-xl border bg-input px-4 py-3.5 text-foreground placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 ${
      errors[field] ? "border-destructive" : "border-border/50"
    }`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[61] flex items-center justify-center p-4" onClick={handleClose}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border/30 bg-card"
              onClick={(event) => event.stopPropagation()}
            >
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-1 flex-col items-center justify-center p-12 text-center"
                >
                  <CheckCircle className="mb-6 h-20 w-20 text-primary" />
                  <h2 className="mb-3 text-2xl font-black">Замовлення оформлено!</h2>
                  <p className="leading-relaxed text-muted-foreground">
                    Усе успішно. Ми зв'яжемося з вами через email для підтвердження замовлення.
                  </p>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-center justify-between border-b border-border/30 p-6">
                    <h2 className="text-xl font-black">Контактна інформація</h2>
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={isSubmitting}
                      aria-label="Закрити форму оформлення замовлення"
                      className="rounded-lg p-2 transition-colors hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex-1 space-y-5 overflow-y-auto p-6">
                    <div>
                      <label htmlFor="checkout-name" className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Повне ім'я *</label>
                      <input id="checkout-name" type="text" placeholder="Іван Петренко" value={form.name} onChange={(e) => handleChange("name", e.target.value)} className={inputClass("name")} />
                      {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="checkout-email" className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Email *</label>
                      <input id="checkout-email" type="email" placeholder="ivan@example.com" value={form.email} onChange={(e) => handleChange("email", e.target.value)} className={inputClass("email")} />
                      {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                    </div>
                    <div>
                      <label htmlFor="checkout-phone" className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Телефон</label>
                      <input id="checkout-phone" type="tel" placeholder="+380 XX XXX XX XX" value={form.phone ?? ""} onChange={(e) => handleChange("phone", e.target.value)} className={inputClass("phone")} />
                      {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
                    </div>
                    <div>
                      <label htmlFor="checkout-country" className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Країна *</label>
                      <input id="checkout-country" type="text" value={form.country} onChange={(e) => handleChange("country", e.target.value)} className={inputClass("country")} />
                      {errors.country && <p className="mt-1 text-xs text-destructive">{errors.country}</p>}
                    </div>
                    <div>
                      <label htmlFor="checkout-city" className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Місто *</label>
                      <input id="checkout-city" type="text" placeholder="Київ" value={form.city} onChange={(e) => handleChange("city", e.target.value)} className={inputClass("city")} />
                      {errors.city && <p className="mt-1 text-xs text-destructive">{errors.city}</p>}
                    </div>
                    <div>
                      <label htmlFor="checkout-address" className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Адреса *</label>
                      <input id="checkout-address" type="text" placeholder="вул. Хрещатик 1, кв. 5" value={form.address} onChange={(e) => handleChange("address", e.target.value)} className={inputClass("address")} />
                      {errors.address && <p className="mt-1 text-xs text-destructive">{errors.address}</p>}
                    </div>
                    <div>
                      <label htmlFor="checkout-comment" className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">Коментар</label>
                      <textarea id="checkout-comment" placeholder="Додаткові деталі щодо доставки..." value={form.comment ?? ""} onChange={(e) => handleChange("comment", e.target.value)} className={`${inputClass("comment")} min-h-[80px] resize-none`} />
                      {errors.comment && <p className="mt-1 text-xs text-destructive">{errors.comment}</p>}
                    </div>


                    <div className="rounded-xl border border-border/20 bg-muted/30 p-4">
                      <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">Ваше замовлення</h3>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div key={item.id} className="flex justify-between gap-4 text-sm">
                            <span>
                              {item.name} {item.flavor} × {item.quantity}
                            </span>
                            <span className="font-mono">{item.price * item.quantity} ₴</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex justify-between border-t border-border/30 pt-3 font-bold">
                        <span>Разом</span>
                        <span className="font-mono text-primary">{totalPrice} ₴</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 border-t border-border/30 p-6">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={isSubmitting}
                      className="flex-1 rounded-xl border border-border/50 py-3.5 font-bold text-foreground transition-all hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Назад
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting || items.length === 0}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-bold uppercase tracking-wider text-primary-foreground transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Підтвердити"}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal;
