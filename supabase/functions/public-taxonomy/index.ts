// Endpoint público (sem auth) para expor a taxonomia do Sim Questões.
// GET /public-taxonomy            -> { subjects, contents, topics }
// GET /public-taxonomy?flat=1     -> mesma coisa, sem aninhamento
// GET /public-taxonomy?tree=1     -> subjects aninhados com contents e topics

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Cache-Control": "public, max-age=60",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const url = new URL(req.url);
    const wantsTree = url.searchParams.get("tree") === "1";

    const [subjectsRes, contentsRes, topicsRes] = await Promise.all([
      supabase.from("subjects").select("id, name, area_id").order("name"),
      supabase.from("contents").select("id, name, subject_id").order("name"),
      supabase.from("topics").select("id, name, content_id").order("name"),
    ]);

    if (subjectsRes.error) throw subjectsRes.error;
    if (contentsRes.error) throw contentsRes.error;
    if (topicsRes.error) throw topicsRes.error;

    const subjects = subjectsRes.data ?? [];
    const contents = contentsRes.data ?? [];
    const topics = topicsRes.data ?? [];

    if (wantsTree) {
      const tree = subjects.map((s) => ({
        ...s,
        contents: contents
          .filter((c) => c.subject_id === s.id)
          .map((c) => ({
            ...c,
            topics: topics.filter((t) => t.content_id === c.id),
          })),
      }));
      return json({ subjects: tree });
    }

    return json({ subjects, contents, topics });
  } catch (e) {
    console.error("public-taxonomy error", e);
    return json({ error: String((e as Error).message ?? e) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
