import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QuestionInput {
  statement: string;
  subject_id: string;
  exam_id: string;
  year: number;
  difficulty: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_e: string;
  correct_answer: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { questions } = await req.json();
    
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Questions array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing environment variables');
      return new Response(
        JSON.stringify({ error: 'Service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Buscar toda a taxonomia disponível
    const { data: subjects } = await supabase.from('subjects').select('*');
    const { data: contents } = await supabase.from('contents').select('*');
    const { data: topics } = await supabase.from('topics').select('*');

    // Organizar taxonomia para o prompt
    const taxonomyMap: Record<string, any> = {};
    subjects?.forEach(subject => {
      taxonomyMap[subject.id] = {
        name: subject.name,
        contents: contents?.filter(c => c.subject_id === subject.id).map(c => ({
          id: c.id,
          name: c.name,
          topics: topics?.filter(t => t.content_id === c.id).map(t => ({
            id: t.id,
            name: t.name
          }))
        }))
      };
    });

    console.log(`Processing ${questions.length} questions...`);

    // Processar questões em paralelo (mas com limite para não sobrecarregar)
    const batchSize = 5;
    const results = [];

    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (question: QuestionInput, index: number) => {
        try {
          console.log(`Classifying question ${i + index + 1}/${questions.length}...`);

          const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${LOVABLE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'google/gemini-2.5-flash',
              messages: [
                {
                  role: 'system',
                  content: `Você é um especialista em classificação de questões de vestibulares brasileiros.
Sua tarefa é classificar questões na taxonomia correta: CONTEÚDO → TÓPICO (a matéria já é fornecida).

MATÉRIA DA QUESTÃO: ${question.subject_id}

TAXONOMIA DISPONÍVEL PARA ESTA MATÉRIA:
${JSON.stringify(taxonomyMap[question.subject_id] || {}, null, 2)}

INSTRUÇÕES CRÍTICAS:
1. Analise o enunciado da questão cuidadosamente
2. A matéria JÁ está definida como: ${question.subject_id}
3. Identifique o conteúdo específico dentro da matéria usando os IDs EXATOS da taxonomia
4. Identifique o tópico específico dentro do conteúdo usando os IDs EXATOS da taxonomia
5. IMPORTANTE: Use APENAS os IDs que existem na taxonomia fornecida acima
6. Forneça um nível de confiança (0-1) para sua classificação

Use tool calling para retornar os dados estruturados.`
                },
                {
                  role: 'user',
                  content: `Classifique esta questão:\n\n${question.statement}`
                }
              ],
              tools: [
                {
                  type: 'function',
                  function: {
                    name: 'classify_question',
                    description: 'Classifica uma questão na taxonomia correta',
                    parameters: {
                      type: 'object',
                      properties: {
                        content_id: {
                          type: 'string',
                          description: 'ID do conteúdo (deve ser um ID existente na taxonomia)'
                        },
                        topic_id: {
                          type: 'string',
                          description: 'ID do tópico (deve ser um ID existente na taxonomia)'
                        },
                        confidence: {
                          type: 'number',
                          description: 'Nível de confiança na classificação (0-1)'
                        },
                        reasoning: {
                          type: 'string',
                          description: 'Breve explicação do porquê desta classificação'
                        }
                      },
                      required: ['content_id', 'topic_id', 'confidence']
                    }
                  }
                }
              ],
              tool_choice: { type: 'function', function: { name: 'classify_question' } }
            }),
          });

          if (!response.ok) {
            throw new Error(`AI API error: ${response.status}`);
          }

          const data = await response.json();
          const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
          
          if (!toolCall) {
            throw new Error('No classification returned');
          }

          const classification = JSON.parse(toolCall.function.arguments);

          return {
            success: true,
            question: {
              ...question,
              content_id: classification.content_id,
              topic_id: classification.topic_id
            },
            classification: {
              confidence: classification.confidence,
              reasoning: classification.reasoning
            }
          };

        } catch (error) {
          console.error(`Error classifying question ${i + index + 1}:`, error);
          return {
            success: false,
            question,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    console.log(`Classification complete: ${successCount} success, ${failCount} failed`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: results,
        summary: {
          total: questions.length,
          success: successCount,
          failed: failCount
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in classify-questions-batch function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido ao classificar questões',
        details: error instanceof Error ? error.stack : undefined
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
