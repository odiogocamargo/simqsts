import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Paywall, TrialBanner } from "@/components/Paywall";
import { useAuth } from "@/hooks/useAuth";
import { useSubjects } from "@/hooks/useSubjects";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo, useState } from "react";
import { Sigma, Target, TrendingUp, Activity, GraduationCap, Info } from "lucide-react";
import {
  estimateTheta,
  thetaToEnemScore,
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

  const { data: answers = [], isLoading } = useQuery({
    queryKey: ["tri-answers", user?.id, scope],
    queryFn: async () => {
      if (!user?.id) return [];
      let query = supabase
        .from("user_answers")
        .select("id, is_correct, answered_at, question_id, questions(id, exam_id, subject_id, difficulty)")
        .eq("user_id", user.id)
        .order("answered_at", { ascending: true });
      const { data, error } = await query;
      if (error) throw error;
      const filtered = (data || []).filter((a: any) => {
        if (!a.questions) return false;
        if (scope === "enem") return String(a.questions.exam_id).toLowerCase() === "enem";
        return true;
      });
      return filtered;
    },
    enabled: !!user?.id,
  });

  const subjectIdToName = useMemo(() => {
    const map = new Map<string, string>();
    subjects.forEach((s: any) => map.set(s.id, s.name));
    return map;
  }, [subjects]);

  // Estimativa global
  const globalResponses: TriResponse[] = useMemo(
    () =>
      answers.map((a: any) => ({
        difficulty: a.questions?.difficulty,
        isCorrect: a.is_correct,
      })),
    [answers],
  );

  const globalTheta = useMemo(() => estimateTheta(globalResponses), [globalResponses]);
  const globalScore = useMemo(() => thetaToEnemScore(globalTheta), [globalTheta]);
  const coherence = useMemo(
    () => (globalTheta !== null ? calculateCoherence(globalTheta, globalResponses) : 0),
    [globalTheta, globalResponses],
  );

  // Por área
  const byArea = useMemo(() => {
    return ALL_AREAS.map((area) => {
      const areaSubjects = AREA_TO_SUBJECTS[area];
      const areaResponses: TriResponse[] = answers
        .filter((a: any) => {
          const subjectName = subjectIdToName.get(a.questions?.subject_id);
          return subjectName && areaSubjects.includes(subjectName);
        })
        .map((a: any) => ({
          difficulty: a.questions?.difficulty,
          isCorrect: a.is_correct,
        }));
      const theta = estimateTheta(areaResponses);
      return {
        area,
        score: thetaToEnemScore(theta),
        total: areaResponses.length,
        correct: areaResponses.filter((r) => r.isCorrect).length,
      };
    });
  }, [answers, subjectIdToName]);

  // Histórico - calcula nota estimada acumulada a cada bloco de 10 respostas
  const history = useMemo(() => {
    const points: { index: number; date: string; score: number }[] = [];
    const step = Math.max(5, Math.floor(globalResponses.length / 20));
    for (let i = step; i <= globalResponses.length; i += step) {
      const subset = globalResponses.slice(0, i);
      const theta = estimateTheta(subset);
      const score = thetaToEnemScore(theta);
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

  const isPaid = subscription?.subscribed;

  if (!isPaid) {
    return (
      <Layout>
        <TrialBanner />
        <Paywall feature="Análise TRI" />
      </Layout>
    );
  }

  return (
    <Layout>
      <TrialBanner />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Sigma className="h-5 w-5 text-destructive" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Análise TRI</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Estimativa da sua nota no ENEM usando o modelo TRI (Teoria de Resposta ao Item) — o mesmo
              princípio que o INEP utiliza para corrigir a prova: <strong>não basta acertar, importa o que se acerta</strong>.
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
                  <Target className="h-4 w-4" /> Sua estimativa de nota ENEM (TRI)
                </CardDescription>
                <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-6xl font-bold tracking-tight text-destructive">{globalScore}</span>
                  <span className="text-xl text-muted-foreground">/ 1000</span>
                </div>
                <CardDescription className="pt-2">
                  Baseado em <strong>{globalResponses.length}</strong> questões respondidas •{" "}
                  {globalResponses.filter((r) => r.isCorrect).length} acertos
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
                        <div className="text-3xl font-bold">{a.score}</div>
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
                  <strong className="text-foreground">TRI (Teoria de Resposta ao Item)</strong> é o método usado pelo INEP para
                  calcular a nota do ENEM. Diferente do simples percentual de acertos, ele pondera cada acerto pela
                  <strong> dificuldade</strong>, <strong>discriminação</strong> e <strong>probabilidade de chute</strong> de cada questão.
                </p>
                <p>
                  Esta estimativa usa o <strong>modelo logístico de 3 parâmetros (3PL)</strong> com calibração simplificada
                  baseada na dificuldade cadastrada (fácil/médio/difícil). Não substitui a nota oficial, mas indica sua
                  proficiência relativa e o quanto seu padrão de respostas é coerente.
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
