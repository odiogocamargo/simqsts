import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";

interface PerformanceOverviewProps {
  total: number;
  correct: number;
  wrong: number;
  accuracy: number;
  avgTimeSeconds: number;
}

export function PerformanceOverview({ total, correct, wrong, accuracy, avgTimeSeconds }: PerformanceOverviewProps) {
  const data = [
    { name: "Certas", value: correct, color: "hsl(142 71% 45%)" },
    { name: "Erradas", value: wrong, color: "hsl(0 72% 51%)" },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-6 md:grid-cols-3 items-center">
          {/* Donut chart */}
          <div className="relative h-[240px]">
            {total > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {data.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold text-foreground">{total}</span>
                  <span className="text-xs text-muted-foreground">questões</span>
                </div>
                <div className="flex items-center justify-center gap-4 mt-2 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: "hsl(142 71% 45%)" }} />
                    Certas
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: "hsl(0 72% 51%)" }} />
                    Erradas
                  </span>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                Sem dados no período
              </div>
            )}
          </div>

          {/* Stat boxes */}
          <div className="md:col-span-2 grid grid-cols-2 gap-3">
            <div className="rounded-lg border p-4 text-center">
              <p className="text-3xl font-light text-foreground">{accuracy}%</p>
              <p className="text-xs text-muted-foreground mt-1">Taxa de acerto</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <p className="text-3xl font-light text-foreground">{total}</p>
              <p className="text-xs text-muted-foreground mt-1">Questões no período</p>
            </div>
            <div className="rounded-lg p-4 text-center text-white" style={{ background: "hsl(142 71% 45%)" }}>
              <p className="text-3xl font-light">{correct}</p>
              <p className="text-xs mt-1 opacity-90">Certas</p>
            </div>
            <div className="rounded-lg p-4 text-center text-white" style={{ background: "hsl(0 72% 51%)" }}>
              <p className="text-3xl font-light">{wrong}</p>
              <p className="text-xs mt-1 opacity-90">Erradas</p>
            </div>
            <div className="rounded-lg border p-4 text-center col-span-2">
              <p className="text-3xl font-light text-foreground">{avgTimeSeconds}s</p>
              <p className="text-xs text-muted-foreground mt-1">Tempo médio por questão</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
