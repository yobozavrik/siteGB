import { Link } from "react-router-dom";
import { BRAND_TAGLINE, PHONE_DISPLAY, PHONE_ALT_DISPLAY, PHONE, EMAIL, SOCIALS, WORK_HOURS } from "@/config/site";
import { categoriesSorted } from "@/data/catalog";

const columns = [
  {
    title: "Меню страв",
    links: [
      { label: "Усі категорії", to: "/menu" },
      ...categoriesSorted.slice(0, 6).map((c) => ({ label: c.title, to: `/menu/${c.slug}` })),
    ],
  },
  {
    title: "Інформація",
    links: [
      { label: "Магазини у Чернівцях", to: "/shops" },
      { label: "Блог та Новини", to: "/blog" },
      { label: "Контакти та зворотній зв'язок", to: "/contacts" },
      { label: "Відкрита кухня за склом", to: "/about" },
    ],
  },
  {
    title: "Локації",
    links: [
      { label: "вул. Героїв Майдану, 57", to: "/shops" },
      { label: "просп. Незалежності, 52А", to: "/shops" },
      { label: "вул. Руська (219, 255)", to: "/shops" },
      { label: "вул. Ентузіастів, 5-А", to: "/shops" },
      { label: "вул. Головна, 226", to: "/shops" },
    ],
  },
];

const socials = [
  { label: "Instagram", href: SOCIALS.instagram },
  { label: "Facebook", href: SOCIALS.facebook },
  { label: "Viber", href: SOCIALS.viber },
  { label: "Telegram", href: SOCIALS.telegram },
];

const Footer = () => (
  <footer className="bg-stone-950 text-white border-t border-white/10 px-6 py-14">
    <div className="max-w-7xl mx-auto grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
      <div>
        <div className="flex items-center gap-2.5">
          <img
            src="https://galia-baluvana.com/images/logo.svg"
            alt="Логотип Галя Балувана Чернівці"
            width="152"
            height="48"
            className="h-10 w-auto max-w-[142px] shrink-0"
          />
        </div>
        <p className="mt-4 text-sm text-white/70 max-w-xs">{BRAND_TAGLINE}.</p>
        <div className="mt-5 space-y-1 text-sm text-white/80">
          <a href={`tel:${PHONE}`} className="block font-bold hover:text-white">
            {PHONE_DISPLAY}
          </a>
          <a href="tel:+380977756942" className="block text-white/70 hover:text-white">
            {PHONE_ALT_DISPLAY}
          </a>
          <a href={`mailto:${EMAIL}`} className="block text-white/70 hover:text-white">
            {EMAIL}
          </a>
          <p className="text-xs text-white/50 pt-1">{WORK_HOURS}</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-4 text-sm text-white/70">
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {columns.map((col) => (
        <div key={col.title}>
          <h3 className="font-bold text-white/90">{col.title}</h3>
          <div className="mt-4 grid gap-2.5 text-sm text-white/60">
            {col.links.map((l, i) => (
              <Link key={l.to + l.label + i} to={l.to} className="hover:text-white transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
    <p className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 text-xs text-white/40">
      © {new Date().getFullYear()} Галя Балувана Чернівці. Напівфабрикати ручного ліплення. Всі права захищено.
    </p>
  </footer>
);

export default Footer;
