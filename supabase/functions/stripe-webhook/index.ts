import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    
    const signature = req.headers.get("stripe-signature");
    if (!signature) throw new Error("No Stripe signature found");

    const body = await req.text();
    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      logStep("Webhook signature verification failed", { error: errorMessage });
      return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400 });
    }

    logStep("Event verified", { type: event.type, id: event.id });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Handle different event types
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(supabase, stripe, subscription);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(supabase, stripe, subscription);
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          await handleSubscriptionChange(supabase, stripe, subscription);
        }
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          await handlePaymentFailed(supabase, stripe, invoice);
        }
        break;
      }
      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in stripe-webhook", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
});

async function handleSubscriptionChange(
  supabase: any,
  stripe: Stripe,
  subscription: Stripe.Subscription
) {
  logStep("Handling subscription change", { 
    subscriptionId: subscription.id, 
    status: subscription.status,
    customerId: subscription.customer 
  });

  // Get customer email
  const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
  if (!customer.email) {
    logStep("Customer has no email", { customerId: subscription.customer });
    return;
  }

  // Find user by email
  const { data: users, error: userError } = await supabase.auth.admin.listUsers();
  if (userError) {
    logStep("Error listing users", { error: userError.message });
    return;
  }

  const user = users.users.find((u: any) => u.email === customer.email);
  if (!user) {
    logStep("No user found for email", { email: customer.email });
    // Still save the subscription with email for later linking
  }

  // Map Stripe status to our status
  const statusMap: Record<string, string> = {
    active: "active",
    canceled: "canceled",
    incomplete: "pending",
    incomplete_expired: "canceled",
    past_due: "late",
    trialing: "active",
    unpaid: "late",
  };

  const mappedStatus = statusMap[subscription.status] || "pending";
  const productId = subscription.items.data[0]?.price?.product as string;

  // Get product name
  let planName = null;
  if (productId) {
    try {
      const product = await stripe.products.retrieve(productId);
      planName = product.name;
    } catch (e) {
      logStep("Could not fetch product name", { productId });
    }
  }

  // Upsert subscription
  const subscriptionData = {
    user_id: user?.id || null,
    kiwify_customer_email: customer.email,
    kiwify_subscription_id: subscription.id,
    status: mappedStatus,
    plan_name: planName,
    started_at: new Date(subscription.start_date * 1000).toISOString(),
    expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
    canceled_at: subscription.canceled_at 
      ? new Date(subscription.canceled_at * 1000).toISOString() 
      : null,
    updated_at: new Date().toISOString(),
  };

  // Check if subscription exists
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("kiwify_subscription_id", subscription.id)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("subscriptions")
      .update(subscriptionData)
      .eq("id", existing.id);
    
    if (error) {
      logStep("Error updating subscription", { error: error.message });
    } else {
      logStep("Subscription updated", { id: existing.id, status: mappedStatus });
    }
  } else {
    const { error } = await supabase
      .from("subscriptions")
      .insert(subscriptionData);
    
    if (error) {
      logStep("Error inserting subscription", { error: error.message });
    } else {
      logStep("Subscription created", { email: customer.email, status: mappedStatus });
    }
  }
}

async function handleSubscriptionDeleted(
  supabase: any,
  stripe: Stripe,
  subscription: Stripe.Subscription
) {
  logStep("Handling subscription deletion", { subscriptionId: subscription.id });

  const { error } = await supabase
    .from("subscriptions")
    .update({ 
      status: "canceled", 
      canceled_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq("kiwify_subscription_id", subscription.id);

  if (error) {
    logStep("Error marking subscription as canceled", { error: error.message });
  } else {
    logStep("Subscription marked as canceled", { subscriptionId: subscription.id });
  }
}

async function handlePaymentFailed(
  supabase: any,
  stripe: Stripe,
  invoice: Stripe.Invoice
) {
  logStep("Handling payment failure", { invoiceId: invoice.id });

  const { error } = await supabase
    .from("subscriptions")
    .update({ 
      status: "late",
      updated_at: new Date().toISOString()
    })
    .eq("kiwify_subscription_id", invoice.subscription);

  if (error) {
    logStep("Error updating subscription to late", { error: error.message });
  } else {
    logStep("Subscription marked as late", { subscriptionId: invoice.subscription });
  }
}
