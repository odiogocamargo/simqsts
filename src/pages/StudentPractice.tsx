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
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const StudentPractice = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState<string>("today");
  const [customDate, setCustomDate] = useState<Date>();

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

  const totalQuestions = performance.reduce((acc, p) => acc + p.total_questions, 0);
  const totalCorrect = performance.reduce((acc, p) => acc + p.correct_answers, 0);
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const totalSessions = studySessions.length;

  const metrics = [
    { title: "Questões Respondidas", value: totalQuestions.toString(), icon: BookOpen, variant: "default" as const },
    { title: "Taxa de Acerto", value: `${accuracy}%`, icon: Target, variant: "success" as const, trend: accuracy >= 70 ? "Excelente!" : "Continue praticando" },
    { title: "Respostas Corretas", value: totalCorrect.toString(), icon: TrendingUp, variant: "default" as const },
    { title: "Sessões de Estudo", value: totalSessions.toString(), icon: Clock, variant: "default" as const }
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Meu Desempenho</h2>
          <p className="text-muted-foreground">Acompanhe seu progresso e evolução nos estudos</p>
        </div>

        <Card>
          <CardHeader><CardTitle>Período de Análise</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Selecione o período</Label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="yesterday">Ontem</SelectItem>
                    <SelectItem value="week">Esta Semana</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {period === 'custom' && (
                <div className="space-y-2">
                  <Label>Selecione a data</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left", !customDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customDate ? format(customDate, "PPP", { locale: ptBR }) : "Escolha uma data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={customDate} onSelect={setCustomDate} locale={ptBR} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => <MetricCard key={index} {...metric} />)}
        </div>

        <Card>
          <CardHeader><CardTitle>Histórico de Sessões</CardTitle></CardHeader>
          <CardContent>
            {studySessions.length === 0 ? (
              <p className="text-muted-foreground">Nenhuma sessão registrada no período selecionado.</p>
            ) : (
              <div className="space-y-4">
                {studySessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{format(new Date(session.started_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
                      <p className="text-sm text-muted-foreground">{session.questions_answered} questões • {session.correct_answers} acertos</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-primary">{session.questions_answered > 0 ? ((session.correct_answers / session.questions_answered) * 100).toFixed(0) : 0}%</p>
                      <p className="text-sm text-muted-foreground">{session.duration_minutes || 0} min</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default StudentPractice;
