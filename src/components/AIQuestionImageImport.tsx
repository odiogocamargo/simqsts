import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileImage, Loader2, Sparkles, Upload, Wand2, X } from "lucide-react";
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
  should_attach_source_image?: boolean;
}

interface AIResponsePayload {
  questions?: AIExtractedQuestion[];
  summary?: {
    total_questions?: number;
    detected_exam?: string | null;
    detected_year?: number | null;
  };
}

const normalizeEscapedText = (value?: string | null) => {
  if (!value) return "";

  return value
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n|\\r/g, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\\\$/g, "$")
    .replace(/&nbsp;/gi, " ")
    .replace(/\u00a0/g, " ");
};

const normalizeRichText = (value?: string | null) => {
  const normalized = normalizeEscapedText(value).trim();
  if (!normalized) return "";

  if (normalized.startsWith("<")) {
    return normalized;
  }

  return normalized
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br />")}</p>`)
    .join("");
};

/** Strips HTML tags and normalises whitespace – used for plain-text fields like alternatives */
const stripHtml = (value?: string | null) => {
  const normalized = normalizeEscapedText(value)
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&");

  if (!normalized.trim()) return "";

  return normalized
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/\n/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
};

const normalizeAnswer = (value?: string | null) => value?.trim().toLowerCase().slice(0, 1) || "";

const buildQuestionFromAI = (question: AIExtractedQuestion, sourceFile?: File): QuestionData => ({
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
    A: stripHtml(question.option_a),
    B: stripHtml(question.option_b),
    C: stripHtml(question.option_c),
    D: stripHtml(question.option_d),
    E: stripHtml(question.option_e),
  },
  explanation: normalizeRichText(question.explanation),
  images: sourceFile && question.should_attach_source_image !== false
    ? [{ image_url: URL.createObjectURL(sourceFile), image_type: "statement", display_order: 0, file: sourceFile }]
    : [],
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedCount, setDetectedCount] = useState<number | null>(null);
  const [processedFiles, setProcessedFiles] = useState(0);

  const helperText = useMemo(() => {
    if (selectedFiles.length === 0) {
      return "Envie uma ou várias fotos de questões ou páginas inteiras do vestibular para a IA preencher matéria, conteúdo, tópico, gabarito e demais campos.";
    }

    if (selectedFiles.length === 1) {
      return `1 imagem selecionada: ${selectedFiles[0].name}`;
    }

    return `${selectedFiles.length} imagens selecionadas para leitura em lote.`;
  }, [selectedFiles]);

  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const invalidFile = files.find((file) => !file.type.startsWith("image/"));
    if (invalidFile) {
      toast({
        title: "Arquivo inválido",
        description: "Selecione apenas imagens JPG, PNG, WebP ou similares.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFiles((prev) => {
      const existingKeys = new Set(prev.map((file) => `${file.name}-${file.size}-${file.lastModified}`));
      const newFiles = files.filter((file) => !existingKeys.has(`${file.name}-${file.size}-${file.lastModified}`));
      return [...prev, ...newFiles];
    });

    setPreviewUrls((prev) => {
      const existingUrls = new Set(prev);
      const nextUrls = files.map((file) => URL.createObjectURL(file));
      return [...prev, ...nextUrls.filter((url) => !existingUrls.has(url))];
    });

    setDetectedCount(null);
    setProcessedFiles(0);
    event.target.value = "";
  };

  const handleRemoveFile = (fileToRemove: File) => {
    const fileKeyToRemove = `${fileToRemove.name}-${fileToRemove.size}-${fileToRemove.lastModified}`;

    setSelectedFiles((prev) => prev.filter((file) => `${file.name}-${file.size}-${file.lastModified}` !== fileKeyToRemove));
    setPreviewUrls((prev) => {
      const previewIndex = selectedFiles.findIndex(
        (file) => `${file.name}-${file.size}-${file.lastModified}` === fileKeyToRemove
      );

      if (previewIndex === -1) return prev;

      const previewUrlToRemove = prev[previewIndex];
      if (previewUrlToRemove) {
        URL.revokeObjectURL(previewUrlToRemove);
      }

      return prev.filter((_, index) => index !== previewIndex);
    });
    setDetectedCount(null);
    setProcessedFiles(0);
  };

  const handleAnalyzeImage = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Envie ao menos uma imagem",
        description: "Selecione uma ou mais imagens da questão ou da página antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    const filesToAnalyze = [...selectedFiles];

    setIsAnalyzing(true);
    setDetectedCount(null);
    setProcessedFiles(0);

    try {
      const analysisResults = await Promise.all(
        filesToAnalyze.map(async (selectedFile) => {
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
              throw new Error(data?.error || `A IA não conseguiu interpretar a imagem ${selectedFile.name}.`);
            }

            const payload = data.data as AIResponsePayload;
            return (payload.questions || [])
              .map((question) => buildQuestionFromAI(question, selectedFile))
              .filter((question) => question.statement);
          } finally {
            setProcessedFiles((prev) => prev + 1);
          }
        })
      );

      const importedQuestions = analysisResults.flat();

      if (importedQuestions.length === 0) {
        throw new Error("Nenhuma questão válida foi identificada nas imagens enviadas.");
      }

      onImportQuestions(importedQuestions);
      setDetectedCount(importedQuestions.length);

      toast({
        title: "Questões preenchidas pela IA",
        description: `${importedQuestions.length} questão(ões) foram carregadas no formulário para revisão final.`,
      });
    } catch (error) {
      console.error("Error analyzing images:", error);
      toast({
        title: "Erro na análise",
        description: error instanceof Error ? error.message : "Não foi possível analisar as imagens.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const progressValue = selectedFiles.length > 0 ? (processedFiles / selectedFiles.length) * 100 : 0;

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
              <h3 className="text-xl font-semibold text-foreground">Preencha várias questões com uma ou mais imagens</h3>
              <p className="text-sm text-muted-foreground">{helperText}</p>
            </div>
          </div>

          <Button type="button" variant="outline" onClick={handleAnalyzeImage} disabled={selectedFiles.length === 0 || isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analisando imagens...
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
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleSelectFile} />
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-foreground">Clique para enviar uma ou mais imagens do vestibular</p>
              <p className="text-sm text-muted-foreground">Use páginas inteiras ou questões isoladas com boa nitidez.</p>
            </div>
          </div>
        </label>

        {isAnalyzing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Extraindo enunciados, alternativas, gabarito e taxonomia</span>
              <span>{processedFiles}/{selectedFiles.length} imagens processadas</span>
            </div>
            <Progress value={progressValue} />
          </div>
        )}

        {previewUrls.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3 text-sm text-muted-foreground">
              <FileImage className="h-4 w-4" />
              Pré-visualizações enviadas para a IA
            </div>
            <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
              {selectedFiles.map((file, index) => (
                <div key={`${file.name}-${file.size}-${file.lastModified}`} className="group relative overflow-hidden rounded-xl border border-border bg-background">
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(file)}
                    className="absolute right-2 top-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/90 text-muted-foreground shadow-sm transition-colors hover:text-foreground"
                    aria-label={`Remover ${file.name} da fila`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <img
                    src={previewUrls[index]}
                    alt={`Pré-visualização da imagem ${index + 1} enviada`}
                    className="max-h-[320px] w-full object-contain"
                    loading="lazy"
                  />
                  <div className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
                    {file.name}
                  </div>
                </div>
              ))}
            </div>
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
