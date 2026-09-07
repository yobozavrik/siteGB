import { Phone, Mail, Clock, Instagram, MessageCircle, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import SEO from "@/components/SEO";
import ContactForm from "@/components/ContactForm";
import {
  PHONE,
  PHONE_DISPLAY,
  PHONE_ALT,
  PHONE_ALT_DISPLAY,
  EMAIL,
  FRANCHISE_EMAIL,
  SOCIALS,
  WORK_HOURS,
  SUPPORT_HOURS,
  SITE_URL,
} from "@/config/site";

const ContactsPage = () => (
  <SiteLayout
    seo={
      <SEO
        title="Контакти — Галя Балувана Чернівці"
        description="Телефони, Viber, адреси магазинів у Чернівцях та форма зворотного зв'язку. Допоможемо з вибором напівфабрикатів."
        path="/contacts"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Галя Балувана Чернівці",
            url: SITE_URL,
            email: EMAIL,
            telephone: PHONE,
            sameAs: [SOCIALS.instagram, SOCIALS.facebook, SOCIALS.telegram],
          },
        ]}
      />
    }
  >
    <div className="gb-page mx-auto max-w-5xl px-6 py-16 md:px-12 lg:px-20">
      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-3">
        <MapPin size={14} /> Чернівці
      </div>
      <h1>Контакти та <b>зворотній зв'язок</b></h1>
      <p className="gb-page__lead">
        Маєте питання щодо асортименту, наявності страв або співпраці? Зателефонуйте нам або залиште повідомлення.
      </p>

      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <div className="space-y-5 text-sm">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold">Телефон / Viber (замовлення та довідка)</p>
            <a href={`tel:${PHONE}`} className="mt-1 flex items-center gap-2 text-base font-bold text-primary hover:underline">
              <Phone className="h-4 w-4" /> {PHONE_DISPLAY}
            </a>
            <a href={`tel:${PHONE_ALT}`} className="mt-1 flex items-center gap-2 text-sm font-semibold text-foreground/80 hover:text-primary">
              <Phone className="h-4 w-4 text-muted-foreground" /> {PHONE_ALT_DISPLAY} (Героїв Майдану, 57)
            </a>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold">Електронна пошта</p>
              <a href={`mailto:${EMAIL}`} className="mt-1 flex items-center gap-2 font-semibold hover:text-primary">
                <Mail className="h-4 w-4 text-primary" /> {EMAIL}
              </a>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold">Графік роботи магазинів</p>
              <p className="mt-1 flex items-center gap-2 font-semibold">
                <Clock className="h-4 w-4 text-primary" /> {WORK_HOURS}
              </p>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold">Соціальні мережі та месенджери</p>
              <div className="mt-1 flex flex-wrap gap-4 font-semibold">
                <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-primary hover:underline">
                  <Instagram className="h-4 w-4" /> Instagram
                </a>
                <a href={SOCIALS.viber} className="flex items-center gap-1.5 text-purple-600 hover:underline">
                  <MessageCircle className="h-4 w-4" /> Viber
                </a>
                <a href={SOCIALS.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sky-600 hover:underline">
                  <MessageCircle className="h-4 w-4" /> Telegram
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-bold text-foreground">Шукаєте найближчий магазин?</p>
              <p className="text-xs text-muted-foreground">14 локацій у всіх районах Чернівців</p>
            </div>
            <Link to="/shops" className="rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground hover:opacity-90">
              Мапа точок
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">Служба підтримки працює: {SUPPORT_HOURS}.</p>
        </div>

        <div className="gb-form-box p-6">
          <h2 className="text-xl font-black mb-1">Написати нам</h2>
          <p className="text-xs text-muted-foreground mb-4">Надішліть відгук чи запитання, і ми відповімо найближчим часом.</p>
          <ContactForm subjectTag="Чернівці" messagePlaceholder="Ваше запитання, відгук або пропозиція…" />
        </div>
      </div>
    </div>
  </SiteLayout>
);

export default ContactsPage;
