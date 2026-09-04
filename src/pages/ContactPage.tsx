import { motion } from "framer-motion";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import SEO from "@/components/SEO";

import { Send, Phone, Mail, MapPin, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const ease = [0.16, 1, 0.3, 1] as const;

const contactInfo = [
  { icon: Phone, label: "ТЕЛЕФОН", value: "+380 44 123 45 67" },
  { icon: Mail, label: "EMAIL", value: "hello@example.com" },
  { icon: MapPin, label: "АДРЕСА", value: "Україна, м. Київ" },
  { icon: Clock, label: "ГРАФІК", value: "Пн–Пт: 9:00 – 18:00" },
];

const socials = [
  { name: "Instagram", href: "https://www.instagram.com/kratea_official/" },
  { name: "TikTok", href: "https://www.tiktok.com/@kratea" },
];

const SITE_URL = "https://kratea-official.com";

const contactJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "KRATEA",
    image: `${SITE_URL}/og-image.jpg`,
    url: SITE_URL,
    telephone: "+380 44 123 45 67",
    email: "hello@example.com",
    address: {
      "@type": "PostalAddress",
      addressCountry: "UA",
      addressLocality: "Київ",
      addressRegion: "Київська область",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    sameAs: [
      "https://www.instagram.com/kratea_official/",
      "https://www.tiktok.com/@kratea",
    ],
  },
];

const ContactPage = () => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    const { error } = await supabase.from("contact_messages").insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      message: form.message || null,
    });

    setSending(false);

    if (error) {
      toast({ variant: "destructive", title: "Помилка", description: "Не вдалося надіслати. Спробуйте ще раз." });
      return;
    }

    setSent(true);
    setForm({ name: "", email: "", phone: "", message: "" });
    toast({ title: "Надіслано!", description: "Ми зв'яжемося з вами найближчим часом." });
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Контакти KRATEA — зв'яжіться з нами"
        description="Зв'яжіться з KRATEA для замовлення, співпраці чи питань. Телефон, email і форма зворотного зв'язку."
        path="/contact"
        jsonLd={contactJsonLd}
      />
      <Header />
      <CartDrawer />

      <section className="pt-32 pb-20 section-padding">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-black mb-2 tracking-tight">КОНТАКТИ</h1>
            <div className="w-12 h-1 bg-primary mx-auto mb-6 rounded-full" />
            <p className="text-lg text-muted-foreground">
              Зв'яжіться з нами для замовлення або співпраці
            </p>
          </motion.div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left — Contact info cards */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.2 }}
              className="flex flex-col gap-4"
            >
              {contactInfo.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease, delay: 0.3 + i * 0.1 }}
                  className="glass-card p-6 flex items-start gap-4"
                >
                  <div className="p-3 rounded-full bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-widest text-muted-foreground mb-1">{item.label}</p>
                    <p className="text-foreground font-medium">{item.value}</p>
                  </div>
                </motion.div>
              ))}

              {/* Social links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease, delay: 0.7 }}
                className="glass-card p-6"
              >
                <p className="text-xs font-semibold tracking-widest text-muted-foreground mb-4">МИ В СОЦМЕРЕЖАХ</p>
                <div className="flex items-center gap-4">
                  {socials.map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
                    >
                      {s.name}
                    </a>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right — Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.3 }}
            >
              <div className="glass-card p-8 md:p-10">
                <h2 className="text-2xl font-black mb-8">Напишіть нам</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-semibold tracking-widest text-muted-foreground mb-2">ІМ'Я *</label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Ваше ім'я"
                      className="w-full bg-input border border-border/50 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-semibold tracking-widest text-muted-foreground mb-2">EMAIL *</label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full bg-input border border-border/50 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="block text-xs font-semibold tracking-widest text-muted-foreground mb-2">ТЕЛЕФОН</label>
                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+380 XX XXX XX XX"
                      className="w-full bg-input border border-border/50 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-semibold tracking-widest text-muted-foreground mb-2">ПОВІДОМЛЕННЯ *</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={4}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Ваше повідомлення..."
                      className="w-full bg-input border border-border/50 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                    />
                  </div>


                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:brightness-110 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {sent ? (
                      "Надіслано! ✓"
                    ) : sending ? (
                      "Надсилається..."
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        НАДІСЛАТИ
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
