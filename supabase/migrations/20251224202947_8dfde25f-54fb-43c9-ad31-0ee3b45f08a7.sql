-- Criar tabela de áreas (nível superior da taxonomia V3)
CREATE TABLE public.areas (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para areas
CREATE POLICY "Todos podem ver áreas" 
ON public.areas 
FOR SELECT 
USING (true);

CREATE POLICY "Admins podem gerenciar áreas" 
ON public.areas 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Adicionar coluna area_id na tabela subjects
ALTER TABLE public.subjects 
ADD COLUMN area_id TEXT REFERENCES public.areas(id);

-- Adicionar coluna needs_review na tabela questions para marcar questões que precisam de revisão manual
ALTER TABLE public.questions 
ADD COLUMN needs_review BOOLEAN DEFAULT false;

-- Adicionar coluna review_reason para explicar o motivo da revisão
ALTER TABLE public.questions 
ADD COLUMN review_reason TEXT;

-- Índice para buscar questões que precisam de revisão
CREATE INDEX idx_questions_needs_review ON public.questions(needs_review) WHERE needs_review = true;