import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    // Any OpenAI-compatible chat-completions endpoint works here.
    // Defaults to OpenRouter, which uses the same "vendor/model" ids.
    const AI_GATEWAY_URL =
      Deno.env.get("AI_GATEWAY_URL") ?? "https://openrouter.ai/api/v1/chat/completions";
    const AI_MODEL = Deno.env.get("AI_MODEL") ?? "google/gemini-2.5-flash";
    const AI_API_KEY = Deno.env.get("AI_API_KEY");
    if (!AI_API_KEY) throw new Error("AI_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: orders } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(50);

    type OrderRow = {
      id: string;
      customer_name: string;
      customer_email: string;
      status: string;
      total_price: number;
      created_at: string;
    };

    const ordersSummary = ((orders ?? []) as OrderRow[]).map((o) => ({
      id: o.id.slice(0, 8),
      customer: o.customer_name,
      email: o.customer_email,
      status: o.status,
      items: o.items,
      total: o.total_price,
      city: o.city,
      date: o.created_at,
    }));

    const systemPrompt = `You are a 24/7 customer support assistant for KRATEA brand (natural functional beverages).
You MUST respond in the SAME LANGUAGE the customer writes to you. If they write in Ukrainian — respond in Ukrainian. If in Russian — respond in Russian. If in English — respond in English.

KRATEA PRODUCTS & PRICING:
- KRATEA Grapefruit (0.33L, 199₴ / ~$5): Kava Kava, L-Theanine, Glycine, Magnesium. Improves mood, reduces anxiety, enhances social openness.
- KRATEA Orange (0.33L, 199₴ / ~$5): Kanna, Pu-erh, L-Theanine, Glycine. Relaxed focus, steady energy, stress reduction.
- KRATEA Apple (0.33L, 199₴ / ~$5): CBD, GABA, L-Theanine, Magnesium. Deep relaxation, better sleep quality.

PRICING & ORDERING:
- Each can costs 199₴
- Delivery across Ukraine via Nova Poshta
- Payment: cash on delivery or card
- Minimum order: 1 can
- Free delivery for orders over 500₴

RECENT ORDERS DATA:
${JSON.stringify(ordersSummary, null, 1)}

RULES:
- Match the customer's language (Ukrainian, Russian, or English)
- Help with delivery, product ingredients, payment, order status
- If customer provides email or name, look up their order in the data above
- Be polite, accurate, and helpful
- If you don't know the answer — suggest contacting via the contact form or phone +380 97 564 04 50
- Keep responses concise but informative`;

    const response = await fetch(AI_GATEWAY_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${AI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Too many requests, please try again later." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "Service limit reached." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ error: "AI gateway error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(response.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
