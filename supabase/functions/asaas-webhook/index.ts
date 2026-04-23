// Webhook do Asaas - processa eventos de pagamento e assinatura
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, asaas-access-token",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const expectedToken = Deno.env.get("ASAAS_WEBHOOK_TOKEN");
    const receivedToken = req.headers.get("asaas-access-token");

    if (!expectedToken || receivedToken !== expectedToken) {
      console.warn("Webhook token inválido");
      return new Response(JSON.stringify({ error: "Token inválido" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const event = await req.json();
    console.log("Asaas event:", event?.event, event?.payment?.id || event?.subscription?.id);

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const eventName = event?.event as string;
    const payment = event?.payment;
    const subscription = event?.subscription;

    // Eventos de pagamento
    if (payment) {
      const subscriptionId = payment.subscription;
      const customerId = payment.customer;

      // Buscar assinatura no banco
      const { data: dbSub } = await supabase
        .from("subscriptions")
        .select("id, user_id")
        .or(`asaas_subscription_id.eq.${subscriptionId},asaas_customer_id.eq.${customerId}`)
        .maybeSingle();

      if (!dbSub) {
        console.warn("Assinatura não encontrada para webhook:", subscriptionId, customerId);
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const updates: Record<string, unknown> = {
        asaas_last_payment_id: payment.id,
        updated_at: new Date().toISOString(),
      };

      switch (eventName) {
        case "PAYMENT_CONFIRMED":
        case "PAYMENT_RECEIVED":
          updates.status = "active";
          updates.expires_at = new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString();
          if (payment.dueDate) updates.next_due_date = payment.dueDate;
          break;
        case "PAYMENT_OVERDUE":
          updates.status = "late";
          break;
        case "PAYMENT_REFUNDED":
          updates.status = "refunded";
          break;
        case "PAYMENT_DELETED":
          break;
      }

      await supabase.from("subscriptions").update(updates).eq("id", dbSub.id);

      // Upsert no histórico de pagamentos
      const paymentRecord = {
        user_id: dbSub.user_id,
        subscription_id: dbSub.id,
        asaas_payment_id: payment.id,
        asaas_subscription_id: subscriptionId ?? null,
        asaas_customer_id: customerId ?? null,
        amount: payment.value ?? 0,
        net_value: payment.netValue ?? null,
        status: payment.status ?? eventName,
        billing_type: payment.billingType ?? null,
        description: payment.description ?? null,
        due_date: payment.dueDate ?? null,
        payment_date: payment.paymentDate ?? payment.clientPaymentDate ?? null,
        invoice_url: payment.invoiceUrl ?? null,
        invoice_number: payment.invoiceNumber ?? null,
        transaction_receipt_url: payment.transactionReceiptUrl ?? null,
        bank_slip_url: payment.bankSlipUrl ?? null,
        raw_event: event,
        updated_at: new Date().toISOString(),
      };

      const { error: phError } = await supabase
        .from("payment_history")
        .upsert(paymentRecord, { onConflict: "asaas_payment_id" });

      if (phError) console.error("Erro ao salvar payment_history:", phError);
    }

    // Eventos de assinatura
    if (subscription && !payment) {
      const subId = subscription.id;
      const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

      if (eventName === "SUBSCRIPTION_DELETED" || subscription.status === "INACTIVE") {
        updates.status = "canceled";
        updates.canceled_at = new Date().toISOString();
      }
      if (subscription.nextDueDate) updates.next_due_date = subscription.nextDueDate;

      await supabase.from("subscriptions").update(updates).eq("asaas_subscription_id", subId);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("asaas-webhook error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
