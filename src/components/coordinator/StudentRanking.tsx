import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, AlertTriangle } from "lucide-react";
import type { AnswerRecord, StudentProfile } from "@/hooks/useCoordinatorData";

interface StudentRankingProps {
  students: StudentProfile[];
  answers: AnswerRecord[];
  onStudentClick?: (studentId: string) => void;
}

interface StudentSummary {
  id: string;
  name: string;
  total: number;
  correct: number;
  accuracy: number;
}

function buildSummaries(students: StudentProfile[], answers: AnswerRecord[]): StudentSummary[] {
  return students.map(s => {
    const sa = answers.filter(a => a.user_id === s.id);
    const correct = sa.filter(a => a.is_correct).length;
    return {
      id: s.id,
      name: s.full_name || "Sem nome",
      total: sa.length,
      correct,
      accuracy: sa.length > 0 ? Math.round((correct / sa.length) * 100) : 0,
    };
  }).filter(s => s.total > 0);
}

export function StudentRanking({ students, answers, onStudentClick }: StudentRankingProps) {
  const summaries = buildSummaries(students, answers);

  const topStudents = [...summaries].sort((a, b) => b.accuracy - a.accuracy || b.total - a.total).slice(0, 5);
  const bottomStudents = [...summaries].sort((a, b) => a.accuracy - b.accuracy || a.total - b.total).slice(0, 5);

  // Inactive students (0 questions)
  const inactiveStudents = students.filter(s => !answers.some(a => a.user_id === s.id));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            Melhores Alunos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {topStudents.map((s, i) => (
            <div
              key={s.id}
              className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => onStudentClick?.(s.id)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm font-bold text-muted-foreground w-5">{i + 1}.</span>
                <span className="text-sm truncate">{s.name}</span>
              </div>
              <Badge variant="default" className="shrink-0">{s.accuracy}%</Badge>
            </div>
          ))}
          {topStudents.length === 0 && <p className="text-sm text-muted-foreground">Sem dados</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            Precisam de Atenção
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {bottomStudents.map((s, i) => (
            <div
              key={s.id}
              className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => onStudentClick?.(s.id)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm font-bold text-muted-foreground w-5">{i + 1}.</span>
                <span className="text-sm truncate">{s.name}</span>
              </div>
              <Badge variant="destructive" className="shrink-0">{s.accuracy}%</Badge>
            </div>
          ))}
          {bottomStudents.length === 0 && <p className="text-sm text-muted-foreground">Sem dados</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            Inativos ({inactiveStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {inactiveStudents.slice(0, 8).map(s => (
            <div
              key={s.id}
              className="flex items-center p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => onStudentClick?.(s.id)}
            >
              <span className="text-sm text-muted-foreground truncate">{s.full_name || "Sem nome"}</span>
            </div>
          ))}
          {inactiveStudents.length > 8 && (
            <p className="text-xs text-muted-foreground">+ {inactiveStudents.length - 8} mais</p>
          )}
          {inactiveStudents.length === 0 && <p className="text-sm text-muted-foreground">Todos ativos!</p>}
        </CardContent>
      </Card>
    </div>
  );
}
