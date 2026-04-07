import { Layout } from "@/components/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, TrendingUp, Clock, Target, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCoordinatorSchool } from "@/hooks/useCoordinatorData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ComposedChart, Line, Legend } from "recharts";
import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Progress } from "@/components/ui/progress";
import { PerformanceHeatmap } from "@/components/coordinator/PerformanceHeatmap";
import { useContentTopicHeatmap } from "@/hooks/useContentTopicPerformance";

export default function CoordinatorStudentDetail() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { schoolId } = useCoordinatorSchool();

  // Verify student belongs to school
  const { data: studentLink } = useQuery({
    queryKey: ["coord-student-link", schoolId, studentId],
    queryFn: async () => {
      const { data } = await supabase
        .from("school_students")
        .select("id")
        .eq("school_id", schoolId!)
        .eq("user_id", studentId!)
        .maybeSingle();
      return data;
    },
    enabled: !!schoolId && !!studentId,
  });

  // Profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["student-profile", studentId],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, cpf, whatsapp, created_at")
        .eq("id", studentId!)
        .single();
      return data;
    },
    enabled: !!studentId && !!studentLink,
  });

  // Answers
  const { data: answers, isLoading: answersLoading } = useQuery({
    queryKey: ["student-answers-coord", studentId],
    queryFn: async () => {
      let all: any[] = [];
      let from = 0;
      const pageSize = 1000;
      while (true) {
        const { data } = await supabase
          .from("user_answers")
          .select("is_correct, question_id, answered_at, time_spent_seconds, selected_answer")
          .eq("user_id", studentId!)
          .range(from, from + pageSize - 1)
          .order("answered_at", { ascending: false });
        if (!data || data.length === 0) break;
        all = all.concat(data);
        if (data.length < pageSize) break;
        from += pageSize;
      }
      return all;
    },
    enabled: !!studentId && !!studentLink,
  });

  // Performance by subject
  const { data: perfData } = useQuery({
    queryKey: ["student-perf-coord", studentId],
    queryFn: async () => {
      const { data: perf } = await supabase
        .from("user_performance")
        .select("subject_id, total_questions, correct_answers")
        .eq("user_id", studentId!);

      const { data: subjects } = await supabase
        .from("subjects")
        .select("id, name");

      return { perf: perf || [], subjects: subjects || [] };
    },
    enabled: !!studentId && !!studentLink,
  });

  // Classes this student belongs to
  const { data: studentClasses } = useQuery({
    queryKey: ["student-classes", studentId, schoolId],
    queryFn: async () => {
      const { data: classLinks } = await supabase
        .from("school_class_students")
        .select("class_id")
        .eq("student_id", studentId!);

      if (!classLinks || classLinks.length === 0) return [];

      const { data: classes } = await supabase
        .from("school_classes")
        .select("id, name, year, shift")
        .in("id", classLinks.map(c => c.class_id))
        .eq("school_id", schoolId!);

      return classes || [];
    },
    enabled: !!studentId && !!schoolId && !!studentLink,
  });

  const answersForHeatmap = (answers || []).map(a => ({ question_id: a.question_id, is_correct: a.is_correct }));
  const { data: heatmapData } = useContentTopicHeatmap(answersForHeatmap);

  const isLoading = profileLoading || answersLoading;

  if (isLoading || !studentLink) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  const totalAnswers = answers?.length || 0;
  const totalCorrect = answers?.filter(a => a.is_correct).length || 0;
  const accuracy = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;
  const times = (answers || []).filter(a => a.time_spent_seconds != null).map(a => a.time_spent_seconds!);
  const avgTime = times.length > 0 ? Math.round(times.reduce((a: number, b: number) => a + b, 0) / times.length) : 0;

  // Daily evolution (14 days)
  const now = new Date();
  const dailyData = Array.from({ length: 14 }, (_, i) => {
    const date = subDays(now, 13 - i);
    const dateStr = format(date, "yyyy-MM-dd");
    const dayAnswers = (answers || []).filter(a => a.answered_at.startsWith(dateStr));
    const correct = dayAnswers.filter(a => a.is_correct).length;
    const total = dayAnswers.length;
    return {
      date: format(date, "dd/MM", { locale: ptBR }),
      questoes: total,
      aproveitamento: total > 0 ? Math.round((correct / total) * 100) : 0,
    };
  });

  // Subject performance
  const subjectPerf = (perfData?.subjects || [])
    .map(sub => {
      const entry = perfData?.perf?.find(p => p.subject_id === sub.id);
      if (!entry || entry.total_questions === 0) return null;
      return {
        name: sub.name.length > 18 ? sub.name.substring(0, 18) + "…" : sub.name,
        fullName: sub.name,
        total: entry.total_questions,
        correct: entry.correct_answers,
        accuracy: Math.round((entry.correct_answers / entry.total_questions) * 100),
      };
    })
    .filter(Boolean)
    .sort((a: any, b: any) => b.total - a.total) as any[];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/coordinator")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{profile?.full_name || "Aluno"}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {profile?.cpf && <span>CPF: {profile.cpf}</span>}
              {studentClasses && studentClasses.length > 0 && (
                <div className="flex gap-1">
                  {studentClasses.map((c: any) => (
                    <Badge key={c.id} variant="outline" className="text-xs">
                      {c.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card>
            <CardContent className="pt-4 pb-3 px-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="text-xl font-bold">{totalAnswers}</p>
                  <p className="text-xs text-muted-foreground">Questões respondidas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 px-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="text-xl font-bold">{totalCorrect}</p>
                  <p className="text-xs text-muted-foreground">Acertos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 px-4">
              <div className="flex items-center gap-2">
                <TrendingUp className={`h-5 w-5 shrink-0 ${accuracy >= 70 ? "text-green-500" : accuracy >= 50 ? "text-yellow-500" : "text-red-500"}`} />
                <div>
                  <p className="text-xl font-bold">{accuracy}%</p>
                  <p className="text-xs text-muted-foreground">Aproveitamento</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3 px-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="text-xl font-bold">{avgTime}s</p>
                  <p className="text-xs text-muted-foreground">Tempo médio</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Evolution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Evolução Diária (14 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                <RechartsTooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="questoes" name="Questões" fill="hsl(var(--primary))" />
                <Line yAxisId="right" type="monotone" dataKey="aproveitamento" name="Aproveitamento %" stroke="hsl(142, 76%, 36%)" strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subject Performance */}
        {subjectPerf.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Desempenho por Matéria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {subjectPerf.map((s: any) => (
                <div key={s.fullName} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{s.fullName}</span>
                    <span className="text-muted-foreground">{s.correct}/{s.total} ({s.accuracy}%)</span>
                  </div>
                  <Progress value={s.accuracy} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
