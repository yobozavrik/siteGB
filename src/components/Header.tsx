import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

const nav = [
  { label: "Меню", to: "/menu" },
  { label: "Доставка", to: "/delivery" },
  { label: "Магазини", to: "/shops" },
  { label: "Про нас", to: "/about" },
  { label: "Блог", to: "/blog" },
  { label: "Контакти", to: "/contacts" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm transition-colors ${isActive ? "text-white" : "text-white/75 hover:text-white"}`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-stone-950/90 text-white backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3" aria-label="Галя Балувана — на головну">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary font-black text-xs">ГБ</span>
          <span className="leading-4 text-sm font-bold">Галя<br />Балувана</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
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
          <button onClick={() => setOpen(!open)} aria-label="Меню" aria-expanded={open} className="lg:hidden p-2">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-white/10 px-6 py-5 flex flex-col gap-4 bg-stone-950">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="text-left text-white/85 hover:text-white"
            >
              {item.label}
            </NavLink>
          ))}
          <Link to="/cart" onClick={() => setOpen(false)} className="text-left text-white/85 hover:text-white">
            Кошик{totalItems > 0 ? ` · ${totalItems}` : ""}
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
