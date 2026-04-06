-- Add coordenador to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'coordenador';

-- Create school_coordinators table
CREATE TABLE public.school_coordinators (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(school_id, user_id)
);

-- Enable RLS
ALTER TABLE public.school_coordinators ENABLE ROW LEVEL SECURITY;

-- Admins can manage all
CREATE POLICY "Admins podem gerenciar coordenadores"
  ON public.school_coordinators
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Coordinators can see their own link
CREATE POLICY "Coordenadores podem ver seu próprio vínculo"
  ON public.school_coordinators
  FOR SELECT
  USING (auth.uid() = user_id);
