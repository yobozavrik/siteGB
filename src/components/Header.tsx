import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { MapPin, Menu, X, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { SHOW_PRICES } from "@/config/site";

const nav = [
  { label: "Магазини", to: "/shops" },
  { label: "Меню", to: "/menu" },
  { label: "Новини", to: "/blog" },
  { label: "Зворотній зв'язок", to: "/contacts" },
  { label: "Франшиза", to: "/franchise" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${isActive ? "text-primary" : "text-foreground/70 hover:text-primary"}`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/95 text-foreground backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Галя Балувана — на головну">
          <img src="https://galia-baluvana.com/images/logo.svg" alt="Логотип Галя Балувана" width="152" height="48" className="h-10 w-auto max-w-[142px] shrink-0" />
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/shops" className="hidden items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground sm:inline-flex">
            <MapPin size={15} /> Магазини
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
          <button onClick={() => setOpen(!open)} aria-label="Меню" aria-expanded={open} className="lg:hidden p-2">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-border/70 px-6 py-5 flex flex-col gap-4 bg-background">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="text-left text-foreground/80 hover:text-primary"
            >
              {item.label}
            </NavLink>
          ))}
          {SHOW_PRICES && (
            <Link to="/cart" onClick={() => setOpen(false)} className="text-left text-foreground/80 hover:text-primary">
              Кошик{totalItems > 0 ? ` · ${totalItems}` : ""}
            </Link>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
