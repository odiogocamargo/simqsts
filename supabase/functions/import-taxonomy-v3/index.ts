import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.80.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper para gerar ID em kebab-case
function generateId(text: string, prefix?: string): string {
  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .trim()
    .replace(/\s+/g, '-') // Espaços viram hífens
    .replace(/-+/g, '-'); // Remove hífens duplicados
  
  return prefix ? `${prefix}_${normalized}` : normalized;
}

// Mapeamento manual de tópicos antigos para novos
const topicMappings: Record<string, { newTopicId: string; confidence: 'exact' | 'equivalent' | 'parent' | 'approximate' }> = {
  // Espanhol
  'comprension-lectora': { newTopicId: 'esp_comprension-lectora_inferencias', confidence: 'parent' },
  'expresiones': { newTopicId: 'esp_vocabulario_expressoes', confidence: 'equivalent' },
  'regionalismos': { newTopicId: 'esp_vocabulario_expressoes', confidence: 'approximate' },
  'verbos-esp': { newTopicId: 'esp_gramatica-base_verbos-tempos-base', confidence: 'equivalent' },
  
  // Inglês
  'vocabulary-context': { newTopicId: 'ing_interpretacao-reading_vocabulario-em-contexto', confidence: 'equivalent' },
  'reading-comprehension': { newTopicId: 'ing_interpretacao-reading_ideia-central', confidence: 'parent' },
  
  // Português / Literatura
  'romantismo': { newTopicId: 'lit_escolas-literarias_romantismo', confidence: 'exact' },
  'simbolismo': { newTopicId: 'lit_escolas-literarias_simbolismo', confidence: 'exact' },
  'intertextualidade': { newTopicId: 'lit_fundamentos-de-literatura_intertextualidade', confidence: 'exact' },
  'generos-textuais': { newTopicId: 'int_generos-jornalisticos_noticia', confidence: 'approximate' },
  'leitura-compreensao': { newTopicId: 'int_compreensao_informacoes-explicitas', confidence: 'parent' },
  'interpretacao-inferencia': { newTopicId: 'int_inferencia_inferencia-de-sentido', confidence: 'equivalent' },
  
  // Física
  'fis_mec_cinematica_escalar': { newTopicId: 'fis_cinematica_mru', confidence: 'parent' },
  'fis_mec_gravitacao': { newTopicId: 'fis_gravitacao_lei-da-gravitacao', confidence: 'equivalent' },
  'fis_mec_hidrostatica': { newTopicId: 'fis_hidrostatica_pressao', confidence: 'parent' },
  
  // Biologia
  'bio_eco_biomas': { newTopicId: 'bio_ecologia-ciclos-e-biomas_biomas-brasileiros', confidence: 'equivalent' },
  'bio_eco_ciclos': { newTopicId: 'bio_ecologia-ciclos-e-biomas_ciclos-biogeoquimicos', confidence: 'exact' },
  'bio_eco_conceitos': { newTopicId: 'bio_ecologia-fundamentos_cadeias-teias', confidence: 'parent' },
  'bio_eco_dinamica': { newTopicId: 'bio_ecologia-fundamentos_relacoes-ecologicas', confidence: 'approximate' },
  'bio_eco_fluxo': { newTopicId: 'bio_ecologia-fundamentos_piramides', confidence: 'equivalent' },
  'bio_eco_impactos': { newTopicId: 'bio_ecologia-impactos_problemas-ambientais', confidence: 'equivalent' },
  'bio_eco_interacoes': { newTopicId: 'bio_ecologia-fundamentos_relacoes-ecologicas', confidence: 'exact' },
  
  // Adicionar mais mapeamentos conforme necessário
};

interface TaxonomyRow {
  area: string;
  subject: string;
  theme: string;
  topic: string;
}

interface MigrationResult {
  questionId: string;
  oldSubjectId: string;
  oldContentId: string;
  oldTopicId: string | null;
  oldTopicName: string | null;
  newSubjectId: string | null;
  newContentId: string | null;
  newTopicId: string | null;
  status: 'migrated' | 'needs_review';
  confidence: string;
  reason: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse CSV content from request body
    const { csvContent, dryRun = true } = await req.json();
    
    if (!csvContent) {
      throw new Error('CSV content is required');
    }

    console.log('[import-taxonomy-v3] Starting import, dryRun:', dryRun);

    // Parse CSV
    const lines = csvContent.trim().split('\n');
    const header = lines[0].split(',');
    const rows: TaxonomyRow[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      // Handle quoted values with commas
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (const char of line) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      
      if (values.length >= 4) {
        rows.push({
          area: values[0],
          subject: values[1],
          theme: values[2],
          topic: values[3]
        });
      }
    }

    console.log(`[import-taxonomy-v3] Parsed ${rows.length} taxonomy rows`);

