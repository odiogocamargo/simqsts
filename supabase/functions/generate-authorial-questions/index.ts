import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };
const AI_MODEL = "google/gemini-2.5-flash";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: jsonHeaders });

const tryParse = (v: string) => {
  try { return JSON.parse(v); } catch { return null; }
};

const extractJson = (v: string) => {
  const cleaned = v.replace(/```json/gi, "").replace(/```/g, "").trim();
  const first = cleaned.search(/[\[{]/);
  if (first === -1) return null;
  const open = cleaned[first];
  const close = open === "[" ? "]" : "}";
  const last = cleaned.lastIndexOf(close);
  if (last <= first) return null;
  return cleaned.slice(first, last + 1);
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claims?.claims?.sub) return json({ error: "Invalid token" }, 401);

    const userId = claims.claims.sub;
    const [prof, admin] = await Promise.all([
      supabase.rpc("has_role", { _user_id: userId, _role: "professor" }),
      supabase.rpc("has_role", { _user_id: userId, _role: "admin" }),
    ]);
    if (!prof.data && !admin.data) return json({ error: "Forbidden" }, 403);

    const body = await req.json();
    const subject_id = String(body.subject_id || "").trim();
    const content_id = String(body.content_id || "").trim();
    const topic_id = String(body.topic_id || "").trim();
    const difficulty = ["facil", "medio", "dificil"].includes(body.difficulty) ? body.difficulty : "medio";
    const quantity = Math.max(1, Math.min(10, Number(body.quantity) || 1));
    const instructions = String(body.instructions || "").trim();

    if (!subject_id || !content_id) return json({ error: "subject_id e content_id são obrigatórios" }, 400);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) return json({ error: "AI service not configured" }, 500);

    // Buscar taxonomia (nomes) e amostra de questões existentes como referência de estilo
    const [subj, cont, top, refQuestions] = await Promise.all([
      supabase.from("subjects").select("id, name").eq("id", subject_id).maybeSingle(),
      supabase.from("contents").select("id, name").eq("id", content_id).maybeSingle(),
      topic_id
        ? supabase.from("topics").select("id, name").eq("id", topic_id).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      (async () => {
        let q = supabase
          .from("questions")
          .select("statement, option_a, option_b, option_c, option_d, option_e, correct_answer, explanation")
          .eq("subject_id", subject_id)
          .eq("content_id", content_id)
          .limit(6);
        if (topic_id) q = q.eq("topic_id", topic_id);
        const { data, error } = await q;
        if (error || !data || data.length === 0) {
          // fallback: sem filtro de tópico
          const { data: fb } = await supabase
            .from("questions")
            .select("statement, option_a, option_b, option_c, option_d, option_e, correct_answer, explanation")
            .eq("subject_id", subject_id)
            .eq("content_id", content_id)
            .limit(6);
          return fb || [];
        }
        return data;
      })(),
    ]);

    const subjectName = subj.data?.name || subject_id;
    const contentName = cont.data?.name || content_id;
    const topicName = top.data?.name || "";

    const referenceBlock = (refQuestions || []).map((q, i) => {
      return [
        `--- Questão de referência #${i + 1} ---`,
        `Enunciado: ${q.statement || ""}`,
        `A) ${q.option_a || ""}`,
        `B) ${q.option_b || ""}`,
        `C) ${q.option_c || ""}`,
        `D) ${q.option_d || ""}`,
        `E) ${q.option_e || ""}`,
        `Gabarito: ${(q.correct_answer || "").toUpperCase()}`,
      ].join("\n");
    }).join("\n\n");

    const systemPrompt = [
      "Você é um elaborador sênior de questões AUTORAIS para o cursinho Mérito, especializado em vestibulares brasileiros (ENEM, FUVEST, UNICAMP, UECE, etc.).",
      "Sua tarefa é criar questões INÉDITAS, no mesmo padrão de qualidade, linguagem e nível cognitivo das questões de referência fornecidas, mas SEM copiar enunciados, alternativas ou contextos.",
      "",
      "REGRAS OBRIGATÓRIAS:",
      "1. Cada questão deve ter enunciado claro, contexto original (se pertinente) e 5 alternativas (A-E) plausíveis.",
      "2. Apenas UMA alternativa correta. As demais devem ser distratores coerentes (erros conceituais comuns).",
      "3. Forneça explicação didática apontando por que a correta está certa e por que cada distrator está errado.",
      "4. NUNCA copie trechos literais das questões de referência. Use-as apenas como padrão de estilo, profundidade e taxonomia cognitiva.",
      "5. Use HTML simples quando necessário (<p>, <br/>, <strong>, <em>, <ul>, <li>). Para fórmulas, use LaTeX inline entre $...$.",
      "6. Respeite a dificuldade solicitada.",
      "7. Português brasileiro formal, típico de banca de vestibular.",
    ].join("\n");

    const userPrompt = [
      `Matéria: ${subjectName}`,
      `Conteúdo: ${contentName}`,
      topicName ? `Tópico: ${topicName}` : "",
      `Dificuldade: ${difficulty}`,
      `Quantidade a gerar: ${quantity}`,
      instructions ? `\nInstruções adicionais do professor:\n${instructions}` : "",
      "",
      referenceBlock
        ? `QUESTÕES DE REFERÊNCIA (padrão de estilo — NÃO copiar):\n\n${referenceBlock}`
        : "Não há questões de referência no banco para esta taxonomia — crie no padrão dos grandes vestibulares brasileiros.",
      "",
      `Gere agora ${quantity} questão(ões) AUTORAL(is) inédita(s) seguindo esse padrão.`,
    ].filter(Boolean).join("\n");

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "return_authorial_questions",
            description: "Retorna a lista de questões autorais geradas.",
            parameters: {
              type: "object",
              properties: {
                questions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      statement: { type: "string", description: "Enunciado completo da questão (pode incluir contexto e HTML simples)." },
                      option_a: { type: "string" },
                      option_b: { type: "string" },
                      option_c: { type: "string" },
                      option_d: { type: "string" },
                      option_e: { type: "string" },
                      correct_answer: { type: "string", enum: ["a", "b", "c", "d", "e"] },
                      explanation: { type: "string", description: "Explicação didática (justificativa da correta e comentário breve dos distratores)." },
                    },
                    required: ["statement", "option_a", "option_b", "option_c", "option_d", "option_e", "correct_answer", "explanation"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["questions"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "return_authorial_questions" } },
      }),
    });

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, errText);
      if (aiResp.status === 429) return json({ error: "Limite de requisições excedido. Tente novamente em alguns instantes." }, 429);
      if (aiResp.status === 402) return json({ error: "Créditos de IA esgotados. Adicione créditos em Settings → Workspace → Usage." }, 402);
      return json({ error: "Erro ao gerar questões com IA" }, 500);
    }

    const data = await aiResp.json();
    const msg = data?.choices?.[0]?.message;
    const args = msg?.tool_calls?.[0]?.function?.arguments;
    const content = typeof msg?.content === "string" ? msg.content : "";
    const parsed = (typeof args === "string" ? (tryParse(args) || tryParse(extractJson(args) || "")) : null)
      || tryParse(content) || tryParse(extractJson(content) || "");

    if (!parsed?.questions || !Array.isArray(parsed.questions)) {
      console.error("Resposta inesperada da IA:", data);
      return json({ error: "Formato de resposta inesperado da IA" }, 500);
    }

    return json({
      success: true,
      data: {
        subject: { id: subject_id, name: subjectName },
        content: { id: content_id, name: contentName },
        topic: topic_id ? { id: topic_id, name: topicName } : null,
        difficulty,
        reference_count: refQuestions?.length || 0,
        questions: parsed.questions,
      },
    });
  } catch (err) {
    console.error("generate-authorial-questions error:", err);
    return json({ error: "Erro ao gerar questões. Tente novamente." }, 500);
  }
});
