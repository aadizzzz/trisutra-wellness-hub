import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    const { record } = body;
    if (!record || !record.name || !record.email || !record.message) {
      console.error("Payload missing required fields:", record);
      return new Response(JSON.stringify({ error: "Missing required fields in record" }), { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    const { name, email, subject, message } = record;

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not set");
      return new Response(JSON.stringify({ error: "Server Configuration Error: Resend not configured" }), { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject || "No Subject");
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

    // Notify Admin
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: "TriSutra Ayurveda <contact@trisutra.online>",
        to: ["trisutra06@gmail.com"],
        subject: "New Message from " + safeName + ": " + safeSubject,
        html: "<h3>New Contact Form Submission</h3>" +
              "<p><b>Name:</b> " + safeName + "</p>" +
              "<p><b>Email:</b> " + safeEmail + "</p>" +
              "<p><b>Subject:</b> " + safeSubject + "</p>" +
              "<p><b>Message:</b></p>" +
              "<div style='background: #fff; padding: 15px; border-radius: 4px; border: 1px solid #eee;'>" +
                safeMessage +
              "</div>" +
              "<hr>" +
              "<p><small>Sent via TriSutra Ayurveda Edge Hub</small></p>",
        reply_to: email,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Resend API error:", errorText);
      return new Response(JSON.stringify({ error: "Failed to send email notification" }), { 
        status: 502, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    const resData = await res.json();
    return new Response(JSON.stringify({ success: true, id: resData.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Fatal function error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
