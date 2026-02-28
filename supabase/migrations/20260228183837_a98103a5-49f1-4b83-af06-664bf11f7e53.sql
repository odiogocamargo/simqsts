
-- TAXONOMY V2.1 MIGRATION
-- Step 1: Insert new subjects with short IDs
INSERT INTO subjects (id, name, area_id) VALUES
  ('ma', 'Matemática', 'geral'),
  ('ge', 'Geografia', 'geral'),
  ('hi', 'História', 'geral'),
  ('bi', 'Biologia', 'geral'),
  ('qu', 'Química', 'geral'),
  ('fi', 'Física', 'geral'),
  ('gr', 'Gramática', 'geral'),
  ('le', 'Leitura e Interpretação de Textos', 'geral'),
  ('it', 'Produção/Interpretação Textual', 'geral'),
  ('li', 'Literatura', 'geral'),
  ('so', 'Sociologia', 'geral'),
  ('fl', 'Filosofia', 'geral'),
  ('in', 'Inglês', 'geral'),
  ('es', 'Espanhol', 'geral')
ON CONFLICT (id) DO NOTHING;

-- Step 2: Create in-* contents for English (cloning current le-* contents)
INSERT INTO contents (id, name, subject_id) VALUES
  ('in-coesao-textual', 'Coesão textual', 'in'),
  ('in-compreensao-textual', 'Compreensão textual', 'in'),
  ('in-estrategias-leitura', 'Estratégias de leitura', 'in'),
  ('in-gramatica-aplicada', 'Gramática aplicada', 'in'),
  ('in-intencao-comunicativa', 'Intenção comunicativa', 'in'),
  ('in-vocabulario-contexto', 'Vocabulário em contexto', 'in')
ON CONFLICT (id) DO NOTHING;

-- Step 3: Create in-* topics for English (cloning le-* topics)
INSERT INTO topics (id, name, content_id) VALUES
  ('in-ct-conectores', 'Conectores', 'in-coesao-textual'),
  ('in-ct-pronomes-referenciais', 'Pronomes referenciais', 'in-coesao-textual'),
  ('in-ct-detalhes-especificos', 'Detalhes específicos', 'in-compreensao-textual'),
  ('in-ct-ideia-principal', 'Ideia principal', 'in-compreensao-textual'),
  ('in-ct-inferencia', 'Inferência', 'in-compreensao-textual'),
  ('in-el-scanning', 'Scanning', 'in-estrategias-leitura'),
  ('in-el-skimming', 'Skimming', 'in-estrategias-leitura'),
  ('in-ga-modalizacao', 'Modalização', 'in-gramatica-aplicada'),
  ('in-ga-tempos-verbais', 'Tempos verbais', 'in-gramatica-aplicada'),
  ('in-ic-humor', 'Humor', 'in-intencao-comunicativa'),
  ('in-ic-ironia', 'Ironia', 'in-intencao-comunicativa'),
  ('in-vc-cognatos', 'Cognatos', 'in-vocabulario-contexto'),
  ('in-vc-falsos-cognatos', 'Falsos cognatos', 'in-vocabulario-contexto')
ON CONFLICT (id) DO NOTHING;

-- Step 4: Update English questions - content_id and subject_id
-- First update question_topics for English questions (before changing content references)
UPDATE question_topics SET 
  topic_id = 'in' || substring(topic_id from 3)
WHERE topic_id LIKE 'le-%' 
  AND question_id IN (SELECT id FROM questions WHERE subject_id = 'ingles');

-- Update English questions content_id and subject_id
UPDATE questions SET 
  content_id = 'in' || substring(content_id from 3),
  subject_id = 'in'
WHERE subject_id = 'ingles';

-- Step 5: Update contents subject_id - move le-* contents to le (Leitura) subject
UPDATE contents SET subject_id = 'le' WHERE subject_id = 'ingles';

-- Update all other contents to new subject IDs
UPDATE contents SET subject_id = 'ma' WHERE subject_id = 'matematica';
UPDATE contents SET subject_id = 'ge' WHERE subject_id = 'geografia';
UPDATE contents SET subject_id = 'hi' WHERE subject_id = 'historia';
UPDATE contents SET subject_id = 'bi' WHERE subject_id = 'biologia';
UPDATE contents SET subject_id = 'qu' WHERE subject_id = 'quimica';
UPDATE contents SET subject_id = 'fi' WHERE subject_id = 'fisica';
UPDATE contents SET subject_id = 'gr' WHERE subject_id = 'gramatica';
UPDATE contents SET subject_id = 'it' WHERE subject_id = 'interpretacao-textual';
UPDATE contents SET subject_id = 'li' WHERE subject_id = 'literatura';
UPDATE contents SET subject_id = 'so' WHERE subject_id = 'sociologia';
UPDATE contents SET subject_id = 'fl' WHERE subject_id = 'filosofia';
UPDATE contents SET subject_id = 'es' WHERE subject_id = 'espanhol';

