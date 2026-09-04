import { Check } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import SEO from "@/components/SEO";
import ContactForm from "@/components/ContactForm";
import { FRANCHISE_EMAIL, SITE_URL } from "@/config/site";

const points = [
  "Готова рецептурна база й технологічні карти на весь асортимент",
  "Обладнання та планування цеху «за склом» у торговому залі",
  "Навчання персоналу, стандарти ліплення й викладки",
  "Маркетингова підтримка, макети, вивіски, локальні акції",
  "Постачання інгредієнтів і пакування за єдиними цінами",
];

const FranchisePage = () => (
  <SiteLayout
    seo={
      <SEO
        title="Франшиза Галя Балувана — відкрити магазин напівфабрикатів"
        description="Умови франшизи мережі домашніх напівфабрикатів «Галя Балувана»: рецептура, обладнання, навчання, маркетинг. Залиште заявку."
        path="/franchise"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Головна", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "Франшиза", item: `${SITE_URL}/franchise` },
            ],
          },
        ]}
      />
    }
  >
    <div className="gb-page mx-auto max-w-4xl px-6 py-16 md:px-12 lg:px-20">
      <h1>Відкрийте свій магазин <b>«Галя Балувана»</b></h1>
      <p className="gb-page__lead">
        Формат — виробництво-магазин: невеликий цех ручного ліплення за склом і вітрина з
        готовими напівфабрикатами. Ми передаємо рецептуру, стандарти й підтримку, ви керуєте
        точкою у своєму місті.
      </p>

      <ul className="mt-8 space-y-3">
        {points.map((p) => (
          <li key={p} className="flex gap-3 text-sm">
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <span>{p}</span>
          </li>
        ))}
      </ul>

      <div className="gb-form-box mt-10 p-6">
        <h2>Заявка на партнерство</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Розкажіть про місто й приміщення — надішлемо актуальні умови. Або пишіть на{" "}
          <a href={`mailto:${FRANCHISE_EMAIL}`} className="font-semibold text-primary">{FRANCHISE_EMAIL}</a>.
        </p>
        <div className="mt-4">
          <ContactForm
            subjectTag="Франшиза"
            submitLabel="Надіслати заявку"
            messagePlaceholder="Місто, орієнтовне приміщення (м²), досвід у рітейлі/HoReCa…"
          />
        </div>
      </div>
    </div>
  </SiteLayout>
);

export default FranchisePage;
