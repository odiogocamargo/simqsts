-- Coordinators can see school_students of their school
CREATE POLICY "Coordenadores podem ver alunos da sua escola"
  ON public.school_students
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.school_coordinators sc
      WHERE sc.user_id = auth.uid()
        AND sc.school_id = school_students.school_id
    )
  );

-- Coordinators can manage school_students of their school (add/remove)
CREATE POLICY "Coordenadores podem gerenciar alunos da sua escola"
  ON public.school_students
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.school_coordinators sc
      WHERE sc.user_id = auth.uid()
        AND sc.school_id = school_students.school_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.school_coordinators sc
      WHERE sc.user_id = auth.uid()
        AND sc.school_id = school_students.school_id
    )
  );

-- Coordinators can view user_answers of students in their school
CREATE POLICY "Coordenadores podem ver respostas dos alunos da escola"
  ON public.user_answers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.school_students ss
      JOIN public.school_coordinators sc ON sc.school_id = ss.school_id
      WHERE ss.user_id = user_answers.user_id
        AND sc.user_id = auth.uid()
    )
  );

-- Coordinators can view user_performance of students in their school
CREATE POLICY "Coordenadores podem ver desempenho dos alunos da escola"
  ON public.user_performance
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.school_students ss
      JOIN public.school_coordinators sc ON sc.school_id = ss.school_id
      WHERE ss.user_id = user_performance.user_id
        AND sc.user_id = auth.uid()
    )
  );

-- Coordinators can view profiles of students in their school
CREATE POLICY "Coordenadores podem ver perfis dos alunos da escola"
  ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.school_students ss
      JOIN public.school_coordinators sc ON sc.school_id = ss.school_id
      WHERE ss.user_id = profiles.id
        AND sc.user_id = auth.uid()
    )
  );
