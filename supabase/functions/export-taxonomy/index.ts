import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.80.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Buscar subjects
    const { data: subjects, error: subjectsError } = await supabase
      .from('subjects')
      .select('*')
      .order('name');

    if (subjectsError) throw subjectsError;

    // Buscar contents
    const { data: contents, error: contentsError } = await supabase
      .from('contents')
      .select('*')
      .order('subject_id, name');

    if (contentsError) throw contentsError;

    // Buscar topics
    const { data: topics, error: topicsError } = await supabase
      .from('topics')
      .select('*')
      .order('content_id, name');

    if (topicsError) throw topicsError;

    // Buscar exams
    const { data: exams, error: examsError } = await supabase
      .from('exams')
      .select('id, name')
      .order('name');

    if (examsError) throw examsError;

    // Organizar dados hierarquicamente
    const taxonomy = subjects.map(subject => ({
      subject_id: subject.id,
      subject_name: subject.name,
      contents: contents
        .filter(c => c.subject_id === subject.id)
        .map(content => ({
          content_id: content.id,
          content_name: content.name,
          topics: topics
            .filter(t => t.content_id === content.id)
            .map(topic => ({
              topic_id: topic.id,
              topic_name: topic.name
            }))
        }))
    }));

    // Criar lista completa de todos os topic_ids
    const allTopicIds: string[] = [];
    taxonomy.forEach(subject => {
      subject.contents.forEach(content => {
        content.topics.forEach(topic => {
          allTopicIds.push(topic.topic_id);
        });
      });
    });

    // Gerar texto formatado para o ChatGPT
    let formattedText = "# TAXONOMIA COMPLETA DO SIM QUESTÕES\n\n";
    formattedText += "🚨 ATENÇÃO CRÍTICA: OS IDs NÃO SÃO UUIDs!\n";
    formattedText += "🚨 Os IDs são STRINGS em formato kebab-case (exemplo: 'ma-fn-exponencial')\n";
    formattedText += "🚨 NUNCA gere UUIDs aleatórios como 'e9f3b7e0-7cd1-4d0a-8b67-9abc2f0bd881'\n";
    formattedText += "🚨 SEMPRE copie EXATAMENTE os IDs desta lista!\n";
    formattedText += "🚨 Um único caractere errado = erro no Supabase\n\n";
    
    formattedText += "## 📋 LISTA COMPLETA DE TODOS OS TOPIC_IDS VÁLIDOS\n\n";
    formattedText += "```\n";
    allTopicIds.forEach(topicId => {
      formattedText += `"${topicId}"\n`;
    });
    formattedText += "```\n\n";
    formattedText += `Total de tópicos disponíveis: ${allTopicIds.length}\n\n`;
    formattedText += "---\n\n";
    
    formattedText += "## 📚 ESTRUTURA HIERÁRQUICA COMPLETA\n\n";
    
    taxonomy.forEach(subject => {
      formattedText += `### ${subject.subject_name.toUpperCase()}\n`;
      formattedText += `**subject_id:** "${subject.subject_id}"\n\n`;
      
      subject.contents.forEach(content => {
        formattedText += `#### ${content.content_name}\n`;
        formattedText += `**content_id:** "${content.content_id}"\n\n`;
        formattedText += `**Tópicos disponíveis:**\n`;
        
        content.topics.forEach(topic => {
          formattedText += `  • **"${topic.topic_id}"** → ${topic.topic_name}\n`;
        });
        formattedText += `\n`;
      });
      formattedText += `\n`;
    });

    formattedText += "\n## 🎓 VESTIBULARES ACEITOS\n\n";
    exams.forEach(exam => {
      formattedText += `  • **"${exam.id}"** → ${exam.name}\n`;
    });
    formattedText += "\n";
    formattedText += "## ✅ VALORES ACEITOS PARA correct_answer\n\n";
    formattedText += '**Apenas letras minúsculas:** "a", "b", "c", "d", "e"\n\n';
    formattedText += "## 📊 VALORES ACEITOS PARA difficulty\n\n";
    formattedText += '**Opções:** "facil", "medio", "dificil"\n\n';
    formattedText += "## 📝 EXEMPLO DE JSON VÁLIDO\n\n";
    formattedText += '🚨 REPARE: Os IDs são STRINGS, não UUIDs!\n\n';
    formattedText += '```json\n';
    formattedText += '{\n';
    formattedText += '  "statement": "Texto da questão aqui",\n';
    formattedText += '  "option_a": "Alternativa A",\n';
    formattedText += '  "option_b": "Alternativa B",\n';
    formattedText += '  "option_c": "Alternativa C",\n';
    formattedText += '  "option_d": "Alternativa D",\n';
    formattedText += '  "option_e": "Alternativa E",\n';
    formattedText += '  "correct_answer": "a",\n';
    formattedText += '  "explanation": "Explicação detalhada da resposta",\n';
    formattedText += '  "subject_id": "ma",\n';
    formattedText += '  "content_id": "ma-funcoes",\n';
    formattedText += '  "topic_id": "ma-fn-exponencial",\n';
    formattedText += '  "exam_id": "enem",\n';
    formattedText += '  "year": 2024,\n';
    formattedText += '  "difficulty": "medio"\n';
    formattedText += '}\n';
    formattedText += '```\n\n';
    formattedText += "## ❌ EXEMPLO DE JSON ERRADO (NÃO FAÇA ISSO!)\n\n";
    formattedText += '```json\n';
    formattedText += '{\n';
    formattedText += '  "subject_id": "e9f3b7e0-7cd1-4d0a-8b67-9abc2f0bd881",  ❌ ERRADO! Não é UUID!\n';
    formattedText += '  "content_id": "a1b2c3d4-5678-90ab-cdef-123456789abc",  ❌ ERRADO! Não é UUID!\n';
    formattedText += '  "topic_id": "12345678-1234-1234-1234-123456789abc"     ❌ ERRADO! Não é UUID!\n';
    formattedText += '}\n';
    formattedText += '```\n\n';
    formattedText += "## ✅ FORMATO CORRETO DOS IDs\n\n";
    formattedText += '- subject_id: texto em kebab-case (ex: "ma", "bi")\n';
    formattedText += '- content_id: texto em kebab-case (ex: "ma-funcoes", "ma-trigonometria")\n';
    formattedText += '- topic_id: texto em kebab-case (ex: "ma-fn-exponencial", "ma-gp-teorema-pitagoras")\n';
    formattedText += '- SEMPRE consulte a lista completa acima para copiar o ID exato!\n';

    return new Response(
      JSON.stringify({
        taxonomy,
        formatted_text: formattedText,
        total_subjects: subjects.length,
        total_contents: contents.length,
        total_topics: topics.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in export-taxonomy:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
