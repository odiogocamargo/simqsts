// Job automático: sincroniza status de assinaturas e pagamentos do Asaas
// Executado via pg_cron a cada 10 minutos. Não requer autenticação de usuário.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ASAAS_BASE_URL = "https://api.asaas.com/v3";

function mapAsaasSubStatus(s?: string): string | null {
  if (!s) return null;
  const v = s.toUpperCase();
  if (v === "ACTIVE") return "active";
  if (v === "INACTIVE" || v === "CANCELLED" || v === "CANCELED" || v === "EXPIRED") return "canceled";
  if (v === "OVERDUE") return "late";
  return null;
}

function normalizePaymentStatus(payment: any): string {
  if (payment?.deleted) return "DELETED";
  return payment?.status ?? "PENDING";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startedAt = Date.now();
  try {
    const ASAAS_API_KEY = Deno.env.get("ASAAS_API_KEY");
    if (!ASAAS_API_KEY) throw new Error("ASAAS_API_KEY não configurada");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Buscar assinaturas com vínculo de assinatura no Asaas, mesmo que o customer esteja ausente.
    // O customer pode ser recuperado pelo histórico de pagamentos abaixo.
    const { data: subs, error: subsErr } = await admin
      .from("subscriptions")
      .select("id, user_id, asaas_customer_id, asaas_subscription_id, status")
      .or("asaas_customer_id.not.is.null,asaas_subscription_id.not.is.null");

    if (subsErr) throw subsErr;

    let subsChecked = 0;
    let subsUpdated = 0;
    let paymentsSynced = 0;
    const errors: string[] = [];

    for (const sub of subs ?? []) {
      subsChecked++;
      try {
        let customerId = sub.asaas_customer_id as string | null;

        if (!customerId) {
          const { data: lastPayment } = await admin
            .from("payment_history")
            .select("asaas_customer_id")
            .eq("subscription_id", sub.id)
            .not("asaas_customer_id", "is", null)
            .order("updated_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          customerId = lastPayment?.asaas_customer_id ?? null;
          if (customerId) {
            await admin
              .from("subscriptions")
              .update({ asaas_customer_id: customerId, updated_at: new Date().toISOString() })
              .eq("id", sub.id);
            subsUpdated++;
          }
        }

        // 1. Atualizar status da assinatura (se houver assinatura Asaas)
        if (sub.asaas_subscription_id) {
          const sResp = await fetch(`${ASAAS_BASE_URL}/subscriptions/${sub.asaas_subscription_id}`, {
            headers: { "access_token": ASAAS_API_KEY },
          });
          if (sResp.ok) {
            const sJson = await sResp.json();
            const mapped = mapAsaasSubStatus(sJson?.status);
            const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
            if (mapped && mapped !== sub.status) {
              updates.status = mapped;
              if (mapped === "canceled") updates.canceled_at = new Date().toISOString();
            }
            if (sJson?.nextDueDate) updates.next_due_date = sJson.nextDueDate;
            if (Object.keys(updates).length > 1) {
              await admin.from("subscriptions").update(updates).eq("id", sub.id);
              subsUpdated++;
            }
          }
        }

        if (!customerId) {
          errors.push(`customer missing ${sub.id}`);
          continue;
        }

        await admin
          .from("payment_history")
          .update({ status: "DELETED", updated_at: new Date().toISOString() })
          .eq("subscription_id", sub.id)
          .eq("status", "PENDING")
          .eq("raw_event->payment->>deleted", "true");

        // 2. Sincronizar pagamentos do customer
        const url = new URL(`${ASAAS_BASE_URL}/payments`);
        url.searchParams.set("customer", customerId);
        url.searchParams.set("limit", "100");
        const pResp = await fetch(url.toString(), {
          headers: { "access_token": ASAAS_API_KEY },
        });
        if (!pResp.ok) {
          errors.push(`payments ${sub.id}: ${pResp.status}`);
          continue;
        }
        const pJson = await pResp.json();
        const payments: any[] = pJson?.data ?? [];

        for (const p of payments) {
          const paymentStatus = normalizePaymentStatus(p);
          const record = {
            user_id: sub.user_id,
            subscription_id: sub.id,
            asaas_payment_id: p.id,
            asaas_subscription_id: p.subscription ?? sub.asaas_subscription_id ?? null,
            asaas_customer_id: p.customer ?? customerId,
            amount: p.value ?? 0,
            net_value: p.netValue ?? null,
            status: paymentStatus,
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
          if (error) errors.push(`upsert ${p.id}: ${error.message}`);
          else paymentsSynced++;

          // Se há um pagamento confirmado, garantir assinatura ativa
          if (
            (paymentStatus === "CONFIRMED" || paymentStatus === "RECEIVED") &&
            sub.status !== "active"
          ) {
            await admin
              .from("subscriptions")
              .update({
                status: "active",
                asaas_last_payment_id: p.id,
                expires_at: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq("id", sub.id);
          }
        }
      } catch (e) {
        errors.push(`sub ${sub.id}: ${e instanceof Error ? e.message : "err"}`);
      }
    }

    const elapsed = Date.now() - startedAt;
    console.log(
      `sync-asaas-all done: subsChecked=${subsChecked} subsUpdated=${subsUpdated} paymentsSynced=${paymentsSynced} errors=${errors.length} elapsedMs=${elapsed}`
    );

    return new Response(
      JSON.stringify({ subsChecked, subsUpdated, paymentsSynced, errors, elapsedMs: elapsed }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("sync-asaas-all fatal:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
