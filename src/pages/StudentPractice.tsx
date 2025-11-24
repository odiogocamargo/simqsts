import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp, Target, Clock, CalendarIcon, AlertTriangle, Zap, Activity } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";

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
        .limit(10);
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: userAnswers = [] } = useQuery({
    queryKey: ['user-answers', user?.id, startDate, endDate],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data } = await supabase
        .from('user_answers')
        .select('*, questions(subject_id, content_id, exam_id, difficulty, topics:question_topics(topic_id))')
        .eq('user_id', user.id)
        .gte('answered_at', startDate)
        .lte('answered_at', endDate);
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data } = await supabase.from('subjects').select('*');
      return data || [];
    },
  });

  const { data: contents = [] } = useQuery({
    queryKey: ['contents'],
    queryFn: async () => {
      const { data } = await supabase.from('contents').select('*, subjects(name)');
      return data || [];
    },
  });

  const { data: topics = [] } = useQuery({
    queryKey: ['topics'],
    queryFn: async () => {
      const { data } = await supabase.from('topics').select('*, contents(name, subject_id)');
      return data || [];
    },
  });

  const { data: exams = [] } = useQuery({
    queryKey: ['exams'],
    queryFn: async () => {
      const { data } = await supabase.from('exams').select('*');
      return data || [];
    },
  });

  const totalQuestions = userAnswers.length;
  const totalCorrect = userAnswers.filter(a => a.is_correct).length;
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const totalSessions = studySessions.length;
  const avgTime = userAnswers.length > 0 
    ? Math.round(userAnswers.reduce((acc, a) => acc + (a.time_spent_seconds || 0), 0) / userAnswers.length)
    : 0;

  // Performance por matéria
  const performanceBySubject = subjects.map(subject => {
    const subjectAnswers = userAnswers.filter(a => a.questions?.subject_id === subject.id);
    const correct = subjectAnswers.filter(a => a.is_correct).length;
    return {
      name: subject.name,
      total: subjectAnswers.length,
      correct,
      accuracy: subjectAnswers.length > 0 ? Math.round((correct / subjectAnswers.length) * 100) : 0
    };
  }).filter(s => s.total > 0);

  // Performance por conteúdo
  const performanceByContent = contents.map(content => {
    const contentAnswers = userAnswers.filter(a => a.questions?.content_id === content.id);
    const correct = contentAnswers.filter(a => a.is_correct).length;
    return {
      name: content.name,
      subject: content.subjects?.name,
      total: contentAnswers.length,
      correct,
      accuracy: contentAnswers.length > 0 ? Math.round((correct / contentAnswers.length) * 100) : 0
    };
  }).filter(c => c.total > 0).sort((a, b) => a.accuracy - b.accuracy);

  // Performance por tópico
  const performanceByTopic = topics.map(topic => {
    const topicAnswers = userAnswers.filter(a => 
      a.questions?.topics?.some((t: any) => t.topic_id === topic.id)
    );
    const correct = topicAnswers.filter(a => a.is_correct).length;
    return {
      id: topic.id,
      name: topic.name,
      content: topic.contents?.name,
      total: topicAnswers.length,
      correct,
      accuracy: topicAnswers.length > 0 ? Math.round((correct / topicAnswers.length) * 100) : 0
    };
  }).filter(t => t.total > 0).sort((a, b) => a.accuracy - b.accuracy);

  // Tópicos críticos (abaixo de 50%)
  const criticalTopics = performanceByTopic.filter(t => t.accuracy < 50).slice(0, 5);

  // Performance por vestibular
  const performanceByExam = exams.map(exam => {
    const examAnswers = userAnswers.filter(a => a.questions?.exam_id === exam.id);
    const correct = examAnswers.filter(a => a.is_correct).length;
    return {
      name: exam.name,
      total: examAnswers.length,
      correct,
      accuracy: examAnswers.length > 0 ? Math.round((correct / examAnswers.length) * 100) : 0
    };
  }).filter(e => e.total > 0);

  // Evolução diária
  const dailyEvolution = studySessions.slice(0, 7).reverse().map(session => ({
    date: format(new Date(session.started_at), "dd/MM", { locale: ptBR }),
    accuracy: session.questions_answered > 0 
      ? Math.round((session.correct_answers / session.questions_answered) * 100)
      : 0,
    questions: session.questions_answered
  }));

  const metrics = [
    { title: "Taxa de Acerto Geral", value: `${accuracy}%`, icon: Target, variant: accuracy >= 70 ? "success" as const : "default" as const, trend: accuracy >= 70 ? "Excelente!" : "Continue praticando" },
    { title: "Questões Respondidas", value: totalQuestions.toString(), icon: BookOpen, variant: "default" as const },
    { title: "Tempo Médio", value: `${avgTime}s`, icon: Clock, variant: "default" as const },
    { title: "Sessões de Estudo", value: totalSessions.toString(), icon: Activity, variant: "default" as const }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Meu Desempenho</h2>
          <p className="text-muted-foreground">Análise completa do seu progresso e evolução nos estudos</p>
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

        {criticalTopics.length > 0 && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Tópicos Críticos - Atenção Urgente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {criticalTopics.map((topic) => (
                  <div key={topic.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                    <div className="flex-1">
                      <p className="font-medium">{topic.name}</p>
                      <p className="text-sm text-muted-foreground">{topic.content}</p>
                    </div>
                    <Badge variant="destructive">{topic.accuracy}% de acerto</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="evolution" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="evolution">Evolução</TabsTrigger>
            <TabsTrigger value="subjects">Por Matéria</TabsTrigger>
            <TabsTrigger value="contents">Por Conteúdo</TabsTrigger>
            <TabsTrigger value="topics">Por Tópico</TabsTrigger>
            <TabsTrigger value="exams">Por Vestibular</TabsTrigger>
          </TabsList>

          <TabsContent value="evolution" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Evolução Diária do Desempenho</CardTitle>
              </CardHeader>
              <CardContent>
                {dailyEvolution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dailyEvolution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="accuracy" stroke="hsl(var(--primary))" name="Taxa de Acerto (%)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-muted-foreground text-center py-8">Sem dados suficientes para gráfico de evolução</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Histórico dos Últimos Blocos Resolvidos</CardTitle></CardHeader>
              <CardContent>
                {studySessions.length === 0 ? (
                  <p className="text-muted-foreground">Nenhuma sessão registrada no período selecionado.</p>
                ) : (
                  <div className="space-y-3">
                    {studySessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex-1">
                          <p className="font-medium">{format(new Date(session.started_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
                          <p className="text-sm text-muted-foreground">{session.questions_answered} questões • {session.correct_answers} acertos • {session.duration_minutes || 0} min</p>
                        </div>
                        <Badge variant={session.questions_answered > 0 && (session.correct_answers / session.questions_answered) >= 0.7 ? "default" : "secondary"}>
                          {session.questions_answered > 0 ? ((session.correct_answers / session.questions_answered) * 100).toFixed(0) : 0}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects">
            <Card>
              <CardHeader>
                <CardTitle>Desempenho por Matéria</CardTitle>
              </CardHeader>
              <CardContent>
                {performanceBySubject.length > 0 ? (
                  <div className="space-y-4">
                    {performanceBySubject.map((subject) => (
                      <div key={subject.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{subject.name}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">{subject.correct}/{subject.total} acertos</span>
                            <Badge variant={subject.accuracy >= 70 ? "default" : subject.accuracy >= 50 ? "secondary" : "destructive"}>
                              {subject.accuracy}%
                            </Badge>
                          </div>
                        </div>
                        <Progress value={subject.accuracy} className="h-2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">Nenhuma questão respondida no período</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contents">
            <Card>
              <CardHeader>
                <CardTitle>Mapa de Calor - Desempenho por Conteúdo</CardTitle>
              </CardHeader>
              <CardContent>
                {performanceByContent.length > 0 ? (
                  <div className="space-y-3">
                    {performanceByContent.map((content) => (
                      <div 
                        key={content.name} 
                        className={cn(
                          "p-4 rounded-lg border",
                          content.accuracy >= 70 && "bg-green-500/10 border-green-500/30",
                          content.accuracy >= 50 && content.accuracy < 70 && "bg-yellow-500/10 border-yellow-500/30",
                          content.accuracy < 50 && "bg-red-500/10 border-red-500/30"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium">{content.name}</p>
                            <p className="text-sm text-muted-foreground">{content.subject}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">{content.correct}/{content.total}</span>
                            <Badge variant={content.accuracy >= 70 ? "default" : content.accuracy >= 50 ? "secondary" : "destructive"}>
                              {content.accuracy}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">Nenhuma questão respondida no período</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="topics">
            <Card>
              <CardHeader>
                <CardTitle>Desempenho por Tópico Específico</CardTitle>
              </CardHeader>
              <CardContent>
                {performanceByTopic.length > 0 ? (
                  <div className="space-y-3">
                    {performanceByTopic.map((topic) => (
                      <div 
                        key={topic.id}
                        className={cn(
                          "p-4 rounded-lg border",
                          topic.accuracy >= 70 && "bg-green-500/10 border-green-500/30",
                          topic.accuracy >= 50 && topic.accuracy < 70 && "bg-yellow-500/10 border-yellow-500/30",
                          topic.accuracy < 50 && "bg-red-500/10 border-red-500/30"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium">{topic.name}</p>
                            <p className="text-sm text-muted-foreground">{topic.content}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">{topic.correct}/{topic.total}</span>
                            <Badge variant={topic.accuracy >= 70 ? "default" : topic.accuracy >= 50 ? "secondary" : "destructive"}>
                              {topic.accuracy}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">Nenhuma questão respondida no período</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exams">
            <Card>
              <CardHeader>
                <CardTitle>Desempenho por Vestibular</CardTitle>
              </CardHeader>
              <CardContent>
                {performanceByExam.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={performanceByExam}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="accuracy" fill="hsl(var(--primary))" name="Taxa de Acerto (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-muted-foreground text-center py-8">Nenhuma questão respondida no período</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default StudentPractice;