    // Extract unique areas
    const areas = [...new Set(rows.map(r => r.area))];
    const areasData = areas.map(name => ({
      id: generateId(name),
      name
    }));

    // Extract unique subjects with area
    const subjectsMap = new Map<string, { name: string; areaId: string }>();
    rows.forEach(r => {
      const key = r.subject;
      if (!subjectsMap.has(key)) {
        subjectsMap.set(key, {
          name: r.subject,
          areaId: generateId(r.area)
        });
      }
    });
    const subjectsData = Array.from(subjectsMap.entries()).map(([name, data]) => ({
      id: generateId(name),
      name: data.name,
      area_id: data.areaId
    }));

    // Extract unique themes (contents) with subject
    const themesMap = new Map<string, { name: string; subjectId: string }>();
    rows.forEach(r => {
      const key = `${r.subject}|${r.theme}`;
      if (!themesMap.has(key)) {
        themesMap.set(key, {
          name: r.theme,
          subjectId: generateId(r.subject)
        });
      }
    });
    const contentsData = Array.from(themesMap.entries()).map(([key, data]) => {
      const subjectId = generateId(key.split('|')[0]);
      const themeId = generateId(data.name, subjectId.substring(0, 3));
      return {
        id: themeId,
        name: data.name,
        subject_id: subjectId
      };
    });

    // Extract all topics with content
    const topicsData = rows.map(r => {
      const subjectPrefix = generateId(r.subject).substring(0, 3);
      const themeId = generateId(r.theme, subjectPrefix);
      const topicId = generateId(r.topic, themeId);
      return {
        id: topicId,
        name: r.topic,
        content_id: themeId
      };
    });

    // Remove duplicates from topics
    const uniqueTopics = Array.from(
      new Map(topicsData.map(t => [t.id, t])).values()
    );

    console.log(`[import-taxonomy-v3] Extracted: ${areasData.length} areas, ${subjectsData.length} subjects, ${contentsData.length} contents, ${uniqueTopics.length} topics`);

    // Get current questions for migration analysis
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select(`
        id,
        subject_id,
        content_id
      `);

    if (questionsError) throw questionsError;

    // Get question_topics separately
    const { data: questionTopics } = await supabase
      .from('question_topics')
      .select('question_id, topic_id');

    // Get topics with names
    const { data: currentTopics } = await supabase.from('topics').select('id, name, content_id');
    const { data: currentContents } = await supabase.from('contents').select('id, name, subject_id');
    const { data: currentSubjects } = await supabase.from('subjects').select('id, name');

    // Build migration report
    const migrationResults: MigrationResult[] = [];
    const needsReviewQuestions: string[] = [];

    // Create topic lookup map
    const topicLookup = new Map<string, { id: string; name: string; content_id: string }>();
    (currentTopics || []).forEach((t: { id: string; name: string; content_id: string }) => {
      topicLookup.set(t.id, t);
    });

    // Create question to topic mapping
    const questionTopicMap = new Map<string, string>();
    (questionTopics || []).forEach((qt: { question_id: string; topic_id: string }) => {
      questionTopicMap.set(qt.question_id, qt.topic_id);
    });

    for (const question of questions || []) {
      const oldTopicId = questionTopicMap.get(question.id) || null;
      const oldTopic = oldTopicId ? topicLookup.get(oldTopicId) : null;
      const oldTopicName = oldTopic?.name || null;
      
      let result: MigrationResult = {
        questionId: question.id,
        oldSubjectId: question.subject_id,
        oldContentId: question.content_id,
        oldTopicId,
        oldTopicName,
        newSubjectId: null,
        newContentId: null,
        newTopicId: null,
        status: 'needs_review',
        confidence: 'none',
        reason: ''
      };

      // Try to find mapping
      if (oldTopicId && topicMappings[oldTopicId]) {
        const mapping = topicMappings[oldTopicId];
        result.newTopicId = mapping.newTopicId;
        result.confidence = mapping.confidence;
        result.status = mapping.confidence === 'approximate' ? 'needs_review' : 'migrated';
        result.reason = `Mapeamento ${mapping.confidence} encontrado`;
        
        // Extract subject and content from new topic ID
        const parts = mapping.newTopicId.split('_');
        if (parts.length >= 3) {
          result.newSubjectId = findSubjectIdByPrefix(parts[0], subjectsData);
          result.newContentId = `${parts[0]}_${parts[1]}`;
        }
      } else if (oldTopicName) {
        // Try fuzzy matching by name
        const matchedTopic = uniqueTopics.find(t => 
          t.name.toLowerCase() === oldTopicName.toLowerCase() ||
          normalizeText(t.name) === normalizeText(oldTopicName)
        );
        
        if (matchedTopic) {
          result.newTopicId = matchedTopic.id;
          result.newContentId = matchedTopic.content_id;
          const content = contentsData.find(c => c.id === matchedTopic.content_id);
          result.newSubjectId = content?.subject_id || null;
          result.status = 'migrated';
          result.confidence = 'equivalent';
          result.reason = `Match por nome: "${oldTopicName}" -> "${matchedTopic.name}"`;
        } else {
          result.status = 'needs_review';
          result.reason = `Nenhum match encontrado para tópico: "${oldTopicName}"`;
          needsReviewQuestions.push(question.id);
        }
      } else {
        result.status = 'needs_review';
        result.reason = 'Questão sem tópico associado';
        needsReviewQuestions.push(question.id);
      }

      migrationResults.push(result);
    }

