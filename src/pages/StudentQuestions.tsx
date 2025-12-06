import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useSubjects, useContents, useTopics, useExams } from "@/hooks/useSubjects";
import { Badge } from "@/components/ui/badge";
import { Paywall, TrialBanner } from "@/components/Paywall";

const StudentQuestions = () => {
  const { user, subscription } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedContent, setSelectedContent] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  
  const { data: subjects = [] } = useSubjects();
  const { data: contents = [] } = useContents(selectedSubject);
  const { data: topics = [] } = useTopics(selectedContent);
  const { data: exams = [] } = useExams();
  const years = Array.from({ length: 26 }, (_, i) => 2026 - i);
  
  // Buscar todos os conteúdos e tópicos para exibição (não apenas os filtrados)
  const { data: allContents = [] } = useQuery({
    queryKey: ['all-contents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contents')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });
  
  const { data: allTopics = [] } = useQuery({
    queryKey: ['all-topics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });
  
  // Timer para contar tempo de resposta
  useEffect(() => {
    if (showResult) return;
    
    setStartTime(Date.now());
    setElapsedTime(0);
    
    const interval = setInterval(() => {
      setElapsedTime((Date.now() - startTime) / 1000);
    }, 100);
    
    return () => clearInterval(interval);
  }, [currentQuestionIndex, showResult]);
  
  // Formatar tempo em MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const { data: questions = [], isLoading: isLoadingQuestions } = useQuery({
    queryKey: ['practice-questions', selectedExam, selectedSubject, selectedContent, selectedTopic, selectedYear, selectedDifficulty],
    queryFn: async () => {
      if (selectedTopic) {
        // Se tópico está selecionado, buscar questões através da tabela question_topics
        const { data: questionTopics, error: qtError } = await supabase
          .from('question_topics')
          .select('question_id')
          .eq('topic_id', selectedTopic);
        
        if (qtError) throw qtError;
        const questionIds = questionTopics?.map(qt => qt.question_id) || [];
        
        if (questionIds.length === 0) return [];
        
        let query = supabase.from('questions').select('*').in('id', questionIds);
        if (selectedExam) query = query.eq('exam_id', selectedExam);
        if (selectedSubject) query = query.eq('subject_id', selectedSubject);
        if (selectedContent) query = query.eq('content_id', selectedContent);
        if (selectedYear) query = query.eq('year', parseInt(selectedYear));
        if (selectedDifficulty) query = query.eq('difficulty', selectedDifficulty);
        const { data, error } = await query;
        if (error) throw error;
        return data || [];
      } else {
        let query = supabase.from('questions').select('*');
        if (selectedExam) query = query.eq('exam_id', selectedExam);
        if (selectedSubject) query = query.eq('subject_id', selectedSubject);
        if (selectedContent) query = query.eq('content_id', selectedContent);
        if (selectedYear) query = query.eq('year', parseInt(selectedYear));
        if (selectedDifficulty) query = query.eq('difficulty', selectedDifficulty);
        const { data, error } = await query;
        if (error) throw error;
        return data || [];
      }
    },
    enabled: !!selectedExam && !!selectedSubject,
  });
  
  const currentQuestion = questions[currentQuestionIndex];
  
  const { data: currentQuestionImages = [] } = useQuery({
    queryKey: ['question-images', currentQuestion?.id],
    queryFn: async () => {
      if (!currentQuestion?.id) return [];
      const { data, error } = await supabase
        .from('question_images')
        .select('*')
        .eq('question_id', currentQuestion.id)
        .order('display_order');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentQuestion?.id,
  });
  
  const { data: currentQuestionTopics = [] } = useQuery({
    queryKey: ['current-question-topics', currentQuestion?.id],
    queryFn: async () => {
      if (!currentQuestion?.id) return [];
      const { data, error } = await supabase
        .from('question_topics')
        .select('topic_id')
        .eq('question_id', currentQuestion.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentQuestion?.id,
  });
  
  const saveAnswerMutation = useMutation({
    mutationFn: async ({ questionId, answer, isCorrect, timeSpent }: { questionId: string, answer: string, isCorrect: boolean, timeSpent: number }) => {
      if (!user?.id || !currentQuestion) return;

      // 1. Salvar resposta do usuário com tempo gasto
      const { error: answerError } = await supabase.from('user_answers').insert({
        user_id: user.id,
        question_id: questionId,
        selected_answer: answer,
        is_correct: isCorrect,
        time_spent_seconds: timeSpent,
      });
      if (answerError) throw answerError;

      // 2. Atualizar ou criar registro de performance
      const { data: existingPerformance } = await supabase
        .from('user_performance')
        .select('*')
        .eq('user_id', user.id)
        .eq('subject_id', currentQuestion.subject_id)
        .single();

      if (existingPerformance) {
        // Atualizar performance existente
        const newTotalQuestions = existingPerformance.total_questions + 1;
        const newCorrectAnswers = existingPerformance.correct_answers + (isCorrect ? 1 : 0);
        const newWrongAnswers = existingPerformance.wrong_answers + (isCorrect ? 0 : 1);
        const newAccuracy = (newCorrectAnswers / newTotalQuestions) * 100;

        const { error: updateError } = await supabase
          .from('user_performance')
          .update({
            total_questions: newTotalQuestions,
            correct_answers: newCorrectAnswers,
            wrong_answers: newWrongAnswers,
            accuracy_percentage: newAccuracy,
            last_practice_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingPerformance.id);
        
        if (updateError) throw updateError;
      } else {
        // Criar novo registro de performance
        const { error: insertError } = await supabase
          .from('user_performance')
          .insert({
            user_id: user.id,
            subject_id: currentQuestion.subject_id,
            total_questions: 1,
            correct_answers: isCorrect ? 1 : 0,
            wrong_answers: isCorrect ? 0 : 1,
            accuracy_percentage: isCorrect ? 100 : 0,
            last_practice_at: new Date().toISOString(),
          });
        
        if (insertError) throw insertError;
      }

      // 3. Atualizar ou criar sessão de estudo
      if (sessionId) {
        // Atualizar sessão existente
        const { data: session } = await supabase
          .from('study_sessions')
          .select('*')
          .eq('id', sessionId)
          .single();

        if (session) {
          const { error: sessionError } = await supabase
            .from('study_sessions')
            .update({
              questions_answered: session.questions_answered + 1,
              correct_answers: session.correct_answers + (isCorrect ? 1 : 0),
              ended_at: new Date().toISOString(),
            })
            .eq('id', sessionId);
          
          if (sessionError) throw sessionError;
        }
      } else {
        // Criar nova sessão
        const { data: newSession, error: sessionError } = await supabase
          .from('study_sessions')
          .insert({
            user_id: user.id,
            exam_id: currentQuestion.exam_id,
            subject_id: currentQuestion.subject_id,
            questions_answered: 1,
            correct_answers: isCorrect ? 1 : 0,
            started_at: new Date().toISOString(),
          })
          .select()
          .single();
        
        if (sessionError) throw sessionError;
        if (newSession) setSessionId(newSession.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-performance'] });
      queryClient.invalidateQueries({ queryKey: ['study-sessions'] });
    },
  });
  
  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !currentQuestion) return;
    const isCorrect = selectedAnswer.toLowerCase() === currentQuestion.correct_answer?.toLowerCase();
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    saveAnswerMutation.mutate({ questionId: currentQuestion.id, answer: selectedAnswer, isCorrect, timeSpent });
    setShowResult(true);
    toast({
      title: isCorrect ? "Resposta correta!" : "Resposta incorreta",
      description: isCorrect ? "Parabéns!" : "Continue praticando!",
    });
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
    setSelectedTopic("");
    setSelectedYear("");
    setSelectedDifficulty("");
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setShowResult(false);
    setSessionId(null);
  };

  // Check if user has access
  if (!subscription.hasAccess) {
    return (
      <Layout>
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Prática de Questões</h2>
            <p className="text-muted-foreground">Selecione os filtros e pratique as questões</p>
          </div>
          <Paywall 
            title="Acesso às Questões Bloqueado" 
            description="Seu período de teste expirou. Assine para continuar praticando e melhorar seu desempenho."
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Prática de Questões</h2>
          <p className="text-muted-foreground">Selecione os filtros e pratique as questões</p>
        </div>

        <TrialBanner />

        <Card>
          <CardHeader><CardTitle>Filtros de Prática</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label>Vestibular</Label>
                <Select value={selectedExam} onValueChange={setSelectedExam}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{exams.map(exam => <SelectItem key={exam.id} value={exam.id}>{exam.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Matéria</Label>
                <Select value={selectedSubject} onValueChange={(v) => { setSelectedSubject(v); setSelectedContent(""); setSelectedTopic(""); }}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Conteúdo</Label>
                <Select value={selectedContent} onValueChange={(v) => { setSelectedContent(v); setSelectedTopic(""); }} disabled={!selectedSubject}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{contents.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tópico</Label>
                <Select value={selectedTopic} onValueChange={setSelectedTopic} disabled={!selectedContent}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{topics.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
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
              {/* Informações da Questão e Contador */}
              <div className="flex flex-wrap items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                <Badge variant="outline" className="gap-1.5">
                  <span className="text-xs font-semibold">Vestibular:</span>
                  <span className="text-xs">{exams.find(e => e.id === currentQuestion.exam_id)?.name}</span>
                </Badge>
                <Badge variant="outline" className="gap-1.5">
                  <span className="text-xs font-semibold">Matéria:</span>
                  <span className="text-xs">{subjects.find(s => s.id === currentQuestion.subject_id)?.name}</span>
                </Badge>
                <Badge variant="outline" className="gap-1.5">
                  <span className="text-xs font-semibold">Conteúdo:</span>
                  <span className="text-xs">{allContents.find(c => c.id === currentQuestion.content_id)?.name}</span>
                </Badge>
                {currentQuestionTopics.length > 0 && (
                  <Badge variant="outline" className="gap-1.5">
                    <span className="text-xs font-semibold">Tópico:</span>
                    <span className="text-xs">
                      {currentQuestionTopics.map(qt => 
                        allTopics.find(t => t.id === qt.topic_id)?.name
                      ).filter(Boolean).join(', ')}
                    </span>
                  </Badge>
                )}
                {currentQuestion.year && (
                  <Badge variant="outline" className="gap-1.5">
                    <span className="text-xs font-semibold">Ano:</span>
                    <span className="text-xs">{currentQuestion.year}</span>
                  </Badge>
                )}
                {currentQuestion.difficulty && (
                  <Badge variant="outline" className="gap-1.5">
                    <span className="text-xs font-semibold">Dificuldade:</span>
                    <span className="text-xs">{currentQuestion.difficulty}</span>
                  </Badge>
                )}
                <div className="ml-auto">
                  <Badge variant="secondary" className="gap-2 px-3 py-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-sm font-mono font-semibold">{formatTime(elapsedTime)}</span>
                  </Badge>
                </div>
              </div>
              
              <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: currentQuestion.statement }} />
              
              {currentQuestionImages.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestionImages.map((image) => (
                    <div key={image.id} className="rounded-lg overflow-hidden border border-border">
                      <img
                        src={image.image_url}
                        alt={`Imagem da questão ${image.display_order}`}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  ))}
                </div>
              )}
              
              <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} disabled={showResult}>
                {['A', 'B', 'C', 'D', 'E'].map((option) => {
                  const optionKey = `option_${option.toLowerCase()}` as keyof typeof currentQuestion;
                  const optionValue = currentQuestion[optionKey] as string;
                  if (!optionValue) return null;
                  
                  const isCorrect = currentQuestion.correct_answer?.toLowerCase() === option.toLowerCase();
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
      </div>
    </Layout>
  );
};

export default StudentQuestions;
