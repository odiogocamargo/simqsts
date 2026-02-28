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

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    
    // Use getUser with the token directly - this validates the JWT
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError) {
      logStep("Auth error details", { message: userError.message, status: userError.status });
      throw new Error(`Authentication error: ${userError.message}`);
    }
    
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

    // Check if user is linked to an active school - they get free access
    const { data: schoolLink } = await supabaseClient
      .from("school_students")
      .select("school_id, schools!inner(active)")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (schoolLink) {
      logStep("User is linked to a school - granting full access", { schoolId: schoolLink.school_id });
      return new Response(JSON.stringify({
        subscribed: true,
        has_access: true,
        is_in_trial: false,
        trial_days_remaining: 0,
        trial_end_date: null,
        product_id: "school_access",
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

    logStep("Trial status calculated", { isInTrial, trialDaysRemaining });

    // FIRST: Check local database for subscription (updated by webhook in real-time)
    const { data: dbSubscription } = await supabaseClient
      .from("subscriptions")
      .select("*")
      .eq("kiwify_customer_email", user.email)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (dbSubscription) {
      logStep("Found active subscription in database", { id: dbSubscription.id });
      return new Response(JSON.stringify({
        subscribed: true,
        has_access: true,
        is_in_trial: false,
        trial_days_remaining: 0,
        trial_end_date: trialEndDate.toISOString(),
        product_id: dbSubscription.plan_name,
        subscription_end: dbSubscription.expires_at,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Only call Stripe API if no subscription found in database
    // This reduces Stripe API calls significantly
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("No Stripe key, returning trial status only");
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
      logStep("Subscription data", { 
        subscriptionId: subscription.id, 
        currentPeriodEnd: subscription.current_period_end,
        status: subscription.status 
      });
      
      // Safe handling of current_period_end - it can be a number (timestamp) or undefined
      if (subscription.current_period_end && typeof subscription.current_period_end === 'number') {
        subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      }
      
      // Safe handling of product ID
      if (subscription.items?.data?.[0]?.price?.product) {
        productId = subscription.items.data[0].price.product;
      }
      
      logStep("Active Stripe subscription found", { subscriptionId: subscription.id, productId, subscriptionEnd });
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

    // Treat stale/missing sessions as a normal "not subscribed" state to avoid breaking the UI.
    // These happen when the client still holds an old token/session id (session_not_found).
    const isAuthSessionIssue =
      /Auth session missing/i.test(errorMessage) ||
      /session_not_found/i.test(errorMessage) ||
      /No authorization header/i.test(errorMessage);

    if (isAuthSessionIssue) {
      return new Response(
        JSON.stringify({
          subscribed: false,
          has_access: false,
          is_in_trial: false,
          trial_days_remaining: 0,
          trial_end_date: null,
          product_id: null,
          subscription_end: null,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        },
      );
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
