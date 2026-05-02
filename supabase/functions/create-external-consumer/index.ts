// Admin-only: cria um external_consumer e retorna a API key em texto puro
// UMA ÚNICA VEZ (depois disso só fica o hash).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encodeHex } from "https://deno.land/std@0.224.0/encoding/hex.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return encodeHex(new Uint8Array(buf));
}

function randomToken(bytes = 32): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return encodeHex(arr);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Unauthorized" }, 401);
    }

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsErr } = await userClient.auth.getClaims(token);
    if (claimsErr || !claimsData?.claims) return json({ error: "Unauthorized" }, 401);

    const userId = claimsData.claims.sub;
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: isAdmin } = await admin.rpc("has_role", { _user_id: userId, _role: "admin" });
    if (!isAdmin) return json({ error: "Admin only" }, 403);

    const body = await req.json().catch(() => ({}));
    const name: string = (body?.name ?? "").toString().trim();
    const webhook_url: string | null = body?.webhook_url ? String(body.webhook_url) : null;
    if (!name) return json({ error: "name is required" }, 400);
    if (webhook_url && !webhook_url.startsWith("https://")) {
      return json({ error: "webhook_url must use https" }, 400);
    }

    const apiKey = `sq_live_${randomToken(24)}`;
    const apiKeyHash = await sha256(apiKey);
    const apiKeyPrefix = apiKey.slice(0, 12);
    const webhookSecret = randomToken(32);

    const { data, error } = await admin
      .from("external_consumers")
      .insert({
        name,
        api_key_hash: apiKeyHash,
        api_key_prefix: apiKeyPrefix,
        webhook_url,
        webhook_secret: webhookSecret,
        active: true,
      })
      .select("id, name, api_key_prefix, webhook_url, active, created_at")
      .single();

    if (error) return json({ error: error.message }, 500);

    return json({
      consumer: data,
      api_key: apiKey,            // mostrado apenas nesta resposta
      webhook_secret: webhookSecret, // idem
      message: "Guarde a api_key e o webhook_secret agora. Eles não serão mostrados novamente.",
    }, 200);
  } catch (e) {
    return json({ error: String((e as Error).message ?? e) }, 500);
  }
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
