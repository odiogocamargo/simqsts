import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, BookOpen, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Practice = () => {
  const { toast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedExam, setSelectedExam] = useState<string>("all");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Buscar matérias
  const { data: subjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  // Buscar vestibulares
  const { data: exams } = useQuery({
    queryKey: ["exams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exams")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  // Buscar questões
  const { data: questions, isLoading } = useQuery({
    queryKey: ["practice-questions", selectedSubject, selectedExam],
    queryFn: async () => {
      let query = supabase
        .from("questions")
        .select(`
          *,
          subjects(name),
          exams(name),
          contents(name)
        `)
        .order("created_at", { ascending: false })
        .limit(20);

      if (selectedSubject !== "all") {
        query = query.eq("subject_id", selectedSubject);
      }
      if (selectedExam !== "all") {
        query = query.eq("exam_id", selectedExam);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const currentQuestion = questions?.[currentQuestionIndex];

  const handleAnswerSelect = async (answer: string) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === currentQuestion?.correct_answer;

    // Salvar resposta no banco
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("user_answers").insert({
        user_id: user.id,
        question_id: currentQuestion?.id,
        selected_answer: answer,
        is_correct: isCorrect,
      });
    }

    setShowExplanation(true);

    if (isCorrect) {
      toast({
        title: "Resposta correta! 🎉",
        description: "Continue assim!",
      });
    } else {
      toast({
        title: "Resposta incorreta",
        description: "Veja a explicação abaixo.",
        variant: "destructive",
      });
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <BookOpen className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-2xl font-bold text-foreground">Nenhuma questão encontrada</h2>
          <p className="text-muted-foreground">Tente ajustar os filtros ou volte mais tarde.</p>
        </div>
      </Layout>
    );
  }

  if (currentQuestionIndex >= questions.length) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <h2 className="text-2xl font-bold text-foreground">Parabéns! 🎉</h2>
          <p className="text-muted-foreground">Você completou todas as questões disponíveis!</p>
          <Button onClick={() => {
            setCurrentQuestionIndex(0);
            setSelectedAnswer(null);
            setShowExplanation(false);
          }}>
            Recomeçar
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Filtros */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Filtros</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Matéria</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as matérias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as matérias</SelectItem>
                  {subjects?.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Vestibular</label>
              <Select value={selectedExam} onValueChange={setSelectedExam}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os vestibulares" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os vestibulares</SelectItem>
                  {exams?.map((exam) => (
                    <SelectItem key={exam.id} value={exam.id}>
                      {exam.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Questão */}
        <Card className="p-6">
          <div className="space-y-4">
            {/* Header da Questão */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {currentQuestion?.subjects?.name || "Matéria não especificada"}
                </Badge>
                <Badge variant="outline">
                  {currentQuestion?.exams?.name || "Vestibular não especificado"}
                </Badge>
                {currentQuestion?.year && (
                  <Badge variant="outline">{currentQuestion.year}</Badge>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                Questão {currentQuestionIndex + 1} de {questions.length}
              </span>
            </div>

            {/* Enunciado */}
            <div 
              className="prose prose-sm max-w-none text-foreground"
              dangerouslySetInnerHTML={{ __html: currentQuestion?.statement || "" }}
            />

            {/* Alternativas */}
            <div className="space-y-2 mt-6">
              {["a", "b", "c", "d", "e"].map((option) => {
                const optionKey = `option_${option}` as keyof typeof currentQuestion;
                const optionText = currentQuestion?.[optionKey];
                
                if (!optionText) return null;

                const isSelected = selectedAnswer === option;
                const isCorrect = option === currentQuestion?.correct_answer;
                const showCorrectness = showExplanation;

                return (
                  <Button
                    key={option}
                    variant={
                      showCorrectness && isCorrect
                        ? "default"
                        : showCorrectness && isSelected && !isCorrect
                        ? "destructive"
                        : isSelected
                        ? "secondary"
                        : "outline"
                    }
                    className="w-full justify-start text-left h-auto py-4 px-6"
                    onClick={() => !showExplanation && handleAnswerSelect(option)}
                    disabled={showExplanation}
                  >
                    <span className="font-bold mr-3">{option.toUpperCase()})</span>
                    <span dangerouslySetInnerHTML={{ __html: optionText }} />
                  </Button>
                );
              })}
            </div>

            {/* Explicação */}
            {showExplanation && currentQuestion?.explanation && (
              <Card className="p-4 bg-muted/50 mt-6">
                <h3 className="font-semibold text-foreground mb-2">Explicação:</h3>
                <div 
                  className="prose prose-sm max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: currentQuestion.explanation }}
                />
              </Card>
            )}

            {/* Próxima Questão */}
            {showExplanation && (
              <div className="flex justify-end mt-6">
                <Button onClick={handleNextQuestion}>
                  Próxima Questão
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Practice;
