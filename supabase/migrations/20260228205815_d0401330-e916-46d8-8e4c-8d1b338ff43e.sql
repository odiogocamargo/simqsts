
-- 1. Renomear matéria 'it' para 'Interpretação Textual'
UPDATE subjects SET name = 'Interpretação Textual' WHERE id = 'it';

-- 2. Mover conteúdos de 'le' para 'it' (atualizar subject_id)
UPDATE contents SET subject_id = 'it' WHERE subject_id = 'le';

-- 3. Remover a matéria 'le' (não tem questões vinculadas)
DELETE FROM subjects WHERE id = 'le';
