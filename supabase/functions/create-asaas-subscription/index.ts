// Cria cliente + assinatura no Asaas com cartão de crédito tokenizado
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ASAAS_BASE_URL = "https://api-sandbox.asaas.com/v3";

interface CreditCardInfo {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
}

interface CreditCardHolderInfo {
  name: string;
  email: string;
  cpfCnpj: string;
  postalCode: string;
  addressNumber: string;
  phone: string;
}

interface RequestBody {
  creditCard: CreditCardInfo;
  holderInfo: CreditCardHolderInfo;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ASAAS_API_KEY = Deno.env.get("ASAAS_API_KEY");
    if (!ASAAS_API_KEY) throw new Error("ASAAS_API_KEY não configurada");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Auth do usuário
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autenticado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: "Usuário inválido" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const user = userData.user;

    const body = (await req.json()) as RequestBody;
    if (!body?.creditCard || !body?.holderInfo) {
      return new Response(JSON.stringify({ error: "Dados de cartão obrigatórios" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Buscar profile
    const { data: profile } = await adminClient
      .from("profiles")
      .select("full_name, cpf, whatsapp")
      .eq("id", user.id)
      .single();

    const cpf = (body.holderInfo.cpfCnpj || profile?.cpf || "").replace(/\D/g, "");
    const fullName = body.holderInfo.name || profile?.full_name || user.email!;

    // 1. Criar/buscar customer no Asaas
    const customerResp = await fetch(`${ASAAS_BASE_URL}/customers`, {
      method: "POST",
      headers: {
        "access_token": ASAAS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: fullName,
        cpfCnpj: cpf,
        email: user.email,
        mobilePhone: body.holderInfo.phone || profile?.whatsapp || "",
        externalReference: user.id,
      }),
    });

    const customerData = await customerResp.json();
    if (!customerResp.ok) {
      console.error("Asaas customer error:", customerData);
      return new Response(JSON.stringify({ error: customerData?.errors?.[0]?.description || "Erro ao criar cliente" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const customerId = customerData.id;

    // 2. Criar assinatura mensal R$ 49,99 cartão de crédito
    const today = new Date();
    today.setDate(today.getDate() + 1); // primeira cobrança amanhã
    const nextDueDate = today.toISOString().split("T")[0];

    const subResp = await fetch(`${ASAAS_BASE_URL}/subscriptions`, {
      method: "POST",
      headers: {
        "access_token": ASAAS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: customerId,
        billingType: "CREDIT_CARD",
        cycle: "MONTHLY",
        value: 49.99,
        nextDueDate,
        description: "Assinatura SIM Questões - Premium",
        externalReference: user.id,
        creditCard: body.creditCard,
        creditCardHolderInfo: body.holderInfo,
        remoteIp: req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1",
      }),
    });

    const subData = await subResp.json();
    if (!subResp.ok) {
      console.error("Asaas subscription error:", subData);
      return new Response(JSON.stringify({ error: subData?.errors?.[0]?.description || "Erro ao criar assinatura" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Salvar no banco
    await adminClient.from("subscriptions").upsert({
      user_id: user.id,
      kiwify_customer_email: user.email!,
      asaas_customer_id: customerId,
      asaas_subscription_id: subData.id,
      plan_name: "SIM Questões Premium",
      status: "active",
      payment_method: "CREDIT_CARD",
      started_at: new Date().toISOString(),
      next_due_date: nextDueDate,
      expires_at: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString(),
    }, { onConflict: "user_id" });

    return new Response(JSON.stringify({ success: true, subscriptionId: subData.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("create-asaas-subscription error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
