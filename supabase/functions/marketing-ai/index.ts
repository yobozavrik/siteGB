import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action } = await req.json(); // "analyze" | "generate-campaign"
    // Any OpenAI-compatible chat-completions endpoint works here.
    // Defaults to OpenRouter, which uses the same "vendor/model" ids.
    const AI_GATEWAY_URL =
      Deno.env.get("AI_GATEWAY_URL") ?? "https://openrouter.ai/api/v1/chat/completions";
    const AI_MODEL = Deno.env.get("AI_MODEL") ?? "google/gemini-3-flash-preview";
    const AI_API_KEY = Deno.env.get("AI_API_KEY");
    if (!AI_API_KEY) throw new Error("AI_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all orders for analysis
    const { data: orders } = await supabase.from("orders").select("*").order("created_at", { ascending: false });

    type OrderRow = {
      customer_name: string;
      customer_email: string;
      city: string;
      items: unknown;
      total_price: number;
      status: string;
      created_at: string;
    };

    const orderData = ((orders ?? []) as OrderRow[]).map((o) => ({
      customer: o.customer_name,
      email: o.customer_email,
      phone: o.customer_phone,
      status: o.status,
      items: o.items,
      total: o.total_price,
      city: o.city,
      date: o.created_at,
    }));

    // Fetch contact messages  
    const { data: contacts } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(100);

    let userPrompt = "";

    if (action === "analyze") {
      userPrompt = `Проаналізуй наступні дані замовлень та контактів і створи детальний маркетинговий звіт:

ЗАМОВЛЕННЯ (${orderData.length}):
${JSON.stringify(orderData, null, 1)}

КОНТАКТНІ ЗАПИТИ (${(contacts ?? []).length}):
${JSON.stringify(contacts ?? [], null, 1)}

Створи звіт з:
1. Сегментація клієнтів (нові, повторні, VIP)
2. Найпопулярніші продукти та тренди
3. Географія продажів
4. Рекомендації для збільшення повторних покупок
5. Пропозиції персоналізованих кампаній`;
    } else {
      userPrompt = `На основі даних замовлень створи 3 персоналізовані маркетингові кампанії:

ДАНІ ЗАМОВЛЕНЬ:
${JSON.stringify(orderData.slice(0, 30), null, 1)}

Для кожної кампанії вкажи:
- Назва кампанії
- Цільова аудиторія
- Тип повідомлення (нагадування, знижка, рекомендація)
- Текст повідомлення (готовий до відправки)
- Рекомендований канал (email/SMS)
- Очікуваний ефект`;
    }

    const systemPrompt = `Ти — експерт з маркетингової автоматизації для бренду KRATEA (натуральні функціональні напої: Grapefruit, Orange, Apple по 199₴).
Аналізуй поведінку та переваги користувачів. Створюй персоналізовані повідомлення, пропозиції та контент.
Завжди відповідай УКРАЇНСЬКОЮ мовою. Використовуй дані для конкретних, дієвих рекомендацій.`;

    const response = await fetch(AI_GATEWAY_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${AI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "Payment required" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ error: "AI gateway error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(response.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
