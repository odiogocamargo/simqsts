
-- 1. Criar tabela de escolas parceiras
CREATE TABLE public.schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  cnpj text,
  address text,
  phone text,
  email text,
  logo_url text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Criar tabela de vínculo aluno-escola
CREATE TABLE public.school_students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(school_id, user_id)
);

-- 3. RLS para schools
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins podem gerenciar escolas"
  ON public.schools FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Todos podem ver escolas ativas"
  ON public.schools FOR SELECT
  USING (active = true);

-- 4. RLS para school_students
ALTER TABLE public.school_students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins podem gerenciar alunos de escolas"
  ON public.school_students FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Usuários podem ver seu próprio vínculo"
  ON public.school_students FOR SELECT
  USING (auth.uid() = user_id);

-- 5. Trigger de updated_at para schools
CREATE TRIGGER handle_schools_updated_at
  BEFORE UPDATE ON public.schools
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- 6. Bucket para logos de escolas
INSERT INTO storage.buckets (id, name, public)
VALUES ('school-logos', 'school-logos', true);

-- 7. Storage policies
CREATE POLICY "Admins podem gerenciar logos de escolas"
  ON storage.objects FOR ALL
  USING (bucket_id = 'school-logos' AND has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'school-logos' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Todos podem ver logos de escolas"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'school-logos');
