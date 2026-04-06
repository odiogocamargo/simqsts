import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";
import type { AnswerRecord, StudentProfile } from "@/hooks/useCoordinatorData";
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, eachWeekOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Props {
  students: StudentProfile[];
  answers: AnswerRecord[];
}

export function ReportTemporalEvolution({ students, answers }: Props) {
  const now = new Date();

  // Daily data (last 30 days)
  const thirtyDaysAgo = subDays(now, 30);
  const days = eachDayOfInterval({ start: thirtyDaysAgo, end: now });

  const dailyData = days.map(day => {
    const dayStr = format(day, "yyyy-MM-dd");
    const dayAnswers = answers.filter(a => a.answered_at.startsWith(dayStr));
    const correct = dayAnswers.filter(a => a.is_correct).length;
    const accuracy = dayAnswers.length > 0 ? Math.round((correct / dayAnswers.length) * 100) : 0;
    const activeStudents = new Set(dayAnswers.map(a => a.user_id)).size;

    return {
      date: format(day, "dd/MM", { locale: ptBR }),
      questões: dayAnswers.length,
      acertos: correct,
      erros: dayAnswers.length - correct,
      aproveitamento: accuracy,
      alunos: activeStudents,
    };
  });

  // Weekly data (last 8 weeks)
  const eightWeeksAgo = subDays(now, 56);
  const weeks = eachWeekOfInterval({ start: eightWeeksAgo, end: now }, { weekStartsOn: 1 });

  const weeklyData = weeks.map(weekStart => {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    const weekAnswers = answers.filter(a => {
      const d = new Date(a.answered_at);
      return d >= weekStart && d <= weekEnd;
    });
    const correct = weekAnswers.filter(a => a.is_correct).length;
    const accuracy = weekAnswers.length > 0 ? Math.round((correct / weekAnswers.length) * 100) : 0;
    const activeStudents = new Set(weekAnswers.map(a => a.user_id)).size;

    return {
      week: `${format(weekStart, "dd/MM")} - ${format(weekEnd, "dd/MM")}`,
      questões: weekAnswers.length,
      aproveitamento: accuracy,
      alunos: activeStudents,
    };
  });

  // Engagement trend: compare last 7 days vs previous 7 days
  const last7 = answers.filter(a => new Date(a.answered_at) >= subDays(now, 7));
  const prev7 = answers.filter(a => {
    const d = new Date(a.answered_at);
    return d >= subDays(now, 14) && d < subDays(now, 7);
  });

  const last7Active = new Set(last7.map(a => a.user_id)).size;
  const prev7Active = new Set(prev7.map(a => a.user_id)).size;
  const engagementChange = prev7Active > 0 ? Math.round(((last7Active - prev7Active) / prev7Active) * 100) : 0;

  const last7Acc = last7.length > 0 ? Math.round((last7.filter(a => a.is_correct).length / last7.length) * 100) : 0;
  const prev7Acc = prev7.length > 0 ? Math.round((prev7.filter(a => a.is_correct).length / prev7.length) * 100) : 0;
  const accChange = prev7Acc > 0 ? last7Acc - prev7Acc : 0;

  return (
    <div className="space-y-4 mt-4">
      {/* Trend summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground">Questões (7 dias)</p>
            <p className="text-2xl font-bold">{last7.length.toLocaleString("pt-BR")}</p>
            <p className="text-xs text-muted-foreground">vs {prev7.length.toLocaleString("pt-BR")} semana anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground">Alunos ativos (7 dias)</p>
            <p className="text-2xl font-bold">{last7Active}</p>
            <Badge variant={engagementChange >= 0 ? "default" : "destructive"} className="text-xs mt-1">
              {engagementChange >= 0 ? "+" : ""}{engagementChange}%
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground">Aproveitamento (7 dias)</p>
            <p className="text-2xl font-bold">{last7Acc}%</p>
            <Badge variant={accChange >= 0 ? "default" : "destructive"} className="text-xs mt-1">
              {accChange >= 0 ? "+" : ""}{accChange}pp
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground">Média diária</p>
            <p className="text-2xl font-bold">
              {Math.round(last7.length / 7)}
            </p>
            <p className="text-xs text-muted-foreground">questões/dia</p>
          </CardContent>
        </Card>
      </div>

      {/* Daily chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Atividade Diária (30 dias)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={2} />
              <YAxis tick={{ fontSize: 11 }} />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="acertos" stackId="a" fill="hsl(var(--primary))" name="Acertos" />
              <Bar dataKey="erros" stackId="a" fill="hsl(var(--destructive))" name="Erros" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Accuracy line chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Evolução do Aproveitamento (30 dias)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyData.filter(d => d.questões > 0)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
              <RechartsTooltip formatter={(v: any) => [`${v}%`, "Aproveitamento"]} />
              <Line type="monotone" dataKey="aproveitamento" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Weekly summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Resumo Semanal</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="questões" fill="hsl(var(--primary))" name="Questões" radius={[4, 4, 0, 0]} />
              <Bar dataKey="alunos" fill="hsl(var(--primary) / 0.4)" name="Alunos Ativos" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
