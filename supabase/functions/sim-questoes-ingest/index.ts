import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encodeHex } from "https://deno.land/std@0.224.0/encoding/hex.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, x-api-key, x-signature-sha256",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ENTITY_TO_TABLE: Record<string, string> = {
  question: "questions",
  question_image: "question_images",
  question_topic: "question_topics",
  subject: "subjects",
  content: "contents",
  topic: "topics",
  area: "areas",
  exam: "exams",
};

async function hmacSha256Hex(secret: string, body: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  return encodeHex(new Uint8Array(sig));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response("method not allowed", { status: 405, headers: corsHeaders });
  }

  const raw = await req.text();

  const secret = Deno.env.get("SIM_QUESTOES_WEBHOOK_SECRET");
  if (!secret) {
    return new Response(JSON.stringify({ error: "server missing SIM_QUESTOES_WEBHOOK_SECRET" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const expected = await hmacSha256Hex(secret, raw);
  const received = req.headers.get("x-signature-sha256") ?? "";
  if (received !== expected) {
    return new Response(JSON.stringify({ error: "invalid signature" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let evt: any;
  try {
    evt = JSON.parse(raw);
  } catch {
    return new Response(JSON.stringify({ error: "invalid json" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const table = ENTITY_TO_TABLE[evt.entity_type];
  if (!table) {
    return new Response(JSON.stringify({ error: `unknown entity_type: ${evt.entity_type}` }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supa = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    if (evt.operation === "delete") {
      const { error } = await supa.from(table).delete().eq("id", evt.entity_id);
      if (error) throw error;
    } else {
      let payload = { ...(evt.payload ?? {}) };

      if (evt.entity_type === "question") {
        const subjectName: string | undefined = payload.subject_name;
        const topicName: string | undefined = payload.topic_name;
        delete payload.subject_name;
        delete payload.topic_name;

        if (!payload.subject_id) {
          if (!subjectName) throw new Error("question payload missing subject_id/subject_name");
          payload.subject_id = await resolveSubjectId(supa, subjectName);
        }
        if (!payload.content_id) {
          if (!topicName) throw new Error("question payload missing content_id/topic_name");
          payload.content_id = await resolveContentId(supa, payload.subject_id, topicName);
        }
      }

      const { error } = await supa.from(table).upsert(payload);
      if (error) throw error;
    }
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e?.message ?? String(e), entity_type: evt.entity_type }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  return new Response(JSON.stringify({ ok: true, event_id: evt.event_id }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
