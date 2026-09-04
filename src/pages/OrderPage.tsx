import { Link, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import SEO from "@/components/SEO";
import { PHONE_DISPLAY, PHONE } from "@/config/site";

const OrderPage = () => {
  const { id } = useParams<{ id: string }>();
  const short = id ? id.slice(0, 8).toUpperCase() : "—";

  return (
    <SiteLayout seo={<SEO title="Замовлення прийнято — Галя Балувана" description="Дякуємо за замовлення." path="/order" />}>
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-primary" />
        <h1 className="mt-5 text-2xl font-black">Замовлення прийнято</h1>
        <p className="mt-2 text-muted-foreground">
          Номер замовлення <b className="text-foreground">#{short}</b>. Ми зателефонуємо, щоб
          підтвердити склад і час. Підтвердження також надійде у Viber або SMS.
        </p>

        <div className="mt-8 rounded-2xl border border-border bg-card p-5 text-left text-sm">
          <p className="font-bold">Що далі</p>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li>• Менеджер підтверджує замовлення протягом робочого часу.</li>
            <li>• Для доставки — кур'єр виїжджає у вибраний час.</li>
            <li>• Для самовивозу — замовлення буде готове за 30–40 хв після підтвердження.</li>
          </ul>
          <p className="mt-3">
            Питання? <a href={`tel:${PHONE}`} className="font-semibold text-primary">{PHONE_DISPLAY}</a>
          </p>
        </div>

        <Link to="/menu" className="mt-8 inline-block rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground">
          Повернутися до меню
        </Link>
      </div>
    </SiteLayout>
  );
};

export default OrderPage;
