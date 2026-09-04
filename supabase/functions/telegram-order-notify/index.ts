import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { orderId, customerName, customerEmail, customerPhone, city, address, items, totalPrice, comment } = await req.json();

    const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID");

    if (!TELEGRAM_BOT_TOKEN) throw new Error("TELEGRAM_BOT_TOKEN not configured");
    if (!TELEGRAM_CHAT_ID) throw new Error("TELEGRAM_CHAT_ID not configured");

    type OrderItem = { name: string; flavor: string; quantity: number; price: number };

    const itemsList = ((items ?? []) as OrderItem[])
      .map((i) => `  • ${i.name} ${i.flavor} × ${i.quantity} — ${i.price * i.quantity} ₴`)
      .join("\n");

    const message = `🛒 <b>Нове замовлення!</b>

📋 <b>ID:</b> <code>${orderId?.slice(0, 8) ?? "—"}</code>
👤 <b>Клієнт:</b> ${customerName}
📧 <b>Email:</b> ${customerEmail}
📱 <b>Телефон:</b> ${customerPhone || "не вказано"}
🏙 <b>Місто:</b> ${city}
🏠 <b>Адреса:</b> ${address}
${comment ? `💬 <b>Коментар:</b> ${comment}\n` : ""}
<b>Товари:</b>
${itemsList}

💰 <b>Разом:</b> ${totalPrice} ₴`;

    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(`Telegram API error [${res.status}]: ${JSON.stringify(data)}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Telegram notify error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