-- Step 6: Update questions subject_id
UPDATE questions SET subject_id = 'ma' WHERE subject_id = 'matematica';
UPDATE questions SET subject_id = 'ge' WHERE subject_id = 'geografia';
UPDATE questions SET subject_id = 'hi' WHERE subject_id = 'historia';
UPDATE questions SET subject_id = 'bi' WHERE subject_id = 'biologia';
UPDATE questions SET subject_id = 'qu' WHERE subject_id = 'quimica';
UPDATE questions SET subject_id = 'fi' WHERE subject_id = 'fisica';
UPDATE questions SET subject_id = 'gr' WHERE subject_id = 'gramatica';
UPDATE questions SET subject_id = 'it' WHERE subject_id = 'interpretacao-textual';
UPDATE questions SET subject_id = 'li' WHERE subject_id = 'literatura';
UPDATE questions SET subject_id = 'so' WHERE subject_id = 'sociologia';
UPDATE questions SET subject_id = 'fl' WHERE subject_id = 'filosofia';
-- ingles already handled in step 4, espanhol has 0 questions

-- Step 7: Update user_performance subject_id
UPDATE user_performance SET subject_id = 'ma' WHERE subject_id = 'matematica';
UPDATE user_performance SET subject_id = 'ge' WHERE subject_id = 'geografia';
UPDATE user_performance SET subject_id = 'hi' WHERE subject_id = 'historia';
UPDATE user_performance SET subject_id = 'bi' WHERE subject_id = 'biologia';
UPDATE user_performance SET subject_id = 'qu' WHERE subject_id = 'quimica';
UPDATE user_performance SET subject_id = 'fi' WHERE subject_id = 'fisica';
UPDATE user_performance SET subject_id = 'gr' WHERE subject_id = 'gramatica';
UPDATE user_performance SET subject_id = 'it' WHERE subject_id = 'interpretacao-textual';
UPDATE user_performance SET subject_id = 'li' WHERE subject_id = 'literatura';
UPDATE user_performance SET subject_id = 'so' WHERE subject_id = 'sociologia';
UPDATE user_performance SET subject_id = 'fl' WHERE subject_id = 'filosofia';
UPDATE user_performance SET subject_id = 'in' WHERE subject_id = 'ingles';
UPDATE user_performance SET subject_id = 'es' WHERE subject_id = 'espanhol';

-- Step 8: Update study_sessions subject_id
UPDATE study_sessions SET subject_id = 'ma' WHERE subject_id = 'matematica';
UPDATE study_sessions SET subject_id = 'ge' WHERE subject_id = 'geografia';
UPDATE study_sessions SET subject_id = 'hi' WHERE subject_id = 'historia';
UPDATE study_sessions SET subject_id = 'bi' WHERE subject_id = 'biologia';
UPDATE study_sessions SET subject_id = 'qu' WHERE subject_id = 'quimica';
UPDATE study_sessions SET subject_id = 'fi' WHERE subject_id = 'fisica';
UPDATE study_sessions SET subject_id = 'gr' WHERE subject_id = 'gramatica';
UPDATE study_sessions SET subject_id = 'it' WHERE subject_id = 'interpretacao-textual';
UPDATE study_sessions SET subject_id = 'li' WHERE subject_id = 'literatura';
UPDATE study_sessions SET subject_id = 'so' WHERE subject_id = 'sociologia';
UPDATE study_sessions SET subject_id = 'fl' WHERE subject_id = 'filosofia';
UPDATE study_sessions SET subject_id = 'in' WHERE subject_id = 'ingles';
UPDATE study_sessions SET subject_id = 'es' WHERE subject_id = 'espanhol';

-- Step 9: Update simulations subject_ids (array column)
UPDATE simulations SET subject_ids = array_replace(subject_ids, 'matematica', 'ma') WHERE 'matematica' = ANY(subject_ids);
UPDATE simulations SET subject_ids = array_replace(subject_ids, 'geografia', 'ge') WHERE 'geografia' = ANY(subject_ids);
UPDATE simulations SET subject_ids = array_replace(subject_ids, 'historia', 'hi') WHERE 'historia' = ANY(subject_ids);
UPDATE simulations SET subject_ids = array_replace(subject_ids, 'biologia', 'bi') WHERE 'biologia' = ANY(subject_ids);
UPDATE simulations SET subject_ids = array_replace(subject_ids, 'quimica', 'qu') WHERE 'quimica' = ANY(subject_ids);
UPDATE simulations SET subject_ids = array_replace(subject_ids, 'fisica', 'fi') WHERE 'fisica' = ANY(subject_ids);
UPDATE simulations SET subject_ids = array_replace(subject_ids, 'gramatica', 'gr') WHERE 'gramatica' = ANY(subject_ids);
UPDATE simulations SET subject_ids = array_replace(subject_ids, 'interpretacao-textual', 'it') WHERE 'interpretacao-textual' = ANY(subject_ids);
UPDATE simulations SET subject_ids = array_replace(subject_ids, 'literatura', 'li') WHERE 'literatura' = ANY(subject_ids);
UPDATE simulations SET subject_ids = array_replace(subject_ids, 'sociologia', 'so') WHERE 'sociologia' = ANY(subject_ids);
UPDATE simulations SET subject_ids = array_replace(subject_ids, 'filosofia', 'fl') WHERE 'filosofia' = ANY(subject_ids);
UPDATE simulations SET subject_ids = array_replace(subject_ids, 'ingles', 'in') WHERE 'ingles' = ANY(subject_ids);
UPDATE simulations SET subject_ids = array_replace(subject_ids, 'espanhol', 'es') WHERE 'espanhol' = ANY(subject_ids);

-- Step 10: Delete old subjects
DELETE FROM subjects WHERE id IN (
  'matematica', 'geografia', 'historia', 'biologia', 'quimica', 'fisica',
  'gramatica', 'interpretacao-textual', 'literatura', 'sociologia', 'filosofia',
  'ingles', 'espanhol'
);
