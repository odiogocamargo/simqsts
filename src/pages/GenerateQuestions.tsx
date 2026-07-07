import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSubjects, useContents, useTopics } from "@/hooks/useSubjects";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Loader2, Copy, RefreshCw, CheckCircle2 } from "lucide-react";
import DOMPurify from "dompurify";

interface GeneratedQuestion {
  statement: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_e: string;
  correct_answer: string;
  explanation: string;
}

interface GenerationResult {
  subject: { id: string; name: string };
  content: { id: string; name: string };
  topic: { id: string; name: string } | null;
  difficulty: string;
  reference_count: number;
  questions: GeneratedQuestion[];
}

const GenerateQuestions = () => {
  const { toast } = useToast();
  const { data: subjects = [] } = useSubjects();
  const [subjectId, setSubjectId] = useState("");
  const [contentId, setContentId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [difficulty, setDifficulty] = useState("medio");
  const [quantity, setQuantity] = useState(3);
  const [instructions, setInstructions] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);

  const { data: contents = [] } = useContents(subjectId || undefined);
  const { data: topics = [] } = useTopics(contentId || undefined);

  const canGenerate = subjectId && contentId && !isGenerating;

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setIsGenerating(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-authorial-questions", {
        body: {
          subject_id: subjectId,
          content_id: contentId,
          topic_id: topicId || undefined,
          difficulty,
          quantity,
          instructions: instructions.trim() || undefined,
        },
      });

      if (error) {
        let friendly = "Erro ao gerar questões";
        try {
          const ctx = (error as any).context;
          const parsed = typeof ctx === "string" ? JSON.parse(ctx) : ctx;
          if (parsed?.error) friendly = parsed.error;
        } catch {
          friendly = error.message || friendly;
        }
        throw new Error(friendly);
      }

      if (!data?.success) throw new Error(data?.error || "Falha na geração");

      setResult(data.data as GenerationResult);
      toast({
        title: "Questões geradas",
        description: `${data.data.questions.length} questão(ões) autoral(is) prontas para revisão.`,
      });
    } catch (err) {
      toast({
        title: "Erro",
        description: err instanceof Error ? err.message : "Não foi possível gerar as questões.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyJson = () => {
    if (!result) return;
    const payload = result.questions.map((q) => ({
      statement: q.statement,
      subject_id: result.subject.id,
      content_id: result.content.id,
      topic_id: result.topic?.id || "",
      difficulty: result.difficulty,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      option_e: q.option_e,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      origin: "autoral_merito",
    }));
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    toast({ title: "Copiado", description: "JSON copiado para a área de transferência." });
  };

  const renderHtml = (html: string) => ({
    __html: DOMPurify.sanitize(html, { ADD_ATTR: ["target"] }),
  });

  const selectedSubjectName = useMemo(
    () => subjects.find((s) => s.id === subjectId)?.name || "",
    [subjects, subjectId],
  );

  return (
    <Layout>
      <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Gerador Autoral Mérito
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Gerar questões autorais</h1>
          <p className="text-muted-foreground">
            A IA usa as questões do seu banco como referência de estilo e gera novas questões inéditas
            no mesmo padrão. Nada é salvo automaticamente — revise e copie o JSON quando aprovar.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Parâmetros da geração</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Matéria *</Label>
                <Select value={subjectId} onValueChange={(v) => { setSubjectId(v); setContentId(""); setTopicId(""); }}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Conteúdo *</Label>
                <Select value={contentId} onValueChange={(v) => { setContentId(v); setTopicId(""); }} disabled={!subjectId}>
                  <SelectTrigger><SelectValue placeholder={subjectId ? "Selecione" : "Escolha a matéria antes"} /></SelectTrigger>
                  <SelectContent>
                    {contents.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tópico (opcional)</Label>
                <Select value={topicId} onValueChange={setTopicId} disabled={!contentId}>
                  <SelectTrigger><SelectValue placeholder={contentId ? "Qualquer tópico" : "Escolha o conteúdo antes"} /></SelectTrigger>
                  <SelectContent>
                    {topics.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Dificuldade</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facil">Fácil</SelectItem>
                    <SelectItem value="medio">Médio</SelectItem>
                    <SelectItem value="dificil">Difícil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Quantidade (1–10)</Label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Instruções adicionais (opcional)</Label>
              <Textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Ex.: foque em interpretação de gráficos, evite cálculo pesado, contexto atual do agronegócio..."
                rows={3}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={handleGenerate} disabled={!canGenerate}>
                {isGenerating ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Gerando...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" />Gerar {quantity} questão(ões)</>
                )}
              </Button>
              {result && (
                <>
                  <Button variant="outline" onClick={handleGenerate} disabled={isGenerating}>
                    <RefreshCw className="mr-2 h-4 w-4" />Gerar novamente
                  </Button>
                  <Button variant="outline" onClick={handleCopyJson}>
                    <Copy className="mr-2 h-4 w-4" />Copiar JSON
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-4">
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Geração concluída</AlertTitle>
              <AlertDescription>
                {result.questions.length} questão(ões) geradas para <strong>{result.subject.name}</strong> →{" "}
                <strong>{result.content.name}</strong>
                {result.topic ? <> → <strong>{result.topic.name}</strong></> : null}. A IA usou{" "}
                {result.reference_count} questão(ões) do banco como referência de estilo.
              </AlertDescription>
            </Alert>

            {result.questions.map((q, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-lg">Questão autoral #{i + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className="prose prose-sm max-w-none rounded-lg border border-border bg-muted/30 p-4"
                    dangerouslySetInnerHTML={renderHtml(q.statement)}
                  />

                  <div className="space-y-2">
                    {(["a", "b", "c", "d", "e"] as const).map((letter) => {
                      const value = (q as any)[`option_${letter}`] as string;
                      const isCorrect = q.correct_answer?.toLowerCase() === letter;
                      return (
                        <div
                          key={letter}
                          className={`flex items-start gap-3 rounded-lg border p-3 ${
                            isCorrect ? "border-primary bg-primary/5" : "border-border"
                          }`}
                        >
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                              isCorrect
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground"
                            }`}
                          >
                            {letter.toUpperCase()}
                          </div>
                          <div className="flex-1 text-sm">{value}</div>
                          {isCorrect && (
                            <span className="text-xs font-semibold uppercase text-primary">
                              Gabarito
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="rounded-lg border border-border bg-muted/20 p-4">
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Explicação
                      </div>
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={renderHtml(q.explanation)}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!result && !isGenerating && (
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-10 text-center text-sm text-muted-foreground">
            Escolha matéria, conteúdo e quantidade acima e clique em <strong>Gerar</strong>.
            {selectedSubjectName && <div className="mt-2">Contexto selecionado: {selectedSubjectName}</div>}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GenerateQuestions;
