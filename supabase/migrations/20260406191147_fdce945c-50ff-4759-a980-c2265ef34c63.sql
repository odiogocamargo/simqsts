
-- Tabela de turmas
CREATE TABLE public.school_classes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM now()),
  shift TEXT, -- manhã, tarde, noite
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Vínculo aluno-turma
CREATE TABLE public.school_class_students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID NOT NULL REFERENCES public.school_classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL, -- user_id do aluno
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(class_id, student_id)
);

-- RLS
ALTER TABLE public.school_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_class_students ENABLE ROW LEVEL SECURITY;

-- Policies school_classes
CREATE POLICY "Admins podem gerenciar turmas"
ON public.school_classes FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Coordenadores podem gerenciar turmas da sua escola"
ON public.school_classes FOR ALL
USING (EXISTS (
  SELECT 1 FROM school_coordinators sc
  WHERE sc.user_id = auth.uid() AND sc.school_id = school_classes.school_id
))
WITH CHECK (EXISTS (
  SELECT 1 FROM school_coordinators sc
  WHERE sc.user_id = auth.uid() AND sc.school_id = school_classes.school_id
));

CREATE POLICY "Alunos podem ver turmas da sua escola"
ON public.school_classes FOR SELECT
USING (EXISTS (
  SELECT 1 FROM school_students ss
  WHERE ss.user_id = auth.uid() AND ss.school_id = school_classes.school_id
));

-- Policies school_class_students
CREATE POLICY "Admins podem gerenciar alunos de turmas"
ON public.school_class_students FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Coordenadores podem gerenciar alunos de turmas da sua escola"
ON public.school_class_students FOR ALL
USING (EXISTS (
  SELECT 1 FROM school_classes sc2
  JOIN school_coordinators coord ON coord.school_id = sc2.school_id
  WHERE sc2.id = school_class_students.class_id AND coord.user_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM school_classes sc2
  JOIN school_coordinators coord ON coord.school_id = sc2.school_id
  WHERE sc2.id = school_class_students.class_id AND coord.user_id = auth.uid()
));

CREATE POLICY "Alunos podem ver seus vínculos de turma"
ON public.school_class_students FOR SELECT
USING (auth.uid() = student_id);

-- Trigger updated_at
CREATE TRIGGER update_school_classes_updated_at
BEFORE UPDATE ON public.school_classes
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
