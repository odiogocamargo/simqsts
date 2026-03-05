import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };
const AI_MODEL = "google/gemini-3-flash-preview";

const toJsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: jsonHeaders });

const normalizeImageBase64 = (value: string) => value.trim();

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return toJsonResponse({ error: "Unauthorized" }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims?.sub) {
      return toJsonResponse({ error: "Invalid token" }, 401);
    }

    const userId = claimsData.claims.sub;
    const [professorRole, adminRole] = await Promise.all([
      supabase.rpc("has_role", { _user_id: userId, _role: "professor" }),
      supabase.rpc("has_role", { _user_id: userId, _role: "admin" }),
    ]);

    if (!professorRole.data && !adminRole.data) {
      return toJsonResponse({ error: "Forbidden - professor or admin role required" }, 403);
    }

    const { imageBase64 } = await req.json();
    if (!imageBase64 || typeof imageBase64 !== "string") {
      return toJsonResponse({ error: "Image data is required" }, 400);
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return toJsonResponse({ error: "AI service not configured" }, 500);
    }

    const [subjectsResult, contentsResult, topicsResult, examsResult] = await Promise.all([
      supabase.from("subjects").select("id, name").order("name"),
      supabase.from("contents").select("id, name, subject_id").order("name"),
      supabase.from("topics").select("id, name, content_id").order("name"),
      supabase.from("exams").select("id, name").order("name"),
    ]);

    const taxonomyErrors = [subjectsResult.error, contentsResult.error, topicsResult.error, examsResult.error].filter(Boolean);
    if (taxonomyErrors.length > 0) {
      console.error("Error loading taxonomy:", taxonomyErrors);
      return toJsonResponse({ error: "Não foi possível carregar a taxonomia para classificação." }, 500);
    }

    const taxonomyPrompt = [
      "Você está analisando uma imagem de vestibular brasileiro.",
      "A imagem pode conter uma única questão ou várias questões na mesma página.",
      "Extraia TODAS as questões visíveis e retorne uma lista estruturada.",
      "",
      "OBJETIVO PRINCIPAL:",
      "Transcreva o texto da forma MAIS FIEL possível ao original, preservando a ordem visual e a estrutura do vestibular.",
      "",
      "REGRAS OBRIGATÓRIAS:",
      "1. Retorne apenas questões claramente legíveis.",
      "2. Para cada questão, preencha matéria, conteúdo, tópico, vestibular, ano, dificuldade, alternativas, gabarito e explicação curta quando possível.",
      "3. Use APENAS os IDs reais da taxonomia abaixo; nunca invente IDs.",
      "4. Se não conseguir identificar um tópico, retorne string vazia para topic_id.",
      "5. Se não houver alternativas, deixe option_a..option_e vazias e correct_answer vazio.",
      "6. correct_answer deve ser uma letra minúscula: a, b, c, d ou e.",
      "7. O campo statement deve vir fiel ao original, preservando títulos, citações, versos, quebras de linha, enumerações, trechos de livros, diálogos e a ordem natural da leitura.",
      "8. O campo exam_id deve usar um dos IDs abaixo exatamente como informado.",
      "9. O campo difficulty deve ser apenas: facil, medio ou dificil.",
      "10. Se a página tiver mais de uma questão, preserve a ordem visual da página.",
      "11. Leia sempre de cima para baixo e da esquerda para a direita dentro de cada bloco textual.",
      "12. NUNCA misture linhas de alternativas com o enunciado nem junte trechos de blocos diferentes fora de ordem.",
      "13. Quando houver poema, letra de música, citação longa ou passagem de livro, preserve a formatação com HTML simples (<p>, <br>, <strong>, <em>, <ul>, <li>) quando isso ajudar a manter o sentido original.",
      "14. Não reescreva, não resuma, não interprete e não simplifique o texto; transcreva como aparece.",
      "15. Se parte do texto estiver ilegível, mantenha apenas o trecho confiável e não invente conteúdo.",
      "",
      "EXAMES DISPONÍVEIS:",
      ...(examsResult.data || []).map((exam) => `- ${exam.id}: ${exam.name}`),
      "",
      "MATÉRIAS DISPONÍVEIS:",
      ...(subjectsResult.data || []).map((subject) => `- ${subject.id}: ${subject.name}`),
      "",
      "CONTEÚDOS DISPONÍVEIS:",
      ...(contentsResult.data || []).map((content) => `- ${content.id}: ${content.name} (subject_id: ${content.subject_id})`),
      "",
      "TÓPICOS DISPONÍVEIS:",
      ...(topicsResult.data || []).map((topic) => `- ${topic.id}: ${topic.name} (content_id: ${topic.content_id})`),
    ].join("\n");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          {
            role: "system",
            content: taxonomyPrompt,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analise esta imagem e extraia todas as questões visíveis para pré-preenchimento do formulário de cadastro. Primeiro reconstrua mentalmente a leitura na ordem visual da página; depois transcreva cada questão de forma fiel ao original, preservando passagens, citações, poemas, versos, diálogos e quebras de linha sempre que necessário. Se houver várias questões, retorne todas.",
              },
              {
                type: "image_url",
                image_url: {
                  url: normalizeImageBase64(imageBase64),
                },
              },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_questions_batch",
              description: "Extrai uma ou mais questões de vestibular a partir de uma imagem e devolve dados prontos para preencher o formulário.",
              parameters: {
                type: "object",
                properties: {
                  questions: {
                    type: "array",
                    description: "Lista ordenada de questões encontradas na imagem.",
                    items: {
                      type: "object",
                      properties: {
                        statement: { type: "string", description: "Enunciado transcrito fielmente ao original, preservando ordem de leitura e podendo usar HTML simples para manter formatação." },
                        subject_id: { type: "string", description: "ID real da matéria" },
                        content_id: { type: "string", description: "ID real do conteúdo" },
                        topic_id: { type: "string", description: "ID real do tópico ou string vazia" },
                        exam_id: { type: "string", description: "ID real do vestibular" },
                        year: { type: "integer" },
                        difficulty: { type: "string", enum: ["facil", "medio", "dificil"] },
                        option_a: { type: "string", description: "Alternativa A fiel ao original; pode usar HTML simples para preservar quebras." },
                        option_b: { type: "string", description: "Alternativa B fiel ao original; pode usar HTML simples para preservar quebras." },
                        option_c: { type: "string", description: "Alternativa C fiel ao original; pode usar HTML simples para preservar quebras." },
                        option_d: { type: "string", description: "Alternativa D fiel ao original; pode usar HTML simples para preservar quebras." },
                        option_e: { type: "string", description: "Alternativa E fiel ao original; pode usar HTML simples para preservar quebras." },
                        correct_answer: { type: "string", enum: ["", "a", "b", "c", "d", "e"] },
                        explanation: { type: "string", description: "Explicação curta opcional; se houver citação textual relevante, preserve-a fielmente." },
                      },
                      required: ["statement", "subject_id", "content_id", "topic_id", "exam_id", "year", "difficulty", "option_a", "option_b", "option_c", "option_d", "option_e", "correct_answer", "explanation"],
                      additionalProperties: false,
                    },
                  },
                  summary: {
                    type: "object",
                    properties: {
                      total_questions: { type: "integer" },
                      detected_exam: { type: "string" },
                      detected_year: { type: "integer" },
                    },
                    required: ["total_questions", "detected_exam", "detected_year"],
                    additionalProperties: false,
                  },
                },
                required: ["questions", "summary"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_questions_batch" } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);

      if (response.status === 429) {
        return toJsonResponse({ error: "Limite de requisições excedido. Tente novamente em alguns instantes." }, 429);
      }

      if (response.status === 402) {
        return toJsonResponse({ error: "Créditos de IA esgotados. Adicione créditos em Settings → Workspace → Usage." }, 402);
      }

      return toJsonResponse({ error: "Erro ao processar imagem com IA" }, 500);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      console.error("No tool call in response:", data);
      return toJsonResponse({ error: "Formato de resposta inesperado da IA" }, 500);
    }

    const extractedData = JSON.parse(toolCall.function.arguments);
    const validSubjects = new Set((subjectsResult.data || []).map((item) => item.id));
    const validContentsMap = new Map((contentsResult.data || []).map((item) => [item.id, item.subject_id]));
    const validTopicsMap = new Map((topicsResult.data || []).map((item) => [item.id, item.content_id]));
    const validExams = new Set((examsResult.data || []).map((item) => item.id));

    const sanitizedQuestions = (extractedData.questions || []).reduce((acc: Record<string, unknown>[], question: Record<string, unknown>) => {
      const statement = typeof question.statement === "string" ? question.statement.trim() : "";
      const subjectId = String(question.subject_id || "");
      const contentId = String(question.content_id || "");
      const examId = String(question.exam_id || "");
      const topicId = String(question.topic_id || "");

      if (!statement) return acc;
      if (!validSubjects.has(subjectId)) return acc;
      if (!validContentsMap.has(contentId) || validContentsMap.get(contentId) !== subjectId) return acc;
      if (!validExams.has(examId)) return acc;

      acc.push({
        ...question,
        statement,
        topic_id: topicId && validTopicsMap.get(topicId) === contentId ? topicId : "",
        correct_answer: ["a", "b", "c", "d", "e"].includes(String(question.correct_answer || "")) ? question.correct_answer : "",
        difficulty: ["facil", "medio", "dificil"].includes(String(question.difficulty || "")) ? question.difficulty : "medio",
      });

      return acc;
    }, []);

    return toJsonResponse({
      success: true,
      data: {
        questions: sanitizedQuestions,
        summary: {
          total_questions: sanitizedQuestions.length,
          detected_exam: String(extractedData.summary?.detected_exam || sanitizedQuestions[0]?.exam_id || ""),
          detected_year: Number(extractedData.summary?.detected_year || sanitizedQuestions[0]?.year || 0),
        },
      },
    });
  } catch (error) {
    console.error("Error in analyze-question-image function:", error);
    return toJsonResponse(
      {
        error: error instanceof Error ? error.message : "Erro desconhecido ao analisar imagem",
        details: error instanceof Error ? error.stack : undefined,
      },
      500,
    );
  }
});

