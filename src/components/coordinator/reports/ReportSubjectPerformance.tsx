import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AnswerRecord, StudentProfile, PerformanceRecord } from "@/hooks/useCoordinatorData";

interface Props {
  students: StudentProfile[];
  answers: AnswerRecord[];
  performance: PerformanceRecord[];
  subjects: { id: string; name: string }[];
}

export function ReportSubjectPerformance({ students, answers, performance, subjects }: Props) {
  const subjectStats = subjects.map(sub => {
    const entries = performance.filter(p => p.subject_id === sub.id);
    const totalQ = entries.reduce((acc, p) => acc + (p.total_questions || 0), 0);
    const correctQ = entries.reduce((acc, p) => acc + (p.correct_answers || 0), 0);
    const studentsCount = entries.filter(e => e.total_questions > 0).length;
    const accuracy = totalQ > 0 ? Math.round((correctQ / totalQ) * 100) : 0;
    return {
      id: sub.id,
      name: sub.name,
      shortName: sub.name.length > 20 ? sub.name.substring(0, 20) + "…" : sub.name,
      totalQuestions: totalQ,
      correctQuestions: correctQ,
      studentsCount,
      accuracy,
    };
  }).filter(s => s.totalQuestions > 0).sort((a, b) => b.totalQuestions - a.totalQuestions);

  // Best and worst subjects
  const sorted = [...subjectStats].sort((a, b) => b.accuracy - a.accuracy);
  const best = sorted.slice(0, 3);
  const worst = sorted.slice(-3).reverse();

  const chartData = subjectStats.map(s => ({
    name: s.shortName,
    fullName: s.name,
    Aproveitamento: s.accuracy,
  }));

  return (
    <div className="space-y-4 mt-4">
      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-green-600">🏆 Melhores Matérias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {best.map(s => (
              <div key={s.id} className="flex items-center justify-between">
                <span className="text-sm truncate">{s.name}</span>
                <Badge variant="default">{s.accuracy}%</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-destructive">⚠️ Matérias Críticas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {worst.map(s => (
              <div key={s.id} className="flex items-center justify-between">
                <span className="text-sm truncate">{s.name}</span>
                <Badge variant="destructive">{s.accuracy}%</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Aproveitamento por Matéria</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={Math.max(250, subjectStats.length * 32)}>
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 11 }} />
                <RechartsTooltip
                  formatter={(value: any) => [`${value}%`, "Aproveitamento"]}
                  labelFormatter={(label) => {
                    const item = chartData.find(s => s.name === label);
                    return item?.fullName || label;
                  }}
                />
                <Bar
                  dataKey="Aproveitamento"
                  fill="hsl(var(--primary))"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Detailed table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Detalhamento por Matéria</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matéria</TableHead>
                <TableHead className="text-center">Alunos</TableHead>
                <TableHead className="text-center">Questões</TableHead>
                <TableHead className="text-center">Acertos</TableHead>
                <TableHead className="text-center">Aproveitamento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjectStats.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="text-center">{s.studentsCount}</TableCell>
                  <TableCell className="text-center">{s.totalQuestions.toLocaleString("pt-BR")}</TableCell>
                  <TableCell className="text-center">{s.correctQuestions.toLocaleString("pt-BR")}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={s.accuracy} className="h-2 flex-1" />
                      <span className="text-xs font-medium w-10 text-right">{s.accuracy}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {subjectStats.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhum dado de desempenho por matéria disponível.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
