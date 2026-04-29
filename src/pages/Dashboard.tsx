import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/MetricCard";
import { Database, BookOpen, TrendingUp, Calendar, Crown, CreditCard, CheckCircle, Clock, GraduationCap, Trophy, CalendarDays } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { format, subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const { subscription, subscriptionLoading, createCheckout, openCustomerPortal, checkSubscription } = useAuth();
  const { isAdmin, isProfessor } = useUserRole();
  const [searchParams, setSearchParams] = useSearchParams();
  const [questionsPeriod, setQuestionsPeriod] = useState<string>("all");
  const [questionsDateRange, setQuestionsDateRange] = useState<DateRange | undefined>();
  const [evolutionPeriod, setEvolutionPeriod] = useState<string>("30days");

  // Handle subscription success/cancel from Stripe redirect
  useEffect(() => {
    const subscriptionStatus = searchParams.get('subscription');
    if (subscriptionStatus === 'success') {
      toast.success('Assinatura realizada com sucesso! Bem-vindo ao SIM Questões.');
      checkSubscription();
      setSearchParams({});
    } else if (subscriptionStatus === 'canceled') {
      toast.info('Processo de assinatura cancelado.');
      setSearchParams({});
    }
  }, [searchParams, setSearchParams, checkSubscription]);

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
      const { data: subjects, error: subjectsError } = await supabase
        .from('subjects')
        .select('id, name')
        .order('name');

      if (subjectsError) throw subjectsError;

      const questions: { subject_id: string }[] = [];
      const pageSize = 1000;
      let from = 0;

      while (true) {
        const { data, error } = await supabase
          .from('questions')
          .select('subject_id')
          .range(from, from + pageSize - 1);

        if (error) throw error;

        const page = data || [];
        questions.push(...page);

        if (page.length < pageSize) break;
        from += pageSize;
      }

      const distribution = questions.reduce<Record<string, number>>((acc, q) => {
        acc[q.subject_id] = (acc[q.subject_id] || 0) + 1;
        return acc;
      }, {});

      const total = questions.length;
      return (subjects || []).map((subject) => {
        const count = distribution[subject.id] || 0;
        return {
          subject: subject.name,
          count,
          percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        };
      }).sort((a, b) => b.count - a.count || a.subject.localeCompare(b.subject, 'pt-BR'));
    },
  });

  // Buscar distribuição por vestibular (apenas para admin/professor)
  const { data: examStats = [] } = useQuery({
    queryKey: ['exam-distribution'],
    enabled: isAdmin || isProfessor,
    queryFn: async () => {
      const { data: exams, error: examsError } = await supabase
        .from('exams')
        .select('id, name')
        .order('name');

      if (examsError) throw examsError;

      const questions: { exam_id: string }[] = [];
      const pageSize = 1000;
      let from = 0;

      while (true) {
        const { data, error } = await supabase
          .from('questions')
          .select('exam_id')
          .range(from, from + pageSize - 1);

        if (error) throw error;

        const page = data || [];
        questions.push(...page);

        if (page.length < pageSize) break;
        from += pageSize;
      }

      const distribution = questions.reduce<Record<string, number>>((acc, q) => {
        acc[q.exam_id] = (acc[q.exam_id] || 0) + 1;
        return acc;
      }, {});

      const total = questions.length;
      return (exams || []).map((exam) => {
        const count = distribution[exam.id] || 0;
        return {
          exam: exam.name,
          count,
          percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        };
      }).sort((a, b) => b.count - a.count || a.exam.localeCompare(b.exam, 'pt-BR'));
    },
  });

  const getQuestionsPeriodDates = useMemo(() => {
    const now = new Date();
    switch (questionsPeriod) {
      case "today":
        return { start: startOfDay(now), end: endOfDay(now) };
      case "yesterday": {
        const yesterday = subDays(now, 1);
        return { start: startOfDay(yesterday), end: endOfDay(yesterday) };
      }
      case "week":
        return { start: startOfWeek(now, { locale: ptBR }), end: endOfWeek(now, { locale: ptBR }) };
      case "month":
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case "custom":
        if (questionsDateRange?.from) {
          return {
            start: startOfDay(questionsDateRange.from),
            end: questionsDateRange.to ? endOfDay(questionsDateRange.to) : endOfDay(questionsDateRange.from),
          };
        }
        return null;
      default:
        return null;
    }
  }, [questionsPeriod, questionsDateRange]);

  const { data: professorQuestionCounts } = useQuery({
    queryKey: ["dashboard-professor-question-counts", questionsPeriod, questionsDateRange?.from?.toISOString(), questionsDateRange?.to?.toISOString()],
    enabled: isAdmin || isProfessor,
    queryFn: async () => {
      const { data: staffRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role")
        .in("role", ["professor", "admin"]);

      if (rolesError) throw rolesError;

      const staffIds = staffRoles?.map((r) => r.user_id) || [];
      const roleMap = new Map(staffRoles?.map((r) => [r.user_id, r.role]) || []);

      if (staffIds.length === 0) return { data: [], periodLabel: "" };

      let query = supabase
        .from("questions")
        .select("created_by, created_at")
        .in("created_by", staffIds);

      const periodDates = getQuestionsPeriodDates;
      if (periodDates) {
        query = query
          .gte("created_at", periodDates.start.toISOString())
          .lte("created_at", periodDates.end.toISOString());
      }

      const { data: questions, error: questionsError } = await query;
      if (questionsError) throw questionsError;

      const countMap = new Map<string, number>();
      questions?.forEach((q) => countMap.set(q.created_by, (countMap.get(q.created_by) || 0) + 1));

      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", staffIds);

      if (profilesError) throw profilesError;

      let periodLabel = "Todo o período";
      if (periodDates) {
        if (questionsPeriod === "today") periodLabel = "Hoje";
        else if (questionsPeriod === "yesterday") periodLabel = "Ontem";
        else if (questionsPeriod === "week") periodLabel = "Esta semana";
        else if (questionsPeriod === "month") periodLabel = "Este mês";
        else if (questionsPeriod === "custom") {
          periodLabel = questionsDateRange?.to
            ? `${format(periodDates.start, "dd/MM/yyyy")} - ${format(periodDates.end, "dd/MM/yyyy")}`
            : format(periodDates.start, "dd/MM/yyyy");
        }
      }

      return {
        data: staffIds.map((id) => {
          const profile = profiles?.find((p) => p.id === id);
          return {
            userId: id,
            name: profile?.full_name || "Sem nome",
            role: roleMap.get(id) || "professor",
            questionCount: countMap.get(id) || 0,
          };
        }).sort((a, b) => b.questionCount - a.questionCount),
        periodLabel,
      };
    },
  });

  const metrics = [
    { title: "Total de Questões", value: totalQuestions.toString(), icon: Database, variant: "default" as const },
    { title: "Matérias Cobertas", value: totalSubjects.toString(), icon: BookOpen, variant: "default" as const },
    { title: "Questões Adicionadas", value: questionsThisWeek.toString(), icon: TrendingUp, trend: "Esta semana", variant: "success" as const },
    { title: "Última Atualização", value: totalQuestions > 0 ? "Hoje" : "Nenhuma", icon: Calendar, trend: totalQuestions > 0 ? "Recente" : "Adicione questões", variant: "accent" as const },
  ];

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Trial Banner - destacado no topo (apenas para alunos) */}
        {subscription.isInTrial && !isAdmin && !isProfessor && (
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 text-white shadow-lg">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <Clock className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Período de Teste Gratuito</h3>
                  <p className="text-white/90">
                    {subscription.trialDaysRemaining === 1 
                      ? "Seu teste expira amanhã! Não perca o acesso." 
                      : subscription.trialDaysRemaining === 0
                      ? "Seu teste expira hoje!"
                      : `Restam ${subscription.trialDaysRemaining} dias do seu período de teste.`}
                  </p>
                </div>
              </div>
              <Button
                onClick={createCheckout}
                disabled={subscriptionLoading}
                size="lg"
                className="bg-white text-orange-600 hover:bg-white/90 font-semibold shadow-md"
              >
                <Crown className="h-5 w-5 mr-2" />
                Assinar Agora - R$ 37,90/mês
              </Button>
            </div>
          </div>
        )}

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
          {/* Distribuição por Vestibular - apenas para admin/professor */}
          {(isAdmin || isProfessor) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Questões por Vestibular
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {examStats.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">
                        Nenhuma questão cadastrada ainda.
                      </p>
                    </div>
                  ) : (
                    examStats.map((stat) => (
                      <div key={stat.exam} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-foreground">{stat.exam}</span>
                          <span className="text-muted-foreground">{stat.count} questões</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full transition-all"
                            style={{ width: `${stat.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Subscription Status Card - apenas para alunos */}
          {!isAdmin && !isProfessor && (
            <Card className={subscription.subscribed ? "border-primary/50" : subscription.isInTrial ? "border-amber-500/50" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-primary" />
                  Status da Assinatura
                </CardTitle>
              </CardHeader>
              <CardContent>
                {subscriptionLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                ) : subscription.subscribed ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">Assinatura Ativa</span>
                          <Badge variant="secondary" className="bg-primary/10 text-primary">Premium</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Válida até {formatDate(subscription.subscriptionEnd)}
                        </p>
                      </div>
                    </div>
                    {subscription.productId !== 'school_access' && subscription.productId !== 'admin_access' && (
                      <Button
                        variant="outline"
                        onClick={openCustomerPortal}
                        disabled={subscriptionLoading}
                        className="w-full gap-2"
                      >
                        <CreditCard className="h-4 w-4" />
                        Gerenciar Assinatura
                      </Button>
                    )}
                  </div>
                ) : subscription.isInTrial ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">Período de Teste</span>
                          <Badge variant="secondary" className="bg-amber-500/10 text-amber-600">Trial</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {subscription.trialDaysRemaining === 1 
                            ? "Expira amanhã" 
                            : `${subscription.trialDaysRemaining} dias restantes`}
                        </p>
                      </div>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                      <p className="text-sm text-amber-700 dark:text-amber-400">
                        Você tem acesso gratuito por 2 dias. Assine agora para não perder o acesso!
                      </p>
                    </div>
                    <Button
                      onClick={createCheckout}
                      disabled={subscriptionLoading}
                      className="w-full gap-2"
                    >
                      <Crown className="h-4 w-4" />
                      Assinar por R$ 37,90/mês
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center py-4">
                      <Crown className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                      <h4 className="font-semibold text-foreground mb-1">Seu período de teste expirou</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Assine para ter acesso completo ao banco de questões e todas as funcionalidades.
                      </p>
                    </div>
                    <Button
                      onClick={createCheckout}
                      disabled={subscriptionLoading}
                      className="w-full gap-2"
                    >
                      <Crown className="h-4 w-4" />
                      Assinar por R$ 37,90/mês
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

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
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Status do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-foreground">Banco de Dados</p>
                  <p className="text-xs text-muted-foreground">Conectado e funcionando</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-foreground">Autenticação</p>
                  <p className="text-xs text-muted-foreground">Sistema ativo</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-foreground">Pagamentos (Stripe)</p>
                  <p className="text-xs text-muted-foreground">Integração ativa</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
