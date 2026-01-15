-- Criar matéria Inglês
INSERT INTO public.subjects (id, name, area_id) 
VALUES ('ingles', 'Inglês', 'geral')
ON CONFLICT (id) DO NOTHING;

-- Criar matéria Espanhol
INSERT INTO public.subjects (id, name, area_id) 
VALUES ('espanhol', 'Espanhol', 'geral')
ON CONFLICT (id) DO NOTHING;

-- Migrar conteúdos de língua-estrangeira para inglês
UPDATE public.contents 
SET subject_id = 'ingles' 
WHERE subject_id = 'lingua-estrangeira';

-- Migrar questões de língua-estrangeira para inglês
UPDATE public.questions 
SET subject_id = 'ingles' 
WHERE subject_id = 'lingua-estrangeira';

-- Remover matéria antiga (após migrar dados)
DELETE FROM public.subjects 
WHERE id = 'lingua-estrangeira';