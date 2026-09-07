import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { MapPin, Menu, X, ShoppingCart, Phone } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { SHOW_PRICES, PHONE, PHONE_DISPLAY } from "@/config/site";

const nav = [
  { label: "Меню", to: "/menu" },
  { label: "Магазини Чернівці", to: "/shops" },
  { label: "Блог та Новини", to: "/blog" },
  { label: "Контакти", to: "/contacts" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold transition-colors ${isActive ? "text-primary font-bold" : "text-foreground/75 hover:text-primary"}`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/95 text-foreground backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5" aria-label="Галя Балувана Чернівці — на головну">
            <img
              src="/logo.svg"
              alt="Логотип Галя Балувана"
              width="152"
              height="48"
              className="h-10 w-auto max-w-[142px] shrink-0"
            />
          </Link>
          <span className="hidden sm:inline-block rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
            Чернівці
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-7">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${PHONE}`}
            className="hidden xl:inline-flex items-center gap-1.5 text-xs font-bold text-foreground/80 hover:text-primary"
          >
            <Phone size={14} className="text-primary" /> {PHONE_DISPLAY}
          </a>

          <Link
            to="/shops"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground hover:opacity-90 transition"
          >
            <MapPin size={14} /> 14 магазинів
          </Link>

          {SHOW_PRICES && (
            <>
              <Link to="/cart" className="relative p-2 hidden sm:block" aria-label="Кошик">
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 px-0.5 place-items-center rounded-full bg-primary text-[10px] font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>
              <button onClick={() => setIsCartOpen(true)} aria-label="Відкрити кошик" className="relative p-2 sm:hidden">
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 px-0.5 place-items-center rounded-full bg-primary text-[10px] font-bold">
                    {totalItems}
                  </span>
                )}
              </button>
            </>
          )}

          <button onClick={() => setOpen(!open)} aria-label="Меню" aria-expanded={open} className="md:hidden p-2">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border/70 px-6 py-5 flex flex-col gap-4 bg-background">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="text-left font-medium text-foreground/80 hover:text-primary py-1"
            >
              {item.label}
            </NavLink>
          ))}
          <a
            href={`tel:${PHONE}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-primary pt-2 border-t border-border/50"
          >
            <Phone size={15} /> {PHONE_DISPLAY}
          </a>
        </nav>
      )}
    </header>
  );
};

export default Header;
