import { Phone, Mail, Clock, Instagram, MessageCircle } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import SEO from "@/components/SEO";
import ContactForm from "@/components/ContactForm";
import { PHONE, PHONE_DISPLAY, EMAIL, FRANCHISE_EMAIL, SOCIALS, WORK_HOURS, SUPPORT_HOURS, SITE_URL } from "@/config/site";

const ContactsPage = () => (
  <SiteLayout
    seo={
      <SEO
        title="Контакти — Галя Балувана"
        description="Телефон, пошта, соцмережі та форма зворотного зв'язку. Відповідаємо у робочі години."
        path="/contacts"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Галя Балувана",
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
      <h1>Зворотній <b>зв'язок</b></h1>

      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Телефон / Viber</p>
            <a href={`tel:${PHONE}`} className="flex items-center gap-2 font-semibold">
              <Phone className="h-4 w-4 text-primary" /> {PHONE_DISPLAY}
            </a>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Пошта</p>
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 font-semibold">
              <Mail className="h-4 w-4 text-primary" /> {EMAIL}
            </a>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Графік</p>
            <p className="flex items-center gap-2 font-semibold">
              <Clock className="h-4 w-4 text-primary" /> {WORK_HOURS}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Соцмережі</p>
            <div className="flex gap-4 font-semibold">
              <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                <Instagram className="h-4 w-4 text-primary" /> Instagram
              </a>
              <a href={SOCIALS.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                <MessageCircle className="h-4 w-4 text-primary" /> Telegram
              </a>
            </div>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Співпраця / франшиза</p>
            <a href={`mailto:${FRANCHISE_EMAIL}`} className="font-semibold">{FRANCHISE_EMAIL}</a>
          </div>
          <p className="text-xs text-muted-foreground">Відповідаємо: {SUPPORT_HOURS}.</p>
        </div>

        <div className="gb-form-box p-6">
          <h2>Написати нам</h2>
          <ContactForm subjectTag="Контакт" messagePlaceholder="Питання, відгук, пропозиція…" />
        </div>
      </div>
    </div>
  </SiteLayout>
);

export default ContactsPage;
