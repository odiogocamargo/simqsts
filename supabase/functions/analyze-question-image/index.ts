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

const tryParseJson = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const extractJsonSubstring = (value: string) => {
  const cleaned = value
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace = cleaned.search(/[\[{]/);
  if (firstBrace === -1) return null;

  const openingChar = cleaned[firstBrace];
  const closingChar = openingChar === "[" ? "]" : "}";
  const lastBrace = cleaned.lastIndexOf(closingChar);
  if (lastBrace === -1 || lastBrace <= firstBrace) return null;

  return cleaned.slice(firstBrace, lastBrace + 1);
};

const parseStructuredPayload = (rawValue: unknown) => {
  if (typeof rawValue !== "string") return null;

  const directParse = tryParseJson(rawValue);
  if (directParse) return directParse;

  const extractedJson = extractJsonSubstring(rawValue);
  return extractedJson ? tryParseJson(extractedJson) : null;
};

const extractToolPayload = (data: any, requiredKey?: string) => {
  if (data?.error) {
    console.error("AI gateway returned error payload:", data);
    throw new Error(data.error.message || "Erro interno da IA ao analisar a imagem");
  }

  const message = data?.choices?.[0]?.message;
  const toolArguments = message?.tool_calls?.[0]?.function?.arguments;
  const content = typeof message?.content === "string"
    ? message.content
    : Array.isArray(message?.content)
      ? message.content.map((part: any) => typeof part?.text === "string" ? part.text : "").join("\n")
      : "";

  const payload = parseStructuredPayload(toolArguments) || parseStructuredPayload(content);

  if (!payload || (requiredKey && !(requiredKey in payload))) {
    console.error("Unable to extract structured payload from AI response:", data);
    throw new Error("Formato de resposta inesperado da IA");
  }

  return payload;
};

const isValidDifficulty = (value: unknown) => ["facil", "medio", "dificil"].includes(String(value || ""));
const isValidAnswer = (value: unknown) => ["a", "b", "c", "d", "e"].includes(String(value || ""));

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
      "Você está analisando uma página de vestibular brasileiro que pode conter texto, gráficos, tabelas, figuras, charges, mapas, obras de arte e imagens que fazem parte da questão.",
      "A imagem pode conter uma única questão ou várias questões na mesma página.",
      "Extraia TODAS as questões visíveis e retorne uma lista estruturada.",
      "",
      "OBJETIVO PRINCIPAL:",
      "Transcreva o texto da forma MAIS FIEL possível ao original, preservando a ordem visual e a estrutura do vestibular.",
      "",
      "REGRAS OBRIGATÓRIAS:",
      "1. Retorne questões claramente identificáveis mesmo que exista imagem ilustrativa, gráfico, tabela ou charge dentro da página.",
      "2. Se a questão tiver imagem de apoio, AINDA ASSIM extraia o texto e marque should_attach_source_image=true.",
      "3. Para cada questão, preencha matéria, conteúdo, tópico, vestibular, ano, dificuldade, alternativas, gabarito e explicação curta quando possível.",
      "4. Use APENAS os IDs reais da taxonomia abaixo; nunca invente IDs.",
      "5. Se não conseguir identificar um tópico, retorne string vazia para topic_id.",
      "6. Se não houver alternativas, deixe option_a..option_e vazias e correct_answer vazio.",
      "7. correct_answer deve ser uma letra minúscula: a, b, c, d ou e.",
      "8. O campo statement deve vir fiel ao original, preservando títulos, citações, versos, quebras de linha, enumerações, trechos de livros, diálogos e a ordem natural da leitura.",
      "9. O campo exam_id deve usar um dos IDs abaixo exatamente como informado.",
      "10. O campo difficulty deve ser apenas: facil, medio ou dificil.",
      "11. Se a página tiver mais de uma questão, preserve a ordem visual da página.",
      "12. Leia sempre de cima para baixo e da esquerda para a direita dentro de cada bloco textual.",
      "13. NUNCA misture linhas de alternativas com o enunciado nem junte trechos de blocos diferentes fora de ordem.",
      "14. Quando houver poema, letra de música, citação longa ou passagem de livro, preserve a formatação com HTML simples (<p>, <br>, <strong>, <em>, <ul>, <li>) quando isso ajudar a manter o sentido original.",
      "15. Não reescreva, não resuma, não interprete e não simplifique o texto; transcreva como aparece.",
      "16. Se parte do texto estiver ilegível, mantenha apenas o trecho confiável e não invente conteúdo.",
      "17. Se existir uma questão com imagem e pouco texto, não descarte automaticamente; extraia todo o texto legível ao redor e preserve a associação com a imagem original.",
      "18. Considere figuras, gráficos e imagens como parte do contexto da questão, não como motivo para invalidar a questão.",
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

    const ocrResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
            content: "Extraia todo o texto legível da página preservando ao máximo a ordem visual e a estrutura. Inclua textos próximos a imagens, gráficos, tabelas, poemas e trechos literários. Não resuma.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Faça uma OCR fiel desta página de vestibular. Preserve blocos, quebras de linha, alternativas, legendas e trechos literários. Se houver imagens, gráficos ou tabelas, extraia o texto que estiver associado a eles.",
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
      }),
    });

    if (!ocrResponse.ok) {
      const errorText = await ocrResponse.text();
      console.error("AI OCR Gateway error:", ocrResponse.status, errorText);
      if (ocrResponse.status === 429) {
        return toJsonResponse({ error: "Limite de requisições excedido. Tente novamente em alguns instantes." }, 429);
      }
      if (ocrResponse.status === 402) {
        return toJsonResponse({ error: "Créditos de IA esgotados. Adicione créditos em Settings → Workspace → Usage." }, 402);
      }
      return toJsonResponse({ error: "Erro ao extrair texto da imagem com IA" }, 500);
    }

    const ocrData = await ocrResponse.json();
    const ocrText = ocrData.choices?.[0]?.message?.content || "";

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
                text: `Analise esta imagem e extraia todas as questões visíveis para pré-preenchimento do formulário de cadastro. Primeiro reconstrua mentalmente a leitura na ordem visual da página; depois transcreva cada questão de forma fiel ao original, preservando passagens, citações, poemas, versos, diálogos e quebras de linha sempre que necessário. Se houver várias questões, retorne todas. Use também esta OCR como apoio, sem perder a fidelidade visual da imagem:\n\n${ocrText}`,
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
                        should_attach_source_image: { type: "boolean", description: "true quando a questão depende ou inclui imagem, gráfico, tabela, charge, mapa ou qualquer apoio visual da página original." },
                      },
                      required: ["statement", "subject_id", "content_id", "topic_id", "exam_id", "year", "difficulty", "option_a", "option_b", "option_c", "option_d", "option_e", "correct_answer", "explanation", "should_attach_source_image"],
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
    const extractedData = extractToolPayload(data, "questions");
    const validSubjects = new Set((subjectsResult.data || []).map((item) => item.id));
    const validContentsMap = new Map((contentsResult.data || []).map((item) => [item.id, item.subject_id]));
    const validTopicsMap = new Map((topicsResult.data || []).map((item) => [item.id, item.content_id]));
    const validExams = new Set((examsResult.data || []).map((item) => item.id));
    const subjectContentsMap = new Map(
      (subjectsResult.data || []).map((subject) => [
        subject.id,
        (contentsResult.data || []).filter((content) => content.subject_id === subject.id),
      ]),
    );
    const contentTopicsMap = new Map(
      (contentsResult.data || []).map((content) => [
        content.id,
        (topicsResult.data || []).filter((topic) => topic.content_id === content.id),
      ]),
    );

    const extractedQuestions = Array.isArray(extractedData.questions) ? extractedData.questions : [];
    const questionsNeedingTaxonomy = extractedQuestions
      .map((question: Record<string, unknown>, index: number) => ({ question, index }))
      .filter(({ question }) => {
        const subjectId = String(question.subject_id || "");
        const contentId = String(question.content_id || "");
        const topicId = String(question.topic_id || "");

        if (!validSubjects.has(subjectId)) return false;
        const hasValidContent = validContentsMap.has(contentId) && validContentsMap.get(contentId) === subjectId;
        const hasValidTopic = topicId && validTopicsMap.get(topicId) === contentId;

        return !hasValidContent || !hasValidTopic;
      });

    const taxonomyFixes = new Map<number, { content_id: string; topic_id: string }>();

    if (questionsNeedingTaxonomy.length > 0) {
      const taxonomyRepairPrompt = questionsNeedingTaxonomy.flatMap(({ question, index }) => {
        const subjectId = String(question.subject_id || "");
        const availableContents = subjectContentsMap.get(subjectId) || [];

        return [
          `QUESTÃO ${index}:`,
          `subject_id: ${subjectId}`,
          `statement: ${String(question.statement || "")}`,
          "CONTEÚDOS POSSÍVEIS:",
          ...availableContents.map((content) => `- ${content.id}: ${content.name}`),
          "TÓPICOS POSSÍVEIS POR CONTEÚDO:",
          ...availableContents.flatMap((content) => {
            const topics = contentTopicsMap.get(content.id) || [];
            return topics.length > 0
              ? topics.map((topic) => `- ${topic.id}: ${topic.name} (content_id: ${content.id})`)
              : [`- sem-topicos-para-${content.id}`];
          }),
          "Escolha o content_id mais aderente. topic_id pode ficar vazio apenas se realmente não houver tópico específico compatível.",
          "",
        ];
      }).join("\n");

      const taxonomyRepairResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
              content: "Você é um classificador de taxonomia. Para cada questão, escolha obrigatoriamente um content_id válido entre as opções do subject_id informado. Só deixe topic_id vazio se nenhum tópico disponível se encaixar claramente.",
            },
            {
              role: "user",
              content: taxonomyRepairPrompt,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "repair_question_taxonomy",
                description: "Retorna content_id e topic_id corrigidos para cada questão listada.",
                parameters: {
                  type: "object",
                  properties: {
                    fixes: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          question_index: { type: "integer" },
                          content_id: { type: "string" },
                          topic_id: { type: "string" },
                        },
                        required: ["question_index", "content_id", "topic_id"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["fixes"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "repair_question_taxonomy" } },
        }),
      });

      if (taxonomyRepairResponse.ok) {
        const taxonomyRepairData = await taxonomyRepairResponse.json();
        const taxonomyRepairPayload = extractToolPayload(taxonomyRepairData, "fixes");

        for (const fix of taxonomyRepairPayload.fixes || []) {
          const questionIndex = Number(fix.question_index);
          const contentId = String(fix.content_id || "");
          const topicId = String(fix.topic_id || "");
          const sourceQuestion = extractedQuestions[questionIndex];
          const subjectId = String(sourceQuestion?.subject_id || "");

          if (!validContentsMap.has(contentId) || validContentsMap.get(contentId) !== subjectId) continue;
          taxonomyFixes.set(questionIndex, {
            content_id: contentId,
            topic_id: topicId && validTopicsMap.get(topicId) === contentId ? topicId : "",
          });
        }
      } else {
        const taxonomyRepairError = await taxonomyRepairResponse.text();
        console.error("AI taxonomy repair error:", taxonomyRepairResponse.status, taxonomyRepairError);
      }
    }

    const sanitizedQuestions = extractedQuestions.reduce((acc: Record<string, unknown>[], question: Record<string, unknown>, index: number) => {
      const statement = typeof question.statement === "string" ? question.statement.trim() : "";
      const subjectId = String(question.subject_id || "");
      const contentId = String(question.content_id || "");
      const examId = String(question.exam_id || "");
      const topicId = String(question.topic_id || "");
      const fallbackSubjectId = validSubjects.has(subjectId) ? subjectId : "";
      const repairedContentId = taxonomyFixes.get(index)?.content_id || "";
      const repairedTopicId = taxonomyFixes.get(index)?.topic_id || "";
      const fallbackContentId = validContentsMap.has(contentId) && validContentsMap.get(contentId) === fallbackSubjectId
        ? contentId
        : repairedContentId;
      const fallbackExamId = validExams.has(examId) ? examId : "";

      if (!statement) return acc;

      acc.push({
        ...question,
        statement,
        subject_id: fallbackSubjectId,
        content_id: fallbackContentId,
        exam_id: fallbackExamId,
        topic_id: repairedTopicId || (topicId && validTopicsMap.get(topicId) === fallbackContentId ? topicId : ""),
        correct_answer: isValidAnswer(question.correct_answer) ? question.correct_answer : "",
        difficulty: isValidDifficulty(question.difficulty) ? question.difficulty : "medio",
        should_attach_source_image: Boolean(question.should_attach_source_image),
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

