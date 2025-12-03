import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Upload, Loader2 } from "lucide-react";
import { QuestionImportModal } from "@/components/QuestionImportModal";
import { QuestionForm, QuestionData, createEmptyQuestion } from "@/components/QuestionForm";

const AddQuestion = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuestionData[]>([createEmptyQuestion()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);

  const handleQuestionChange = (id: string, data: Partial<QuestionData>) => {
    setQuestions(prev => 
      prev.map(q => q.id === id ? { ...q, ...data } : q)
    );
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleAddQuestion = () => {
    setQuestions(prev => [...prev, createEmptyQuestion()]);
    toast({
      title: "Questão adicionada",
      description: `Agora você tem ${questions.length + 1} questões para submeter.`,
    });
  };

  const validateQuestion = (q: QuestionData, index: number): string | null => {
    if (!q.statement.trim()) return `Questão ${index + 1}: O enunciado é obrigatório.`;
    if (!q.selectedSubject) return `Questão ${index + 1}: Selecione a matéria.`;
    if (!q.selectedContent) return `Questão ${index + 1}: Selecione o conteúdo.`;
    if (!q.selectedExam) return `Questão ${index + 1}: Selecione o vestibular.`;
    if (!q.selectedYear) return `Questão ${index + 1}: Selecione o ano.`;
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Você precisa estar autenticado para adicionar questões.",
        variant: "destructive",
      });
      return;
    }

    // Validar todas as questões
    for (let i = 0; i < questions.length; i++) {
      const error = validateQuestion(questions[i], i);
      if (error) {
        toast({ title: "Erro de validação", description: error, variant: "destructive" });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      let successCount = 0;
      const errors: string[] = [];

      for (const [index, q] of questions.entries()) {
        try {
          const { data: questionData, error } = await supabase
            .from("questions")
            .insert({
              statement: q.statement,
              subject_id: q.selectedSubject,
              content_id: q.selectedContent,
              exam_id: q.selectedExam,
              year: parseInt(q.selectedYear),
              difficulty: q.selectedDifficulty || "medio",
              option_a: q.alternatives.A || null,
              option_b: q.alternatives.B || null,
              option_c: q.alternatives.C || null,
              option_d: q.alternatives.D || null,
              option_e: q.alternatives.E || null,
              correct_answer: q.correctAnswer || null,
              explanation: q.explanation || null,
              created_by: user.id,
            })
            .select()
            .single();

          if (error) throw error;

          // Inserir o tópico da questão
          if (q.selectedTopic && questionData) {
            await supabase.from("question_topics").insert({
              question_id: questionData.id,
              topic_id: q.selectedTopic,
            });
          }

          successCount++;
        } catch (error: any) {
          errors.push(`Questão ${index + 1}: ${error.message}`);
        }
      }

      if (successCount > 0) {
        toast({
          title: "Questões adicionadas!",
          description: `${successCount} de ${questions.length} questões foram cadastradas com sucesso.`,
        });
        
        // Limpar o formulário
        setQuestions([createEmptyQuestion()]);
      }

      if (errors.length > 0) {
        console.error("Erros ao salvar questões:", errors);
        toast({
          title: "Algumas questões falharam",
          description: errors.join("\n"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao adicionar questões:", error);
      toast({
        title: "Erro ao adicionar questões",
        description: "Ocorreu um erro ao salvar as questões. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setQuestions([createEmptyQuestion()]);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Adicionar Questões</h2>
            <p className="text-muted-foreground">
              Cadastre questões manualmente - adicione quantas quiser antes de submeter
            </p>
          </div>
          <Button onClick={() => setImportModalOpen(true)} variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Importar JSON
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((question, index) => (
            <QuestionForm
              key={question.id}
              question={question}
              index={index}
              totalQuestions={questions.length}
              onChange={handleQuestionChange}
              onRemove={handleRemoveQuestion}
            />
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={handleAddQuestion}
            className="w-full border-dashed"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Mais Uma Questão
          </Button>

          <div className="flex gap-3 pt-4 sticky bottom-4 bg-background/95 backdrop-blur p-4 rounded-lg border shadow-lg">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                `Salvar ${questions.length} Questão${questions.length > 1 ? "ões" : ""}`
              )}
            </Button>
            <Button type="button" variant="outline" onClick={handleClear} disabled={isSubmitting}>
              Limpar Tudo
            </Button>
          </div>
        </form>

        <QuestionImportModal
          open={importModalOpen}
          onOpenChange={setImportModalOpen}
          onSuccess={handleClear}
        />
      </div>
    </Layout>
  );
};

export default AddQuestion;
