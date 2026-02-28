import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { statement } = await req.json();
    
    if (!statement) {
      return new Response(
        JSON.stringify({ error: 'Statement is required' }),
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

    // Criar cliente Supabase
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

    console.log('Classifying question with Lovable AI...');

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
Sua tarefa é classificar questões na taxonomia correta: MATÉRIA → CONTEÚDO → TÓPICO.

TAXONOMIA DISPONÍVEL:
${JSON.stringify(taxonomyMap, null, 2)}

INSTRUÇÕES CRÍTICAS:
1. Analise o enunciado da questão cuidadosamente
2. Identifique a matéria principal (matematica, portugues, quimica, fisica, biologia, historia, geografia, filosofia, sociologia, ingles, espanhol, artes)
3. Identifique o conteúdo específico dentro da matéria usando os IDs EXATOS da taxonomia
4. Identifique o tópico específico dentro do conteúdo usando os IDs EXATOS da taxonomia
5. IMPORTANTE: Use APENAS os IDs que existem na taxonomia fornecida acima
6. Forneça um nível de confiança (0-1) para sua classificação
7. Se não tiver certeza, ainda sugira a melhor opção disponível

Use tool calling para retornar os dados estruturados.`
          },
          {
            role: 'user',
            content: `Classifique esta questão:\n\n${statement}`
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
                  subject_id: {
                    type: 'string',
                    enum: ['ma', 'ge', 'hi', 'bi', 'qu', 'fi', 'gr', 'le', 'it', 'li', 'so', 'fl', 'in', 'es'],
                    description: 'ID da matéria (ex: ma=Matemática, ge=Geografia, hi=História, bi=Biologia, qu=Química, fi=Física, gr=Gramática, le=Leitura, it=Interpretação Textual, li=Literatura, so=Sociologia, fl=Filosofia, in=Inglês, es=Espanhol)'
                  },
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
                required: ['subject_id', 'content_id', 'topic_id', 'confidence']
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'classify_question' } }
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
        JSON.stringify({ error: 'Erro ao processar classificação com IA' }),
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

    const classification = JSON.parse(toolCall.function.arguments);
    console.log('Classification result:', classification);

    return new Response(
      JSON.stringify({ success: true, data: classification }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in classify-question function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido ao classificar questão',
        details: error instanceof Error ? error.stack : undefined
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
