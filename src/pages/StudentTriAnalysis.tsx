import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Paywall, TrialBanner } from "@/components/Paywall";
import { useAuth } from "@/hooks/useAuth";
import { useSubjects } from "@/hooks/useSubjects";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo, useState } from "react";
import { Sigma, Target, TrendingUp, Activity, GraduationCap, Info, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  estimateThetaEAP,
  thetaToEnemScore,
  seToEnemScore,
  calculateCoherence,
  ENEM_CUTOFF_REFERENCES,
  TriResponse,
} from "@/lib/tri";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const AREA_TO_SUBJECTS: Record<string, string[]> = {
  "Linguagens, Códigos e suas Tecnologias": ["Português", "Gramática", "Interpretação Textual", "Literatura", "Inglês", "Espanhol"],
  "Matemática e suas Tecnologias": ["Matemática"],
  "Ciências da Natureza e suas Tecnologias": ["Biologia", "Física", "Química"],
  "Ciências Humanas e suas Tecnologias": ["História", "Geografia", "Filosofia", "Sociologia"],
};

const ALL_AREAS = Object.keys(AREA_TO_SUBJECTS);

const StudentTriAnalysis = () => {
  const { user, subscription } = useAuth();
  const { data: subjects = [] } = useSubjects();
  const [scope, setScope] = useState<"enem" | "all">("enem");
  const [diagnosis, setDiagnosis] = useState<string>("");

  const { data: answers = [], isLoading } = useQuery({
    queryKey: ["tri-answers", user?.id, scope],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("user_answers")
        .select("id, is_correct, answered_at, question_id, questions(id, exam_id, subject_id, difficulty)")
        .eq("user_id", user.id)
        .order("answered_at", { ascending: true });
      if (error) throw error;
      return (data || []).filter((a: any) => {
        if (!a.questions) return false;
        if (scope === "enem") return String(a.questions.exam_id).toLowerCase() === "enem";
        return true;
      });
    },
    enabled: !!user?.id,
  });

  const subjectIdToName = useMemo(() => {
    const map = new Map<string, string>();
    subjects.forEach((s: any) => map.set(s.id, s.name));
    return map;
  }, [subjects]);

  const globalResponses: TriResponse[] = useMemo(
    () => answers.map((a: any) => ({ difficulty: a.questions?.difficulty, isCorrect: a.is_correct })),
    [answers],
  );

  const globalEstimate = useMemo(() => estimateThetaEAP(globalResponses), [globalResponses]);
  const globalScore = useMemo(() => thetaToEnemScore(globalEstimate?.theta ?? null), [globalEstimate]);
  const globalSE = useMemo(() => (globalEstimate ? seToEnemScore(globalEstimate.se) : 0), [globalEstimate]);
  const coherence = useMemo(
    () => (globalEstimate ? calculateCoherence(globalEstimate.theta, globalResponses) : 0),
    [globalEstimate, globalResponses],
  );

  const byArea = useMemo(() => {
    return ALL_AREAS.map((area) => {
      const areaSubjects = AREA_TO_SUBJECTS[area];
      const areaResponses: TriResponse[] = answers
        .filter((a: any) => {
          const subjectName = subjectIdToName.get(a.questions?.subject_id);
          return subjectName && areaSubjects.includes(subjectName);
        })
        .map((a: any) => ({ difficulty: a.questions?.difficulty, isCorrect: a.is_correct }));
      const est = estimateThetaEAP(areaResponses);
      return {
        area,
        score: thetaToEnemScore(est?.theta ?? null),
        se: est ? seToEnemScore(est.se) : 0,
        total: areaResponses.length,
        correct: areaResponses.filter((r) => r.isCorrect).length,
      };
    });
  }, [answers, subjectIdToName]);

  const history = useMemo(() => {
    const points: { index: number; date: string; score: number }[] = [];
    const step = Math.max(5, Math.floor(globalResponses.length / 20));
    for (let i = step; i <= globalResponses.length; i += step) {
      const subset = globalResponses.slice(0, i);
      const est = estimateThetaEAP(subset);
      const score = thetaToEnemScore(est?.theta ?? null);
      if (score !== null) {
        const ans = answers[i - 1];
        points.push({
          index: i,
          date: ans?.answered_at ? new Date(ans.answered_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) : `${i}`,
          score,
        });
      }
    }
    return points;
  }, [globalResponses, answers]);

  const reachedCutoffs = useMemo(() => {
    if (globalScore === null) return [];
    return ENEM_CUTOFF_REFERENCES.filter((c) => globalScore >= c.score).map((c) => c.course);
  }, [globalScore]);

  const diagnoseMutation = useMutation({
    mutationFn: async () => {
      if (!globalEstimate || globalScore === null) throw new Error("Sem dados suficientes");
      const { data, error } = await supabase.functions.invoke("tri-diagnosis", {
        body: {
          globalScore,
          se: globalEstimate.se,
          totalAnswered: globalResponses.length,
          totalCorrect: globalResponses.filter((r) => r.isCorrect).length,
          coherence,
          byArea,
        },
      });
      if (error) throw error;
      return data?.diagnosis as string;
    },
    onSuccess: (text) => {
      setDiagnosis(text || "");
      toast.success("Diagnóstico gerado");
    },
    onError: (e: any) => {
      toast.error(e?.message || "Falha ao gerar diagnóstico");
    },
  });

  const isPaid = subscription?.subscribed;

  if (!isPaid) {
    return (
      <Layout>
        <TrialBanner />
        <Paywall title="Análise TRI" description="Estimativa de nota ENEM com Teoria de Resposta ao Item disponível para assinantes." />
      </Layout>
    );
  }

  return (
    <Layout>
      <TrialBanner />
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Sigma className="h-5 w-5 text-destructive" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Análise TRI</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Estimativa bayesiana (EAP) da sua nota ENEM via Teoria de Resposta ao Item — com{" "}
              <strong>intervalo de confiança</strong> e diagnóstico inteligente.
            </p>
          </div>
          <Tabs value={scope} onValueChange={(v) => setScope(v as "enem" | "all")}>
            <TabsList>
              <TabsTrigger value="enem">Apenas ENEM</TabsTrigger>
              <TabsTrigger value="all">Todas as respondidas</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">Calculando proficiência…</CardContent></Card>
        ) : globalResponses.length < 10 ? (
          <Card>
            <CardContent className="py-12 text-center space-y-2">
              <Info className="h-10 w-10 text-muted-foreground mx-auto" />
              <p className="font-medium">Você precisa responder ao menos 10 questões {scope === "enem" ? "do ENEM" : ""} para uma estimativa confiável.</p>
              <p className="text-sm text-muted-foreground">Respondidas até agora: {globalResponses.length}</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Nota estimada principal */}
            <Card className="border-destructive/30 bg-gradient-to-br from-destructive/5 to-background">
              <CardHeader>
                <CardDescription className="flex items-center gap-2">
                  <Target className="h-4 w-4" /> Sua estimativa de nota ENEM (TRI · EAP)
                </CardDescription>
                <div className="flex items-baseline gap-3 pt-1 flex-wrap">
                  <span className="text-6xl font-bold tracking-tight text-destructive">{globalScore}</span>
                  <span className="text-xl text-muted-foreground">± {globalSE}</span>
                  <span className="text-xl text-muted-foreground">/ 1000</span>
                </div>
                <CardDescription className="pt-2">
                  Intervalo provável: <strong className="text-foreground">{Math.max(0, (globalScore || 0) - globalSE)}</strong> a{" "}
                  <strong className="text-foreground">{Math.min(1000, (globalScore || 0) + globalSE)}</strong> • Baseado em{" "}
                  <strong>{globalResponses.length}</strong> questões • {globalResponses.filter((r) => r.isCorrect).length} acertos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium flex items-center gap-2">
                      <Activity className="h-4 w-4" /> Coerência TRI
                    </span>
                    <span className="font-semibold">{coherence}%</span>
                  </div>
                  <Progress value={coherence} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {coherence >= 75
                      ? "✓ Padrão coerente — você acerta o que era esperado para sua proficiência."
                      : coherence >= 55
                      ? "⚠ Padrão moderadamente coerente — alguns erros inesperados."
                      : "⚠ Padrão errático — muitos chutes ou desatenção. Revise estratégia."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Diagnóstico IA */}
            <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-5 w-5 text-primary" /> Diagnóstico inteligente
                  </CardTitle>
                  <CardDescription>
                    Análise textual do seu perfil TRI gerada por IA, com recomendações personalizadas.
                  </CardDescription>
                </div>
                <Button
                  onClick={() => diagnoseMutation.mutate()}
                  disabled={diagnoseMutation.isPending}
                  size="sm"
                >
                  {diagnoseMutation.isPending ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Gerando…</>
                  ) : diagnosis ? "Gerar novo diagnóstico" : "Gerar diagnóstico"}
                </Button>
              </CardHeader>
              {diagnosis && (
                <CardContent>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">{diagnosis}</div>
                </CardContent>
              )}
            </Card>

            {/* 4 áreas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {byArea.map((a) => (
                <Card key={a.area}>
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs leading-tight min-h-[2.5rem]">{a.area}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {a.score !== null ? (
                      <>
                        <div className="flex items-baseline gap-2">
                          <div className="text-3xl font-bold">{a.score}</div>
                          <div className="text-sm text-muted-foreground">± {a.se}</div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {a.correct}/{a.total} acertos
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">Sem dados suficientes</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Histórico */}
            {history.length >= 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" /> Evolução da nota estimada
                  </CardTitle>
                  <CardDescription>Como sua proficiência TRI evoluiu ao longo das respostas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={history} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis domain={[0, 1000]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: 8,
                        }}
                      />
                      <ReferenceLine y={500} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" label={{ value: "Média ENEM", fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                      <Line type="monotone" dataKey="score" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Comparativo de cortes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" /> Comparativo com cursos
                </CardTitle>
                <CardDescription>
                  Notas de corte aproximadas (SISU, ampla concorrência). Você já alcançaria{" "}
                  <strong className="text-foreground">{reachedCutoffs.length}</strong> de {ENEM_CUTOFF_REFERENCES.length} referências.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ENEM_CUTOFF_REFERENCES.map((c) => {
                    const reached = globalScore !== null && globalScore >= c.score;
                    const pct = Math.min(100, ((globalScore || 0) / c.score) * 100);
                    return (
                      <div key={c.course} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium flex items-center gap-2">
                            {c.course}
                            {reached && <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">✓ Atingido</Badge>}
                          </span>
                          <span className="text-muted-foreground">
                            {globalScore} / <strong className="text-foreground">{c.score}</strong>
                          </span>
                        </div>
                        <Progress value={pct} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Explicação */}
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Info className="h-4 w-4" /> Como interpretar
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  Esta versão usa <strong className="text-foreground">EAP (Expected A Posteriori)</strong> com prior N(0,1) — uma
                  estimação bayesiana mais robusta que a máxima verossimilhança, especialmente quando você tem poucas respostas
                  ou padrões extremos. O <strong>± erro padrão</strong> indica a margem de incerteza: quanto mais questões
                  responder, menor ele fica.
                </p>
                <p>
                  Modelo logístico de 3 parâmetros (3PL) com calibração baseada na dificuldade cadastrada (fácil/médio/difícil).
                  Não substitui a nota oficial, mas indica sua proficiência relativa real.
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
};

export default StudentTriAnalysis;
