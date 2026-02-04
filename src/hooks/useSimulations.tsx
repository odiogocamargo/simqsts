import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "@/hooks/use-toast";

export interface SimulationFilters {
  subjectIds?: string[];
  contentIds?: string[];
  examIds?: string[];
  difficultyLevels?: string[];
  years?: number[];
}

export interface Simulation {
  id: string;
  user_id: string;
  title: string | null;
  question_count: number;
  time_limit_minutes: number | null;
  status: "pending" | "in_progress" | "completed" | "abandoned";
  subject_ids: string[] | null;
  content_ids: string[] | null;
  exam_ids: string[] | null;
  difficulty_levels: string[] | null;
  years: number[] | null;
  started_at: string | null;
  completed_at: string | null;
  total_correct: number;
  total_answered: number;
  score_percentage: number | null;
  total_time_seconds: number | null;
  created_at: string;
  updated_at: string;
}

export interface SimulationQuestion {
  id: string;
  simulation_id: string;
  question_id: string;
  question_order: number;
  selected_answer: string | null;
  is_correct: boolean | null;
  time_spent_seconds: number | null;
  answered_at: string | null;
  created_at: string;
  question?: {
    id: string;
    statement: string;
    option_a: string | null;
    option_b: string | null;
    option_c: string | null;
    option_d: string | null;
    option_e: string | null;
    correct_answer: string | null;
    explanation: string | null;
    difficulty: string | null;
    year: number;
    subject_id: string;
    content_id: string;
    exam_id: string;
    subjects?: { name: string };
    contents?: { name: string };
    exams?: { name: string };
  };
}

