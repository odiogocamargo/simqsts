-- Drop tables related to schools module (CASCADE removes FKs, policies, triggers)
DROP TABLE IF EXISTS public.school_class_students CASCADE;
DROP TABLE IF EXISTS public.school_classes CASCADE;
DROP TABLE IF EXISTS public.school_coordinators CASCADE;
DROP TABLE IF EXISTS public.school_students CASCADE;
DROP TABLE IF EXISTS public.schools CASCADE;

-- Remove any lingering coordenador role assignments
DELETE FROM public.user_roles WHERE role = 'coordenador';