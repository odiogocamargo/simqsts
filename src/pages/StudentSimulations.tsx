import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ClipboardList, 
  Plus, 
  Play, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  Loader2,
  BarChart3,
  XCircle,
} from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSimulations, Simulation, SimulationQuestion } from "@/hooks/useSimulations";
import { CreateSimulationForm } from "@/components/simulation/CreateSimulationForm";
import { SimulationExecution } from "@/components/simulation/SimulationExecution";
import { SimulationFeedback } from "@/components/simulation/SimulationFeedback";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

type ViewMode = "list" | "create" | "execute" | "feedback";

const StudentSimulations = () => {
  const {
    simulations,
    simulationsLoading,
    getSimulation,
    getSimulationQuestions,
    createSimulation,
    isCreating,
    startSimulation,
    answerQuestion,
    completeSimulation,
    abandonSimulation,
    deleteSimulation,
  } = useSimulations();

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [activeSimulation, setActiveSimulation] = useState<Simulation | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<SimulationQuestion[]>([]);
  const [loadingSimulation, setLoadingSimulation] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [simulationToDelete, setSimulationToDelete] = useState<string | null>(null);

  const handleCreateSimulation = async (questionCount: number, filters: any) => {
    const simulation = await createSimulation({ questionCount, filters });
    if (simulation) {
      await loadAndStartSimulation(simulation.id);
    }
  };

  const loadAndStartSimulation = async (simulationId: string) => {
    setLoadingSimulation(true);
    try {
      const simulation = await getSimulation(simulationId);
      const questions = await getSimulationQuestions(simulationId);
      
      if (simulation.status === "pending") {
        await startSimulation(simulationId);
        simulation.status = "in_progress";
      }

      setActiveSimulation(simulation);
      setActiveQuestions(questions);
      setViewMode("execute");
    } finally {
      setLoadingSimulation(false);
    }
  };

  const loadSimulationFeedback = async (simulationId: string) => {
    setLoadingSimulation(true);
    try {
      const simulation = await getSimulation(simulationId);
      const questions = await getSimulationQuestions(simulationId);
      setActiveSimulation(simulation);
      setActiveQuestions(questions);
      setViewMode("feedback");
    } finally {
      setLoadingSimulation(false);
    }
  };

  const handleAnswerQuestion = async (
    questionId: string,
    answer: string,
    isCorrect: boolean,
    timeSpent: number
  ) => {
    await answerQuestion({
      simulationQuestionId: questionId,
      selectedAnswer: answer,
      isCorrect,
      timeSpentSeconds: timeSpent,
    });
  };

  const handleCompleteSimulation = async () => {
    if (!activeSimulation) return;
    await completeSimulation(activeSimulation.id);
    await loadSimulationFeedback(activeSimulation.id);
  };

  const handleAbandonSimulation = async () => {
    if (!activeSimulation) return;
    await abandonSimulation(activeSimulation.id);
    await loadSimulationFeedback(activeSimulation.id);
  };

  const handleDeleteSimulation = async () => {
    if (!simulationToDelete) return;
    await deleteSimulation(simulationToDelete);
    setDeleteDialogOpen(false);
    setSimulationToDelete(null);
  };

  const confirmDelete = (id: string) => {
    setSimulationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const resetToList = () => {
    setViewMode("list");
    setActiveSimulation(null);
    setActiveQuestions([]);
  };

  const getStatusBadge = (status: Simulation["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pendente</Badge>;
      case "in_progress":
        return <Badge variant="secondary">Em andamento</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Concluído</Badge>;
      case "abandoned":
        return <Badge variant="destructive">Abandonado</Badge>;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  // Lista de simulados
  const renderList = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Simulados</h1>
          <p className="text-muted-foreground">Pratique com simulados personalizados</p>
        </div>
        <Button onClick={() => setViewMode("create")} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Simulado
        </Button>
      </div>

      {simulationsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : simulations && simulations.length > 0 ? (
        <div className="grid gap-4">
          {simulations.map((sim) => (
            <Card key={sim.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ClipboardList className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{sim.title}</h3>
                        {getStatusBadge(sim.status)}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span>{sim.question_count} questões</span>
                        {sim.total_time_seconds && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(sim.total_time_seconds)}
                            </span>
                          </>
                        )}
                        {sim.score_percentage !== null && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              {sim.score_percentage >= 50 ? (
                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                              ) : (
                                <XCircle className="h-3 w-3 text-red-500" />
                              )}
                              {sim.score_percentage.toFixed(0)}%
                            </span>
                          </>
                        )}
                        <span>•</span>
                        <span>
                          {formatDistanceToNow(new Date(sim.created_at), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {(sim.status === "pending" || sim.status === "in_progress") && (
                      <Button
                        size="sm"
                        onClick={() => loadAndStartSimulation(sim.id)}
                        disabled={loadingSimulation}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        {sim.status === "pending" ? "Iniciar" : "Continuar"}
                      </Button>
                    )}
                    {(sim.status === "completed" || sim.status === "abandoned") && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => loadSimulationFeedback(sim.id)}
                        disabled={loadingSimulation}
                      >
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Ver Resultado
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => confirmDelete(sim.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum simulado ainda</h3>
            <p className="text-muted-foreground mb-4">
              Crie seu primeiro simulado para começar a praticar
            </p>
            <Button onClick={() => setViewMode("create")}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Simulado
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <Layout>
      {loadingSimulation && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Carregando simulado...</p>
          </div>
        </div>
      )}

      {viewMode === "list" && renderList()}

      {viewMode === "create" && (
        <div className="max-w-2xl mx-auto">
          <CreateSimulationForm
            onSubmit={handleCreateSimulation}
            isLoading={isCreating}
            onCancel={resetToList}
          />
        </div>
      )}

      {viewMode === "execute" && activeSimulation && activeQuestions.length > 0 && (
        <SimulationExecution
          questions={activeQuestions}
          onAnswer={handleAnswerQuestion}
          onComplete={handleCompleteSimulation}
          onAbandon={handleAbandonSimulation}
        />
      )}

      {viewMode === "feedback" && activeSimulation && (
        <SimulationFeedback
          simulation={activeSimulation}
          questions={activeQuestions}
          onBack={resetToList}
        />
      )}

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir simulado?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O simulado e todas as suas respostas serão removidos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSimulation}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default StudentSimulations;
