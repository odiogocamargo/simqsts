-- Inserir vestibulares
INSERT INTO exams (id, name) VALUES 
  ('enem', 'ENEM'),
  ('paes-uema', 'PAES UEMA')
ON CONFLICT (id) DO NOTHING;

-- Inserir matérias principais
INSERT INTO subjects (id, name) VALUES 
  ('matematica', 'Matemática'),
  ('portugues', 'Português'),
  ('fisica', 'Física'),
  ('quimica', 'Química'),
  ('biologia', 'Biologia'),
  ('historia', 'História'),
  ('geografia', 'Geografia'),
  ('filosofia', 'Filosofia'),
  ('sociologia', 'Sociologia'),
  ('ingles', 'Inglês'),
  ('espanhol', 'Espanhol'),
  ('redacao', 'Redação')
ON CONFLICT (id) DO NOTHING;

-- Inserir alguns conteúdos básicos de Matemática
INSERT INTO contents (id, subject_id, name) VALUES 
  ('matematica-algebra', 'matematica', 'Álgebra'),
  ('matematica-geometria', 'matematica', 'Geometria'),
  ('matematica-estatistica', 'matematica', 'Estatística e Probabilidade')
ON CONFLICT (id) DO NOTHING;

-- Inserir alguns tópicos básicos de Álgebra
INSERT INTO topics (id, content_id, name) VALUES 
  ('equacoes-1grau', 'matematica-algebra', 'Equações do 1º grau'),
  ('equacoes-2grau', 'matematica-algebra', 'Equações do 2º grau'),
  ('funcoes', 'matematica-algebra', 'Funções')
ON CONFLICT (id) DO NOTHING;

-- Inserir alguns conteúdos básicos de Português
INSERT INTO contents (id, subject_id, name) VALUES 
  ('portugues-gramatica', 'portugues', 'Gramática'),
  ('portugues-literatura', 'portugues', 'Literatura'),
  ('portugues-interpretacao', 'portugues', 'Interpretação de Texto')
ON CONFLICT (id) DO NOTHING;

-- Inserir alguns tópicos básicos de Gramática
INSERT INTO topics (id, content_id, name) VALUES 
  ('morfologia', 'portugues-gramatica', 'Morfologia'),
  ('sintaxe', 'portugues-gramatica', 'Sintaxe'),
  ('semantica', 'portugues-gramatica', 'Semântica')
ON CONFLICT (id) DO NOTHING;