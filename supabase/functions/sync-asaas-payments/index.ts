// Sincroniza histórico de pagamentos do Asaas para o usuário autenticado
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ASAAS_BASE_URL = "https://api-sandbox.asaas.com/v3";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ASAAS_API_KEY = Deno.env.get("ASAAS_API_KEY");
    if (!ASAAS_API_KEY) throw new Error("ASAAS_API_KEY não configurada");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autenticado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser();
    if (!userData?.user) {
      return new Response(JSON.stringify({ error: "Inválido" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Buscar a assinatura do usuário
    const { data: subs } = await admin
      .from("subscriptions")
      .select("id, asaas_customer_id, asaas_subscription_id")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    const sub = subs?.[0];
    if (!sub?.asaas_customer_id) {
      return new Response(JSON.stringify({ synced: 0, message: "Sem cliente Asaas" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Buscar pagamentos no Asaas pelo customer
    const url = new URL(`${ASAAS_BASE_URL}/payments`);
    url.searchParams.set("customer", sub.asaas_customer_id);
    url.searchParams.set("limit", "100");

    const resp = await fetch(url.toString(), {
      headers: { "access_token": ASAAS_API_KEY },
    });

    if (!resp.ok) {
      const txt = await resp.text();
      console.error("Asaas list payments error:", resp.status, txt);
      return new Response(JSON.stringify({ error: "Erro ao consultar Asaas" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const json = await resp.json();
    const payments: any[] = json?.data ?? [];

    let synced = 0;
    for (const p of payments) {
      const record = {
        user_id: userData.user.id,
        subscription_id: sub.id,
        asaas_payment_id: p.id,
        asaas_subscription_id: p.subscription ?? sub.asaas_subscription_id ?? null,
        asaas_customer_id: p.customer ?? sub.asaas_customer_id,
        amount: p.value ?? 0,
        net_value: p.netValue ?? null,
        status: p.status ?? "PENDING",
        billing_type: p.billingType ?? null,
        description: p.description ?? null,
        due_date: p.dueDate ?? null,
        payment_date: p.paymentDate ?? p.clientPaymentDate ?? null,
        invoice_url: p.invoiceUrl ?? null,
        invoice_number: p.invoiceNumber ?? null,
        transaction_receipt_url: p.transactionReceiptUrl ?? null,
        bank_slip_url: p.bankSlipUrl ?? null,
        raw_event: p,
        updated_at: new Date().toISOString(),
      };

      const { error } = await admin
        .from("payment_history")
        .upsert(record, { onConflict: "asaas_payment_id" });

      if (error) console.error("upsert error:", error);
      else synced++;
    }

    return new Response(JSON.stringify({ synced, total: payments.length }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("sync-asaas-payments error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
