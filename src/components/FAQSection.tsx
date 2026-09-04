import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqItems } from "@/data/faq";

const FAQSection = () => (
  <section id="faq" className="section-padding bg-background">
    <div className="mx-auto max-w-3xl">
      <p className="mb-4 text-sm font-bold uppercase tracking-[.25em] text-primary">Питання й відповіді</p>
      <h2 className="text-4xl font-black md:text-5xl">Коротко про головне</h2>
      <Accordion type="single" collapsible className="mt-8">
        {faqItems.map((item, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-left text-base font-bold">{item.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQSection;
