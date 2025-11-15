import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp, Target, Clock, CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format, startOfDay, endOfDay, subDays, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { subjects } from "@/data/subjects";
import { exams } from "@/data/exams";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const StudentPractice = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [period, setPeriod] = useState<string>("today");
  const [customDate, setCustomDate] = useState<Date>();
  
  // Estados para filtros de questões
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedContent, setSelectedContent] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  
  // Estados para prática de questões
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  
  const currentSubject = subjects.find(s => s.id === selectedSubject);
  const years = Array.from({ length: 26 }, (_, i) => 2026 - i);

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
  
  const { data: questions = [], isLoading: isLoadingQuestions } = useQuery({
    queryKey: ['practice-questions', selectedExam, selectedSubject, selectedContent, selectedYear, selectedDifficulty],
    queryFn: async () => {
      let query = supabase.from('questions').select('*');
      if (selectedExam) query = query.eq('exam_id', selectedExam);
      if (selectedSubject) query = query.eq('subject_id', selectedSubject);
      if (selectedContent) query = query.eq('content_id', selectedContent);
      if (selectedYear) query = query.eq('year', parseInt(selectedYear));
      if (selectedDifficulty) query = query.eq('difficulty', selectedDifficulty);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedExam && !!selectedSubject,
  });
  
  const currentQuestion = questions[currentQuestionIndex];
  
  const saveAnswerMutation = useMutation({
    mutationFn: async ({ questionId, answer, isCorrect }: { questionId: string, answer: string, isCorrect: boolean }) => {
      const { error } = await supabase.from('user_answers').insert({ user_id: user?.id!, question_id: questionId, selected_answer: answer, is_correct: isCorrect });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-performance'] });
      queryClient.invalidateQueries({ queryKey: ['study-sessions'] });
    },
  });
  
  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !currentQuestion) return;
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    saveAnswerMutation.mutate({ questionId: currentQuestion.id, answer: selectedAnswer, isCorrect });
    setShowResult(true);
    toast({ title: isCorrect ? "Resposta correta!" : "Resposta incorreta", description: isCorrect ? "Parabéns!" : "Continue praticando!" });
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
      setShowResult(false);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer("");
      setShowResult(false);
    }
  };
  
  const resetFilters = () => {
    setSelectedExam("");
    setSelectedSubject("");
    setSelectedContent("");
    setSelectedYear("");
    setSelectedDifficulty("");
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setShowResult(false);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Área do Aluno</h2>
          <p className="text-muted-foreground">Pratique questões e acompanhe seu desempenho</p>
        </div>

        <Tabs defaultValue="desempenho" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="desempenho">Desempenho</TabsTrigger>
            <TabsTrigger value="questoes">Questões</TabsTrigger>
          </TabsList>
          
          <TabsContent value="desempenho" className="space-y-6">
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
                  <p className="text-muted-foreground">Nenhuma sessão registrada.</p>
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
          </TabsContent>
          
          <TabsContent value="questoes" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Filtros de Prática</CardTitle></CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Vestibular</Label>
                    <Select value={selectedExam} onValueChange={setSelectedExam}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>{exams.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Matéria</Label>
                    <Select value={selectedSubject} onValueChange={(v) => { setSelectedSubject(v); setSelectedContent(""); }}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>{subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Conteúdo</Label>
                    <Select value={selectedContent} onValueChange={setSelectedContent} disabled={!selectedSubject}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>{currentSubject?.contents.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Ano</Label>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>{years.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Dificuldade</Label>
                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fácil">Fácil</SelectItem>
                        <SelectItem value="Médio">Médio</SelectItem>
                        <SelectItem value="Difícil">Difícil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button variant="outline" onClick={resetFilters} className="w-full">Limpar Filtros</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {!selectedExam || !selectedSubject ? (
              <Card><CardContent className="py-12 text-center"><p className="text-muted-foreground">Selecione vestibular e matéria para começar</p></CardContent></Card>
            ) : isLoadingQuestions ? (
              <Card><CardContent className="py-12 text-center"><p className="text-muted-foreground">Carregando questões...</p></CardContent></Card>
            ) : questions.length === 0 ? (
              <Card><CardContent className="py-12 text-center"><p className="text-muted-foreground">Nenhuma questão encontrada</p></CardContent></Card>
            ) : currentQuestion ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Questão {currentQuestionIndex + 1} de {questions.length}</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}><ChevronLeft className="h-4 w-4" /></Button>
                      <Button variant="outline" size="icon" onClick={handleNextQuestion} disabled={currentQuestionIndex === questions.length - 1}><ChevronRight className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: currentQuestion.statement }} />
                  
                  <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} disabled={showResult}>
                    {['A', 'B', 'C', 'D', 'E'].map((option) => {
                      const optionKey = `option_${option.toLowerCase()}` as keyof typeof currentQuestion;
                      const optionValue = currentQuestion[optionKey] as string;
                      if (!optionValue) return null;
                      
                      const isCorrect = currentQuestion.correct_answer === option;
                      const isSelected = selectedAnswer === option;
                      
                      return (
                        <div key={option} className={cn("flex items-start space-x-3 p-4 rounded-lg border-2 transition-colors", showResult && isCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20", showResult && isSelected && !isCorrect && "border-red-500 bg-red-50 dark:bg-red-950/20", !showResult && "border-border hover:border-primary/50")}>
                          <RadioGroupItem value={option} id={`option-${option}`} />
                          <Label htmlFor={`option-${option}`} className="flex-1 cursor-pointer">
                            <span className="font-medium">{option})</span> <span dangerouslySetInnerHTML={{ __html: optionValue }} />
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                  
                  {!showResult ? (
                    <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer || saveAnswerMutation.isPending} className="w-full">
                      {saveAnswerMutation.isPending ? 'Enviando...' : 'Confirmar Resposta'}
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      {currentQuestion.explanation && (
                        <div className="p-4 bg-muted rounded-lg">
                          <h4 className="font-medium mb-2">Explicação:</h4>
                          <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: currentQuestion.explanation }} />
                        </div>
                      )}
                      <Button onClick={handleNextQuestion} disabled={currentQuestionIndex === questions.length - 1} className="w-full">Próxima Questão</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : null}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default StudentPractice;
