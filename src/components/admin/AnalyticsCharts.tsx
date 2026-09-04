import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from "recharts";
import type { OrderRecord } from "@/lib/orders";

interface Props {
  orders: OrderRecord[];
}

const COLORS = ["hsl(90,65%,50%)", "hsl(30,90%,55%)", "hsl(350,55%,60%)", "hsl(200,70%,55%)", "hsl(270,50%,55%)"];

const AnalyticsCharts = ({ orders }: Props) => {
  const bestSellers = useMemo(() => {
    const map: Record<string, { name: string; quantity: number; revenue: number }> = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const key = item.name;
        if (!map[key]) map[key] = { name: key, quantity: 0, revenue: 0 };
        map[key].quantity += item.quantity;
        map[key].revenue += item.price * item.quantity;
      });
    });
    return Object.values(map).sort((a, b) => b.quantity - a.quantity);
  }, [orders]);

  const dailyRevenue = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach((order) => {
      const day = new Date(order.created_at).toLocaleDateString("uk-UA", { day: "2-digit", month: "2-digit" });
      map[day] = (map[day] || 0) + Number(order.total_price);
    });
    return Object.entries(map)
      .map(([date, revenue]) => ({ date, revenue }))
      .slice(-14);
  }, [orders]);

  const statusDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach((order) => {
      map[order.status] = (map[order.status] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [orders]);

  if (orders.length === 0) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-3 mb-8">
      {/* Best Sellers */}
      <div className="glass-card p-6 lg:col-span-2">
        <h3 className="text-lg font-bold mb-4">🏆 Найпопулярніші продукти</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={bestSellers.slice(0, 6)} layout="vertical" margin={{ left: 100 }}>
            <XAxis type="number" stroke="hsl(160,6%,55%)" fontSize={12} />
            <YAxis type="category" dataKey="name" stroke="hsl(160,6%,55%)" fontSize={12} width={100} />
            <Tooltip
              contentStyle={{ background: "hsl(160,8%,10%)", border: "1px solid hsl(160,8%,16%)", borderRadius: 12, color: "#fff" }}
              formatter={(value: number) => [`${value} шт.`, "Кількість"]}
            />
            <Bar dataKey="quantity" radius={[0, 6, 6, 0]}>
              {bestSellers.slice(0, 6).map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Status Pie */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold mb-4">📊 Статуси замовлень</h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={statusDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
              {statusDistribution.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: "hsl(160,8%,10%)", border: "1px solid hsl(160,8%,16%)", borderRadius: 12, color: "#fff" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Revenue */}
      <div className="glass-card p-6 lg:col-span-3">
        <h3 className="text-lg font-bold mb-4">📈 Виручка за день</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={dailyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(160,8%,16%)" />
            <XAxis dataKey="date" stroke="hsl(160,6%,55%)" fontSize={12} />
            <YAxis stroke="hsl(160,6%,55%)" fontSize={12} />
            <Tooltip
              contentStyle={{ background: "hsl(160,8%,10%)", border: "1px solid hsl(160,8%,16%)", borderRadius: 12, color: "#fff" }}
              formatter={(value: number) => [`${value} ₴`, "Виручка"]}
            />
            <Line type="monotone" dataKey="revenue" stroke="hsl(90,65%,50%)" strokeWidth={2} dot={{ r: 4, fill: "hsl(90,65%,50%)" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
