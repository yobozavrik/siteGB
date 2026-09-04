import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import SiteLayout from "@/components/SiteLayout";
import SEO from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404: маршрут не знайдено —", location.pathname);
  }, [location.pathname]);

  return (
    <SiteLayout seo={<SEO title="Сторінку не знайдено — Галя Балувана" description="Такої сторінки немає." path={location.pathname} />}>
      <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center">
        <p className="text-6xl font-black text-primary">404</p>
        <h1 className="mt-3 text-2xl font-black">Сторінку не знайдено</h1>
        <p className="mt-2 text-muted-foreground">
          Можливо, посилання застаріле. Спробуйте меню або головну.
        </p>
        <div className="mt-6 flex gap-3">
          <Link to="/" className="rounded-full border border-border px-5 py-2.5 font-bold">На головну</Link>
          <Link to="/menu" className="rounded-full bg-primary px-5 py-2.5 font-bold text-primary-foreground">До меню</Link>
        </div>
      </div>
    </SiteLayout>
  );
};

export default NotFound;
