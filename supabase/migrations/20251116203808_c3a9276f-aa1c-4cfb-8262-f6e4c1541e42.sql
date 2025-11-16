-- Adicionar tópicos usando ON CONFLICT DO NOTHING para evitar duplicatas

-- Tópicos de Citologia
INSERT INTO topics (id, name, content_id) VALUES
('citoplasma', 'Citoplasma', 'citologia'),
('membrana-plasmatica', 'Membrana plasmática', 'citologia'),
('metabolismo-energetico', 'Metabolismo energético', 'citologia'),
('nucleo-celular', 'Núcleo celular', 'citologia')
ON CONFLICT (id) DO NOTHING;

-- Tópicos de Gramática Espanhol
INSERT INTO topics (id, name, content_id) VALUES
('adjetivos-esp', 'Adjetivos', 'gramatica-espanhol'),
('adverbios-esp', 'Adverbios', 'gramatica-espanhol'),
('articulos-esp', 'Artículos', 'gramatica-espanhol'),
('conjunciones-esp', 'Conjunciones', 'gramatica-espanhol'),
('conectores-discurso-esp', 'Discurso / Conectores del discurso', 'gramatica-espanhol'),
('marcadores-temporales-esp', 'Discurso / Marcadores temporales', 'gramatica-espanhol'),
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

-- Tópicos de Filosofia Antiga
INSERT INTO topics (id, name, content_id) VALUES
('aristoteles', 'Aristóteles', 'filosofia-antiga'),
('helenismo', 'Helenismo', 'filosofia-antiga'),
('mitologia-fil', 'Mitologia', 'filosofia-antiga'),
('outros-fil-antiga', 'Outros', 'filosofia-antiga'),
('mito-logos', 'Passagem do mito ao logos', 'filosofia-antiga'),
('platao', 'Platão', 'filosofia-antiga'),
('polis-razao', 'Pólis e Razão', 'filosofia-antiga'),
('pre-socraticos', 'Pré-socráticos', 'filosofia-antiga'),
('questoes-transversais-antiga', 'Questões Transversais (Filosofia antiga)', 'filosofia-antiga'),
('socrates', 'Sócrates', 'filosofia-antiga'),
('sofismo', 'Sofismo', 'filosofia-antiga')
ON CONFLICT (id) DO NOTHING;

-- Tópicos de Mecânica (Física)
INSERT INTO topics (id, name, content_id) VALUES
('cinematica', 'Cinemática', 'mecanica'),
('dinamica', 'Dinâmica', 'mecanica'),
('estatica', 'Estática', 'mecanica'),
('gravitacao', 'Gravitação', 'mecanica'),
('hidrodinamica', 'Hidrodinâmica', 'mecanica'),
('hidrostatica', 'Hidrostática', 'mecanica'),
('impulso-quantidade-movimento', 'Impulso e Quantidade de Movimento', 'mecanica'),
('movimento-harmonico-simples', 'Movimento Harmônico Simples (Mecânica)', 'mecanica'),
('trabalho-energia', 'Trabalho e Energia', 'mecanica')
ON CONFLICT (id) DO NOTHING;

-- Tópicos de Geografia Física
INSERT INTO topics (id, name, content_id) VALUES
('estrutura-terra', 'Estrutura da Terra', 'geografia-fisica'),
('tectonica-placas', 'Tectônica de Placas', 'geografia-fisica'),
('relevo-formacao', 'Relevo: formação e tipos', 'geografia-fisica'),
('intemperismo-erosao', 'Intemperismo e Erosão', 'geografia-fisica'),
('solos-formacao', 'Solos: formação e tipos', 'geografia-fisica'),
('clima-elementos', 'Clima: elementos e fatores', 'geografia-fisica'),
('tipos-climaticos', 'Tipos Climáticos do Brasil e do Mundo', 'geografia-fisica'),
('fenomenos-climaticos', 'Fenômenos Climáticos (El Niño, La Niña, etc.)', 'geografia-fisica'),
('vegetacao-biomas', 'Vegetação e Biomas', 'geografia-fisica'),
('hidrografia-rios', 'Hidrografia: rios, bacias e regimes', 'geografia-fisica'),
('ciclo-agua', 'Ciclo da Água', 'geografia-fisica'),
('oceanografia', 'Oceanografia (correntes e marés)', 'geografia-fisica'),
('dominios-morfoclimaticos', 'Domínios Morfoclimáticos Brasileiros', 'geografia-fisica'),
('paisagens-naturais', 'Paisagens Naturais', 'geografia-fisica'),
('cartografia-fisica', 'Cartografia Física (mapas físicos, hipsométricos, climáticos)', 'geografia-fisica'),
('desastres-naturais', 'Desastres Naturais (enchentes, secas, terremotos, erupções)', 'geografia-fisica'),
('recursos-naturais', 'Recursos Naturais e Uso do Solo', 'geografia-fisica'),
('dinamicas-atmosfericas', 'Dinâmicas Atmosféricas (ventos, frentes, massas de ar)', 'geografia-fisica'),
('ecossistemas-sucessao', 'Ecossistemas e Sucessão Ecológica', 'geografia-fisica'),
('impactos-ambientais-fisicos', 'Impactos Ambientais Físicos (desertificação, salinização, assoreamento)', 'geografia-fisica')
ON CONFLICT (id) DO NOTHING;

