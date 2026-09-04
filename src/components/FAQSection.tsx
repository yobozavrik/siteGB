import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqItems } from "@/data/faq";

const ease = [0.16, 1, 0.3, 1] as const;

const FAQSection = () => (
  <section id="faq" className="section-padding relative overflow-hidden">
    <div className="section-accent pointer-events-none absolute inset-0 opacity-[0.03]" />
    <div className="relative mx-auto max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease }}
        className="mb-14 text-center"
      >
        <span className="mb-4 block text-sm font-bold uppercase tracking-[0.3em] text-primary">
          <HelpCircle className="mr-2 inline h-4 w-4" />
          Питання й відповіді
        </span>
        <h2 className="text-4xl font-black md:text-5xl">
          Коротко про <span className="text-gradient-brand">головне</span>
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease, delay: 0.2 }}
      >
        <Accordion type="single" collapsible className="space-y-3">
          {faqItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease, delay: i * 0.07 }}
            >
              <AccordionItem
                value={`faq-${i}`}
                className="glass-card overflow-hidden rounded-xl border border-border/40 px-6 transition-colors data-[state=open]:border-primary/30"
              >
                <AccordionTrigger className="py-5 text-left text-base font-bold hover:text-primary hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-foreground/60">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </motion.div>
    </div>
  </section>
);

export default FAQSection;
