import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import type { PerformanceRecord } from "@/hooks/useCoordinatorData";

interface SubjectPerformanceChartProps {
  performance: PerformanceRecord[];
  subjects: { id: string; name: string }[];
}

export function SubjectPerformanceChart({ performance, subjects }: SubjectPerformanceChartProps) {
  const subjectStats = subjects.map(sub => {
    const entries = performance.filter(p => p.subject_id === sub.id);
    const totalQ = entries.reduce((acc, p) => acc + (p.total_questions || 0), 0);
    const correctQ = entries.reduce((acc, p) => acc + (p.correct_answers || 0), 0);
    return {
      name: sub.name.length > 18 ? sub.name.substring(0, 18) + "…" : sub.name,
      fullName: sub.name,
      total: totalQ,
      correct: correctQ,
      accuracy: totalQ > 0 ? Math.round((correctQ / totalQ) * 100) : 0,
    };
  }).filter(s => s.total > 0).sort((a, b) => b.total - a.total);

  if (subjectStats.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Desempenho por Matéria</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={Math.max(200, subjectStats.length * 35)}>
          <BarChart data={subjectStats} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11 }} />
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
  );
}
