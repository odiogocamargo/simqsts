import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileText, TrendingUp, Users as UsersIcon, Plug, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface QuestionRow {
  id: string;
  created_at: string;
  created_by: string | null;
  subject_id: string | null;
}

const Dashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: async () => {
      const [questionsRes, profilesRes, subjectsRes, consumersRes] = await Promise.all([
        supabase.from("questions").select("id, created_at, created_by, subject_id"),
        supabase.from("profiles").select("id, full_name"),
        supabase.from("subjects").select("id, name"),
        supabase.from("external_consumers").select("id, name, is_active"),
      ]);

      const questions = (questionsRes.data ?? []) as QuestionRow[];
      const profiles = profilesRes.data ?? [];
      const subjects = subjectsRes.data ?? [];
      const consumers = consumersRes.data ?? [];

      const profileMap = new Map(profiles.map((p: any) => [p.id, p.full_name || "Sem nome"]));
      const subjectMap = new Map(subjects.map((s: any) => [s.id, s.name]));

      // Por mês
      const byMonth = new Map<string, number>();
      // Por usuário
      const byUser = new Map<string, number>();
      // Por matéria
      const bySubject = new Map<string, number>();

      questions.forEach((q) => {
        const monthKey = q.created_at.slice(0, 7); // YYYY-MM
        byMonth.set(monthKey, (byMonth.get(monthKey) ?? 0) + 1);

        if (q.created_by) {
          byUser.set(q.created_by, (byUser.get(q.created_by) ?? 0) + 1);
        }
        if (q.subject_id) {
          bySubject.set(q.subject_id, (bySubject.get(q.subject_id) ?? 0) + 1);
        }
      });

      const monthly = Array.from(byMonth.entries())
        .sort((a, b) => b[0].localeCompare(a[0]))
        .slice(0, 12)
        .map(([month, count]) => ({ month, count }));

      const ranking = Array.from(byUser.entries())
        .map(([userId, count]) => ({
          userId,
          name: profileMap.get(userId) ?? "Usuário removido",
          count,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      const subjectsList = Array.from(bySubject.entries())
        .map(([subjectId, count]) => ({
          name: subjectMap.get(subjectId) ?? "Sem matéria",
          count,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

      return {
        totalQuestions: questions.length,
        totalUsers: profiles.length,
        activeConsumers: consumers.filter((c: any) => c.is_active).length,
        totalConsumers: consumers.length,
        monthly,
        ranking,
        subjectsList,
      };
    },
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Visão geral do banco de questões e integrações</p>
        </div>

        {isLoading || !data ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2"><FileText className="h-4 w-4" />Questões</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{data.totalQuestions}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2"><UsersIcon className="h-4 w-4" />Usuários internos</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{data.totalUsers}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2"><Plug className="h-4 w-4" />Integrações ativas</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{data.activeConsumers}<span className="text-base text-muted-foreground font-normal">/{data.totalConsumers}</span></p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2"><TrendingUp className="h-4 w-4" />Este mês</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{data.monthly[0]?.count ?? 0}</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Adições por mês</CardTitle>
                  <CardDescription>Últimos 12 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  {data.monthly.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Sem dados ainda.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Mês</TableHead>
                          <TableHead className="text-right">Questões adicionadas</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.monthly.map((row) => (
                          <TableRow key={row.month}>
                            <TableCell className="font-medium">
                              {format(new Date(row.month + "-01"), "MMM/yyyy", { locale: ptBR })}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge variant="secondary">{row.count}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ranking de colaboradores</CardTitle>
                  <CardDescription>Quem mais adicionou questões</CardDescription>
                </CardHeader>
                <CardContent>
                  {data.ranking.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Sem dados ainda.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>#</TableHead>
                          <TableHead>Usuário</TableHead>
                          <TableHead className="text-right">Questões</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.ranking.map((row, idx) => (
                          <TableRow key={row.userId}>
                            <TableCell className="font-medium">{idx + 1}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell className="text-right">
                              <Badge>{row.count}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top matérias</CardTitle>
                <CardDescription>Distribuição de questões por matéria</CardDescription>
              </CardHeader>
              <CardContent>
                {data.subjectsList.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Sem dados ainda.</p>
                ) : (
                  <div className="space-y-3">
                    {data.subjectsList.map((s) => {
                      const pct = data.totalQuestions > 0 ? (s.count / data.totalQuestions) * 100 : 0;
                      return (
                        <div key={s.name}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="font-medium">{s.name}</span>
                            <span className="text-muted-foreground">{s.count} ({pct.toFixed(1)}%)</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
