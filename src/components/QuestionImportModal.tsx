import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, FileJson, Download } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Database } from "@/integrations/supabase/types";

interface QuestionImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

type QuestionInsert = Database['public']['Tables']['questions']['Insert'];

interface QuestionJSON {
  statement: string;
  subject_id: string;
  content_id: string;
  topic_id?: string;
  exam_id: string;
  year: number;
  difficulty?: string;
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
  option_e?: string;
  correct_answer?: string;
  explanation?: string;
  question_type?: "multipla_escolha" | "discursiva" | "verdadeiro_falso";
}

export const QuestionImportModal = ({ open, onOpenChange, onSuccess }: QuestionImportModalProps) => {
  const [jsonContent, setJsonContent] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const handleDownloadTemplate = () => {
    const template = [
      {
        statement: "Qual é a fórmula da água?",
        subject_id: "quimica",
        content_id: "quimica_geral",
        topic_id: "substancias_e_misturas",
        exam_id: "enem",
        year: 2024,
        difficulty: "facil",
        option_a: "H2O",
        option_b: "CO2",
        option_c: "O2",
        option_d: "N2",
        option_e: "H2SO4",
        correct_answer: "A",
        explanation: "A água é formada por dois átomos de hidrogênio e um de oxigênio (H2O).",
        question_type: "multipla_escolha"
      },
      {
        statement: "Exemplo de questão dissertativa. Explique o processo de fotossíntese.",
        subject_id: "biologia",
        content_id: "ecologia",
        topic_id: "fotossintese",
        exam_id: "paes_uema",
        year: 2024,
        difficulty: "medio",
        question_type: "discursiva",
        explanation: "A fotossíntese é o processo pelo qual as plantas convertem luz solar em energia química."
      }
    ];

    const jsonString = JSON.stringify(template, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "template-questoes.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Template baixado",
      description: "Preencha o arquivo com suas questões e importe novamente.",
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonContent(content);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!jsonContent.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, adicione o conteúdo JSON",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);

    try {
      const questions: QuestionJSON[] = JSON.parse(jsonContent);

      if (!Array.isArray(questions)) {
        throw new Error("O JSON deve ser um array de questões");
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      for (const [index, question] of questions.entries()) {
        try {
          // Insert question
          const questionData: QuestionInsert = {
            statement: question.statement,
            subject_id: question.subject_id,
            content_id: question.content_id,
            exam_id: question.exam_id,
            year: question.year,
            difficulty: question.difficulty || "medio",
            option_a: question.option_a || null,
            option_b: question.option_b || null,
            option_c: question.option_c || null,
            option_d: question.option_d || null,
            option_e: question.option_e || null,
            correct_answer: question.correct_answer || null,
            explanation: question.explanation || null,
            question_type: question.question_type || "multipla_escolha",
            created_by: user.id,
          };

          const { data: insertedQuestion, error: questionError } = await supabase
            .from("questions")
            .insert(questionData)
            .select()
            .single();

          if (questionError) throw questionError;

          // Insert topic relationship if topic_id is provided
          if (question.topic_id && insertedQuestion) {
            const { error: topicError } = await supabase
              .from("question_topics")
              .insert({
                question_id: insertedQuestion.id,
                topic_id: question.topic_id,
              });

            if (topicError) throw topicError;
          }

          successCount++;
        } catch (error: any) {
          errorCount++;
          errors.push(`Questão ${index + 1}: ${error.message}`);
        }
      }

      if (successCount > 0) {
        toast({
          title: "Importação concluída",
          description: `${successCount} questões importadas com sucesso${errorCount > 0 ? `. ${errorCount} com erro.` : ""}`,
        });
        onSuccess();
        onOpenChange(false);
        setJsonContent("");
      } else {
        throw new Error("Nenhuma questão foi importada");
      }

      if (errors.length > 0) {
        console.error("Erros durante importação:", errors);
      }
    } catch (error: any) {
      toast({
        title: "Erro ao importar",
        description: error.message || "Verifique o formato do JSON",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar Questões (JSON)</DialogTitle>
          <DialogDescription>
            Faça upload de um arquivo JSON com um array de questões. Baixe o template para ver a estrutura correta.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadTemplate}
          >
            <Download className="mr-2 h-4 w-4" />
            Baixar Template
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="file-upload" className="cursor-pointer">
              <div className="border-2 border-dashed rounded-lg p-6 hover:border-primary/50 transition-colors">
                <div className="flex flex-col items-center gap-2">
                  <FileJson className="h-10 w-10 text-muted-foreground" />
                  <div className="text-sm font-medium">Clique para selecionar arquivo JSON</div>
                  <div className="text-xs text-muted-foreground">ou cole o JSON abaixo</div>
                </div>
              </div>
              <input
                id="file-upload"
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileUpload}
              />
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="json-content">Conteúdo JSON</Label>
            <Textarea
              id="json-content"
              placeholder='[{"statement": "Qual é...?", "subject_id": "matematica", ...}]'
              value={jsonContent}
              onChange={(e) => setJsonContent(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isImporting}
            >
              Cancelar
            </Button>
            <Button onClick={handleImport} disabled={isImporting}>
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importando...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Importar Questões
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
