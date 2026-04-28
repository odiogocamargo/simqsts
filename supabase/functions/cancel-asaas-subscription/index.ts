// Cancela a assinatura do usuário no Asaas
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ASAAS_BASE_URL = "https://api.asaas.com/v3";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ASAAS_API_KEY = Deno.env.get("ASAAS_API_KEY");
    if (!ASAAS_API_KEY) throw new Error("ASAAS_API_KEY não configurada");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autenticado" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const body = await req.json().catch(() => ({}));
    if (body?.confirmCancel !== true) {
      return new Response(JSON.stringify({ error: "Confirmação de cancelamento obrigatória" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser();
    if (!userData?.user) {
      return new Response(JSON.stringify({ error: "Inválido" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: subs } = await admin
      .from("subscriptions")
      .select("id, asaas_subscription_id, status")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    const sub = subs?.[0];

    if (!sub) {
      return new Response(
        JSON.stringify({ success: true, message: "Nenhuma assinatura encontrada para cancelar" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If there's an Asaas subscription, try to cancel it remotely
    if (sub.asaas_subscription_id) {
      const resp = await fetch(`${ASAAS_BASE_URL}/subscriptions/${sub.asaas_subscription_id}`, {
        method: "DELETE",
        headers: { "access_token": ASAAS_API_KEY },
      });

      if (!resp.ok) {
        const errText = await resp.text();
        console.error("Asaas cancel error:", resp.status, errText);
        // If Asaas says it doesn't exist (404), proceed to mark locally as canceled
        if (resp.status !== 404) {
          return new Response(
            JSON.stringify({ error: "Erro ao cancelar no Asaas" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    }

    // Always mark local record as canceled
    await admin.from("subscriptions").update({
      status: "canceled",
      canceled_at: new Date().toISOString(),
    }).eq("id", sub.id);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("cancel error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
