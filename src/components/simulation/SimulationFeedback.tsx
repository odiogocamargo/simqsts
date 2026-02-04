import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CheckCircle2, XCircle, Clock, Target, TrendingUp, ArrowLeft, Trophy } from "lucide-react";
import { Simulation, SimulationQuestion } from "@/hooks/useSimulations";

interface SimulationFeedbackProps {
  simulation: Simulation;
  questions: SimulationQuestion[];
  onBack: () => void;
}

export function SimulationFeedback({ simulation, questions, onBack }: SimulationFeedbackProps) {
  const stats = useMemo(() => {
    const answered = questions.filter((q) => q.selected_answer !== null);
    const correct = questions.filter((q) => q.is_correct === true);
    const wrong = questions.filter((q) => q.is_correct === false);
    const unanswered = questions.filter((q) => q.selected_answer === null);
    
    const totalTime = questions.reduce((acc, q) => acc + (q.time_spent_seconds || 0), 0);
    const avgTime = answered.length > 0 ? totalTime / answered.length : 0;

    // Por matéria
    const bySubject = questions.reduce((acc, q) => {
      const subjectName = q.question?.subjects?.name || "Sem matéria";
      if (!acc[subjectName]) {
        acc[subjectName] = { total: 0, correct: 0, wrong: 0 };
      }
      acc[subjectName].total++;
      if (q.is_correct === true) acc[subjectName].correct++;
      if (q.is_correct === false) acc[subjectName].wrong++;
      return acc;
    }, {} as Record<string, { total: number; correct: number; wrong: number }>);

    // Por dificuldade
    const byDifficulty = questions.reduce((acc, q) => {
      const diff = q.question?.difficulty || "Sem nível";
      if (!acc[diff]) {
        acc[diff] = { total: 0, correct: 0, wrong: 0 };
      }
      acc[diff].total++;
      if (q.is_correct === true) acc[diff].correct++;
      if (q.is_correct === false) acc[diff].wrong++;
      return acc;
    }, {} as Record<string, { total: number; correct: number; wrong: number }>);

    return {
      total: questions.length,
      answered: answered.length,
      correct: correct.length,
      wrong: wrong.length,
      unanswered: unanswered.length,
      percentage: answered.length > 0 ? (correct.length / answered.length) * 100 : 0,
      totalTime,
      avgTime,
      bySubject,
      byDifficulty,
    };
  }, [questions]);

  const pieData = [
    { name: "Acertos", value: stats.correct, color: "#22c55e" },
    { name: "Erros", value: stats.wrong, color: "#ef4444" },
    { name: "Não respondidas", value: stats.unanswered, color: "#9ca3af" },
  ].filter((d) => d.value > 0);

  const subjectData = Object.entries(stats.bySubject)
    .map(([name, data]) => ({
      name: name.length > 15 ? name.substring(0, 15) + "..." : name,
      fullName: name,
      Acertos: data.correct,
      Erros: data.wrong,
      percentage: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const difficultyData = Object.entries(stats.byDifficulty)
    .map(([name, data]) => ({
      name: name === "facil" ? "Fácil" : name === "medio" ? "Médio" : name === "dificil" ? "Difícil" : name,
      Acertos: data.correct,
      Erros: data.wrong,
      percentage: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
    }));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const getPerformanceMessage = () => {
    if (stats.percentage >= 90) return { text: "Excelente!", color: "text-green-600" };
    if (stats.percentage >= 70) return { text: "Muito bom!", color: "text-green-500" };
    if (stats.percentage >= 50) return { text: "Bom trabalho!", color: "text-yellow-500" };
    return { text: "Continue praticando!", color: "text-orange-500" };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <Badge variant={simulation.status === "completed" ? "default" : "secondary"}>
          {simulation.status === "completed" ? "Concluído" : "Abandonado"}
        </Badge>
      </div>

      {/* Score principal */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <Trophy className={`h-16 w-16 ${performance.color}`} />
              </div>
            </div>
            <div>
              <h2 className={`text-4xl font-bold ${performance.color}`}>
                {stats.percentage.toFixed(1)}%
              </h2>
              <p className={`text-lg font-medium ${performance.color}`}>{performance.text}</p>
            </div>
            <div className="flex justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span><strong>{stats.correct}</strong> acertos</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <span><strong>{stats.wrong}</strong> erros</span>
              </div>
              {stats.unanswered > 0 && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span><strong>{stats.unanswered}</strong> não respondidas</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Questões</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tempo Total</p>
                <p className="text-2xl font-bold">{formatTime(stats.totalTime)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tempo Médio</p>
                <p className="text-2xl font-bold">{formatTime(stats.avgTime)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Pizza de acertos/erros */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribuição de Respostas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Barras por dificuldade */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Desempenho por Dificuldade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={difficultyData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Acertos" fill="#22c55e" />
                  <Bar dataKey="Erros" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Desempenho por matéria */}
      {subjectData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Desempenho por Matéria</CardTitle>
            <CardDescription>Taxa de acerto em cada disciplina</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjectData.map((subject) => (
                <div key={subject.fullName} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium" title={subject.fullName}>
                      {subject.name}
                    </span>
                    <span className="text-muted-foreground">
                      {subject.Acertos}/{subject.Acertos + subject.Erros} ({subject.percentage}%)
                    </span>
                  </div>
                  <Progress 
                    value={subject.percentage} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de questões */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Revisão das Questões</CardTitle>
          <CardDescription>Clique para ver detalhes de cada questão</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {questions.map((q, i) => (
              <div
                key={q.id}
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    q.is_correct === true
                      ? "bg-green-100 text-green-700"
                      : q.is_correct === false
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">
                    {q.question?.subjects?.name} - {q.question?.contents?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {q.question?.exams?.name} {q.question?.year}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {q.time_spent_seconds && (
                    <Badge variant="outline" className="text-xs">
                      {formatTime(q.time_spent_seconds)}
                    </Badge>
                  )}
                  {q.is_correct === true && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                  {q.is_correct === false && (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  {q.selected_answer === null && (
                    <Badge variant="secondary">Não respondida</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ação final */}
      <div className="flex justify-center">
        <Button onClick={onBack} size="lg">
          Voltar para Simulados
        </Button>
      </div>
    </div>
  );
}
