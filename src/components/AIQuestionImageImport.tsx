import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileImage, Loader2, Sparkles, Upload, Wand2 } from "lucide-react";
import { createEmptyQuestion, type QuestionData } from "@/components/QuestionForm";

interface AIQuestionImageImportProps {
  onImportQuestions: (questions: QuestionData[]) => void;
}

interface AIExtractedQuestion {
  statement: string;
  subject_id?: string;
  content_id?: string;
  topic_id?: string;
  exam_id?: string;
  year?: number;
  difficulty?: string;
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
  option_e?: string;
  correct_answer?: string;
  explanation?: string;
}

interface AIResponsePayload {
  questions?: AIExtractedQuestion[];
  summary?: {
    total_questions?: number;
    detected_exam?: string | null;
    detected_year?: number | null;
  };
}

const normalizeRichText = (value?: string | null) => {
  if (!value?.trim()) return "";

  const trimmed = value.trim();
  if (trimmed.startsWith("<")) return trimmed;

  return trimmed
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br />")}</p>`)
    .join("");
};

const normalizeAnswer = (value?: string | null) => value?.trim().toLowerCase().slice(0, 1) || "";

const buildQuestionFromAI = (question: AIExtractedQuestion): QuestionData => ({
  ...createEmptyQuestion(),
  statement: normalizeRichText(question.statement),
  selectedSubject: question.subject_id || "",
  selectedContent: question.content_id || "",
  selectedTopic: question.topic_id || "",
  selectedExam: question.exam_id || "",
  selectedYear: question.year ? String(question.year) : "",
  selectedDifficulty: question.difficulty || "medio",
  correctAnswer: normalizeAnswer(question.correct_answer),
  alternatives: {
    A: normalizeRichText(question.option_a),
    B: normalizeRichText(question.option_b),
    C: normalizeRichText(question.option_c),
    D: normalizeRichText(question.option_d),
    E: normalizeRichText(question.option_e),
  },
  explanation: normalizeRichText(question.explanation),
});

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem selecionada."));
    reader.readAsDataURL(file);
  });

export const AIQuestionImageImport = ({ onImportQuestions }: AIQuestionImageImportProps) => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedCount, setDetectedCount] = useState<number | null>(null);

  const helperText = useMemo(() => {
    if (!selectedFile) {
      return "Envie uma foto de uma questão ou de uma página inteira do vestibular para a IA preencher matéria, conteúdo, tópico, gabarito e demais campos.";
    }

    return `Arquivo selecionado: ${selectedFile.name}`;
  }, [selectedFile]);

  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Arquivo inválido",
        description: "Selecione uma imagem JPG, PNG, WebP ou similar.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setDetectedCount(null);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleAnalyzeImage = async () => {
    if (!selectedFile) {
      toast({
        title: "Envie uma imagem",
        description: "Selecione a imagem da questão ou da página antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setDetectedCount(null);

    try {
      const imageBase64 = await fileToDataUrl(selectedFile);
      const { data, error } = await supabase.functions.invoke("analyze-question-image", {
        body: { imageBase64 },
      });

      if (error) {
        const errorMessage = error.message || "Erro ao analisar imagem";
        if (errorMessage.includes("402") || errorMessage.includes("Créditos")) {
          throw new Error("Créditos de IA esgotados. Adicione créditos em Settings → Workspace → Usage.");
        }
        if (errorMessage.includes("429") || errorMessage.includes("Limite")) {
          throw new Error("Limite de requisições excedido. Tente novamente em alguns instantes.");
        }
        throw new Error(errorMessage);
      }

      if (!data?.success) {
        throw new Error(data?.error || "A IA não conseguiu interpretar a imagem.");
      }

      const payload = data.data as AIResponsePayload;
      const extractedQuestions = (payload.questions || []).map(buildQuestionFromAI).filter((question) => question.statement);

      if (extractedQuestions.length === 0) {
        throw new Error("Nenhuma questão válida foi identificada na imagem.");
      }

      onImportQuestions(extractedQuestions);
      setDetectedCount(extractedQuestions.length);

      toast({
        title: "Questões preenchidas pela IA",
        description: `${extractedQuestions.length} questão(ões) foram carregadas no formulário para revisão final.`,
      });
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        title: "Erro na análise",
        description: error instanceof Error ? error.message : "Não foi possível analisar a imagem.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Importação inteligente por imagem
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">Preencha várias questões com uma única foto</h3>
              <p className="text-sm text-muted-foreground">{helperText}</p>
            </div>
          </div>

          <Button type="button" variant="outline" onClick={handleAnalyzeImage} disabled={!selectedFile || isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analisando imagem...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Preencher com IA
              </>
            )}
          </Button>
        </div>

        <label className="block cursor-pointer rounded-2xl border border-dashed border-border bg-muted/30 p-6 transition-colors hover:border-primary/40 hover:bg-muted/50">
          <input type="file" accept="image/*" className="hidden" onChange={handleSelectFile} />
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-foreground">Clique para enviar a imagem do vestibular</p>
              <p className="text-sm text-muted-foreground">Use uma página inteira ou uma questão isolada com boa nitidez.</p>
            </div>
          </div>
        </label>

        {isAnalyzing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Extraindo enunciados, alternativas, gabarito e taxonomia</span>
              <span>IA em andamento</span>
            </div>
            <Progress value={75} />
          </div>
        )}

        {previewUrl && (
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3 text-sm text-muted-foreground">
              <FileImage className="h-4 w-4" />
              Pré-visualização enviada para a IA
            </div>
            <img src={previewUrl} alt="Pré-visualização da página enviada" className="max-h-[420px] w-full object-contain" loading="lazy" />
          </div>
        )}

        {detectedCount !== null && (
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertTitle>Pré-preenchimento concluído</AlertTitle>
            <AlertDescription>
              A IA identificou {detectedCount} questão(ões). Revise os campos abaixo e clique em salvar para enviar ao banco.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
