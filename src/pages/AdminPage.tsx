import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Lock, Mail, MapPin, Package, RefreshCw, Search, ShoppingCart, Users, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_OPTIONS,
  orderStatusSchema,
  parseOrderItems,
  type OrderRecord,
} from "@/lib/orders";
import AnalyticsCharts from "@/components/admin/AnalyticsCharts";
import ContactMessagesSection from "@/components/admin/ContactMessagesSection";
import MarketingAISection from "@/components/admin/MarketingAISection";

const ease = [0.16, 1, 0.3, 1] as const;

const statusTone: Record<string, string> = {
  pending: "border-border/60 bg-muted/60 text-muted-foreground",
  processing: "border-secondary/30 bg-secondary/10 text-secondary",
  shipped: "border-primary/30 bg-primary/10 text-primary",
  delivered: "border-primary/40 bg-primary/15 text-primary",
  cancelled: "border-destructive/30 bg-destructive/10 text-destructive",
};

const formatCurrency = (amount: number) => `${new Intl.NumberFormat("uk-UA").format(amount)} ₴`;

/** Row shape returned by the admin-orders edge function before items are parsed. */
type RawOrder = Omit<OrderRecord, "items"> & { items: unknown };

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("uk-UA", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

const formatItems = (items: OrderRecord["items"]) =>
  items.map((item) => `${item.name}${item.unit ? ` (${item.unit})` : ""} ×${item.quantity}`).join(", ");

const AdminPage = () => {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"orders" | "analytics" | "messages" | "marketing">("orders");
  const [adminKeyInput, setAdminKeyInput] = useState("");
  const [isAuthed, setIsAuthed] = useState(() => !!localStorage.getItem("admin_secret_key"));

  const adminKey = localStorage.getItem("admin_secret_key") || "";

  const fetchOrders = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const res = await supabase.functions.invoke("admin-orders", {
        body: { action: "list" },
        headers: { "x-admin-key": adminKey },
      });
      if (res.error) {
        console.error("admin-orders invoke error:", res.error, res.data);
        const msg =
          (res.data as { error?: string } | null)?.error || res.error.message || "Невідома помилка";
        toast({
          variant: "destructive",
          title: "Не вдалося завантажити замовлення",
          description: `${msg}. Спробуйте вийти та ввести ключ ще раз.`,
        });
        setLoading(false);
        return;
      }
      const data = res.data?.data ?? [];
      console.log(`✓ Завантажено ${data.length} замовлень`);
      setOrders(
        (data as RawOrder[]).map((order) => ({ ...order, items: parseOrderItems(order.items) })),
      );
    } catch (err: unknown) {
      console.error("admin-orders fetch exception:", err);
      toast({ variant: "destructive", title: "Помилка завантаження", description: err instanceof Error ? err.message : "Перевірте ключ адміна." });
    }
    setLoading(false);
  }, [adminKey]);

  useEffect(() => {
    if (isAuthed) fetchOrders();
  }, [isAuthed, fetchOrders]);

  const handleStatusChange = async (orderId: string, nextStatus: string) => {
    const parsedStatus = orderStatusSchema.safeParse(nextStatus);
    if (!parsedStatus.success) return;
    setUpdatingOrderId(orderId);
    try {
      const res = await supabase.functions.invoke("admin-orders", {
        body: { action: "update_status", orderId, status: parsedStatus.data },
        headers: { "x-admin-key": adminKey },
      });
      if (res.error) throw res.error;
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: parsedStatus.data } : o)));
      toast({ title: "Статус оновлено", description: `"${ORDER_STATUS_LABELS[parsedStatus.data]}"` });
    } catch {
      toast({ variant: "destructive", title: "Не вдалося змінити статус" });
    }
    setUpdatingOrderId(null);
  };

  const filteredOrders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesSearch = !q || order.customer_name.toLowerCase().includes(q) || order.customer_email.toLowerCase().includes(q) || order.city.toLowerCase().includes(q);
      return matchesSearch && (statusFilter === "all" || order.status === statusFilter);
    });
  }, [orders, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((s, o) => s + Number(o.total_price), 0);
    const pending = orders.filter((o) => o.status === "pending").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    const customers = new Set(orders.map((o) => o.customer_email)).size;
    return [
      { label: "Усі замовлення", value: String(orders.length), icon: ShoppingCart, tone: "bg-primary/10 text-primary" },
      { label: "Очікують обробки", value: String(pending), icon: Package, tone: "bg-secondary/10 text-secondary" },
      { label: "Доставлено", value: String(delivered), icon: BarChart3, tone: "bg-primary/10 text-primary" },
      { label: "Клієнти", value: String(customers), icon: Users, tone: "bg-muted text-foreground" },
      { label: "Виручка", value: formatCurrency(totalRevenue), icon: BarChart3, tone: "bg-primary/10 text-primary" },
    ];
  }, [orders]);

  const tabs = [
    { key: "orders" as const, label: "Замовлення" },
    { key: "analytics" as const, label: "Аналітика" },
    { key: "messages" as const, label: "Повідомлення" },
    { key: "marketing" as const, label: "AI Маркетинг" },
  ];

  const handleLogin = () => {
    if (!adminKeyInput.trim()) return;
    localStorage.setItem("admin_secret_key", adminKeyInput.trim());
    setIsAuthed(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_secret_key");
    setIsAuthed(false);
    setOrders([]);
  };

  if (!isAuthed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card w-full max-w-sm p-8 text-center">
          <Lock className="mx-auto mb-4 h-10 w-10 text-primary" />
          <h1 className="mb-2 text-2xl font-black">Адмін-панель</h1>
          <p className="mb-6 text-sm text-muted-foreground">Введіть секретний ключ для доступу.</p>
          <input
            type="password"
            value={adminKeyInput}
            onChange={(e) => setAdminKeyInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Секретний ключ"
            className="mb-4 w-full rounded-xl border border-border/50 bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button onClick={handleLogin} className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            Увійти
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="px-3 pb-12 pt-6 sm:px-6 md:px-12 md:pt-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-black sm:gap-3 sm:text-3xl">
                <BarChart3 className="h-6 w-6 text-primary sm:h-8 sm:w-8" />
                Панель замовлень
              </h1>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">Керуйте замовленнями та аналітикою.</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => fetchOrders(false)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border/50 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted/50 md:flex-none">
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Оновити
              </button>
              <button type="button" onClick={handleLogout} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-destructive/40 px-4 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 md:flex-none">
                Вийти
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 md:mb-8 xl:grid-cols-5">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease, delay: i * 0.08 }} className="glass-card p-3 sm:p-5">
                <div className={`mb-2 inline-flex rounded-xl p-2 sm:mb-4 sm:rounded-2xl sm:p-3 ${stat.tone}`}><stat.icon className="h-4 w-4 sm:h-5 sm:w-5" /></div>
                <p className="font-mono text-lg font-bold sm:text-2xl">{stat.value}</p>
                <p className="mt-0.5 text-xs text-muted-foreground sm:mt-1 sm:text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Tabs - horizontally scrollable on mobile */}
          <div className="mb-6 -mx-3 overflow-x-auto px-3 sm:mx-0 sm:px-0 scrollbar-hide">
            <div className="flex gap-2 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`whitespace-nowrap px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === tab.key ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Analytics Tab */}
          {activeTab === "analytics" && <AnalyticsCharts orders={orders} />}

          {/* Messages Tab */}
          {activeTab === "messages" && <ContactMessagesSection />}

          {/* Marketing AI Tab */}
          {activeTab === "marketing" && <MarketingAISection />}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease, delay: 0.2 }} className="glass-card overflow-hidden">
              <div className="flex flex-col gap-4 border-b border-border/30 p-4 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-lg font-black sm:text-xl">Керування статусами</h2>
                  <p className="text-xs text-muted-foreground sm:text-sm">Змінюйте статус кожного замовлення.</p>
                </div>
                <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                  <div className="relative flex-1 sm:min-w-[280px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input type="text" placeholder="Пошук..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-xl border border-border/50 bg-input py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-border/50 bg-input px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="all">Усі статуси</option>
                    {ORDER_STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Mobile: card list */}
              <div className="md:hidden">
                {loading ? (
                  <p className="p-8 text-center text-sm text-muted-foreground">Завантаження...</p>
                ) : filteredOrders.length === 0 ? (
                  <p className="p-8 text-center text-sm text-muted-foreground">Замовлень поки немає.</p>
                ) : (
                  <div className="divide-y divide-border/20">
                    {filteredOrders.map((order) => (
                      <div key={order.id} className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-foreground truncate">{order.customer_name}</p>
                            <p className="text-[11px] text-muted-foreground font-mono">#{order.id.slice(0, 8)}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-mono font-bold text-primary">{formatCurrency(Number(order.total_price))}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{formatDateTime(order.created_at)}</p>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-sm">
                          <a href={`mailto:${order.customer_email}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors break-all">
                            <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span className="truncate">{order.customer_email}</span>
                          </a>
                          {order.customer_phone && (
                            <a href={`tel:${order.customer_phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                              <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                              <span>{order.customer_phone}</span>
                            </a>
                          )}
                          <div className="flex items-start gap-2 text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                            <span>{order.city}, {order.address}</span>
                          </div>
                        </div>

                        {order.comment && (
                          <p className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-2">💬 {order.comment}</p>
                        )}

                        <div className="text-xs text-foreground/80 bg-muted/20 rounded-lg p-2 leading-relaxed">
                          {formatItems(order.items)}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap ${statusTone[order.status] || "border-border/60 bg-muted/60 text-muted-foreground"}`}>
                            {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] ?? order.status}
                          </span>
                          <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)} disabled={updatingOrderId === order.id} className="flex-1 rounded-xl border border-border/50 bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50">
                            {ORDER_STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop: table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-[1120px] w-full">
                  <thead>
                    <tr className="border-b border-border/30 text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="p-4 font-medium">Клієнт</th>
                      <th className="p-4 font-medium">Контакти</th>
                      <th className="p-4 font-medium">Товари</th>
                      <th className="p-4 font-medium">Доставка</th>
                      <th className="p-4 font-medium">Статус</th>
                      <th className="p-4 font-medium">Сума</th>
                      <th className="p-4 font-medium">Створено</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Завантаження...</td></tr>
                    ) : filteredOrders.length === 0 ? (
                      <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Замовлень поки немає.</td></tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b border-border/10 align-top transition-colors hover:bg-muted/20">
                          <td className="p-4">
                            <p className="font-semibold text-foreground">{order.customer_name}</p>
                            <p className="mt-1 text-xs text-muted-foreground">ID: {order.id.slice(0, 8)}</p>
                          </td>
                          <td className="p-4 text-sm">
                            <div className="space-y-2 text-muted-foreground">
                              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /><span>{order.customer_email}</span></div>
                              {order.customer_phone && <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /><span>{order.customer_phone}</span></div>}
                            </div>
                          </td>
                          <td className="max-w-[280px] p-4 text-sm text-foreground/80">{formatItems(order.items)}</td>
                          <td className="p-4 text-sm text-muted-foreground">
                            <div className="flex items-start gap-2">
                              <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                              <div><p>{order.country}, {order.city}</p><p>{order.address}</p>{order.comment && <p className="text-xs text-muted-foreground mt-1">💬 {order.comment}</p>}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-2">
                              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusTone[order.status] || "border-border/60 bg-muted/60 text-muted-foreground"}`}>
                                {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] ?? order.status}
                              </span>
                              <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)} disabled={updatingOrderId === order.id} className="w-full rounded-xl border border-border/50 bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50">
                                {ORDER_STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                              </select>
                            </div>
                          </td>
                          <td className="p-4 font-mono font-semibold text-primary">{formatCurrency(Number(order.total_price))}</td>
                          <td className="p-4 text-sm text-muted-foreground">{formatDateTime(order.created_at)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
