import { Link } from "react-router-dom";
import { BRAND_TAGLINE, PHONE_DISPLAY, PHONE, EMAIL, SOCIALS, WORK_HOURS } from "@/config/site";
import { categoriesSorted } from "@/data/catalog";

const columns = [
  {
    title: "Меню",
    links: [
      { label: "Усі категорії", to: "/menu" },
      ...categoriesSorted.slice(0, 5).map((c) => ({ label: c.title, to: `/menu/${c.slug}` })),
    ],
  },
  {
    title: "Клієнту",
    links: [
      { label: "Магазини", to: "/shops" },
      { label: "Блог", to: "/blog" },
      { label: "Зворотній зв'язок", to: "/contacts" },
      { label: "Франшиза", to: "/franchise" },
    ],
  },
  {
    title: "Про нас",
    links: [
      { label: "Кухня за склом", to: "/about" },
      { label: "Доставка та оплата", to: "/delivery" },
    ],
  },
];

const socials = [
  { label: "Instagram", href: SOCIALS.instagram },
  { label: "Facebook", href: SOCIALS.facebook },
  { label: "YouTube", href: SOCIALS.youtube },
  { label: "Telegram", href: SOCIALS.telegram },
];

const Footer = () => (
  <footer className="bg-stone-950 text-white border-t border-white/10 px-6 py-14">
    <div className="max-w-7xl mx-auto grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
      <div>
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary font-black text-xs">ГБ</span>
          <span className="leading-4 text-sm font-bold">Галя<br />Балувана</span>
        </div>
        <p className="mt-5 text-sm text-white/55 max-w-xs">{BRAND_TAGLINE}.</p>
        <div className="mt-5 space-y-1 text-sm text-white/70">
          <a href={`tel:${PHONE}`} className="block hover:text-white">{PHONE_DISPLAY}</a>
          <a href={`mailto:${EMAIL}`} className="block hover:text-white">{EMAIL}</a>
          <p className="text-white/45">{WORK_HOURS}</p>
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
          <h3 className="font-bold">{col.title}</h3>
          <div className="mt-4 grid gap-2 text-sm text-white/60">
            {col.links.map((l) => (
              <Link key={l.to + l.label} to={l.to} className="hover:text-white">{l.label}</Link>
            ))}
          </div>
        </div>
      ))}
    </div>
    <p className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 text-xs text-white/40">
      © {new Date().getFullYear()} Галя Балувана. Демонстраційна версія: адреси магазинів,
      телефони та фото потребують заповнення реальними даними мережі.
    </p>
  </footer>
);

export default Footer;
