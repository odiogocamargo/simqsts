
-- Remove tópicos órfãos dos conteúdos que serão deletados
DELETE FROM topics WHERE content_id IN (
  'fisico-quimica',
  'quimica-geral', 
  'quimica-inorganica',
  'quimica-organica',
  'quimica-ambiental',
  'fisica-moderna',
  'fisiologia-humana',
  'matrizes-determinantes'
);

-- Remove conteúdos antigos/duplicados vazios
DELETE FROM contents WHERE id IN (
  'fisico-quimica',      -- duplicado de qui_fisico
  'quimica-geral',       -- duplicado de qui_geral
  'quimica-inorganica',  -- duplicado de qui_inorganica
  'quimica-organica',    -- duplicado de qui_organica
  'quimica-ambiental',   -- antigo sem questões
  'fisica-moderna',      -- duplicado de fis_moderna
  'fisiologia-humana',   -- antigo sem questões
  'matrizes-determinantes' -- antigo sem questões
);
