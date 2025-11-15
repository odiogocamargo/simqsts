import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp, Target, Clock, CalendarIcon } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format, startOfDay, endOfDay, subDays, startOfWeek, endOfWeek } from "date-fns";
import { cn } from "@/lib/utils";

const StudentPractice = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState<string>("today");
  const [customDate, setCustomDate] = useState<Date>();

  // Calcular datas de início e fim baseado no período selecionado
  const getDateRange = () => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = endOfDay(now);

    switch (period) {
      case "today":
        startDate = startOfDay(now);
        break;
      case "yesterday":
        startDate = startOfDay(subDays(now, 1));
        endDate = endOfDay(subDays(now, 1));
        break;
      case "week":
        startDate = startOfWeek(now, { weekStartsOn: 0 });
        endDate = endOfWeek(now, { weekStartsOn: 0 });
        break;
      case "custom":
        if (!customDate) return { startDate: startOfDay(now), endDate };
        startDate = startOfDay(customDate);
        endDate = endOfDay(customDate);
        break;
      default:
        startDate = startOfDay(now);
    }

    return { startDate: startDate.toISOString(), endDate: endDate.toISOString() };
  };

  const { startDate, endDate } = getDateRange();

  // Buscar desempenho do usuário
  const { data: performance = [] } = useQuery({
    queryKey: ['user-performance', user?.id, startDate, endDate],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data } = await supabase
        .from('user_performance')
        .select('*, subjects(name)')
        .eq('user_id', user.id)
        .gte('last_practice_at', startDate)
        .lte('last_practice_at', endDate);
      
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Buscar sessões de estudo
  const { data: studySessions = [] } = useQuery({
    queryKey: ['study-sessions', user?.id, startDate, endDate],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('started_at', startDate)
        .lte('started_at', endDate)
        .order('started_at', { ascending: false })
        .limit(5);
      
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Calcular métricas
  const totalQuestions = performance.reduce((acc, p) => acc + p.total_questions, 0);
  const totalCorrect = performance.reduce((acc, p) => acc + p.correct_answers, 0);
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const totalSessions = studySessions.length;

  const metrics = [
    { 
      title: "Questões Respondidas", 
      value: totalQuestions.toString(), 
      icon: BookOpen, 
      variant: "default" as const 
    },
    { 
      title: "Taxa de Acerto", 
      value: `${accuracy}%`, 
      icon: Target, 
      variant: "success" as const,
      trend: accuracy >= 70 ? "Excelente!" : "Continue praticando"
    },
    { 
      title: "Respostas Corretas", 
      value: totalCorrect.toString(), 
      icon: TrendingUp, 
      variant: "accent" as const 
    },
    { 
      title: "Sessões de Estudo", 
      value: totalSessions.toString(), 
      icon: Clock, 
      variant: "default" as const 
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Meu Desempenho</h2>
            <p className="text-muted-foreground">Acompanhe seu progresso e continue evoluindo</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="yesterday">Ontem</SelectItem>
                <SelectItem value="week">Esta Semana</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>

            {period === "custom" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[200px] justify-start text-left font-normal",
                      !customDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {customDate ? format(customDate, "PPP") : <span>Escolha uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={customDate}
                    onSelect={setCustomDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Desempenho por Matéria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performance.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">
                      Você ainda não respondeu nenhuma questão.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Comece a praticar para ver seu desempenho!
                    </p>
                  </div>
                ) : (
                  performance.map((perf) => (
                    <div key={perf.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">
                          {perf.subjects?.name || 'Matéria desconhecida'}
                        </span>
                        <span className="text-muted-foreground">
                          {perf.accuracy_percentage}% de acerto
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                          style={{ width: `${perf.accuracy_percentage || 0}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{perf.correct_answers} acertos</span>
                        <span>{perf.total_questions} questões</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Começar Prática</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Escolha uma matéria para começar a praticar:
                </p>
                <div className="space-y-2">
                  <Button className="w-full justify-start" variant="outline">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Matemática
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Português
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Física
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Química
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {studySessions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Sessões</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {studySessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {session.questions_answered} questões respondidas
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.started_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary">
                        {session.questions_answered > 0 
                          ? Math.round((session.correct_answers / session.questions_answered) * 100)
                          : 0}% acerto
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.duration_minutes || 0} min
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default StudentPractice;
