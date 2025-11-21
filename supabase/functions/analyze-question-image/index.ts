import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();
    
    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: 'Image data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing question image with Lovable AI...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          {
            role: 'system',
            content: `Você é um especialista em análise de questões de vestibulares brasileiros (ENEM e PAES UEMA).
Sua tarefa é extrair informações estruturadas de imagens de questões.

INSTRUÇÕES CRÍTICAS:
1. Identifique o vestibular (ENEM ou PAES UEMA) com base em logos, padrões visuais ou menções no texto
2. Classifique a matéria baseado no conteúdo da questão
3. Identifique o conteúdo específico dentro da matéria
4. Identifique o tópico específico dentro do conteúdo
5. Extraia o enunciado completo da questão
6. Extraia todas as alternativas (A, B, C, D, E)
7. Identifique qual alternativa está GRIFADA EM VERDE (essa é a resposta correta)
8. Se houver ano visível, extraia-o

MATÉRIAS VÁLIDAS: matematica, portugues, quimica, fisica, biologia, historia, geografia, filosofia, sociologia, ingles, espanhol, artes

Use tool calling para retornar os dados estruturados.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analise esta imagem de questão e extraia todas as informações estruturadas.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'extract_question_data',
              description: 'Extrai dados estruturados de uma questão de vestibular',
              parameters: {
                type: 'object',
                properties: {
                  exam_id: {
                    type: 'string',
                    enum: ['ENEM', 'PAES UEMA'],
                    description: 'Vestibular identificado'
                  },
                  subject_id: {
                    type: 'string',
                    enum: ['matematica', 'portugues', 'quimica', 'fisica', 'biologia', 'historia', 'geografia', 'filosofia', 'sociologia', 'ingles', 'espanhol', 'artes'],
                    description: 'Matéria da questão'
                  },
                  content_id: {
                    type: 'string',
                    description: 'ID do conteúdo (usar kebab-case: ex: fisico-quimica)'
                  },
                  topic_id: {
                    type: 'string',
                    description: 'ID do tópico (usar kebab-case: ex: termoquimica)'
                  },
                  statement: {
                    type: 'string',
                    description: 'Enunciado completo da questão'
                  },
                  option_a: {
                    type: 'string',
                    description: 'Texto da alternativa A'
                  },
                  option_b: {
                    type: 'string',
                    description: 'Texto da alternativa B'
                  },
                  option_c: {
                    type: 'string',
                    description: 'Texto da alternativa C'
                  },
                  option_d: {
                    type: 'string',
                    description: 'Texto da alternativa D'
                  },
                  option_e: {
                    type: 'string',
                    description: 'Texto da alternativa E'
                  },
                  correct_answer: {
                    type: 'string',
                    enum: ['a', 'b', 'c', 'd', 'e'],
                    description: 'Letra da alternativa grifada em verde (resposta correta)'
                  },
                  year: {
                    type: 'integer',
                    description: 'Ano da questão, se visível'
                  },
                  difficulty: {
                    type: 'string',
                    enum: ['facil', 'medio', 'dificil'],
                    description: 'Estimativa de dificuldade baseada na complexidade'
                  },
                  confidence: {
                    type: 'number',
                    description: 'Nível de confiança na classificação (0-1)'
                  },
                  notes: {
                    type: 'string',
                    description: 'Observações importantes sobre a análise'
                  }
                },
                required: ['exam_id', 'subject_id', 'statement', 'option_a', 'option_b', 'option_c', 'option_d', 'option_e', 'correct_answer']
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'extract_question_data' } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de requisições excedido. Tente novamente em alguns instantes.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Créditos de IA esgotados. Adicione créditos em Settings → Workspace → Usage.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Erro ao processar imagem com IA' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('AI response received:', JSON.stringify(data, null, 2));

    // Extrair os dados do tool call
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error('No tool call in response:', data);
      return new Response(
        JSON.stringify({ error: 'Formato de resposta inesperado da IA' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const questionData = JSON.parse(toolCall.function.arguments);
    console.log('Extracted question data:', questionData);

    return new Response(
      JSON.stringify({ success: true, data: questionData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-question-image function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido ao analisar imagem',
        details: error instanceof Error ? error.stack : undefined
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
