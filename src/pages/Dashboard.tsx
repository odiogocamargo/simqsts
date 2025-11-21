import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/MetricCard";
import { Database, BookOpen, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  // Buscar total de questões
  const { data: totalQuestions = 0 } = useQuery({
    queryKey: ['questions-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  // Buscar total de matérias
  const { data: totalSubjects = 0 } = useQuery({
    queryKey: ['subjects-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('subjects')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  // Buscar questões adicionadas esta semana
  const { data: questionsThisWeek = 0 } = useQuery({
    queryKey: ['questions-this-week'],
    queryFn: async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());
      return count || 0;
    },
  });

  // Buscar distribuição por matéria
  const { data: subjectStats = [] } = useQuery({
    queryKey: ['subject-distribution'],
    queryFn: async () => {
      const { data: questions } = await supabase
        .from('questions')
        .select('subject_id, subjects(name)');
      
      if (!questions) return [];

      const distribution = questions.reduce((acc: any, q: any) => {
        const subjectName = q.subjects?.name || 'Desconhecida';
        acc[subjectName] = (acc[subjectName] || 0) + 1;
        return acc;
      }, {});

      const total = questions.length || 1;
      return Object.entries(distribution).map(([subject, count]: [string, any]) => ({
        subject,
        count,
        percentage: Math.round((count / total) * 100),
      })).sort((a, b) => b.count - a.count);
    },
  });

  const metrics = [
    { title: "Total de Questões", value: totalQuestions.toString(), icon: Database, variant: "default" as const },
    { title: "Matérias Cobertas", value: totalSubjects.toString(), icon: BookOpen, variant: "default" as const },
    { title: "Questões Adicionadas", value: questionsThisWeek.toString(), icon: TrendingUp, trend: "Esta semana", variant: "success" as const },
    { title: "Última Atualização", value: totalQuestions > 0 ? "Hoje" : "Nenhuma", icon: Calendar, trend: totalQuestions > 0 ? "Recente" : "Adicione questões", variant: "accent" as const },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
          <p className="text-muted-foreground">Visão geral da saúde do seu banco de questões</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Matéria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjectStats.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">
                      Nenhuma questão cadastrada ainda.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Adicione questões para ver a distribuição por matéria.
                    </p>
                  </div>
                ) : (
                  subjectStats.map((stat) => (
                    <div key={stat.subject} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{stat.subject}</span>
                        <span className="text-muted-foreground">{stat.count} questões</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all"
                          style={{ width: `${stat.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 pb-4 border-b">
                  <div className="h-2 w-2 rounded-full bg-success mt-2" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-foreground">Banco de Dados Conectado</p>
                    <p className="text-xs text-muted-foreground">
                      Sistema pronto para receber questões
                    </p>
                  </div>
                </div>
                {totalQuestions === 0 ? (
                  <div className="flex items-start gap-3 pb-4 border-b">
                    <div className="h-2 w-2 rounded-full bg-accent mt-2" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-foreground">Nenhuma questão cadastrada</p>
                      <p className="text-xs text-muted-foreground">
                        Comece adicionando suas primeiras questões
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 pb-4 border-b">
                    <div className="h-2 w-2 rounded-full bg-success mt-2" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-foreground">{totalQuestions} questões no banco</p>
                      <p className="text-xs text-muted-foreground">
                        Distribuídas em {totalSubjects} matérias
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-foreground">Sistema de Autenticação</p>
                    <p className="text-xs text-muted-foreground">
                      Aguardando implementação
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
