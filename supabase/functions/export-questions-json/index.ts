import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const examId = url.searchParams.get("exam_id") || "fuvest";

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all questions for the exam
    const { data: questions, error } = await supabase
      .from("questions")
      .select("*, subjects(name)")
      .eq("exam_id", examId)
      .order("year", { ascending: true });

    if (error) throw error;

    // Map difficulty
    const difficultyMap: Record<string, string> = {
      facil: "easy",
      medio: "medium",
      dificil: "hard",
    };

    // Map correct_answer letter to index
    const answerToIndex: Record<string, number> = {
      a: 0, b: 1, c: 2, d: 3, e: 4,
    };

    const exported = (questions || []).map((q: any) => ({
      subject: q.subjects?.name || q.subject_id,
      source: examId.toUpperCase(),
      year: q.year,
      difficulty: difficultyMap[q.difficulty] || q.difficulty || "medium",
      statement: q.statement,
      options: [
        q.option_a || "",
        q.option_b || "",
        q.option_c || "",
        q.option_d || "",
        q.option_e || "",
      ].filter((o: string) => o !== ""),
      correct_answer: answerToIndex[(q.correct_answer || "a").toLowerCase()] ?? 0,
      explanation: q.explanation || "",
    }));

    return new Response(JSON.stringify(exported, null, 2), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="questions-${examId}.json"`,
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
