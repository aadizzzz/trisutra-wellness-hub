import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Utility for XSS protection
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      console.error("Verification failed: Missing Authorization header");
      return new Response(JSON.stringify({ error: "Unauthorized: Please login to verify payment" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: { user: authUser }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !authUser) {
      console.error("Verification failed: Invalid session", authError);
      return new Response(JSON.stringify({ error: "Unauthorized: Session expired. Please login again." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Input Validation
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !order_id) {
      return new Response(JSON.stringify({ error: "Missing required payment fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!RAZORPAY_KEY_SECRET) {
      return new Response(JSON.stringify({ error: "Server Configuration Error: Payment provider not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify signature using HMAC SHA256
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(RAZORPAY_KEY_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const message = razorpay_order_id + "|" + razorpay_payment_id;
    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
    const expectedSignature = Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (expectedSignature !== razorpay_signature) {
      return new Response(JSON.stringify({ error: "Payment security verification failed" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Update order
    const { error: updateError } = await adminSupabase
      .from("orders")
      .update({
        payment_id: razorpay_payment_id,
        payment_status: "paid",
        status: "Confirmed",
      })
      .eq("id", order_id)
      .eq("user_id", authUser.id); // Security: Ensure order belongs to user

    if (updateError) {
      console.error("Order update error:", updateError);
      return new Response(JSON.stringify({ error: "Internal Server Error: Failed to finalize order" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Email Notification logic
    const { data: orderDetails, error: fetchError } = await adminSupabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", order_id)
      .single();

    if (!fetchError && orderDetails) {
      const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
      if (RESEND_API_KEY) {
        try {
          const customerName = escapeHtml(orderDetails.customer_name);
          const orderNum = escapeHtml(orderDetails.order_number);
          const totalFormatted = Number(orderDetails.total).toFixed(2);
          
          let itemsHtml = "";
          if (orderDetails.order_items && Array.isArray(orderDetails.order_items)) {
            for (const item of orderDetails.order_items) {
              const itemName = escapeHtml(item.name);
              itemsHtml += `<tr><td style='padding: 10px 0;'>${itemName} x ${item.quantity}</td>
                           <td style='padding: 10px 0; text-align: right;'>₹${(Number(item.price) * item.quantity).toFixed(2)}</td></tr>`;
            }
          }

          const emailHtml = `<div style='font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background-color: #fcf9f5;'>
            <div style='background-color: #5d4037; color: #ffffff; padding: 30px; text-align: center;'>
              <h1 style='margin: 0; font-size: 24px; letter-spacing: 2px;'>TRISUTRA AYURVEDA</h1>
              <p style='margin: 10px 0 0; opacity: 0.8;'>Order Confirmation</p>
            </div>
            <div style='padding: 40px; color: #333333; line-height: 1.6;'>
              <h2 style='color: #5d4037; margin-top: 0;'>Namaste ${customerName},</h2>
              <p>Thank you for choosing TriSutra Ayurveda. Your order <strong>#${orderNum}</strong> has been successfully confirmed and is being processed.</p>
              <div style='margin: 30px 0; padding: 20px; background-color: #ffffff; border-radius: 6px; border: 1px solid #eee;'>
                <h3 style='margin-top: 0; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 10px;'>Order Summary</h3>
                <table style='width: 100%; border-collapse: collapse;'>
                  ${itemsHtml}
                  <tr style='border-top: 2px solid #5d4037; font-weight: bold;'>
                    <td style='padding: 15px 0 0;'>Total Amount</td>
                    <td style='padding: 15px 0 0; text-align: right; color: #5d4037; font-size: 18px;'>₹${totalFormatted}</td>
                  </tr>
                </table>
              </div>
              <p>You can track your order progress in your <a href='https://trisutra-wellness.vercel.app/account' style='color: #8d6e63; text-decoration: underline;'>Account Dashboard</a>.</p>
              <p style='margin-top: 30px;'>Warm regards,<br>The TriSutra Team</p>
            </div>
          </div>`;

          // Send to Customer
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + RESEND_API_KEY,
            },
            body: JSON.stringify({
              from: "TriSutra Ayurveda <onboarding@resend.dev>",
              to: [orderDetails.customer_email],
              subject: `Order Confirmed - #${orderNum}`,
              html: emailHtml,
            }),
          });

          // Notify Admin
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + RESEND_API_KEY,
            },
            body: JSON.stringify({
              from: "System <onboarding@resend.dev>",
              to: ["trisutra06@gmail.com"],
              subject: `New Order Received - #${orderNum}`,
              html: `<p>New order confirmed for <b>${customerName}</b> (${escapeHtml(orderDetails.customer_email)}). Total: ₹${totalFormatted}</p>`,
            }),
          });

        } catch (emailErr) {
          console.error("Email processing failed:", emailErr);
        }
      }
    }

    return new Response(JSON.stringify({ verified: true }), {
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
