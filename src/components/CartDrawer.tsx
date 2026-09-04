import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { X, Plus, Minus, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 bg-card border-l border-border/30 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border/30">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Кошик{totalItems > 0 && <span className="text-muted-foreground font-normal">· {totalItems}</span>}
              </h2>
              <button onClick={() => setIsCartOpen(false)} aria-label="Закрити кошик" className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
                  <ShoppingCart className="h-16 w-16 opacity-30" />
                  <p className="text-lg">Кошик порожній</p>
                  <Link
                    to="/menu"
                    onClick={() => setIsCartOpen(false)}
                    className="rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground"
                  >
                    До меню
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    className="glass-surface p-4 flex gap-4 items-center"
                  >
                    <img src={item.image} alt="" className="w-16 h-16 object-cover rounded-lg bg-muted" />
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.slug}`}
                        onClick={() => setIsCartOpen(false)}
                        className="font-semibold leading-tight hover:text-primary line-clamp-2"
                      >
                        {item.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">{item.unitLabel}</p>
                      <p className="text-primary font-bold mt-1">{item.priceUAH} ₴</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Зменшити кількість" className="p-1 hover:bg-muted/50 rounded">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="font-mono w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Збільшити кількість" className="p-1 hover:bg-muted/50 rounded">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id)} aria-label="Видалити з кошика" className="p-1 text-muted-foreground hover:text-destructive">
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-border/30 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Разом:</span>
                  <span className="text-2xl font-bold font-mono">{totalPrice} ₴</span>
                </div>
                <Link
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg text-center hover:brightness-110 transition-all active:scale-[0.98]"
                >
                  Оформити замовлення
                </Link>
                <button onClick={clearCart} className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Очистити кошик
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
