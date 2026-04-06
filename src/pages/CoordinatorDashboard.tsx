import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Users, TrendingUp, BookOpen, BarChart3, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";

export default function CoordinatorDashboard() {
  const { user } = useAuth();

  // Get coordinator's school
  const { data: coordLink } = useQuery({
    queryKey: ["coordinator-school", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("school_coordinators")
        .select("school_id, schools(name, logo_url)")
        .eq("user_id", user!.id)
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const schoolId = coordLink?.school_id;
  const schoolName = (coordLink as any)?.schools?.name || "Minha Escola";

  // Get students of the school
  const { data: students, isLoading: studentsLoading } = useQuery({
    queryKey: ["coord-students", schoolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("school_students")
        .select("user_id")
        .eq("school_id", schoolId!);
      if (error) throw error;

      const userIds = data.map(d => d.user_id);
      if (userIds.length === 0) return [];

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds);

      return profiles || [];
    },
    enabled: !!schoolId,
  });

  // Get performance data for all students
  const { data: performanceData, isLoading: perfLoading } = useQuery({
    queryKey: ["coord-performance", schoolId],
    queryFn: async () => {
      const { data: schoolStudents } = await supabase
        .from("school_students")
        .select("user_id")
        .eq("school_id", schoolId!);

      const userIds = schoolStudents?.map(s => s.user_id) || [];
      if (userIds.length === 0) return { answers: [], performance: [], subjects: [] };

      // Fetch user_answers for these students
      const { data: answers } = await supabase
        .from("user_answers")
        .select("user_id, is_correct, question_id")
        .in("user_id", userIds);

      // Fetch user_performance for these students
      const { data: performance } = await supabase
        .from("user_performance")
        .select("user_id, subject_id, total_questions, correct_answers, accuracy_percentage")
        .in("user_id", userIds);

      // Fetch subjects
      const { data: subjects } = await supabase
        .from("subjects")
        .select("id, name");

      return { answers: answers || [], performance: performance || [], subjects: subjects || [] };
    },
    enabled: !!schoolId,
  });

  const isLoading = studentsLoading || perfLoading;

  // Calculate stats
  const totalStudents = students?.length || 0;
  const totalAnswers = performanceData?.answers?.length || 0;
  const totalCorrect = performanceData?.answers?.filter(a => a.is_correct)?.length || 0;
  const overallAccuracy = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;

  // Per-subject stats
  const subjectStats = performanceData?.subjects?.map(sub => {
    const perfEntries = performanceData.performance.filter(p => p.subject_id === sub.id);
    const totalQ = perfEntries.reduce((acc, p) => acc + (p.total_questions || 0), 0);
    const correctQ = perfEntries.reduce((acc, p) => acc + (p.correct_answers || 0), 0);
    return {
      name: sub.name.length > 15 ? sub.name.substring(0, 15) + "…" : sub.name,
      fullName: sub.name,
      total: totalQ,
      correct: correctQ,
      accuracy: totalQ > 0 ? Math.round((correctQ / totalQ) * 100) : 0,
    };
  }).filter(s => s.total > 0).sort((a, b) => b.total - a.total) || [];

  // Per-student summary
  const studentSummaries = students?.map(student => {
    const studentAnswers = performanceData?.answers?.filter(a => a.user_id === student.id) || [];
    const correct = studentAnswers.filter(a => a.is_correct).length;
    const total = studentAnswers.length;
    return {
      name: (student as any).full_name || "Sem nome",
      total,
      correct,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
    };
  }).sort((a, b) => b.total - a.total) || [];

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{schoolName}</h1>
          <p className="text-muted-foreground">Painel do Coordenador</p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{totalStudents}</p>
                  <p className="text-sm text-muted-foreground">Alunos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{totalAnswers}</p>
                  <p className="text-sm text-muted-foreground">Questões respondidas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{overallAccuracy}%</p>
                  <p className="text-sm text-muted-foreground">Aproveitamento geral</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{subjectStats.length}</p>
                  <p className="text-sm text-muted-foreground">Matérias praticadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Performance Chart */}
        {subjectStats.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Desempenho por Matéria</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subjectStats.slice(0, 10)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} unit="%" />
                  <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
                  <RechartsTooltip
                    formatter={(value: any, name: string) => [
                      `${value}%`,
                      name === "accuracy" ? "Aproveitamento" : name,
                    ]}
                    labelFormatter={(label) => {
                      const item = subjectStats.find(s => s.name === label);
                      return item?.fullName || label;
                    }}
                  />
                  <Bar dataKey="accuracy" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Student Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Desempenho por Aluno</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {studentSummaries.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">Nenhum dado de desempenho disponível</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead className="text-center">Questões</TableHead>
                    <TableHead className="text-center">Acertos</TableHead>
                    <TableHead className="text-center">Aproveitamento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentSummaries.map((s, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="text-center">{s.total}</TableCell>
                      <TableCell className="text-center">{s.correct}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={s.accuracy >= 70 ? "default" : s.accuracy >= 50 ? "secondary" : "destructive"}>
                          {s.accuracy}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
