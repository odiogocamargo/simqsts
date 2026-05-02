// Envia um POST de teste assinado (HMAC-SHA256) para o webhook_url de um consumidor
// e retorna status, latência e corpo da resposta — útil para validar que a outra
// app está conferindo o X-Signature-Sha256 corretamente.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encodeHex } from "https://deno.land/std@0.224.0/encoding/hex.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "missing auth" }, 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    // Identifica o usuário e checa se é admin
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData.user) return json({ error: "unauthorized" }, 401);

    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (!isAdmin) return json({ error: "forbidden — admin only" }, 403);

    const { consumer_id, mode } = await req.json();
    if (!consumer_id) return json({ error: "consumer_id required" }, 400);

    // Busca o consumidor com o secret (precisa do service role; já estamos com ele acima)
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: consumer, error: cErr } = await admin
      .from("external_consumers")
      .select("id, name, webhook_url, webhook_secret, active")
      .eq("id", consumer_id)
      .maybeSingle();

    if (cErr || !consumer) return json({ error: "consumer not found" }, 404);
    if (!consumer.webhook_url) return json({ error: "consumer has no webhook_url configured" }, 400);

    const body = JSON.stringify({
      event_id: 0,
      entity_type: "ping",
      entity_id: "test",
      operation: "test",
      payload: {
        message: "Este é um evento de teste enviado pelo Sim Questões.",
        sent_at: new Date().toISOString(),
        consumer_name: consumer.name,
      },
      created_at: new Date().toISOString(),
      _test: true,
    });

    const signature = await hmacSha256(consumer.webhook_secret, body);

    // Modo "bad_signature" envia uma assinatura inválida de propósito,
    // útil para confirmar que a outra app está REJEITANDO assinaturas erradas.
    const sentSignature = mode === "bad_signature" ? "0".repeat(64) : signature;

    const start = Date.now();
    let status = 0;
    let respText = "";
    let networkError: string | null = null;

    try {
      const resp = await fetch(consumer.webhook_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Signature-Sha256": sentSignature,
          "X-Sim-Questoes-Test": "true",
        },
        body,
        signal: AbortSignal.timeout(15_000),
      });
      status = resp.status;
      respText = (await resp.text()).slice(0, 2000);
    } catch (e) {
      networkError = (e as Error).message;
    }

    const elapsed_ms = Date.now() - start;

    const expected_when_valid =
      mode === "bad_signature"
        ? "Esperado: 401 (assinatura rejeitada). Se vier 2xx, a outra app NÃO está validando a assinatura."
        : "Esperado: 2xx (assinatura aceita). Se vier 401, o webhook_secret está diferente nos dois lados.";

    return json({
      ok: networkError === null,
      mode: mode === "bad_signature" ? "bad_signature" : "valid",
      consumer: { id: consumer.id, name: consumer.name, webhook_url: consumer.webhook_url, active: consumer.active },
      sent_signature_preview: sentSignature.slice(0, 16) + "…",
      status,
      elapsed_ms,
      response_body_preview: respText,
      network_error: networkError,
      interpretation: expected_when_valid,
    });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
