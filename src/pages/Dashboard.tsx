import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/MetricCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, Target, BookOpen, Award, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  // Total de questões respondidas
  const { data: answeredCount } = useQuery({
    queryKey: ["user-answered-count", user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { count, error } = await supabase
        .from("user_answers")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user,
  });

  // Acertos totais
  const { data: correctCount } = useQuery({
    queryKey: ["user-correct-count", user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { count, error } = await supabase
        .from("user_answers")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_correct", true);
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user,
  });

  // Taxa de acerto geral
  const accuracy = answeredCount && answeredCount > 0 
    ? Math.round((correctCount || 0) / answeredCount * 100) 
    : 0;

  // Desempenho por matéria
  const { data: performance } = useQuery({
    queryKey: ["user-performance", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_performance")
        .select(`
          *,
          subjects(name)
        `)
        .eq("user_id", user.id)
        .order("total_questions", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Últimas sessões de estudo
  const { data: recentSessions } = useQuery({
    queryKey: ["recent-sessions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("study_sessions")
        .select(`
          *,
          subjects(name),
          exams(name)
        `)
        .eq("user_id", user.id)
        .order("started_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const sessionsCount = recentSessions?.length || 0;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Meu Desempenho</h1>
          <p className="text-muted-foreground">Acompanhe sua evolução nos estudos</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Questões Respondidas"
            value={answeredCount?.toString() || "0"}
            icon={BookOpen}
          />
          <MetricCard
            title="Acertos"
            value={correctCount?.toString() || "0"}
            icon={Target}
            variant="success"
          />
          <MetricCard
            title="Taxa de Acerto"
            value={`${accuracy}%`}
            icon={TrendingUp}
          />
          <MetricCard
            title="Sessões de Estudo"
            value={sessionsCount.toString()}
            icon={Award}
            variant="accent"
          />
        </div>

        {/* Desempenho por Matéria */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Desempenho por Matéria</h2>
          </div>
          
          {!performance || performance.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Comece a responder questões para ver seu desempenho por matéria!
            </p>
          ) : (
            <div className="space-y-4">
              {performance.map((perf) => (
                <div key={perf.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">
                      {perf.subjects?.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {perf.correct_answers}/{perf.total_questions} ({Math.round(Number(perf.accuracy_percentage))}%)
                    </span>
                  </div>
                  <Progress value={Number(perf.accuracy_percentage)} className="h-2" />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