-- Tópicos de História Moderna (incluindo todos, com ON CONFLICT para os que já existem)
INSERT INTO topics (id, name, content_id) VALUES
('renascimento-cult-cient', 'Renascimento Cultural e Científico', 'historia-moderna'),
('humanismo', 'Humanismo', 'historia-moderna'),
('reforma-protestante', 'Reforma Protestante', 'historia-moderna'),
('contrarreforma', 'Contrarreforma e Inquisição', 'historia-moderna'),
('absolutismo', 'Absolutismo Monárquico', 'historia-moderna'),
('mercantilismo', 'Mercantilismo', 'historia-moderna'),
('expansao-maritima', 'Expansão Marítima e Comercial Europeia', 'historia-moderna'),
('colonizacao-americas', 'Colonização das Américas', 'historia-moderna'),
('civilizacoes-pre-colombianas', 'Civilizações Pré-Colombianas e Conquista Europeia', 'historia-moderna'),
('sistema-colonial-portugues', 'Sistema Colonial Português', 'historia-moderna'),
('escravidao-moderna', 'Escravidão Moderna (indígena e africana)', 'historia-moderna'),
('iluminismo', 'Iluminismo', 'historia-moderna'),
('revolucao-inglesa', 'Revolução Inglesa (Puritana e Gloriosa)', 'historia-moderna'),
('revolucao-industrial-1', 'Revolução Industrial – 1ª Fase', 'historia-moderna'),
('independencia-eua', 'Independência dos EUA', 'historia-moderna'),
('revolucao-francesa', 'Revolução Francesa', 'historia-moderna'),
('era-napoleonica', 'Era Napoleônica', 'historia-moderna'),
('pombalismo', 'Pombalismo e Reformas Ilustradas', 'historia-moderna'),
('formacao-estados-nacionais', 'Formação dos Estados Nacionais Modernos', 'historia-moderna'),
('transicao-feudalismo-capitalismo', 'Transição do Feudalismo para o Capitalismo', 'historia-moderna')
ON CONFLICT (id) DO NOTHING;

-- Tópicos de Gramática Inglês
INSERT INTO topics (id, name, content_id) VALUES
('parts-of-speech', 'Partes do discurso (Parts of Speech)', 'gramatica-ingles'),
('nouns-ing', 'Substantivos (Nouns)', 'gramatica-ingles'),
('pronouns-ing', 'Pronomes (Pronouns)', 'gramatica-ingles'),
('adjectives-ing', 'Adjetivos (Adjectives)', 'gramatica-ingles'),
('adverbs-ing', 'Advérbios (Adverbs)', 'gramatica-ingles'),
('articles-ing', 'Artigos (Articles)', 'gramatica-ingles'),
('prepositions-ing', 'Preposições (Prepositions)', 'gramatica-ingles'),
('conjunctions-ing', 'Conjunções (Conjunctions)', 'gramatica-ingles'),
('verbs-ing', 'Verbos (Verbs)', 'gramatica-ingles'),
('verb-tenses', 'Tempos verbais (Verb Tenses)', 'gramatica-ingles'),
('active-passive-voice', 'Voz ativa e passiva (Active / Passive Voice)', 'gramatica-ingles'),
('modal-verbs', 'Modais (Modal Verbs)', 'gramatica-ingles'),
('sentence-structure', 'Estrutura da frase (Sentence Structure)', 'gramatica-ingles'),
('linking-words', 'Conectores e marcadores discursivos (Linking Words)', 'gramatica-ingles'),
('comparatives-superlatives', 'Comparativos e superlativos (Comparatives / Superlatives)', 'gramatica-ingles'),
('gerund-infinitive', 'Gerúndio e infinitivo (Gerund / Infinitive)', 'gramatica-ingles'),
('conditionals-ing', 'Condicionais (Conditionals)', 'gramatica-ingles'),
('reported-speech', 'Reported Speech (Discurso Reportado)', 'gramatica-ingles'),
('phrasal-verbs', 'Phrasal Verbs', 'gramatica-ingles'),
('word-formation', 'Formação de palavras (Word Formation)', 'gramatica-ingles')
ON CONFLICT (id) DO NOTHING;