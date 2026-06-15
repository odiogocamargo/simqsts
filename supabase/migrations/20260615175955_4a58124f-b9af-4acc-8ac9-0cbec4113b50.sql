-- 1) Drop tables tied to student/payment flows
DROP TABLE IF EXISTS public.simulation_questions CASCADE;
DROP TABLE IF EXISTS public.simulations CASCADE;
DROP TABLE IF EXISTS public.user_answers CASCADE;
DROP TABLE IF EXISTS public.user_performance CASCADE;
DROP TABLE IF EXISTS public.study_sessions CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.payment_history CASCADE;

-- 2) Remove aluno role assignments (value stays in enum for RLS safety, unused)
DELETE FROM public.user_roles WHERE role = 'aluno';

-- 3) New-user trigger: do not auto-create profile/role anymore.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN NEW;
END;
$$;