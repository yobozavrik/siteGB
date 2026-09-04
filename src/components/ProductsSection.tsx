import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import canGrapefruit from "@/assets/can-grapefruit-new.png";
import canOrange from "@/assets/can-orange-new.png";
import canApple from "@/assets/can-apple-new.png";
import { ShoppingCart } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const products = [
  {
    id: "grapefruit",
    name: "KRATEA",
    flavor: "Grapefruit",
    desc: "Напій із кореня кава-кава — рослини з островів Тихого океану. Знімає стрес, розслабляє тіло, прояснює розум.",
    price: 199,
    image: canGrapefruit,
    cardClass: "product-card-grapefruit",
    badgeClass: "bg-grapefruit",
    glowClass: "glow-pink",
  },
  {
    id: "orange",
    name: "KRATEA",
    flavor: "Orange",
    desc: "Зроблений з Африканської канни — рослина з Південної Африки. Дає заряд енергії та піднімає настрій.",
    price: 199,
    image: canOrange,
    cardClass: "product-card-orange",
    badgeClass: "bg-orange",
    glowClass: "glow-orange",
  },
  {
    id: "apple",
    name: "KRATEA",
    flavor: "З соком яблука",
    desc: "Містить амінокислоту GABA — природну речовину, що виробляється мозком. Заспокоює, покращує сон і концентрацію.",
    price: 199,
    image: canApple,
    cardClass: "product-card-apple",
    badgeClass: "bg-apple",
    glowClass: "glow-green",
  },
];

const ProductsSection = () => {
  const { addItem } = useCart();

  return (
    <section id="products" className="section-padding relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle at 20% 50%, hsl(var(--primary)) 0%, transparent 50%), radial-gradient(circle at 80% 50%, hsl(var(--secondary)) 0%, transparent 50%)"
      }} />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.3em" }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease }}
            className="text-primary text-sm font-bold tracking-[0.3em] uppercase block mb-4"
          >
            Лінійка продуктів
          </motion.span>
          <h2 className="text-4xl md:text-6xl font-black mb-4">Наші напої</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Результат інноваційних досліджень і сучасних технологій
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 60, rotateX: 15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease, delay: i * 0.15 }}
              whileHover={{ y: -12, transition: { duration: 0.4, ease } }}
              className={`${product.cardClass} rounded-3xl p-8 flex flex-col items-center text-center group cursor-pointer`}
            >
              <motion.div
                className="relative mb-8"
                whileHover={{ scale: 1.08, rotate: 2 }}
                transition={{ duration: 0.4, ease }}
              >
                <img
                  src={product.image}
                  alt={`Бляшанка напою KRATEA зі смаком ${product.flavor}`}
                  className="w-36 h-52 object-contain drop-shadow-2xl"
                />

                {/* Glow behind can */}
                <div className="absolute inset-0 -z-10 blur-3xl opacity-30 group-hover:opacity-50 transition-opacity" style={{
                  background: product.id === 'grapefruit' ? 'hsl(var(--grapefruit))' : product.id === 'orange' ? 'hsl(var(--orange))' : 'hsl(var(--apple))'
                }} />
              </motion.div>

              <h3 className="text-2xl font-black tracking-wide">{product.name}</h3>
              <motion.span
                className={`${product.badgeClass} text-primary-foreground px-6 py-1.5 rounded-full font-semibold text-sm mt-2 mb-4`}
                whileHover={{ scale: 1.05 }}
              >
                {product.flavor}
              </motion.span>

              <p className="text-foreground/60 text-sm leading-relaxed mb-6 flex-1">{product.desc}</p>

              <p className="text-2xl font-black font-mono mb-4">{product.price} <span className="text-sm font-medium text-muted-foreground">грн</span></p>

              <motion.button
                onClick={() =>
                  addItem({
                    id: product.id,
                    name: product.name,
                    flavor: product.flavor,
                    price: product.price,
                    image: product.image,
                  })
                }
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className="w-full bg-muted hover:bg-primary hover:text-primary-foreground text-foreground py-3.5 rounded-2xl font-bold transition-all uppercase tracking-wider text-sm flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                В кошик
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
