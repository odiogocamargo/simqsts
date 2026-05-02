// Processa a fila webhook_outbox e entrega POSTs assinados (HMAC-SHA256)
// para todos os external_consumers ativos com webhook_url configurada.
//
// Chamado por cron a cada minuto.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encodeHex } from "https://deno.land/std@0.224.0/encoding/hex.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BATCH_SIZE = 100;
const MAX_ATTEMPTS = 8;

async function hmacSha256(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return encodeHex(new Uint8Array(sig));
}

function backoffMinutes(attempts: number): number {
  // 1, 2, 4, 8, 16, 32, 60, 60 minutos
  return Math.min(60, Math.pow(2, attempts));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // 1. Buscar consumidores ativos com webhook configurado
  const { data: consumers, error: consErr } = await supabase
    .from("external_consumers")
    .select("id, name, webhook_url, webhook_secret")
    .eq("active", true)
    .not("webhook_url", "is", null);

  if (consErr) {
    return json({ error: consErr.message }, 500);
  }

  if (!consumers || consumers.length === 0) {
    return json({ ok: true, message: "no active consumers with webhook" }, 200);
  }

  // 2. Buscar eventos pendentes
  const { data: events, error: evErr } = await supabase
    .from("webhook_outbox")
    .select("*")
    .is("delivered_at", null)
    .lte("next_attempt_at", new Date().toISOString())
    .order("id", { ascending: true })
    .limit(BATCH_SIZE);

  if (evErr) {
    return json({ error: evErr.message }, 500);
  }

  if (!events || events.length === 0) {
    return json({ ok: true, processed: 0 }, 200);
  }

  let delivered = 0;
  let failed = 0;

  for (const ev of events) {
    let allOk = true;
    let lastError: string | null = null;

    for (const c of consumers) {
      const body = JSON.stringify({
        event_id: ev.id,
        entity_type: ev.entity_type,
        entity_id: ev.entity_id,
        operation: ev.operation,
        payload: ev.payload,
        created_at: ev.created_at,
      });

      try {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (c.webhook_secret) {
          headers["X-Signature-Sha256"] = await hmacSha256(c.webhook_secret, body);
        }

        const resp = await fetch(c.webhook_url!, {
          method: "POST",
          headers,
          body,
          signal: AbortSignal.timeout(10_000),
        });

        if (!resp.ok) {
          allOk = false;
          lastError = `consumer ${c.name}: HTTP ${resp.status}`;
          await supabase
            .from("external_consumers")
            .update({ events_failed: (Number(c["events_failed" as keyof typeof c]) || 0) + 1 })
            .eq("id", c.id);
        } else {
          await supabase.rpc; // noop placeholder removido abaixo
          await supabase
            .from("external_consumers")
            .update({ last_ping_at: new Date().toISOString() })
            .eq("id", c.id);
        }
        // tenta consumir o body
        try { await resp.text(); } catch (_) { /* ignore */ }
      } catch (e) {
        allOk = false;
        lastError = `consumer ${c.name}: ${(e as Error).message}`;
      }
    }

    if (allOk) {
      delivered++;
      await supabase
        .from("webhook_outbox")
        .update({ delivered_at: new Date().toISOString(), last_error: null })
        .eq("id", ev.id);
    } else {
      failed++;
      const newAttempts = (ev.attempts ?? 0) + 1;
      const next = new Date(Date.now() + backoffMinutes(newAttempts) * 60_000).toISOString();
      await supabase
        .from("webhook_outbox")
        .update({
          attempts: newAttempts,
          next_attempt_at: next,
          last_error: lastError,
          // se exceder, marca como entregue para parar de tentar (e fica registrado o erro)
          delivered_at: newAttempts >= MAX_ATTEMPTS ? new Date().toISOString() : null,
        })
        .eq("id", ev.id);
    }
  }

  return json({ ok: true, processed: events.length, delivered, failed }, 200);
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