    // Execute changes if not dry run
    if (!dryRun) {
      console.log('[import-taxonomy-v3] Executing changes...');

      // 1. Delete old taxonomy data (order matters due to FKs)
      await supabase.from('question_topics').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('topics').delete().neq('id', '');
      await supabase.from('contents').delete().neq('id', '');
      // Don't delete subjects that have questions linked, update them instead
      
      // 2. Insert new areas
      const { error: areasError } = await supabase
        .from('areas')
        .upsert(areasData, { onConflict: 'id' });
      if (areasError) console.error('Areas insert error:', areasError);

      // 3. Update subjects with area_id and insert new ones
      for (const subject of subjectsData) {
        const { error: subjectError } = await supabase
          .from('subjects')
          .upsert(subject, { onConflict: 'id' });
        if (subjectError) console.error('Subject insert error:', subjectError);
      }

      // 4. Insert new contents
      const { error: contentsError } = await supabase
        .from('contents')
        .upsert(contentsData, { onConflict: 'id' });
      if (contentsError) console.error('Contents insert error:', contentsError);

      // 5. Insert new topics
      const { error: topicsError } = await supabase
        .from('topics')
        .upsert(uniqueTopics, { onConflict: 'id' });
      if (topicsError) console.error('Topics insert error:', topicsError);

      // 6. Update questions that could be migrated
      for (const result of migrationResults) {
        if (result.status === 'migrated' && result.newSubjectId && result.newContentId) {
          // Update question classification
          const { error: updateError } = await supabase
            .from('questions')
            .update({
              subject_id: result.newSubjectId,
              content_id: result.newContentId,
              needs_review: false
            })
            .eq('id', result.questionId);

          if (updateError) {
            console.error(`Error updating question ${result.questionId}:`, updateError);
          }

          // Add new topic relationship if we have one
          if (result.newTopicId) {
            const { error: topicError } = await supabase
              .from('question_topics')
              .insert({
                question_id: result.questionId,
                topic_id: result.newTopicId
              });

            if (topicError) {
              console.error(`Error adding topic for question ${result.questionId}:`, topicError);
            }
          }
        } else if (result.status === 'needs_review') {
          // Mark for review
          const { error: reviewError } = await supabase
            .from('questions')
            .update({
              needs_review: true,
              review_reason: result.reason
            })
            .eq('id', result.questionId);

          if (reviewError) {
            console.error(`Error marking question ${result.questionId} for review:`, reviewError);
          }
        }
      }

      console.log('[import-taxonomy-v3] Changes executed successfully');
    }

    // Build report
    const migratedCount = migrationResults.filter(r => r.status === 'migrated').length;
    const needsReviewCount = migrationResults.filter(r => r.status === 'needs_review').length;

    const report = {
      summary: {
        dryRun,
        totalQuestions: questions?.length || 0,
        migratedQuestions: migratedCount,
        needsReviewQuestions: needsReviewCount,
        successRate: questions?.length ? 
          ((migratedCount / questions.length) * 100).toFixed(1) + '%' : '0%'
      },
      taxonomy: {
        areas: areasData.length,
        subjects: subjectsData.length,
        contents: contentsData.length,
        topics: uniqueTopics.length
      },
      migrationDetails: migrationResults,
      newTaxonomyPreview: {
        areas: areasData,
        subjects: subjectsData.slice(0, 5),
        contents: contentsData.slice(0, 10),
        topics: uniqueTopics.slice(0, 20)
      }
    };

    console.log('[import-taxonomy-v3] Report generated:', report.summary);

    return new Response(
      JSON.stringify(report),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in import-taxonomy-v3:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function findSubjectIdByPrefix(prefix: string, subjects: { id: string; name: string }[]): string | null {
  const prefixMap: Record<string, string> = {
    'fil': 'filosofia',
    'geo': 'geografia',
    'his': 'historia',
    'soc': 'sociologia',
    'bio': 'biologia',
    'fis': 'fisica',
    'qui': 'quimica',
    'esp': 'espanhol',
    'gra': 'gramatica',
    'ing': 'ingles',
    'int': 'interpretacao-textual',
    'lit': 'literatura',
    'mat': 'matematica'
  };
  
  return prefixMap[prefix] || null;
}
