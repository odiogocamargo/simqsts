import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Plus, Upload, Loader2 } from "lucide-react";
import { QuestionImportModal } from "@/components/QuestionImportModal";
import { AIQuestionImageImport } from "@/components/AIQuestionImageImport";
import { QuestionForm, QuestionData, createEmptyQuestion } from "@/components/QuestionForm";

const AddQuestion = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { role } = useUserRole();
  const [questions, setQuestions] = useState<QuestionData[]>([createEmptyQuestion()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);

  const handleQuestionChange = (id: string, data: Partial<QuestionData>) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...data } : q)));
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleAddQuestion = () => {
    setQuestions((prev) => [...prev, createEmptyQuestion()]);
    toast({
      title: "Questão adicionada",
      description: `Agora você tem ${questions.length + 1} questões para submeter.`,
    });
  };

  const handleAIImportQuestions = (importedQuestions: QuestionData[]) => {
    setQuestions((prev) => {
      const hasOnlyEmptyDraft = prev.length === 1 && !prev[0].statement.trim() && !prev[0].selectedSubject;
      return hasOnlyEmptyDraft ? importedQuestions : [...prev, ...importedQuestions];
    });

    toast({
      title: "Questões carregadas no formulário",
      description: `${importedQuestions.length} questão(ões) foram adicionadas para revisão antes do salvamento.`,
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

  const uploadQuestionImage = async (file: File, questionId: string, displayOrder: number) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${questionId}/${Date.now()}_${displayOrder}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("question-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from("question-images")
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  };

  const persistQuestionImages = async (questionId: string, question: QuestionData) => {
    const imagesToPersist = question.images.filter((image) => image.file);

    for (const [imageIndex, image] of imagesToPersist.entries()) {
      if (!image.file) continue;

      const publicUrl = await uploadQuestionImage(image.file, questionId, image.display_order ?? imageIndex);

      const { error } = await supabase.from("question_images").insert({
        question_id: questionId,
        image_url: publicUrl,
        image_type: image.image_type || "question",
        display_order: image.display_order ?? imageIndex,
      });

      if (error) throw error;
    }
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

    if (role !== "admin" && role !== "professor") {
      toast({
        title: "Sem permissão para cadastrar questões",
        description: "Sua conta precisa ter perfil de Professor ou Admin para salvar questões no banco.",
        variant: "destructive",
      });
      return;
    }

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
      let permissionDenied = false;

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

          if (q.selectedTopic && questionData) {
            await supabase.from("question_topics").insert({
              question_id: questionData.id,
              topic_id: q.selectedTopic,
            });
          }

          if (questionData && q.images.length > 0) {
            await persistQuestionImages(questionData.id, q);
          }

          successCount++;
        } catch (error: any) {
          const message = String(error?.message || "");

          if (message.includes("row-level security policy") && message.includes("questions")) {
            permissionDenied = true;
            break;
          }

          errors.push(`Questão ${index + 1}: ${message}`);
        }
      }

      if (permissionDenied) {
        toast({
          title: "Permissão insuficiente para salvar",
          description: "O Supabase bloqueou o cadastro porque sua conta não está com role de Professor ou Admin no banco.",
          variant: "destructive",
        });
        return;
      }

      if (successCount > 0) {
        toast({
          title: "Questões adicionadas!",
          description: `${successCount} de ${questions.length} questões foram cadastradas com sucesso.`,
        });

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
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="mb-2 text-3xl font-bold text-foreground">Adicionar Questões</h2>
            <p className="text-muted-foreground">
              Cadastre manualmente, importe via JSON ou use IA para preencher várias questões a partir de uma ou mais imagens.
            </p>
          </div>
          <Button onClick={() => setImportModalOpen(true)} variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Importar JSON
          </Button>
        </div>

        <AIQuestionImageImport onImportQuestions={handleAIImportQuestions} />

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

          <Button type="button" variant="outline" onClick={handleAddQuestion} className="w-full border-dashed">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Mais Uma Questão
          </Button>

          <div className="sticky bottom-4 flex gap-3 rounded-lg border bg-background/95 p-4 pt-4 shadow-lg backdrop-blur">
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

        <QuestionImportModal open={importModalOpen} onOpenChange={setImportModalOpen} onSuccess={handleClear} />
      </div>
    </Layout>
  );
};

export default AddQuestion;
