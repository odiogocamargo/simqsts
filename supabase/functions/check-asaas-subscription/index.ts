// Verifica status da assinatura Asaas + trial. Substitui check-subscription (Stripe).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TRIAL_DAYS = 2;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ subscribed: false, has_access: false }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser();
    const user = userData?.user;

    if (!user) {
      return new Response(JSON.stringify({ subscribed: false, has_access: false }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Bypass para admin/professor/coordenador/aluno-escola
    const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", user.id);
    const roleNames = (roles || []).map((r) => r.role);
    const staffBypass = roleNames.some((r) => ["admin", "professor", "coordenador"].includes(r));

    const { data: schoolStudent } = await admin
      .from("school_students")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (staffBypass || schoolStudent) {
      return new Response(JSON.stringify({
        subscribed: true,
        has_access: true,
        is_in_trial: false,
        trial_days_remaining: 0,
        product_id: schoolStudent ? "school_access" : "admin_access",
        subscription_end: null,
      }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // 2. Buscar assinatura ativa
    const { data: sub } = await admin
      .from("subscriptions")
      .select("status, expires_at, asaas_subscription_id, plan_name")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .maybeSingle();

    const now = new Date();
    const isActive = sub?.status === "active" && (!sub.expires_at || new Date(sub.expires_at) > now);

    if (isActive) {
      return new Response(JSON.stringify({
        subscribed: true,
        has_access: true,
        is_in_trial: false,
        trial_days_remaining: 0,
        product_id: sub?.asaas_subscription_id || "asaas_premium",
        subscription_end: sub?.expires_at,
      }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // 3. Trial baseado em created_at do usuário
    const createdAt = new Date(user.created_at);
    const trialEnd = new Date(createdAt.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
    const inTrial = trialEnd > now;
    const daysRemaining = inTrial ? Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0;

    return new Response(JSON.stringify({
      subscribed: false,
      has_access: inTrial,
      is_in_trial: inTrial,
      trial_days_remaining: daysRemaining,
      trial_end_date: trialEnd.toISOString(),
      product_id: null,
      subscription_end: null,
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("check-asaas-subscription error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro", subscribed: false, has_access: false }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
