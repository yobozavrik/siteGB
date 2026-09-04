import SiteLayout from "@/components/SiteLayout";
import SEO from "@/components/SEO";
import { deliveryZones, paymentMethods, pickupNote } from "@/data/delivery";
import { DELIVERY_HOURS, MIN_ORDER_UAH, SITE_URL } from "@/config/site";

const DeliveryPage = () => (
  <SiteLayout
    seo={
      <SEO
        title="Доставка та оплата — Галя Балувана"
        description="Зони й тарифи доставки по Києву та Україні, способи оплати, умови самовивозу з магазину."
        path="/delivery"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Головна", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "Доставка та оплата", item: `${SITE_URL}/delivery` },
            ],
          },
        ]}
      />
    }
  >
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-black md:text-4xl">Доставка та оплата</h1>
      <p className="mt-3 text-muted-foreground">
        Доставляємо щодня {DELIVERY_HOURS} у день замовлення. Мінімальна сума замовлення —{" "}
        {MIN_ORDER_UAH} ₴.
      </p>

      <h2 className="mt-10 text-lg font-black">Зони та тарифи</h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="border border-border p-3">Зона</th>
              <th className="border border-border p-3">Вартість</th>
              <th className="border border-border p-3">Безкоштовно від</th>
              <th className="border border-border p-3">Час</th>
            </tr>
          </thead>
          <tbody>
            {deliveryZones.map((z) => (
              <tr key={z.id}>
                <td className="border border-border p-3">
                  {z.name}
                  {z.note && <span className="block text-xs text-muted-foreground">{z.note}</span>}
                </td>
                <td className="border border-border p-3 tabular-nums">
                  {z.costUAH == null ? "за тарифом перевізника" : `${z.costUAH} ₴`}
                </td>
                <td className="border border-border p-3 tabular-nums">
                  {z.freeFromUAH == null ? "—" : `${z.freeFromUAH} ₴`}
                </td>
                <td className="border border-border p-3">{z.eta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-lg font-black">Способи оплати</h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {paymentMethods.map((p) => (
          <li key={p.id} className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
            {p.label}
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-lg font-black">Самовивіз</h2>
      <p className="mt-3 text-muted-foreground">{pickupNote}</p>
    </div>
  </SiteLayout>
);

export default DeliveryPage;
