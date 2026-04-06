import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Search, ArrowUpDown } from "lucide-react";
import { useState, useMemo } from "react";
import type { AnswerRecord, StudentProfile } from "@/hooks/useCoordinatorData";

interface StudentPerformanceTableProps {
  students: StudentProfile[];
  answers: AnswerRecord[];
  onStudentClick?: (studentId: string) => void;
}

type SortField = "name" | "total" | "accuracy" | "lastActive";
type SortDir = "asc" | "desc";

export function StudentPerformanceTable({ students, answers, onStudentClick }: StudentPerformanceTableProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("total");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const summaries = useMemo(() => {
    return students.map(s => {
      const sa = answers.filter(a => a.user_id === s.id);
      const correct = sa.filter(a => a.is_correct).length;
      const lastAnswer = sa.length > 0 ? sa.reduce((latest, a) => a.answered_at > latest ? a.answered_at : latest, sa[0].answered_at) : null;
      const times = sa.filter(a => a.time_spent_seconds != null).map(a => a.time_spent_seconds!);
      const avgTime = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;

      return {
        id: s.id,
        name: s.full_name || "Sem nome",
        total: sa.length,
        correct,
        accuracy: sa.length > 0 ? Math.round((correct / sa.length) * 100) : 0,
        avgTime,
        lastActive: lastAnswer,
      };
    });
  }, [students, answers]);

  const filtered = useMemo(() => {
    let result = summaries.filter(s =>
      !search || s.name.toLowerCase().includes(search.toLowerCase())
    );

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "name": cmp = a.name.localeCompare(b.name); break;
        case "total": cmp = a.total - b.total; break;
        case "accuracy": cmp = a.accuracy - b.accuracy; break;
        case "lastActive": cmp = (a.lastActive || "").localeCompare(b.lastActive || ""); break;
      }
      return sortDir === "desc" ? -cmp : cmp;
    });

    return result;
  }, [summaries, search, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead className="cursor-pointer select-none" onClick={() => toggleSort(field)}>
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
      </div>
    </TableHead>
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="text-base">Todos os Alunos ({filtered.length})</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar aluno..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-8 text-sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">Nenhum aluno encontrado</div>
        ) : (
          <div className="overflow-auto max-h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortHeader field="name">Aluno</SortHeader>
                  <SortHeader field="total">Questões</SortHeader>
                  <TableHead className="text-center">Acertos</TableHead>
                  <SortHeader field="accuracy">Aproveitamento</SortHeader>
                  <TableHead className="text-center">Tempo médio</TableHead>
                  <SortHeader field="lastActive">Última atividade</SortHeader>
                  <TableHead className="text-center">Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(s => (
                  <TableRow key={s.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onStudentClick?.(s.id)}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="text-center">{s.total}</TableCell>
                    <TableCell className="text-center">{s.correct}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={s.accuracy >= 70 ? "default" : s.accuracy >= 50 ? "secondary" : "destructive"}>
                        {s.accuracy}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">{s.avgTime}s</TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">
                      {s.lastActive ? new Date(s.lastActive).toLocaleDateString("pt-BR") : "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => { e.stopPropagation(); onStudentClick?.(s.id); }}>
                        <Eye className="h-4 w-4" />
                      </Button>
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
