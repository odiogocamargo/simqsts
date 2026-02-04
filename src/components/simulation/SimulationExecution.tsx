import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ChevronLeft, ChevronRight, Clock, CheckCircle2, XCircle, Flag, Loader2 } from "lucide-react";
import { SimulationQuestion } from "@/hooks/useSimulations";
import DOMPurify from "dompurify";

interface SimulationExecutionProps {
  questions: SimulationQuestion[];
  onAnswer: (questionId: string, answer: string, isCorrect: boolean, timeSpent: number) => Promise<void>;
  onComplete: () => void;
  onAbandon: () => void;
}

export function SimulationExecution({
  questions,
  onAnswer,
  onComplete,
  onAbandon,
}: SimulationExecutionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [totalTime, setTotalTime] = useState(0);
  const [showAbandonDialog, setShowAbandonDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentIndex];
  const answeredCount = questions.filter((q) => q.selected_answer !== null).length;
  const progress = (answeredCount / questions.length) * 100;

  // Timer global
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Reset ao mudar de questão
  useEffect(() => {
    if (currentQuestion.selected_answer) {
      setSelectedAnswer(currentQuestion.selected_answer);
      setAnswered(true);
    } else {
      setSelectedAnswer(null);
      setAnswered(false);
    }
    setQuestionStartTime(Date.now());
  }, [currentIndex, currentQuestion]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectAnswer = (answer: string) => {
    if (answered) return;
    setSelectedAnswer(answer);
  };

  const handleConfirmAnswer = async () => {
    if (!selectedAnswer || answered || !currentQuestion.question) return;

    setIsSubmitting(true);
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const isCorrect = selectedAnswer === currentQuestion.question.correct_answer;

    try {
      await onAnswer(currentQuestion.id, selectedAnswer, isCorrect, timeSpent);
      setAnswered(true);
      
      // Atualizar localmente
      currentQuestion.selected_answer = selectedAnswer;
      currentQuestion.is_correct = isCorrect;
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleComplete = () => {
    const unanswered = questions.filter((q) => q.selected_answer === null).length;
    if (unanswered > 0) {
      setShowCompleteDialog(true);
    } else {
      onComplete();
    }
  };

  const options = [
    { key: "A", value: currentQuestion.question?.option_a },
    { key: "B", value: currentQuestion.question?.option_b },
    { key: "C", value: currentQuestion.question?.option_c },
    { key: "D", value: currentQuestion.question?.option_d },
    { key: "E", value: currentQuestion.question?.option_e },
  ].filter((o) => o.value);

  const getOptionStyle = (key: string) => {
    if (!answered) {
      return selectedAnswer === key
        ? "border-primary bg-primary/5"
        : "border-border hover:border-primary/50";
    }

    const correctAnswer = currentQuestion.question?.correct_answer;
    if (key === correctAnswer) {
      return "border-green-500 bg-green-50";
    }
    if (key === selectedAnswer && key !== correctAnswer) {
      return "border-red-500 bg-red-50";
    }
    return "border-border opacity-50";
  };

  return (
    <div className="space-y-4">
      {/* Header com progresso e timer */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <Badge variant="outline">
                Questão {currentIndex + 1} de {questions.length}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {answeredCount} respondidas
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4" />
              {formatTime(totalTime)}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Questão */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary">{currentQuestion.question?.exams?.name}</Badge>
            <span>•</span>
            <span>{currentQuestion.question?.subjects?.name}</span>
            <span>•</span>
            <span>{currentQuestion.question?.year}</span>
            {currentQuestion.question?.difficulty && (
              <>
                <span>•</span>
                <Badge variant="outline" className="capitalize">
                  {currentQuestion.question.difficulty}
                </Badge>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Enunciado */}
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(currentQuestion.question?.statement || ""),
            }}
          />

          {/* Alternativas */}
          <div className="space-y-2">
            {options.map((option) => (
              <button
                key={option.key}
                onClick={() => handleSelectAnswer(option.key)}
                disabled={answered}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${getOptionStyle(option.key)}`}
              >
                <div className="flex items-start gap-3">
                  <span className="font-semibold text-sm shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                    {option.key}
                  </span>
                  <div
                    className="prose prose-sm max-w-none flex-1"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(option.value || ""),
                    }}
                  />
                  {answered && option.key === currentQuestion.question?.correct_answer && (
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                  )}
                  {answered && option.key === selectedAnswer && option.key !== currentQuestion.question?.correct_answer && (
                    <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Explicação (após responder) */}
          {answered && currentQuestion.question?.explanation && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <p className="font-medium text-sm">Explicação:</p>
              <div
                className="prose prose-sm max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(currentQuestion.question.explanation),
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={goToPrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>

        <div className="flex gap-2">
          {!answered && selectedAnswer && (
            <Button onClick={handleConfirmAnswer} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <CheckCircle2 className="h-4 w-4 mr-1" />
              )}
              Confirmar
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => setShowAbandonDialog(true)}
          >
            <Flag className="h-4 w-4 mr-1" />
            Encerrar
          </Button>
        </div>

        {currentIndex === questions.length - 1 ? (
          <Button onClick={handleComplete}>
            Finalizar
          </Button>
        ) : (
          <Button variant="outline" onClick={goToNext}>
            Próxima
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>

      {/* Navegação rápida */}
      <Card>
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground mb-2">Navegação rápida:</p>
          <div className="flex flex-wrap gap-1">
            {questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(i)}
                className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                  i === currentIndex
                    ? "bg-primary text-primary-foreground"
                    : q.selected_answer
                    ? q.is_correct
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialog de abandono */}
      <AlertDialog open={showAbandonDialog} onOpenChange={setShowAbandonDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Encerrar simulado?</AlertDialogTitle>
            <AlertDialogDescription>
              Você respondeu {answeredCount} de {questions.length} questões.
              O simulado será salvo como abandonado e poderá ver o resultado parcial.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar</AlertDialogCancel>
            <AlertDialogAction onClick={onAbandon}>
              Encerrar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de completar com questões pendentes */}
      <AlertDialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Questões não respondidas</AlertDialogTitle>
            <AlertDialogDescription>
              Você ainda tem {questions.filter((q) => !q.selected_answer).length} questões não respondidas.
              Deseja finalizar mesmo assim?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction onClick={onComplete}>
              Finalizar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
