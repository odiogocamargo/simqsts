-- Tabela para armazenar simulados criados pelos alunos
CREATE TABLE public.simulations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT,
  question_count INTEGER NOT NULL,
  time_limit_minutes INTEGER,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'abandoned')),
  -- Filtros aplicados (armazenados como arrays de IDs)
  subject_ids TEXT[],
  content_ids TEXT[],
  exam_ids TEXT[],
  difficulty_levels TEXT[],
  years INTEGER[],
  -- Resultados
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  total_correct INTEGER DEFAULT 0,
  total_answered INTEGER DEFAULT 0,
  score_percentage NUMERIC(5,2),
  total_time_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para armazenar as questões de cada simulado
CREATE TABLE public.simulation_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  simulation_id UUID NOT NULL REFERENCES public.simulations(id) ON DELETE CASCADE,
  question_id UUID NOT NULL,
  question_order INTEGER NOT NULL,
  selected_answer TEXT,
  is_correct BOOLEAN,
  time_spent_seconds INTEGER,
  answered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para melhor performance
CREATE INDEX idx_simulations_user_id ON public.simulations(user_id);
CREATE INDEX idx_simulations_status ON public.simulations(status);
CREATE INDEX idx_simulation_questions_simulation_id ON public.simulation_questions(simulation_id);

-- Enable RLS
ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulation_questions ENABLE ROW LEVEL SECURITY;

-- Políticas para simulations
CREATE POLICY "Usuários podem ver seus próprios simulados"
ON public.simulations
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios simulados"
ON public.simulations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios simulados"
ON public.simulations
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios simulados"
ON public.simulations
FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todos os simulados"
ON public.simulations
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Políticas para simulation_questions
CREATE POLICY "Usuários podem ver questões de seus simulados"
ON public.simulation_questions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.simulations s 
    WHERE s.id = simulation_id AND s.user_id = auth.uid()
  )
);

CREATE POLICY "Usuários podem inserir questões em seus simulados"
ON public.simulation_questions
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.simulations s 
    WHERE s.id = simulation_id AND s.user_id = auth.uid()
  )
);

CREATE POLICY "Usuários podem atualizar questões de seus simulados"
ON public.simulation_questions
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.simulations s 
    WHERE s.id = simulation_id AND s.user_id = auth.uid()
  )
);

CREATE POLICY "Admins podem gerenciar todas as questões de simulados"
ON public.simulation_questions
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para updated_at
CREATE TRIGGER update_simulations_updated_at
  BEFORE UPDATE ON public.simulations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();