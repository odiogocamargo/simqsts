import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { HeatmapCell } from "@/components/coordinator/PerformanceHeatmap";

interface AnswerWithQuestion {
  question_id: string;
  is_correct: boolean;
}

async function fetchTaxonomy() {
  const [{ data: contents }, { data: topics }, { data: subjects }] = await Promise.all([
    supabase.from("contents").select("id, name, subject_id"),
    supabase.from("topics").select("id, name, content_id"),
    supabase.from("subjects").select("id, name"),
  ]);
  return { contents: contents || [], topics: topics || [], subjects: subjects || [] };
}

async function fetchQuestionMappings(questionIds: string[]) {
  if (questionIds.length === 0) return { questions: [], questionTopics: [] };

  // Fetch questions with content_id
  const uniqueIds = [...new Set(questionIds)];
  let questions: { id: string; content_id: string }[] = [];
  for (let i = 0; i < uniqueIds.length; i += 500) {
    const batch = uniqueIds.slice(i, i + 500);
    const { data } = await supabase
      .from("questions")
      .select("id, content_id")
      .in("id", batch);
    if (data) questions = questions.concat(data);
  }

  // Fetch question_topics
  let questionTopics: { question_id: string; topic_id: string }[] = [];
  for (let i = 0; i < uniqueIds.length; i += 500) {
    const batch = uniqueIds.slice(i, i + 500);
    const { data } = await supabase
      .from("question_topics")
      .select("question_id, topic_id")
      .in("question_id", batch);
    if (data) questionTopics = questionTopics.concat(data);
  }

  return { questions, questionTopics };
}

function computeHeatmapData(
  answers: AnswerWithQuestion[],
  questions: { id: string; content_id: string }[],
  questionTopics: { question_id: string; topic_id: string }[],
  taxonomy: Awaited<ReturnType<typeof fetchTaxonomy>>
) {
  const qMap = new Map(questions.map(q => [q.id, q.content_id]));
  const subjectMap = new Map(taxonomy.subjects.map(s => [s.id, s.name]));
  const contentSubject = new Map(taxonomy.contents.map(c => [c.id, c.subject_id]));

  // Content aggregation
  const contentAgg = new Map<string, { total: number; correct: number }>();
  for (const a of answers) {
    const contentId = qMap.get(a.question_id);
    if (!contentId) continue;
    const entry = contentAgg.get(contentId) || { total: 0, correct: 0 };
    entry.total++;
    if (a.is_correct) entry.correct++;
    contentAgg.set(contentId, entry);
  }

  const contentData: HeatmapCell[] = taxonomy.contents
    .map(c => {
      const agg = contentAgg.get(c.id);
      if (!agg || agg.total === 0) return null;
      return {
        id: c.id,
        name: c.name,
        parentName: subjectMap.get(c.subject_id) || "",
        total: agg.total,
        correct: agg.correct,
        accuracy: Math.round((agg.correct / agg.total) * 100),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a!.accuracy - b!.accuracy) as HeatmapCell[];

  // Topic aggregation
  const topicAnswerMap = new Map<string, { total: number; correct: number }>();
  const qtMap = new Map<string, string[]>();
  for (const qt of questionTopics) {
    const arr = qtMap.get(qt.question_id) || [];
    arr.push(qt.topic_id);
    qtMap.set(qt.question_id, arr);
  }

  for (const a of answers) {
    const topicIds = qtMap.get(a.question_id);
    if (!topicIds) continue;
    for (const tid of topicIds) {
      const entry = topicAnswerMap.get(tid) || { total: 0, correct: 0 };
      entry.total++;
      if (a.is_correct) entry.correct++;
      topicAnswerMap.set(tid, entry);
    }
  }

  const contentNameMap = new Map(taxonomy.contents.map(c => [c.id, c.name]));
  const topicData: HeatmapCell[] = taxonomy.topics
    .map(t => {
      const agg = topicAnswerMap.get(t.id);
      if (!agg || agg.total === 0) return null;
      return {
        id: t.id,
        name: t.name,
        parentName: contentNameMap.get(t.content_id) || "",
        total: agg.total,
        correct: agg.correct,
        accuracy: Math.round((agg.correct / agg.total) * 100),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a!.accuracy - b!.accuracy) as HeatmapCell[];

  return { contentData, topicData };
}

/**
 * Hook for multiple users (coordinator dashboard)
 */
export function useContentTopicHeatmap(answers: AnswerWithQuestion[] | undefined) {
  const questionIds = [...new Set((answers || []).map(a => a.question_id))];

  return useQuery({
    queryKey: ["content-topic-heatmap", questionIds.length],
    queryFn: async () => {
      const [taxonomy, mappings] = await Promise.all([
        fetchTaxonomy(),
        fetchQuestionMappings(questionIds),
      ]);
      return computeHeatmapData(answers || [], mappings.questions, mappings.questionTopics, taxonomy);
    },
    enabled: questionIds.length > 0,
  });
}
