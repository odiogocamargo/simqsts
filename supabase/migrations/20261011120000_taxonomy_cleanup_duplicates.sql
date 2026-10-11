-- LIMPEZA DE TAXONOMIA - duplicatas sem ambiguidade

-- 1. Matéria 'fisica' duplicada (vazia): a matéria válida é 'fi'
UPDATE public.questions SET subject_id = 'fi' WHERE subject_id = 'fisica';
UPDATE public.contents SET subject_id = 'fi' WHERE subject_id = 'fisica';
DELETE FROM public.subjects WHERE id = 'fisica';

-- 2. Conteúdo 'hi-historia-do-brasil-colonial' (sem tópicos) duplica 'hi-brasil-colonia'
UPDATE public.questions SET content_id = 'hi-brasil-colonia' WHERE content_id = 'hi-historia-do-brasil-colonial';
UPDATE public.topics SET content_id = 'hi-brasil-colonia' WHERE content_id = 'hi-historia-do-brasil-colonial';
DELETE FROM public.contents WHERE id = 'hi-historia-do-brasil-colonial';
