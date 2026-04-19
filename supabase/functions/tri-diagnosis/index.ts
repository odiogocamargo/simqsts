// Edge function: gera diagnóstico em linguagem natural a partir de estatísticas TRI do aluno.
import { corsHeaders } from "@supabase/supabase-js/cors";

interface AreaStat {
  area: string;
  score: number | null;
  total: number;
  correct: number;
}

interface DiagnosisInput {
  globalScore: number;
  se: number;
  totalAnswered: number;
  totalCorrect: number;
  coherence: number;
  byArea: AreaStat[];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY não configurada");

    const input = (await req.json()) as DiagnosisInput;

    const areaSummary = input.byArea
      .filter((a) => a.score !== null)
      .map((a) => `- ${a.area}: ${a.score} pts (${a.correct}/${a.total} acertos)`)
      .join("\n");

    const prompt = `Você é um tutor especialista em ENEM analisando o desempenho de um aluno via Teoria de Resposta ao Item (TRI).

Dados do aluno:
- Nota TRI estimada: ${input.globalScore} ± ${Math.round(input.se * 100)} pontos (intervalo de confiança)
- Total respondidas: ${input.totalAnswered} questões
- Acertos: ${input.totalCorrect}
- Coerência TRI: ${input.coherence}% (mede consistência do padrão de respostas)

Desempenho por área:
${areaSummary}

Gere um diagnóstico curto (máx 4 parágrafos curtos) em português brasileiro:
1. Avaliação geral da nota e do que ela significa para o ENEM (qual perfil de curso ela atinge)
2. Pontos fortes (área(s) com melhor pontuação)
3. Lacunas críticas (área(s) com menor pontuação ou com poucos dados)
4. Recomendação prática e objetiva do que fazer agora (1-2 ações concretas)

Use tom direto, motivador mas honesto. Sem clichês ("você está no caminho certo"). Sem markdown pesado, apenas parágrafos. Não repita os números, interprete-os.`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!aiResp.ok) {
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições atingido. Tente em alguns minutos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResp.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados. Adicione créditos no workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, t);
      return new Response(JSON.stringify({ error: "Erro ao gerar diagnóstico" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiResp.json();
    const diagnosis = data?.choices?.[0]?.message?.content ?? "";

    return new Response(JSON.stringify({ diagnosis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("tri-diagnosis error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
