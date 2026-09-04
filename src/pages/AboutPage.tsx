import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SEO from "@/components/SEO";

import { Shield, Sparkles, Leaf, Award, Heart, Globe } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const values = [
  { icon: Leaf, title: "Натуральність", desc: "Ми використовуємо лише природні інгредієнти, перевірені тисячоліттями використання різними культурами." },
  { icon: Heart, title: "Піклування", desc: "Кожен продукт створений з турботою про ваше здоров'я та самопочуття." },
  { icon: Globe, title: "Інновації", desc: "Поєднуємо стародавні знання з сучасними технологіями виробництва." },
  { icon: Shield, title: "Якість", desc: "Суворий контроль якості на кожному етапі виробництва." },
  { icon: Sparkles, title: "Ефективність", desc: "Наші формули розроблені для максимальної ефективності та м'якої дії." },
  { icon: Award, title: "Сертифікація", desc: "Усі продукти сертифіковані та відповідають нормативам безпеки України." },
];

const SITE_URL = "https://kratea-official.com";

const aboutJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "KRATEA",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.png`,
    description: "KRATEA — натуральні функціональні напої від GoldProduct.",
    sameAs: [
      "https://www.instagram.com/kratea_official/",
      "https://www.tiktok.com/@kratea",
    ],
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Про нас — KRATEA"
        description="KRATEA — бренд функціональних напоїв від GoldProduct. Натуральні інгредієнти, сучасні технології, турбота про здоров'я."
        path="/about"
        jsonLd={aboutJsonLd}
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
            <h1 className="text-5xl md:text-6xl font-black mb-6">Про нас</h1>
            <p className="text-xl text-foreground/60 max-w-3xl mx-auto leading-relaxed">
              KRATEA — це бренд функціональних напоїв від GoldProduct. Ми створили продукт, який поєднує в собі всю енергію і корисні властивості рослин, відомих людству вже більше тисячі років.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.2 }}
            className="glass-card p-8 md:p-12 mb-16"
          >
            <h2 className="text-2xl font-bold mb-4">Наша місія</h2>
            <p className="text-foreground/70 leading-relaxed text-lg">
              Ми прагнемо зробити натуральні функціональні напої доступними для кожного. Наші продукти допомагають людям знайти баланс між енергією та спокоєм, використовуючи силу природи без штучних стимуляторів та шкідливих добавок.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.3 + i * 0.1 }}
                className="glass-surface p-6 group hover:border-primary/30 transition-colors"
              >
                <v.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-bold mb-2">{v.title}</h3>
                <p className="text-foreground/60 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
