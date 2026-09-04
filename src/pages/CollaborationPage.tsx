import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SEO from "@/components/SEO";

import { Rocket, Megaphone, Truck } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const benefits = [
  {
    icon: Rocket,
    title: "Унікальний продукт",
    desc: "Унікальні напої, які не мають аналогів на ринку. Це новий тренд у світі натуральних функціональних напоїв, що привертає увагу споживачів. Саме у вас можливість першими запропонувати ексклюзивні продукти вашим клієнтам та отримати високий прибуток.",
  },
  {
    icon: Megaphone,
    title: "Маркетингова підтримка",
    desc: "Ми забезпечуємо потужну маркетингову підтримку: просування у соцмережах, колаборації з інфлюенсерами та рекламні кампанії. Співпрацюючи з нами, ви отримуєте не лише ексклюзивний продукт, а й ефективні інструменти для збільшення продажів.",
  },
  {
    icon: Truck,
    title: "Швидка доставка",
    desc: "Ми гарантуємо швидкі поставки по всій Україні, щоб ваш бізнес працював без перебоїв. Оперативна логістика та стабільні запаси забезпечують безперервні продажі.",
  },
];

const CollaborationPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Співпраця з KRATEA — для дистриб'юторів і мереж"
        description="Стань партнером KRATEA: ексклюзивний продукт, маркетингова підтримка та швидкі поставки по всій Україні."
        path="/collaboration"
      />
      <Header />
      <CartDrawer />

      <section className="pt-32 section-padding">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-black mb-6">Заробляй з KRATEA</h1>
            <p className="text-xl text-foreground/60 max-w-3xl mx-auto leading-relaxed">
              Ми відкриті для співпраці з дистриб'юторами та роздрібними мережами, які зацікавлені у впровадженні нашого інноваційного продукту на свої ринки.
            </p>
          </motion.div>

          <h2 className="sr-only">Переваги співпраці з KRATEA</h2>



          <div className="space-y-8">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease, delay: 0.2 + i * 0.15 }}
                className="glass-card p-8 md:p-10 flex flex-col md:flex-row gap-6 items-start"
              >
                <div className="p-4 rounded-2xl bg-primary/10 shrink-0">
                  <b.icon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">{b.title}</h3>
                  <p className="text-foreground/60 leading-relaxed">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CollaborationPage;
