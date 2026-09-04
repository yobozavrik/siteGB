import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { supabaseConfigured } from "@/integrations/supabase/client";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/customer-support`;

const CustomerSupportChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg: Msg = { role: "user", content: text };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setLoading(true);

    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!resp.ok || !resp.body) throw new Error("Failed");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let nl: number;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant")
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Вибачте, сталася помилка. Спробуйте пізніше або зателефонуйте нам." },
      ]);
    }
    setLoading(false);
  }, [input, messages, loading]);

  // The chat needs the customer-support edge function; hide it when the backend
  // is not configured (matches the reference: "off unless you set AI_API_KEY").
  if (!supabaseConfigured) return null;

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        aria-label="Відкрити чат підтримки"
        className={`fixed bottom-6 right-6 z-[70] rounded-full bg-primary p-4 text-primary-foreground shadow-lg ${open ? "hidden" : ""}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-0 right-0 z-[70] flex h-[100dvh] w-full flex-col overflow-hidden border border-border/30 bg-card shadow-2xl sm:bottom-6 sm:right-6 sm:h-auto sm:max-h-[520px] sm:w-[380px] sm:rounded-2xl"
          >
            <div className="flex items-center justify-between border-b border-border/30 bg-primary px-4 py-4">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary-foreground" />
                <span className="text-sm font-bold text-primary-foreground">Підтримка Галя Балувана</span>
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary-foreground" />
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Закрити чат"
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-primary-foreground/20 p-2 text-primary-foreground transition-colors hover:bg-primary-foreground/40"
              >
                <X className="h-6 w-6 stroke-[2.5]" />
              </button>
            </div>

            <div ref={scrollRef} className="min-h-[300px] flex-1 space-y-3 overflow-y-auto p-4">
              {messages.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  <Bot className="mx-auto mb-3 h-10 w-10 text-primary/50" />
                  <p>Привіт! 👋 Я помічник Галя Балувана.</p>
                  <p className="mt-1">Запитайте про меню, приготування, доставку чи самовивіз.</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && <Bot className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />}
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                      msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none [&>p]:m-0 [&>ul]:m-0">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                  {msg.role === "user" && <User className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />}
                </div>
              ))}
              {loading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <div className="rounded-xl bg-muted px-3 py-2 text-sm text-muted-foreground">Друкую…</div>
                </div>
              )}
            </div>

            <div className="border-t border-border/30 p-3">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Ваше питання…"
                  className="flex-1 rounded-xl border border-border/50 bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  onClick={send}
                  disabled={loading || !input.trim()}
                  aria-label="Надіслати"
                  className="rounded-xl bg-primary p-2 text-primary-foreground hover:brightness-110 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomerSupportChat;
