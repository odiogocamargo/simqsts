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
    const payload = evt.payload ?? {};
    if (evt.entity_type === "question_topic") {
      // O vínculo chega identificado por question_id + topic_id (não pelo id da linha).
      const { question_id, topic_id } = payload;
      if (!question_id) {
        return new Response(JSON.stringify({ error: "question_topic requires question_id" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (evt.operation === "delete") {
        let del = supa.from("question_topics").delete().eq("question_id", question_id);
        if (topic_id) del = del.eq("topic_id", topic_id);
        const { error } = await del;
        if (error) throw error;
      } else {
        // O tópico é a fonte da verdade: cada questão tem UM tópico, e o
        // conteúdo e a matéria da questão acompanham o conteúdo do tópico.
        const { data: topic, error: topicErr } = await supa
          .from("topics")
          .select("id, content_id, contents(subject_id)")
          .eq("id", topic_id)
          .maybeSingle();
        if (topicErr) throw topicErr;
        if (!topic) {
          return new Response(JSON.stringify({ error: `unknown topic_id: ${topic_id}` }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const { error: delErr } = await supa
          .from("question_topics")
          .delete()
          .eq("question_id", question_id)
          .neq("topic_id", topic_id);
        if (delErr) throw delErr;
        const { error: upErr } = await supa
          .from("question_topics")
          .upsert({ question_id, topic_id }, { onConflict: "question_id,topic_id", ignoreDuplicates: true });
        if (upErr) throw upErr;
        const subjectId = (topic as any).contents?.subject_id;
        if (subjectId) {
          // Só grava quando há diferença, para não gerar eventos de webhook à toa.
          const { error: qErr } = await supa
            .from("questions")
            .update({ content_id: topic.content_id, subject_id: subjectId })
            .eq("id", question_id)
            .or(`content_id.is.null,content_id.neq.${topic.content_id},subject_id.neq.${subjectId}`);
          if (qErr) throw qErr;
        }
      }
    } else if (evt.operation === "delete") {
      const { error } = await supa.from(table).delete().eq("id", evt.entity_id);
      if (error) throw error;
    } else {
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