export const useSimulations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar todos os simulados do usuário
  const { data: simulations, isLoading: simulationsLoading } = useQuery({
    queryKey: ["simulations", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("simulations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Simulation[];
    },
    enabled: !!user?.id,
  });

  // Buscar um simulado específico
  const getSimulation = async (simulationId: string) => {
    const { data, error } = await supabase
      .from("simulations")
      .select("*")
      .eq("id", simulationId)
      .single();

    if (error) throw error;
    return data as Simulation;
  };

  // Buscar questões de um simulado com detalhes
  const getSimulationQuestions = async (simulationId: string) => {
    // Primeiro buscar as questões do simulado
    const { data: simQuestions, error } = await supabase
      .from("simulation_questions")
      .select("*")
      .eq("simulation_id", simulationId)
      .order("question_order", { ascending: true });

    if (error) throw error;

    // Buscar detalhes das questões
    const questionIds = simQuestions.map((sq) => sq.question_id);
    
    const { data: questions, error: qError } = await supabase
      .from("questions")
      .select(`
        id,
        statement,
        option_a,
        option_b,
        option_c,
        option_d,
        option_e,
        correct_answer,
        explanation,
        difficulty,
        year,
        subject_id,
        content_id,
        exam_id,
        subjects (name),
        contents (name),
        exams (name)
      `)
      .in("id", questionIds);

    if (qError) throw qError;

    // Combinar os dados
    const questionsMap = new Map(questions.map((q) => [q.id, q]));
    
    return simQuestions.map((sq) => ({
      ...sq,
      question: questionsMap.get(sq.question_id),
    })) as SimulationQuestion[];
  };

  // Criar novo simulado
  const createSimulationMutation = useMutation({
    mutationFn: async ({
      questionCount,
      filters,
      title,
    }: {
      questionCount: number;
      filters: SimulationFilters;
      title?: string;
    }) => {
      if (!user?.id) throw new Error("Usuário não autenticado");

      // Buscar questões aleatórias com base nos filtros
      let query = supabase
        .from("questions")
        .select("id")
        .eq("question_type", "multipla_escolha");

      if (filters.subjectIds && filters.subjectIds.length > 0) {
        query = query.in("subject_id", filters.subjectIds);
      }
      if (filters.contentIds && filters.contentIds.length > 0) {
        query = query.in("content_id", filters.contentIds);
      }
      if (filters.examIds && filters.examIds.length > 0) {
        query = query.in("exam_id", filters.examIds);
      }
      if (filters.difficultyLevels && filters.difficultyLevels.length > 0) {
        query = query.in("difficulty", filters.difficultyLevels);
      }
      if (filters.years && filters.years.length > 0) {
        query = query.in("year", filters.years);
      }

      const { data: questions, error: questionsError } = await query;
      if (questionsError) throw questionsError;

      if (!questions || questions.length === 0) {
        throw new Error("Nenhuma questão encontrada com os filtros selecionados");
      }

      // Embaralhar e pegar a quantidade desejada
      const shuffled = questions.sort(() => Math.random() - 0.5);
      const selectedQuestions = shuffled.slice(0, Math.min(questionCount, questions.length));

      // Criar o simulado
      const { data: simulation, error: simError } = await supabase
        .from("simulations")
        .insert({
          user_id: user.id,
          title: title || `Simulado ${new Date().toLocaleDateString("pt-BR")}`,
          question_count: selectedQuestions.length,
          subject_ids: filters.subjectIds || null,
          content_ids: filters.contentIds || null,
          exam_ids: filters.examIds || null,
          difficulty_levels: filters.difficultyLevels || null,
          years: filters.years || null,
          status: "pending",
        })
        .select()
        .single();

      if (simError) throw simError;

      // Inserir as questões do simulado
      const simulationQuestions = selectedQuestions.map((q, index) => ({
        simulation_id: simulation.id,
        question_id: q.id,
        question_order: index + 1,
      }));

      const { error: sqError } = await supabase
        .from("simulation_questions")
        .insert(simulationQuestions);

      if (sqError) throw sqError;

      return simulation as Simulation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["simulations"] });
      toast({
        title: "Simulado criado!",
        description: "Seu simulado foi criado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar simulado",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Iniciar simulado
  const startSimulationMutation = useMutation({
    mutationFn: async (simulationId: string) => {
      const { data, error } = await supabase
        .from("simulations")
        .update({
          status: "in_progress",
          started_at: new Date().toISOString(),
        })
        .eq("id", simulationId)
        .select()
        .single();

      if (error) throw error;
      return data as Simulation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["simulations"] });
    },
  });

  // Responder questão
  const answerQuestionMutation = useMutation({
    mutationFn: async ({
      simulationQuestionId,
      selectedAnswer,
      isCorrect,
      timeSpentSeconds,
    }: {
      simulationQuestionId: string;
      selectedAnswer: string;
      isCorrect: boolean;
      timeSpentSeconds: number;
    }) => {
      const { data, error } = await supabase
        .from("simulation_questions")
        .update({
          selected_answer: selectedAnswer,
          is_correct: isCorrect,
          time_spent_seconds: timeSpentSeconds,
          answered_at: new Date().toISOString(),
        })
        .eq("id", simulationQuestionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Finalizar simulado
  const completeSimulationMutation = useMutation({
    mutationFn: async (simulationId: string) => {
      // Buscar todas as respostas
      const { data: questions, error: qError } = await supabase
        .from("simulation_questions")
        .select("is_correct, time_spent_seconds")
        .eq("simulation_id", simulationId);

      if (qError) throw qError;

      const totalAnswered = questions.filter((q) => q.is_correct !== null).length;
      const totalCorrect = questions.filter((q) => q.is_correct === true).length;
      const totalTime = questions.reduce((acc, q) => acc + (q.time_spent_seconds || 0), 0);
      const scorePercentage = totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : 0;

      const { data, error } = await supabase
        .from("simulations")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          total_correct: totalCorrect,
          total_answered: totalAnswered,
          score_percentage: scorePercentage,
          total_time_seconds: totalTime,
        })
        .eq("id", simulationId)
        .select()
        .single();

      if (error) throw error;
      return data as Simulation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["simulations"] });
    },
  });

  // Abandonar simulado
  const abandonSimulationMutation = useMutation({
    mutationFn: async (simulationId: string) => {
      const { data, error } = await supabase
        .from("simulations")
        .update({
          status: "abandoned",
        })
        .eq("id", simulationId)
        .select()
        .single();

      if (error) throw error;
      return data as Simulation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["simulations"] });
    },
  });

  // Deletar simulado
  const deleteSimulationMutation = useMutation({
    mutationFn: async (simulationId: string) => {
      const { error } = await supabase
        .from("simulations")
        .delete()
        .eq("id", simulationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["simulations"] });
      toast({
        title: "Simulado excluído",
        description: "O simulado foi removido com sucesso.",
      });
    },
  });

  return {
    simulations,
    simulationsLoading,
    getSimulation,
    getSimulationQuestions,
    createSimulation: createSimulationMutation.mutateAsync,
    isCreating: createSimulationMutation.isPending,
    startSimulation: startSimulationMutation.mutateAsync,
    answerQuestion: answerQuestionMutation.mutateAsync,
    completeSimulation: completeSimulationMutation.mutateAsync,
    abandonSimulation: abandonSimulationMutation.mutateAsync,
    deleteSimulation: deleteSimulationMutation.mutateAsync,
  };
};
