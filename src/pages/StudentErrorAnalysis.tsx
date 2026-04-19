import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Paywall, TrialBanner } from "@/components/Paywall";
import { MetricCard } from "@/components/MetricCard";
import { useAuth } from "@/hooks/useAuth";
import { useSubjects, useContents, useTopics, useExams } from "@/hooks/useSubjects";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  AlertTriangle,
  XCircle,
  RefreshCw,
  Clock,
  Target,
  Repeat,
  TrendingDown,
  RotateCcw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const DIFFICULTY_LABELS: Record<string, string> = {
  facil: "Fácil",
  medio: "Médio",
  dificil: "Difícil",
  Fácil: "Fácil",
  Médio: "Médio",
  Difícil: "Difícil",
};

const StudentErrorAnalysis = () => {
  const { user, subscription } = useAuth();
  const navigate = useNavigate();

  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedContent, setSelectedContent] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedExam, setSelectedExam] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const { data: subjects = [] } = useSubjects();
  const { data: contents = [] } = useContents(
    selectedSubject !== "all" ? selectedSubject : undefined
  );
  const { data: topics = [] } = useTopics(
    selectedContent !== "all" ? selectedContent : undefined
  );
  const { data: exams = [] } = useExams();

  // Todos os tópicos (para resolver nomes no ranking, independentemente do filtro)
  const { data: allTopics = [] } = useQuery({
    queryKey: ["all-topics-name-map"],
    queryFn: async () => {
      const { data, error } = await supabase.from("topics").select("id, name");
      if (error) throw error;
      return data || [];
    },
  });

  // Buscar todas as respostas erradas + as corretas necessárias para comparar
  const { data: allAnswers = [], isLoading } = useQuery({
    queryKey: ["error-analysis-answers", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("user_answers")
        .select(
          "id, question_id, selected_answer, is_correct, time_spent_seconds, answered_at, questions(id, statement, subject_id, content_id, exam_id, difficulty, correct_answer, year, question_topics(topic_id), subjects(name), contents(name), exams(name))"
        )
        .eq("user_id", user.id)
        .order("answered_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Aplicar filtros
  const filteredAnswers = useMemo(() => {
    return allAnswers.filter((a: any) => {
      const q = a.questions;
      if (!q) return false;
      if (selectedSubject !== "all" && q.subject_id !== selectedSubject) return false;
      if (selectedContent !== "all" && q.content_id !== selectedContent) return false;
      if (selectedExam !== "all" && q.exam_id !== selectedExam) return false;
      if (selectedDifficulty !== "all" && q.difficulty !== selectedDifficulty) return false;
      if (selectedTopic !== "all") {
        const hasTopic = q.question_topics?.some((qt: any) => qt.topic_id === selectedTopic);
        if (!hasTopic) return false;
      }
      return true;
    });
  }, [allAnswers, selectedSubject, selectedContent, selectedTopic, selectedExam, selectedDifficulty]);

  const wrongAnswers = useMemo(
    () => filteredAnswers.filter((a: any) => !a.is_correct),
    [filteredAnswers]
  );
  const correctAnswers = useMemo(
    () => filteredAnswers.filter((a: any) => a.is_correct),
    [filteredAnswers]
  );

  const totalAnswered = filteredAnswers.length;
  const totalWrong = wrongAnswers.length;
  const errorRate = totalAnswered > 0 ? Math.round((totalWrong / totalAnswered) * 100) : 0;

  const avgWrongTime = useMemo(() => {
    const times = wrongAnswers
      .map((a: any) => a.time_spent_seconds)
      .filter((t): t is number => typeof t === "number" && t > 0);
    return times.length > 0 ? Math.round(times.reduce((s, t) => s + t, 0) / times.length) : 0;
  }, [wrongAnswers]);

  const avgCorrectTime = useMemo(() => {
    const times = correctAnswers
      .map((a: any) => a.time_spent_seconds)
      .filter((t): t is number => typeof t === "number" && t > 0);
    return times.length > 0 ? Math.round(times.reduce((s, t) => s + t, 0) / times.length) : 0;
  }, [correctAnswers]);

  // Ranking por matéria
  const errorsBySubject = useMemo(() => {
    const map = new Map<string, { name: string; wrong: number; total: number }>();
    filteredAnswers.forEach((a: any) => {
      const name = a.questions?.subjects?.name || "Sem matéria";
      const entry = map.get(name) || { name, wrong: 0, total: 0 };
      entry.total++;
      if (!a.is_correct) entry.wrong++;
      map.set(name, entry);
    });
    return Array.from(map.values())
      .filter((e) => e.wrong > 0)
      .map((e) => ({ ...e, errorRate: Math.round((e.wrong / e.total) * 100) }))
      .sort((a, b) => b.wrong - a.wrong);
  }, [filteredAnswers]);

  // Ranking por conteúdo
  const errorsByContent = useMemo(() => {
    const map = new Map<string, { name: string; subject: string; wrong: number; total: number }>();
    filteredAnswers.forEach((a: any) => {
      const name = a.questions?.contents?.name || "Sem conteúdo";
      const subject = a.questions?.subjects?.name || "";
      const key = `${subject}::${name}`;
      const entry = map.get(key) || { name, subject, wrong: 0, total: 0 };
      entry.total++;
      if (!a.is_correct) entry.wrong++;
      map.set(key, entry);
    });
    return Array.from(map.values())
      .filter((e) => e.wrong > 0)
      .map((e) => ({ ...e, errorRate: Math.round((e.wrong / e.total) * 100) }))
      .sort((a, b) => b.wrong - a.wrong)
      .slice(0, 15);
  }, [filteredAnswers]);

  // Ranking por tópico
  const errorsByTopic = useMemo(() => {
    const topicNameMap = new Map(allTopics.map((t: any) => [t.id, t.name]));
    const map = new Map<string, { name: string; wrong: number; total: number }>();
    filteredAnswers.forEach((a: any) => {
      const qts = a.questions?.question_topics || [];
      qts.forEach((qt: any) => {
        const name = topicNameMap.get(qt.topic_id) || qt.topic_id;
        const entry = map.get(name) || { name, wrong: 0, total: 0 };
        entry.total++;
        if (!a.is_correct) entry.wrong++;
        map.set(name, entry);
      });
    });
    return Array.from(map.values())
      .filter((e) => e.wrong > 0)
      .map((e) => ({ ...e, errorRate: Math.round((e.wrong / e.total) * 100) }))
      .sort((a, b) => b.wrong - a.wrong)
      .slice(0, 15);
  }, [filteredAnswers, allTopics]);

  // Padrão: alternativa marcada quando errou
  const wrongAnswerDistribution = useMemo(() => {
    const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    wrongAnswers.forEach((a: any) => {
      const letter = (a.selected_answer || "").toUpperCase();
      if (letter in counts) counts[letter]++;
    });
    return Object.entries(counts).map(([letter, count]) => ({ letter, count }));
  }, [wrongAnswers]);

  const mostMarkedWrong = useMemo(() => {
    const sorted = [...wrongAnswerDistribution].sort((a, b) => b.count - a.count);
    return sorted[0]?.count > 0 ? sorted[0] : null;
  }, [wrongAnswerDistribution]);

  // Erros por dificuldade
  const errorsByDifficulty = useMemo(() => {
    const map = new Map<string, { wrong: number; total: number }>();
    filteredAnswers.forEach((a: any) => {
      const diff = DIFFICULTY_LABELS[a.questions?.difficulty || ""] || "Sem nível";
      const entry = map.get(diff) || { wrong: 0, total: 0 };
      entry.total++;
      if (!a.is_correct) entry.wrong++;
      map.set(diff, entry);
    });
    return Array.from(map.entries()).map(([name, { wrong, total }]) => ({
      name,
      wrong,
      total,
      errorRate: total > 0 ? Math.round((wrong / total) * 100) : 0,
    }));
  }, [filteredAnswers]);

  // Erros recorrentes (mesma questão errada ≥ 2 vezes)
  const recurrentErrors = useMemo(() => {
    const map = new Map<string, { question: any; wrongCount: number; lastWrong: string }>();
    wrongAnswers.forEach((a: any) => {
      const qid = a.question_id;
      const entry = map.get(qid);
      if (entry) {
        entry.wrongCount++;
        if (a.answered_at > entry.lastWrong) entry.lastWrong = a.answered_at;
      } else {
        map.set(qid, {
          question: a.questions,
          wrongCount: 1,
          lastWrong: a.answered_at,
        });
      }
    });
    return Array.from(map.values())
      .filter((e) => e.wrongCount >= 2)
      .sort((a, b) => b.wrongCount - a.wrongCount)
      .slice(0, 10);
  }, [wrongAnswers]);

  // IDs únicos de questões erradas para refazer
  const uniqueWrongQuestionIds = useMemo(() => {
    return Array.from(new Set(wrongAnswers.map((a: any) => a.question_id)));
  }, [wrongAnswers]);

  // Padrão de tempo: rápido demais (< 15s) ou lento demais (> 180s) nos erros
  const timePatterns = useMemo(() => {
    let fast = 0;
    let slow = 0;
    let normal = 0;
    wrongAnswers.forEach((a: any) => {
      const t = a.time_spent_seconds || 0;
      if (t > 0 && t < 15) fast++;
      else if (t > 180) slow++;
      else normal++;
    });
    return { fast, slow, normal };
  }, [wrongAnswers]);

  const handleRetryWrong = async () => {
    if (uniqueWrongQuestionIds.length === 0) {
      toast.error("Você não tem questões erradas para refazer.");
      return;
    }
    if (!user?.id) return;

    try {
      // Cria um simulado com as questões erradas
      const { data: sim, error: simError } = await supabase
        .from("simulations")
        .insert({
          user_id: user.id,
          title: "Refazer questões erradas",
          question_count: uniqueWrongQuestionIds.length,
          status: "pending",
        })
        .select()
        .single();

      if (simError) throw simError;

      // Insere as questões na ordem
      const rows = uniqueWrongQuestionIds.map((qid, idx) => ({
        simulation_id: sim.id,
        question_id: qid,
        question_order: idx + 1,
      }));
      const { error: insertError } = await supabase
        .from("simulation_questions")
        .insert(rows);
      if (insertError) throw insertError;

      toast.success(`Simulado criado com ${uniqueWrongQuestionIds.length} questão(ões) erradas!`);
      navigate("/student/simulations");
    } catch (e: any) {
      toast.error(`Erro ao criar simulado: ${e.message}`);
    }
  };

  const resetFilters = () => {
    setSelectedSubject("all");
    setSelectedContent("all");
    setSelectedTopic("all");
    setSelectedExam("all");
    setSelectedDifficulty("all");
  };

  if (!subscription.hasAccess) {
    return (
      <Layout>
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Análise de Erros</h2>
            <p className="text-muted-foreground">
              Entenda onde você mais erra e foque seus estudos
            </p>
          </div>
          <Paywall
            title="Análise de Erros Bloqueada"
            description="Assine para acessar a análise detalhada dos seus erros e acelerar sua evolução."
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Análise de Erros</h2>
            <p className="text-muted-foreground">
              Descubra onde você mais erra para direcionar seus estudos
            </p>
          </div>
          <Button
            onClick={handleRetryWrong}
            disabled={uniqueWrongQuestionIds.length === 0}
            className="gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            <RefreshCw className="h-4 w-4" />
            Refazer {uniqueWrongQuestionIds.length} {uniqueWrongQuestionIds.length === 1 ? "questão errada" : "questões erradas"}
          </Button>
        </div>

        <TrialBanner />

        {/* Filtros */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
              <div className="space-y-1.5">
                <Label className="text-xs">Matéria</Label>
                <Select
                  value={selectedSubject}
                  onValueChange={(v) => {
                    setSelectedSubject(v);
                    setSelectedContent("all");
                    setSelectedTopic("all");
                  }}
                >
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {subjects.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Conteúdo</Label>
                <Select
                  value={selectedContent}
                  onValueChange={(v) => {
                    setSelectedContent(v);
                    setSelectedTopic("all");
                  }}
                  disabled={selectedSubject === "all"}
                >
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {contents.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Tópico</Label>
                <Select
                  value={selectedTopic}
                  onValueChange={setSelectedTopic}
                  disabled={selectedContent === "all"}
                >
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {topics.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Vestibular</Label>
                <Select value={selectedExam} onValueChange={setSelectedExam}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {exams.map((e: any) => (
                      <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Dificuldade</Label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="facil">Fácil</SelectItem>
                    <SelectItem value="medio">Médio</SelectItem>
                    <SelectItem value="dificil">Difícil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <Button variant="ghost" size="sm" onClick={resetFilters} className="gap-1.5">
                <RotateCcw className="h-3.5 w-3.5" />
                Limpar filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Carregando análise...
            </CardContent>
          </Card>
        ) : totalAnswered === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Nenhuma questão respondida com os filtros aplicados.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Métricas de topo */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Total de Erros"
                value={totalWrong.toString()}
                icon={XCircle}
                variant="default"
                trend={`de ${totalAnswered} respondidas`}
              />
              <MetricCard
                title="Taxa de Erro"
                value={`${errorRate}%`}
                icon={TrendingDown}
                variant={errorRate > 50 ? "default" : "default"}
              />
              <MetricCard
                title="Tempo Médio nos Erros"
                value={`${avgWrongTime}s`}
                icon={Clock}
                variant="default"
                trend={avgCorrectTime > 0 ? `vs ${avgCorrectTime}s nos acertos` : undefined}
              />
              <MetricCard
                title="Erros Recorrentes"
                value={recurrentErrors.length.toString()}
                icon={Repeat}
                variant="default"
                trend="questões erradas 2+ vezes"
              />
            </div>

            {/* Padrões de erro */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Alternativa mais marcada errada */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-5 w-5 text-destructive" />
                    Padrão de Alternativas Erradas
                  </CardTitle>
                  <CardDescription>
                    Distribuição da alternativa que você marcou ao errar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {totalWrong > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={wrongAnswerDistribution}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="letter" />
                          <YAxis allowDecimals={false} />
                          <RechartsTooltip />
                          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                            {wrongAnswerDistribution.map((entry, i) => (
                              <Cell
                                key={i}
                                fill={
                                  mostMarkedWrong && entry.letter === mostMarkedWrong.letter
                                    ? "hsl(0 72% 51%)"
                                    : "hsl(var(--muted-foreground))"
                                }
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                      {mostMarkedWrong && (
                        <p className="text-sm text-muted-foreground mt-3">
                          Você costuma marcar a alternativa{" "}
                          <strong className="text-foreground">{mostMarkedWrong.letter}</strong>{" "}
                          com mais frequência quando erra ({mostMarkedWrong.count} vezes).
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">Sem erros no período</p>
                  )}
                </CardContent>
              </Card>

              {/* Padrão de tempo */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-destructive" />
                    Padrão de Tempo nos Erros
                  </CardTitle>
                  <CardDescription>
                    Identifica se você erra por pressa ou por excesso de tempo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 rounded-lg border">
                      <p className="text-2xl font-bold text-foreground">{timePatterns.fast}</p>
                      <p className="text-xs text-muted-foreground mt-1">Rápido demais (&lt;15s)</p>
                    </div>
                    <div className="text-center p-3 rounded-lg border">
                      <p className="text-2xl font-bold text-foreground">{timePatterns.normal}</p>
                      <p className="text-xs text-muted-foreground mt-1">Tempo normal</p>
                    </div>
                    <div className="text-center p-3 rounded-lg border">
                      <p className="text-2xl font-bold text-foreground">{timePatterns.slow}</p>
                      <p className="text-xs text-muted-foreground mt-1">Lento demais (&gt;3min)</p>
                    </div>
                  </div>
                  {totalWrong > 0 && (
                    <div className="p-3 rounded-lg bg-muted/50 text-sm">
                      {timePatterns.fast / totalWrong > 0.4 ? (
                        <p className="text-foreground">
                          ⚡ <strong>Atenção:</strong> Mais de 40% dos seus erros foram com pressa. Tente ler o enunciado com mais calma.
                        </p>
                      ) : timePatterns.slow / totalWrong > 0.3 ? (
                        <p className="text-foreground">
                          🐌 <strong>Atenção:</strong> Você gasta muito tempo em questões que erra. Pode indicar dificuldade no conteúdo.
                        </p>
                      ) : (
                        <p className="text-muted-foreground">
                          Seu padrão de tempo nos erros está equilibrado.
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Erros por dificuldade */}
            {errorsByDifficulty.some((d) => d.total > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Erros por Dificuldade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {errorsByDifficulty.map((d) => (
                      <div key={d.name} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{d.name}</span>
                          <span className="text-muted-foreground">
                            {d.wrong}/{d.total} erradas •{" "}
                            <span className="font-semibold text-foreground">{d.errorRate}%</span>
                          </span>
                        </div>
                        <Progress value={d.errorRate} className="h-2 [&>div]:bg-destructive" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ranking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Onde Você Mais Erra
                </CardTitle>
                <CardDescription>
                  Identifique seus pontos fracos por matéria, conteúdo ou tópico
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="subject">
                  <TabsList>
                    <TabsTrigger value="subject">Por Matéria</TabsTrigger>
                    <TabsTrigger value="content">Por Conteúdo</TabsTrigger>
                    <TabsTrigger value="topic">Por Tópico</TabsTrigger>
                  </TabsList>

                  <TabsContent value="subject" className="space-y-3 mt-4">
                    {errorsBySubject.length === 0 ? (
                      <p className="text-muted-foreground text-center py-6">Sem erros</p>
                    ) : (
                      errorsBySubject.map((e) => (
                        <RankingRow key={e.name} title={e.name} wrong={e.wrong} total={e.total} errorRate={e.errorRate} />
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="content" className="space-y-3 mt-4">
                    {errorsByContent.length === 0 ? (
                      <p className="text-muted-foreground text-center py-6">Sem erros</p>
                    ) : (
                      errorsByContent.map((e, i) => (
                        <RankingRow
                          key={`${e.subject}-${e.name}-${i}`}
                          title={e.name}
                          subtitle={e.subject}
                          wrong={e.wrong}
                          total={e.total}
                          errorRate={e.errorRate}
                        />
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="topic" className="space-y-3 mt-4">
                    {errorsByTopic.length === 0 ? (
                      <p className="text-muted-foreground text-center py-6">Sem erros</p>
                    ) : (
                      errorsByTopic.map((e, i) => (
                        <RankingRow
                          key={`${e.name}-${i}`}
                          title={e.name}
                          wrong={e.wrong}
                          total={e.total}
                          errorRate={e.errorRate}
                        />
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Erros recorrentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Repeat className="h-5 w-5 text-destructive" />
                  Erros Recorrentes
                </CardTitle>
                <CardDescription>
                  Questões que você errou mais de uma vez — atenção máxima
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recurrentErrors.length === 0 ? (
                  <p className="text-muted-foreground text-center py-6">
                    Você não errou a mesma questão duas vezes. 🎉
                  </p>
                ) : (
                  <div className="space-y-3">
                    {recurrentErrors.map((e, i) => {
                      const stmt = e.question?.statement || "";
                      const preview = stmt.replace(/<[^>]*>/g, "").slice(0, 140);
                      return (
                        <div
                          key={i}
                          className="flex items-start justify-between gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
                              <span>{e.question?.subjects?.name}</span>
                              {e.question?.contents?.name && <span>• {e.question.contents.name}</span>}
                              {e.question?.exams?.name && <span>• {e.question.exams.name} {e.question?.year}</span>}
                            </div>
                            <p className="text-sm text-foreground line-clamp-2">{preview}...</p>
                          </div>
                          <Badge variant="destructive" className="shrink-0">
                            {e.wrongCount}× errada
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
};

interface RankingRowProps {
  title: string;
  subtitle?: string;
  wrong: number;
  total: number;
  errorRate: number;
}

function RankingRow({ title, subtitle, wrong, total, errorRate }: RankingRowProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm text-foreground truncate">{title}</p>
          {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-semibold text-foreground">
            {wrong} <span className="text-muted-foreground font-normal">/ {total}</span>
          </p>
          <p className="text-xs text-muted-foreground">{errorRate}% erro</p>
        </div>
      </div>
      <Progress value={errorRate} className="h-1.5 [&>div]:bg-destructive" />
    </div>
  );
}

export default StudentErrorAnalysis;
