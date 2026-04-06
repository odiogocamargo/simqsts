import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import type { AnswerRecord } from "@/hooks/useCoordinatorData";
import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DailyEvolutionChartProps {
  answers: AnswerRecord[];
}

export function DailyEvolutionChart({ answers }: DailyEvolutionChartProps) {
  const now = new Date();
  const days = 14;

  const dailyData = Array.from({ length: days }, (_, i) => {
    const date = subDays(now, days - 1 - i);
    const dateStr = format(date, "yyyy-MM-dd");
    const dayAnswers = answers.filter(a => a.answered_at.startsWith(dateStr));
    const correct = dayAnswers.filter(a => a.is_correct).length;
    const total = dayAnswers.length;
    const activeStudents = new Set(dayAnswers.map(a => a.user_id)).size;

    return {
      date: format(date, "dd/MM", { locale: ptBR }),
      questoes: total,
      acertos: correct,
      erros: total - correct,
      aproveitamento: total > 0 ? Math.round((correct / total) * 100) : 0,
      alunos: activeStudents,
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Atividade Diária (14 dias)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="acertos" name="Acertos" fill="hsl(var(--primary))" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="erros" name="Erros" fill="hsl(var(--destructive))" stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Aproveitamento e Alunos Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
              <RechartsTooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="aproveitamento" name="Aproveitamento %" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
              <Line yAxisId="right" type="monotone" dataKey="alunos" name="Alunos ativos" stroke="hsl(142, 76%, 36%)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
