import { motion } from "framer-motion";
import { Shield, Sparkles, Leaf, Award } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const features = [
  {
    icon: Leaf,
    title: "Натуральний склад",
    desc: "Виключно натуральні інгредієнти: канна, L-тіанін, гліцин, магній, Kava Kava, пуер, CBD.",
  },
  {
    icon: Sparkles,
    title: "Тонізуючі властивості",
    desc: "Стимулюють імунну систему та покращують когнітивні функції без побічних ефектів.",
  },
  {
    icon: Shield,
    title: "Легальність та безпека",
    desc: "Повна відповідність нормативам безпеки, підтверджена офіційною сертифікацією.",
  },
  {
    icon: Award,
    title: "Культурна спадщина",
    desc: "Унікальні рослини, які століттями використовувалися для покращення настрою та здоров'я.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease },
  },
};

const AboutSection = () => {
  return (
    <section id="about" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle at 30% 40%, hsl(var(--primary)) 0%, transparent 50%), radial-gradient(circle at 70% 60%, hsl(var(--secondary)) 0%, transparent 50%)"
      }} />

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-bold tracking-[0.3em] uppercase block mb-4">Філософія</span>
          <h2 className="text-4xl md:text-5xl font-black">
            Що таке <span className="text-gradient-brand">KRATEA</span>?
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.3, ease } }}
              className="glass-card p-8 group hover:border-primary/30 transition-all duration-500"
            >
              <div className="flex items-start gap-4">
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors"
                >
                  <f.icon className="h-6 w-6" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                  <p className="text-foreground/60 leading-relaxed text-sm">{f.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
