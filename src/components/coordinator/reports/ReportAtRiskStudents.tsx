import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, TrendingDown, UserX } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AnswerRecord, StudentProfile } from "@/hooks/useCoordinatorData";

interface Props {
  students: StudentProfile[];
  answers: AnswerRecord[];
}

interface StudentRisk {
  id: string;
  name: string;
  total: number;
  accuracy: number;
  lastActivity: string | null;
  daysSinceActivity: number | null;
  trend: "declining" | "stable" | "improving" | "none";
  riskLevel: "critical" | "warning" | "inactive";
  riskReasons: string[];
}

export function ReportAtRiskStudents({ students, answers }: Props) {
  const now = new Date();

  const risks: StudentRisk[] = students.map(s => {
    const sa = answers.filter(a => a.user_id === s.id).sort((a, b) => 
      new Date(b.answered_at).getTime() - new Date(a.answered_at).getTime()
    );
    const total = sa.length;
    const correct = sa.filter(a => a.is_correct).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    const lastActivity = sa.length > 0 ? sa[0].answered_at : null;
    const daysSinceActivity = lastActivity
      ? Math.floor((now.getTime() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24))
      : null;

    // Calculate trend (last 7 days vs previous 7 days)
    let trend: StudentRisk["trend"] = "none";
    if (sa.length >= 5) {
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const fourteenDaysAgo = new Date(now);
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

      const recent = sa.filter(a => new Date(a.answered_at) >= sevenDaysAgo);
      const previous = sa.filter(a => new Date(a.answered_at) >= fourteenDaysAgo && new Date(a.answered_at) < sevenDaysAgo);

      if (recent.length > 0 && previous.length > 0) {
        const recentAcc = recent.filter(a => a.is_correct).length / recent.length;
        const prevAcc = previous.filter(a => a.is_correct).length / previous.length;
        if (recentAcc < prevAcc - 0.1) trend = "declining";
        else if (recentAcc > prevAcc + 0.1) trend = "improving";
        else trend = "stable";
      }
    }

    const riskReasons: string[] = [];
    let riskLevel: StudentRisk["riskLevel"] = "warning";

    if (total === 0) {
      riskLevel = "inactive";
      riskReasons.push("Nunca respondeu questões");
    } else {
      if (accuracy < 40) riskReasons.push("Aproveitamento muito baixo");
      else if (accuracy < 55) riskReasons.push("Aproveitamento abaixo do esperado");
      if (daysSinceActivity && daysSinceActivity > 7) riskReasons.push(`Inativo há ${daysSinceActivity} dias`);
      if (trend === "declining") riskReasons.push("Desempenho em queda");
      if (total < 10) riskReasons.push("Poucas questões respondidas");

      if (accuracy < 40 || (daysSinceActivity && daysSinceActivity > 14)) riskLevel = "critical";
    }

    return {
      id: s.id,
      name: s.full_name || "Sem nome",
      total,
      accuracy,
      lastActivity,
      daysSinceActivity,
      trend,
      riskLevel,
      riskReasons,
    };
  }).filter(r => r.riskReasons.length > 0)
    .sort((a, b) => {
      const order = { critical: 0, inactive: 1, warning: 2 };
      return order[a.riskLevel] - order[b.riskLevel] || a.accuracy - b.accuracy;
    });

  const critical = risks.filter(r => r.riskLevel === "critical");
  const inactive = risks.filter(r => r.riskLevel === "inactive");
  const warning = risks.filter(r => r.riskLevel === "warning");

  return (
    <div className="space-y-4 mt-4">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-destructive/30">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <div>
                <p className="text-2xl font-bold">{critical.length}</p>
                <p className="text-xs text-muted-foreground">Situação Crítica</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-500/30">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center gap-3">
              <UserX className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{inactive.length}</p>
                <p className="text-xs text-muted-foreground">Inativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center gap-3">
              <TrendingDown className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{warning.length}</p>
                <p className="text-xs text-muted-foreground">Atenção</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Alunos que Precisam de Atenção ({risks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {risks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              🎉 Nenhum aluno em situação de risco! Todos estão com bom desempenho.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Questões</TableHead>
                  <TableHead className="text-center">Aproveitamento</TableHead>
                  <TableHead className="text-center">Tendência</TableHead>
                  <TableHead>Motivos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {risks.map(r => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={r.riskLevel === "critical" ? "destructive" : r.riskLevel === "inactive" ? "secondary" : "outline"}>
                        {r.riskLevel === "critical" ? "Crítico" : r.riskLevel === "inactive" ? "Inativo" : "Atenção"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{r.total}</TableCell>
                    <TableCell className="text-center">
                      {r.total > 0 ? `${r.accuracy}%` : "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      {r.trend === "declining" && <TrendingDown className="h-4 w-4 text-destructive mx-auto" />}
                      {r.trend === "improving" && <span className="text-green-500 text-xs">↑</span>}
                      {r.trend === "stable" && <span className="text-muted-foreground text-xs">→</span>}
                      {r.trend === "none" && <span className="text-muted-foreground text-xs">—</span>}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {r.riskReasons.map((reason, i) => (
                          <span key={i} className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                            {reason}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
