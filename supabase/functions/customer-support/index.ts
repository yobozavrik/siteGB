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

    const systemPrompt = `You are a 24/7 customer support assistant for "Галя Балувана" — a Ukrainian shop selling homemade, hand-shaped frozen semi-finished foods.
You MUST respond in the SAME LANGUAGE the customer writes to you. Ukrainian -> Ukrainian, Russian -> Russian, English -> English.

MENU (categories, prices are per pack in UAH, may vary slightly by shop):
- Вареники (dumplings): with potato, potato & mushrooms, stewed cabbage, salty curd cheese, cherry, strawberry. 118–165 ₴ / 0.5 kg. Cook in salted boiling water 4–7 min after they float, do NOT defrost.
- Пельмені та хінкалі: "По-домашньому" (pork+beef), veal, chicken with herbs, khinkali with lamb. 169–219 ₴ / 0.5–0.7 kg. Boil 6–8 min after floating.
- Млинці та налисники (crepes): with meat, curd & raisins, chicken liver, ham & cheese. 139–159 ₴. Pan-fry 2–3 min per side.
- Сирники та ліниві (curd fritters): classic, with raisins, with cherry, lazy varenyky. 112–132 ₴. Fry on low heat under a lid.
- Чебуреки та біляші: with meat, with cheese, belyashi with beef, chicken samsa. 118–135 ₴. Deep-fry; samsa is baked.
- Голубці та фаршировані перці (cabbage rolls / stuffed peppers): with meat & rice, lenten with mushrooms, stuffed pepper, dolma. 159–189 ₴. Stew 20–30 min.
- Котлети та тефтелі (cutlets / meatballs): homemade, chicken, meatballs in tomato sauce, Chicken Kyiv, pork rolls. 135–198 ₴.
- Десерти та випічка: curd bake, apple strudel, baked apple pies, chocolate croissants. 119–142 ₴.

Lenten ("пісні") options: vareniki with potato / potato & mushrooms / cabbage, lenten cabbage rolls.
Storage: −18 °C, up to 30 days, no re-freezing. Natural composition, no soy / preservatives / fat substitutes.

DELIVERY & PICKUP:
- Kyiv left bank: from 60 ₴, free from 1500 ₴, 60–90 min.
- Kyiv right bank: from 90 ₴, free from 2000 ₴, 90–120 min.
- Other cities of Ukraine: Nova Poshta in thermo-packaging, 1–2 days.
- Pickup from any shop is free, order ready in 30–40 min.
- Minimum order for delivery: 300 ₴.
- Payment: cash or card on receipt, or online (Mono / LiqPay / Apple Pay).
- Delivery hours: daily 10:00–20:30.

RECENT ORDERS DATA (for order-status lookups):
${JSON.stringify(ordersSummary, null, 1)}

RULES:
- Match the customer's language.
- Help with the menu, cooking, ingredients, allergens, delivery, pickup, payment and order status.
- If the customer gives a name or email, look up their order in the data above.
- Be polite, accurate and concise. Do not invent products or prices — if unsure, say so.
- If you cannot help, suggest the contact form on /contacts or calling the shop.`;

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
