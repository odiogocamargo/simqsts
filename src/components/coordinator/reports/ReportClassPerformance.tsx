import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";
import type { AnswerRecord, StudentProfile, PerformanceRecord } from "@/hooks/useCoordinatorData";
import { useClassStudents } from "@/hooks/useCoordinatorData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  students: StudentProfile[];
  answers: AnswerRecord[];
  classes: { id: string; name: string; year: number; shift: string | null }[];
  performance: PerformanceRecord[];
  subjects: { id: string; name: string }[];
}

interface ClassStudentsMap {
  [classId: string]: Set<string>;
}

export function ReportClassPerformance({ students, answers, classes, performance, subjects }: Props) {
  // Fetch all class-student links
  const { data: allClassStudents } = useQuery({
    queryKey: ["all-class-students-report", classes.map(c => c.id).join(",")],
    queryFn: async () => {
      if (classes.length === 0) return {};
      const { data } = await supabase
        .from("school_class_students")
        .select("class_id, student_id")
        .in("class_id", classes.map(c => c.id));
      
      const map: ClassStudentsMap = {};
      (data || []).forEach(d => {
        if (!map[d.class_id]) map[d.class_id] = new Set();
        map[d.class_id].add(d.student_id);
      });
      return map;
    },
    enabled: classes.length > 0,
  });

  const classStats = classes.map(cls => {
    const studentIds = allClassStudents?.[cls.id] || new Set<string>();
    const classStudents = students.filter(s => studentIds.has(s.id));
    const classAnswers = answers.filter(a => studentIds.has(a.user_id));
    const correct = classAnswers.filter(a => a.is_correct).length;
    const accuracy = classAnswers.length > 0 ? Math.round((correct / classAnswers.length) * 100) : 0;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const active = new Set(classAnswers.filter(a => new Date(a.answered_at) >= sevenDaysAgo).map(a => a.user_id)).size;

    const avgPerStudent = classStudents.length > 0 ? Math.round(classAnswers.length / classStudents.length) : 0;

    return {
      id: cls.id,
      name: cls.name,
      shift: cls.shift || "—",
      totalStudents: classStudents.length,
      activeStudents: active,
      totalAnswers: classAnswers.length,
      accuracy,
      avgPerStudent,
    };
  }).sort((a, b) => b.accuracy - a.accuracy);

  // "Sem turma" students
  const allEnrolled = new Set<string>();
  Object.values(allClassStudents || {}).forEach(s => s.forEach(id => allEnrolled.add(id)));
  const noClassStudents = students.filter(s => !allEnrolled.has(s.id));
  const noClassAnswers = answers.filter(a => !allEnrolled.has(a.user_id));
  const noClassCorrect = noClassAnswers.filter(a => a.is_correct).length;
  const noClassAccuracy = noClassAnswers.length > 0 ? Math.round((noClassCorrect / noClassAnswers.length) * 100) : 0;

  const chartData = classStats.map(c => ({
    name: c.name,
    "Aproveitamento": c.accuracy,
    "Questões/aluno": c.avgPerStudent,
  }));

  return (
    <div className="space-y-4 mt-4">
      {/* Comparison Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Comparativo entre Turmas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="Aproveitamento" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Questões/aluno" fill="hsl(var(--primary) / 0.4)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Detail cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {classStats.map(cls => (
          <Card key={cls.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{cls.name}</CardTitle>
                <Badge variant={cls.accuracy >= 70 ? "default" : cls.accuracy >= 50 ? "secondary" : "destructive"}>
                  {cls.accuracy}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Turno: {cls.shift}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Alunos:</span>{" "}
                  <span className="font-medium">{cls.totalStudents}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Ativos (7d):</span>{" "}
                  <span className="font-medium">{cls.activeStudents}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Questões:</span>{" "}
                  <span className="font-medium">{cls.totalAnswers.toLocaleString("pt-BR")}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Média/aluno:</span>{" "}
                  <span className="font-medium">{cls.avgPerStudent}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Aproveitamento</span>
                  <span className="font-medium">{cls.accuracy}%</span>
                </div>
                <Progress value={cls.accuracy} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}

        {noClassStudents.length > 0 && (
          <Card className="border-dashed">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-muted-foreground">Sem Turma</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Alunos:</span>{" "}
                  <span className="font-medium">{noClassStudents.length}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Questões:</span>{" "}
                  <span className="font-medium">{noClassAnswers.length.toLocaleString("pt-BR")}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Aproveitamento</span>
                  <span className="font-medium">{noClassAccuracy}%</span>
                </div>
                <Progress value={noClassAccuracy} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {classStats.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhuma turma cadastrada ainda.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
