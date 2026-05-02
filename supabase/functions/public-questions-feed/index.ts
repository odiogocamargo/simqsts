// Endpoint público (autenticado por X-Api-Key) para seed inicial
// e reconciliação incremental do banco de questões em apps externas.
//
// GET /public-questions-feed?entity=questions&page=1&page_size=200&since=2025-01-01T00:00:00Z
//
// entity: questions | subjects | contents | topics | areas | exams | question_images | question_topics
// since:  ISO timestamp - retorna apenas registros com updated_at/created_at >= since

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encodeHex } from "https://deno.land/std@0.224.0/encoding/hex.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-api-key",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

const ENTITY_CONFIG: Record<string, { table: string; orderBy: string; idCol: string }> = {
  questions:        { table: "questions",        orderBy: "updated_at", idCol: "id" },
  question_images:  { table: "question_images",  orderBy: "created_at", idCol: "id" },
  question_topics:  { table: "question_topics",  orderBy: "created_at", idCol: "id" },
  subjects:         { table: "subjects",         orderBy: "updated_at", idCol: "id" },
  contents:         { table: "contents",         orderBy: "updated_at", idCol: "id" },
  topics:           { table: "topics",           orderBy: "updated_at", idCol: "id" },
  areas:            { table: "areas",            orderBy: "updated_at", idCol: "id" },
  exams:            { table: "exams",            orderBy: "updated_at", idCol: "id" },
};

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return encodeHex(new Uint8Array(buf));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey) {
      return json({ error: "Missing X-Api-Key header" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Validar API key
    const apiKeyHash = await sha256(apiKey);
    const { data: consumer, error: consumerErr } = await supabase
      .from("external_consumers")
      .select("id, name, active")
      .eq("api_key_hash", apiKeyHash)
      .maybeSingle();

    if (consumerErr || !consumer || !consumer.active) {
      return json({ error: "Invalid or inactive API key" }, 401);
    }

    // Atualiza last_ping
    await supabase
      .from("external_consumers")
      .update({ last_ping_at: new Date().toISOString() })
      .eq("id", consumer.id);

    const url = new URL(req.url);
    const entity = url.searchParams.get("entity") ?? "questions";
    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
    const pageSize = Math.min(500, Math.max(1, parseInt(url.searchParams.get("page_size") ?? "200", 10)));
    const since = url.searchParams.get("since");

    const cfg = ENTITY_CONFIG[entity];
    if (!cfg) {
      return json({ error: `Unknown entity. Allowed: ${Object.keys(ENTITY_CONFIG).join(", ")}` }, 400);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from(cfg.table)
      .select("*", { count: "exact" })
      .order(cfg.orderBy, { ascending: true })
      .order(cfg.idCol, { ascending: true })
      .range(from, to);

    if (since) {
      query = query.gte(cfg.orderBy, since);
    }

    const { data, count, error } = await query;
    if (error) {
      return json({ error: error.message }, 500);
    }

    return json({
      entity,
      page,
      page_size: pageSize,
      total: count ?? 0,
      has_more: count !== null ? from + (data?.length ?? 0) < count : false,
      data: data ?? [],
    }, 200);
  } catch (e) {
    console.error("public-questions-feed error", e);
    return json({ error: String((e as Error).message ?? e) }, 500);
  }
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
