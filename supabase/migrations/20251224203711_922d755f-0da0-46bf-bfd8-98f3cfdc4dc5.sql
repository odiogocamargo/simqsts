-- Limpar dados relacionados às questões primeiro (devido às FKs)
DELETE FROM public.question_topics;
DELETE FROM public.question_images;
DELETE FROM public.user_answers;
DELETE FROM public.user_performance;
DELETE FROM public.study_sessions;

-- Deletar todas as questões
DELETE FROM public.questions;

-- Limpar taxonomia antiga
DELETE FROM public.topics;
DELETE FROM public.contents;

-- Limpar subjects (será recriado com a nova taxonomia)
DELETE FROM public.subjects;

-- Limpar áreas se existirem
DELETE FROM public.areas;