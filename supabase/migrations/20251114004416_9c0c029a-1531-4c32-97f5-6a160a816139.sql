-- Tabela para armazenar as respostas dos usuários
CREATE TABLE IF NOT EXISTS public.user_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  question_id uuid NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_answer text NOT NULL,
  is_correct boolean NOT NULL,
  answered_at timestamp with time zone NOT NULL DEFAULT now(),
  time_spent_seconds integer,
  CONSTRAINT fk_user_answers_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabela para estatísticas de desempenho por matéria
CREATE TABLE IF NOT EXISTS public.user_performance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  subject_id text NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  total_questions integer NOT NULL DEFAULT 0,
  correct_answers integer NOT NULL DEFAULT 0,
  wrong_answers integer NOT NULL DEFAULT 0,
  accuracy_percentage decimal(5,2) GENERATED ALWAYS AS (
    CASE 
      WHEN total_questions > 0 THEN (correct_answers::decimal / total_questions::decimal * 100)
      ELSE 0
    END
  ) STORED,
  last_practice_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT fk_user_performance_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(user_id, subject_id)
);

-- Tabela para sessões de estudo
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  subject_id text REFERENCES public.subjects(id) ON DELETE SET NULL,
  exam_id text REFERENCES public.exams(id) ON DELETE SET NULL,
  questions_answered integer NOT NULL DEFAULT 0,
  correct_answers integer NOT NULL DEFAULT 0,
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  ended_at timestamp with time zone,
  duration_minutes integer,
  CONSTRAINT fk_study_sessions_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_answers_user_id ON public.user_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_user_answers_question_id ON public.user_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_user_answers_answered_at ON public.user_answers(answered_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_performance_user_id ON public.user_performance(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON public.study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_started_at ON public.study_sessions(started_at DESC);

-- Habilitar RLS
ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para user_answers
CREATE POLICY "Usuários podem ver suas próprias respostas"
  ON public.user_answers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias respostas"
  ON public.user_answers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todas as respostas"
  ON public.user_answers FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Políticas RLS para user_performance
CREATE POLICY "Usuários podem ver seu próprio desempenho"
  ON public.user_performance FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seu próprio desempenho"
  ON public.user_performance FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seu próprio desempenho"
  ON public.user_performance FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todos os desempenhos"
  ON public.user_performance FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Políticas RLS para study_sessions
CREATE POLICY "Usuários podem ver suas próprias sessões"
  ON public.study_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias sessões"
  ON public.study_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias sessões"
  ON public.study_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todas as sessões"
  ON public.study_sessions FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_user_performance_updated_at
  BEFORE UPDATE ON public.user_performance
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();