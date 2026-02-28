
-- Inserir conteúdos de Espanhol
INSERT INTO contents (id, name, subject_id) VALUES
  ('compreensao-oral-espanhol', 'Compreensão Oral', 'es'),
  ('gramatica-espanhol', 'Gramática', 'es'),
  ('interpretacao-espanhol', 'Interpretação', 'es'),
  ('vocabulario-espanhol', 'Vocabulário', 'es')
ON CONFLICT (id) DO NOTHING;

-- Inserir tópicos de Compreensão Oral
INSERT INTO topics (id, name, content_id) VALUES
  ('comprension-auditiva', 'Comprensión Auditiva', 'compreensao-oral-espanhol'),
  ('pronunciacion', 'Pronunciación', 'compreensao-oral-espanhol'),
  ('variantes', 'Variantes del Español', 'compreensao-oral-espanhol')
ON CONFLICT (id) DO NOTHING;

-- Inserir tópicos de Gramática
INSERT INTO topics (id, name, content_id) VALUES
  ('adjetivos-esp', 'Adjetivos', 'gramatica-espanhol'),
  ('adverbios-esp', 'Adverbios', 'gramatica-espanhol'),
  ('articulos-esp', 'Artículos', 'gramatica-espanhol'),
  ('conjunciones-esp', 'Conjunciones', 'gramatica-espanhol'),
  ('conectores-discurso-esp', 'Conectores del discurso', 'gramatica-espanhol'),
  ('marcadores-temporales-esp', 'Marcadores temporales', 'gramatica-espanhol'),
  ('discurso-directo-indirecto-esp', 'Discurso directo e indirecto', 'gramatica-espanhol'),
  ('interjecciones-esp', 'Interjecciones', 'gramatica-espanhol'),
  ('numerales-esp', 'Numerales', 'gramatica-espanhol'),
  ('oraciones-esp', 'Oraciones', 'gramatica-espanhol'),
  ('preposiciones-esp', 'Preposiciones', 'gramatica-espanhol'),
  ('pronombres-esp', 'Pronombres', 'gramatica-espanhol'),
  ('pronunciacion-esp', 'Pronunciación', 'gramatica-espanhol'),
  ('sinonimos-antonimos-esp', 'Sinónimos y antónimos', 'gramatica-espanhol'),
  ('sustantivos-esp', 'Sustantivos', 'gramatica-espanhol'),
  ('verbos-esp', 'Verbos', 'gramatica-espanhol')
ON CONFLICT (id) DO NOTHING;

-- Inserir tópicos de Interpretação
INSERT INTO topics (id, name, content_id) VALUES
  ('comprension-lectora', 'Comprensión Lectora', 'interpretacao-espanhol'),
  ('generos-textuales', 'Géneros Textuales', 'interpretacao-espanhol'),
  ('inferencia-espanol', 'Inferencia', 'interpretacao-espanhol'),
  ('vocabulario-contexto', 'Vocabulario en Contexto', 'interpretacao-espanhol')
ON CONFLICT (id) DO NOTHING;

-- Inserir tópicos de Vocabulário
INSERT INTO topics (id, name, content_id) VALUES
  ('expresiones', 'Expresiones', 'vocabulario-espanhol'),
  ('falsos-amigos', 'Falsos Amigos', 'vocabulario-espanhol'),
  ('modismos', 'Modismos', 'vocabulario-espanhol'),
  ('regionalismos', 'Regionalismos', 'vocabulario-espanhol')
ON CONFLICT (id) DO NOTHING;
