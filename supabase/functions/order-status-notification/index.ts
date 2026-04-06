// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

declare const Deno: any;

function escapeHtml(text: string): string {
  if (!text) return "";
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const { order_id, status } = await req.json();
    if (!order_id || !status) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: corsHeaders });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "Server Configuration Error" }), { status: 500, headers: corsHeaders });
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch order details
    const { data: order, error: fetchError } = await supabaseAdmin
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", order_id)
      .single();

    if (fetchError || !order) {
      console.error("Order fetch error:", fetchError);
      return new Response(JSON.stringify({ error: "Order not found" }), { status: 404, headers: corsHeaders });
    }

    // Only send email if status is "Shipped" for now
    if (status !== "Shipped") {
      return new Response(JSON.stringify({ message: "Notification not required for this status" }), { status: 200, headers: corsHeaders });
    }

    const customerName = escapeHtml(order.customer_name);
    const orderNum = escapeHtml(order.order_number);
    const estDelivery = escapeHtml(order.est_delivery || "7-10 business days");

    const emailHtml = `<div style='font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background-color: #fcf9f5;'>
      <div style='background-color: #5d4037; color: #ffffff; padding: 30px; text-align: center;'>
        <h1 style='margin: 0; font-size: 24px; letter-spacing: 2px;'>TRISUTRA AYURVEDA</h1>
        <p style='margin: 10px 0 0; opacity: 0.8;'>Order Shipped</p>
      </div>
      <div style='padding: 40px; color: #333333; line-height: 1.6;'>
        <h2 style='color: #5d4037; margin-top: 0;'>Greetings ${customerName},</h2>
        <p>Great news! Your order <strong>#${orderNum}</strong> has been shipped and is on its way to you.</p>
        
        <div style='margin: 30px 0; padding: 25px; background-color: #ffffff; border-radius: 6px; border: 1px solid #eee; text-align: center;'>
          <h3 style='margin-top: 0; color: #8d6e63; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;'>Estimated Delivery</h3>
          <p style='font-size: 20px; font-weight: bold; margin: 10px 0; color: #5d4037;'>${estDelivery}</p>
        </div>

        <p>You can view your order details and track progress in your <a href='https://trisutra.online/account' style='color: #8d6e63; text-decoration: underline;'>Account Dashboard</a>.</p>
        
        <p style='margin-top: 30px;'>Thank you for choosing a natural path to wellness.</p>
        <p>Warm regards,<br>The TriSutra Team</p>
      </div>
      <div style='background-color: #f5f5f5; padding: 20px; text-align: center; color: #999; font-size: 12px;'>
        <p>© 2026 TriSutra Ayurveda. All rights reserved.</p>
      </div>
    </div>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: "TriSutra Ayurveda <orders@trisutra.online>",
        to: [order.customer_email],
        subject: `Your Order #${orderNum} has been shipped!`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Resend API error:", errorText);
      return new Response(JSON.stringify({ error: "Failed to send email" }), { status: 502, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Fatal Error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
