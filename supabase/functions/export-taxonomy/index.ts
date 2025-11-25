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

    // Gerar texto formatado para o ChatGPT
    let formattedText = "# TAXONOMIA COMPLETA DO SIM QUESTÕES\n\n";
    formattedText += "Use EXATAMENTE estes IDs ao criar questões. Não invente IDs.\n\n";
    
    taxonomy.forEach(subject => {
      formattedText += `## ${subject.subject_name.toUpperCase()}\n`;
      formattedText += `subject_id: "${subject.subject_id}"\n\n`;
      
      subject.contents.forEach(content => {
        formattedText += `### ${content.content_name}\n`;
        formattedText += `content_id: "${content.content_id}"\n`;
        formattedText += `Tópicos disponíveis:\n`;
        
        content.topics.forEach(topic => {
          formattedText += `  - topic_id: "${topic.topic_id}" | ${topic.topic_name}\n`;
        });
        formattedText += `\n`;
      });
      formattedText += `\n`;
    });

    formattedText += "\n## VESTIBULARES ACEITOS\n";
    formattedText += 'exam_id: "enem" ou "paes-uema"\n\n';
    formattedText += "## VALORES ACEITOS PARA correct_answer\n";
    formattedText += 'Apenas letras minúsculas: "a", "b", "c", "d", "e"\n\n';
    formattedText += "## VALORES ACEITOS PARA difficulty\n";
    formattedText += '"facil", "medio", "dificil"\n';

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
