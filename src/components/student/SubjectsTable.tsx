import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { BookOpen } from "lucide-react";
import { getAreaForSubject } from "./PerformanceByArea";

interface SubjectAnswer {
  subject_id?: string;
  is_correct: boolean;
  time_spent_seconds: number | null;
}

interface UserAnswerLite {
  is_correct: boolean;
  time_spent_seconds: number | null;
  questions?: { subject_id?: string } | null;
}

interface Subject {
  id: string;
  name: string;
}

interface SubjectsTableProps {
  subjects: Subject[];
  userAnswers: UserAnswerLite[];
}

function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function SubjectsTable({ subjects, userAnswers }: SubjectsTableProps) {
  const rows = subjects
    .map((subject) => {
      const subjectAnswers = userAnswers.filter((a) => a.questions?.subject_id === subject.id);
      const total = subjectAnswers.length;
      const correct = subjectAnswers.filter((a) => a.is_correct).length;
      const totalTime = subjectAnswers.reduce((acc, a) => acc + (a.time_spent_seconds || 0), 0);
      const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
      return {
        area: getAreaForSubject(subject.name),
        name: subject.name,
        total,
        totalTime,
        accuracy,
      };
    })
    .filter((r) => r.total > 0)
    .sort((a, b) => b.accuracy - a.accuracy);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Disciplinas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Nenhuma questão respondida no período</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Área</TableHead>
                  <TableHead>Disciplina</TableHead>
                  <TableHead className="text-right">Questões</TableHead>
                  <TableHead className="text-right">Tempo Total</TableHead>
                  <TableHead className="w-[200px]">Taxa de Acerto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.name}>
                    <TableCell className="text-sm text-muted-foreground">{r.area}</TableCell>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell className="text-right">{r.total}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{formatDuration(r.totalTime)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={r.accuracy} className="h-2 flex-1" />
                        <span className="text-sm font-semibold w-12 text-right">{r.accuracy}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
