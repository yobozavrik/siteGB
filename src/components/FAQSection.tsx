import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const faqs = [
  {
    q: "Що таке канна і навіщо вона в напої?",
    a: "Канна (Sceletium tortuosum) — рослина з Південної Африки, яка традиційно використовується для покращення настрою та зменшення стресу. Містить природні алкалоїди, що м'яко впливають на нервову систему.",
  },
  {
    q: "Який ефект дає кава-кава?",
    a: "Кава-кава — рослина з островів Тихого океану, відома розслабляючими властивостями. Допомагає знизити тривожність і м'язове напруження без впливу на ясність розуму.",
  },
  {
    q: "Що таке GABA і як вона працює?",
    a: "GABA (гамма-аміномасляна кислота) — нейромедіатор, який природно виробляється мозком. Зменшує нервову збудливість, покращує якість сну та сприяє глибокому розслабленню.",
  },
  {
    q: "Що таке CBD і чи має він психоактивний ефект?",
    a: "CBD (канабідіол) — природна речовина з рослини коноплі, яка НЕ має психоактивного ефекту. Використовується для зняття стресу та покращення загального самопочуття.",
  },
  {
    q: "Чи безпечно це та чи викликає звикання?",
    a: "Так, наші напої повністю безпечні та не викликають звикання. Усі інгредієнти дозволені в Україні та підтверджені сертифікатами МОЗ.",
  },
];

const FAQSection = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle at 50% 20%, hsl(var(--primary)) 0%, transparent 50%)"
      }} />

      <div className="max-w-3xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="text-center mb-14"
        >
          <span className="text-primary text-sm font-bold tracking-[0.3em] uppercase block mb-4">
            <HelpCircle className="inline h-4 w-4 mr-2" />
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-black">
            Часті <span className="text-gradient-brand">питання</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease, delay: i * 0.08 }}
              >
                <AccordionItem
                  value={`item-${i}`}
                  className="glass-card px-6 border border-border/20 rounded-xl overflow-hidden data-[state=open]:border-primary/20 transition-colors"
                >
                  <AccordionTrigger className="text-left text-base font-semibold py-5 hover:no-underline hover:text-primary transition-colors">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/60 pb-5 leading-relaxed text-sm">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
