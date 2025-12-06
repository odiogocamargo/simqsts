import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TRIAL_DAYS = 2;

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");

    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Check if user is admin or professor - they have full access without subscription
    const { data: userRole } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (userRole?.role === "admin" || userRole?.role === "professor") {
      logStep("User is admin/professor - granting full access", { role: userRole.role });
      return new Response(JSON.stringify({
        subscribed: true,
        has_access: true,
        is_in_trial: false,
        trial_days_remaining: 0,
        trial_end_date: null,
        product_id: "admin_access",
        subscription_end: null,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Calculate trial status for regular users (alunos)
    const createdAt = new Date(user.created_at);
    const trialEndDate = new Date(createdAt);
    trialEndDate.setDate(trialEndDate.getDate() + TRIAL_DAYS);
    const now = new Date();
    const isInTrial = now < trialEndDate;
    const trialDaysRemaining = isInTrial ? Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0;

    logStep("Trial status calculated", { isInTrial, trialDaysRemaining, trialEndDate: trialEndDate.toISOString() });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });

    if (customers.data.length === 0) {
      logStep("No Stripe customer found");
      return new Response(JSON.stringify({
        subscribed: false,
        has_access: isInTrial,
        is_in_trial: isInTrial,
        trial_days_remaining: trialDaysRemaining,
        trial_end_date: trialEndDate.toISOString(),
        product_id: null,
        subscription_end: null,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    const hasActiveSub = subscriptions.data.length > 0;
    let productId = null;
    let subscriptionEnd = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      productId = subscription.items.data[0].price.product;
      logStep("Active subscription found", { subscriptionId: subscription.id, productId, endDate: subscriptionEnd });
    } else {
      logStep("No active subscription found");
    }

    const hasAccess = hasActiveSub || isInTrial;

    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      has_access: hasAccess,
      is_in_trial: isInTrial && !hasActiveSub,
      trial_days_remaining: hasActiveSub ? 0 : trialDaysRemaining,
      trial_end_date: trialEndDate.toISOString(),
      product_id: productId,
      subscription_end: subscriptionEnd,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});