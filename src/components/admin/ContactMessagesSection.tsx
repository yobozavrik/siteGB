import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MessageSquare, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const ease = [0.16, 1, 0.3, 1] as const;

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  created_at: string;
}

const ContactMessagesSection = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const adminKey = localStorage.getItem("admin_secret_key") || "";
      const res = await supabase.functions.invoke("admin-orders", {
        body: { action: "list_messages" },
        headers: { "x-admin-key": adminKey },
      });
      if (res.error) throw res.error;
      setMessages((res.data?.data as ContactMessage[]) ?? []);
    } catch {
      toast({ variant: "destructive", title: "Помилка", description: "Не вдалося завантажити повідомлення." });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("uk-UA", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease, delay: 0.3 }}
      className="glass-card overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-border/30 p-6">
        <div>
          <h2 className="text-xl font-black flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Повідомлення з контактної форми
          </h2>
          <p className="text-sm text-muted-foreground">Запити від відвідувачів сайту</p>
        </div>
        <button
          type="button"
          onClick={fetchMessages}
          className="inline-flex items-center gap-2 rounded-xl border border-border/50 px-4 py-2 font-semibold transition-colors hover:bg-muted/50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Оновити
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[700px] w-full">
          <thead>
            <tr className="border-b border-border/30 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="p-4 font-medium">Ім'я</th>
              <th className="p-4 font-medium">Контакти</th>
              <th className="p-4 font-medium">Повідомлення</th>
              <th className="p-4 font-medium">Дата</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">Завантаження...</td>
              </tr>
            ) : messages.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">Повідомлень поки немає.</td>
              </tr>
            ) : (
              messages.map((msg) => (
                <tr key={msg.id} className="border-b border-border/10 align-top transition-colors hover:bg-muted/20">
                  <td className="p-4 font-semibold text-foreground">{msg.name}</td>
                  <td className="p-4 text-sm">
                    <div className="space-y-1 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        <span>{msg.email}</span>
                      </div>
                      {msg.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-primary" />
                          <span>{msg.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-foreground/80 max-w-[300px]">{msg.message || "—"}</td>
                  <td className="p-4 text-sm text-muted-foreground">{formatDate(msg.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ContactMessagesSection;
