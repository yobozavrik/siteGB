import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles, BarChart3, Megaphone } from "lucide-react";
import ReactMarkdown from "react-markdown";

const ease = [0.16, 1, 0.3, 1] as const;
const MARKETING_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/marketing-ai`;

const MarketingAISection = () => {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const runAction = useCallback(async (action: "analyze" | "generate-campaign") => {
    setLoading(true);
    setActiveAction(action);
    setResult("");

    let soFar = "";

    try {
      const resp = await fetch(MARKETING_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ action }),
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
              soFar += content;
              setResult(soFar);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch {
      setResult("Помилка при генерації. Спробуйте ще раз.");
    }
    setLoading(false);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease, delay: 0.3 }}
      className="glass-card overflow-hidden"
    >
      <div className="border-b border-border/30 p-6">
        <h2 className="text-xl font-black flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Маркетингова AI-автоматизація
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Аналіз поведінки клієнтів та генерація персоналізованих кампаній
        </p>

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => runAction("analyze")}
            disabled={loading}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeAction === "analyze" && loading
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            } disabled:opacity-60`}
          >
            <BarChart3 className={`h-4 w-4 ${activeAction === "analyze" && loading ? "animate-spin" : ""}`} />
            Аналіз клієнтів
          </button>
          <button
            onClick={() => runAction("generate-campaign")}
            disabled={loading}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeAction === "generate-campaign" && loading
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            } disabled:opacity-60`}
          >
            <Megaphone className={`h-4 w-4 ${activeAction === "generate-campaign" && loading ? "animate-spin" : ""}`} />
            Генерувати кампанії
          </button>
        </div>
      </div>

      {(result || loading) && (
        <div className="p-6 max-h-[500px] overflow-y-auto">
          {loading && !result && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="h-4 w-4 animate-pulse text-primary" />
              <span>AI аналізує дані...</span>
            </div>
          )}
          {result && (
            <div className="prose prose-sm prose-invert max-w-none">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default MarketingAISection;
