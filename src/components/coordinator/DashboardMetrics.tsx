import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, TrendingUp, BarChart3, Clock, Activity } from "lucide-react";
import type { AnswerRecord, StudentProfile } from "@/hooks/useCoordinatorData";

interface DashboardMetricsProps {
  students: StudentProfile[];
  answers: AnswerRecord[];
  subjectCount: number;
}

export function DashboardMetrics({ students, answers, subjectCount }: DashboardMetricsProps) {
  const totalStudents = students.length;
  const totalAnswers = answers.length;
  const totalCorrect = answers.filter(a => a.is_correct).length;
  const overallAccuracy = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;

  // Active students (answered at least 1 question in last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const activeStudents = new Set(
    answers.filter(a => new Date(a.answered_at) >= sevenDaysAgo).map(a => a.user_id)
  ).size;

  // Avg time per question
  const timesSpent = answers.filter(a => a.time_spent_seconds != null).map(a => a.time_spent_seconds!);
  const avgTime = timesSpent.length > 0 ? Math.round(timesSpent.reduce((a, b) => a + b, 0) / timesSpent.length) : 0;

  // Avg questions per student
  const avgQuestions = totalStudents > 0 ? Math.round(totalAnswers / totalStudents) : 0;

  const metrics = [
    { icon: Users, label: "Alunos", value: totalStudents, color: "text-primary" },
    { icon: Activity, label: "Ativos (7 dias)", value: activeStudents, color: "text-green-500" },
    { icon: BookOpen, label: "Questões respondidas", value: totalAnswers.toLocaleString("pt-BR"), color: "text-primary" },
    { icon: TrendingUp, label: "Aproveitamento geral", value: `${overallAccuracy}%`, color: overallAccuracy >= 70 ? "text-green-500" : overallAccuracy >= 50 ? "text-yellow-500" : "text-red-500" },
    { icon: BarChart3, label: "Matérias praticadas", value: subjectCount, color: "text-primary" },
    { icon: Clock, label: "Tempo médio/questão", value: `${avgTime}s`, color: "text-primary" },
    { icon: BookOpen, label: "Média questões/aluno", value: avgQuestions, color: "text-primary" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
      {metrics.map((m, i) => (
        <Card key={i}>
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center gap-2">
              <m.icon className={`h-5 w-5 ${m.color} shrink-0`} />
              <div className="min-w-0">
                <p className="text-xl font-bold leading-tight">{m.value}</p>
                <p className="text-xs text-muted-foreground truncate">{m.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
