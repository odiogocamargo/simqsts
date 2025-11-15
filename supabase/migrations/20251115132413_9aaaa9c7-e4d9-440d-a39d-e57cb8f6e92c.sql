-- ==========================================
-- MATEMÁTICA - Conteúdos e Tópicos
-- ==========================================

-- Limpar dados antigos de conteúdos e tópicos
DELETE FROM topics WHERE content_id LIKE 'matematica-%';
DELETE FROM contents WHERE subject_id = 'matematica';

-- Conteúdos de Matemática
INSERT INTO contents (id, subject_id, name) VALUES
  ('conjuntos-logica', 'matematica', 'Conjuntos e Lógica'),
  ('numeros-operacoes', 'matematica', 'Números e Operações'),
  ('algebra-funcoes', 'matematica', 'Álgebra e Funções'),
  ('sequencias-progressoes', 'matematica', 'Sequências, Progressões e Matemática Financeira'),
  ('geometria-plana', 'matematica', 'Geometria Plana'),
  ('geometria-espacial', 'matematica', 'Geometria Espacial'),
  ('trigonometria', 'matematica', 'Trigonometria'),
  ('geometria-analitica', 'matematica', 'Geometria Analítica'),
  ('estatistica-probabilidade', 'matematica', 'Estatística e Probabilidade'),
  ('analise-combinatoria', 'matematica', 'Análise Combinatória'),
  ('matrizes-determinantes', 'matematica', 'Matrizes e Determinantes'),
  ('numeros-complexos', 'matematica', 'Números Complexos'),
  ('polinomios', 'matematica', 'Polinômios');

-- Tópicos de Conjuntos e Lógica
INSERT INTO topics (id, content_id, name) VALUES
  ('conjuntos-numericos', 'conjuntos-logica', 'Conjuntos numéricos e operações'),
  ('diagramas-venn', 'conjuntos-logica', 'Diagramas de Venn'),
  ('logica-proposicional', 'conjuntos-logica', 'Lógica proposicional'),
  ('tabelas-verdade', 'conjuntos-logica', 'Tabelas verdade');

-- Tópicos de Números e Operações
INSERT INTO topics (id, content_id, name) VALUES
  ('numeros-naturais-reais', 'numeros-operacoes', 'Números naturais, inteiros, racionais e reais'),
  ('valor-absoluto', 'numeros-operacoes', 'Valor absoluto e intervalos'),
  ('potenciacao-radiciacao', 'numeros-operacoes', 'Potenciação e radiciação'),
  ('razoes-proporcoes', 'numeros-operacoes', 'Razões e proporções'),
  ('porcentagem', 'numeros-operacoes', 'Porcentagem e aplicações'),
  ('juros', 'numeros-operacoes', 'Juros simples e compostos'),
  ('grandezas-medidas', 'numeros-operacoes', 'Grandezas e medidas');

-- Tópicos de Álgebra e Funções
INSERT INTO topics (id, content_id, name) VALUES
  ('expressoes-algebricas', 'algebra-funcoes', 'Expressões algébricas'),
  ('equacoes-inequacoes', 'algebra-funcoes', 'Equações e inequações'),
  ('sistemas-lineares', 'algebra-funcoes', 'Sistemas lineares'),
  ('funcao-afim', 'algebra-funcoes', 'Função afim'),
  ('funcao-quadratica', 'algebra-funcoes', 'Função quadrática'),
  ('funcao-modular', 'algebra-funcoes', 'Função modular'),
  ('funcao-exponencial', 'algebra-funcoes', 'Função exponencial'),
  ('funcao-logaritmica', 'algebra-funcoes', 'Função logarítmica'),
  ('funcoes-compostas', 'algebra-funcoes', 'Funções compostas e inversas'),
  ('funcoes-trigonometricas', 'algebra-funcoes', 'Funções trigonométricas'),
  ('analise-graficos', 'algebra-funcoes', 'Análise de gráficos');

-- ==========================================
-- PORTUGUÊS - Conteúdos e Tópicos
-- ==========================================

DELETE FROM topics WHERE content_id LIKE 'portugues-%';
DELETE FROM contents WHERE subject_id = 'portugues';

INSERT INTO contents (id, subject_id, name) VALUES
  ('gramatica', 'portugues', 'Gramática'),
  ('literatura', 'portugues', 'Literatura'),
  ('interpretacao-texto', 'portugues', 'Interpretação de Texto'),
  ('redacao', 'portugues', 'Redação'),
  ('semantica-estilos', 'portugues', 'Semântica e Estilos');

-- Tópicos de Gramática
INSERT INTO topics (id, content_id, name) VALUES
  ('morfologia', 'gramatica', 'Morfologia'),
  ('sintaxe', 'gramatica', 'Sintaxe'),
  ('fonologia', 'gramatica', 'Fonologia'),
  ('pontuacao', 'gramatica', 'Pontuação'),
  ('acentuacao', 'gramatica', 'Acentuação'),
  ('crase', 'gramatica', 'Crase'),
  ('concordancia', 'gramatica', 'Concordância verbal e nominal'),
  ('regencia', 'gramatica', 'Regência verbal e nominal'),
  ('colocacao-pronominal', 'gramatica', 'Colocação pronominal');

-- Tópicos de Literatura
INSERT INTO topics (id, content_id, name) VALUES
  ('trovadorismo', 'literatura', 'Trovadorismo'),
  ('humanismo', 'literatura', 'Humanismo'),
  ('classicismo', 'literatura', 'Classicismo'),
  ('quinhentismo', 'literatura', 'Quinhentismo'),
  ('barroco', 'literatura', 'Barroco'),
  ('arcadismo', 'literatura', 'Arcadismo'),
  ('romantismo', 'literatura', 'Romantismo'),
  ('realismo', 'literatura', 'Realismo'),
  ('naturalismo', 'literatura', 'Naturalismo'),
  ('parnasianismo', 'literatura', 'Parnasianismo'),
  ('simbolismo', 'literatura', 'Simbolismo'),
  ('pre-modernismo', 'literatura', 'Pré-Modernismo'),
  ('modernismo', 'literatura', 'Modernismo'),
  ('contemporaneo', 'literatura', 'Literatura Contemporânea');

-- ==========================================
-- FÍSICA - Conteúdos e Tópicos
-- ==========================================

DELETE FROM topics WHERE content_id LIKE 'fisica-%';
DELETE FROM contents WHERE subject_id = 'fisica';

INSERT INTO contents (id, subject_id, name) VALUES
  ('mecanica', 'fisica', 'Mecânica'),
  ('termodinamica', 'fisica', 'Termodinâmica'),
  ('ondas', 'fisica', 'Ondas'),
  ('optica', 'fisica', 'Óptica'),
  ('eletricidade', 'fisica', 'Eletricidade'),
  ('magnetismo', 'fisica', 'Magnetismo'),
  ('fisica-moderna', 'fisica', 'Física Moderna');

-- Tópicos de Mecânica
INSERT INTO topics (id, content_id, name) VALUES
  ('cinematica', 'mecanica', 'Cinemática'),
  ('dinamica', 'mecanica', 'Dinâmica'),
  ('leis-newton', 'mecanica', 'Leis de Newton'),
  ('trabalho-energia', 'mecanica', 'Trabalho e Energia'),
  ('impulso-quantidade-movimento', 'mecanica', 'Impulso e Quantidade de Movimento'),
  ('gravitacao', 'mecanica', 'Gravitação Universal'),
  ('estatica', 'mecanica', 'Estática'),
  ('hidrostatica', 'mecanica', 'Hidrostática');

-- ==========================================
-- QUÍMICA - Conteúdos e Tópicos
-- ==========================================

DELETE FROM topics WHERE content_id LIKE 'quimica-%';
DELETE FROM contents WHERE subject_id = 'quimica';

INSERT INTO contents (id, subject_id, name) VALUES
  ('quimica-geral', 'quimica', 'Química Geral'),
  ('fisico-quimica', 'quimica', 'Físico-Química'),
  ('quimica-organica', 'quimica', 'Química Orgânica'),
  ('quimica-inorganica', 'quimica', 'Química Inorgânica'),
  ('quimica-ambiental', 'quimica', 'Química Ambiental');

-- Tópicos de Química Geral
INSERT INTO topics (id, content_id, name) VALUES
  ('estrutura-atomica', 'quimica-geral', 'Estrutura Atômica'),
  ('tabela-periodica', 'quimica-geral', 'Tabela Periódica'),
  ('ligacoes-quimicas', 'quimica-geral', 'Ligações Químicas'),
  ('reacoes-quimicas', 'quimica-geral', 'Reações Químicas'),
  ('estequiometria', 'quimica-geral', 'Estequiometria'),
  ('solucoes', 'quimica-geral', 'Soluções');

-- ==========================================
-- BIOLOGIA - Conteúdos e Tópicos
-- ==========================================

DELETE FROM topics WHERE content_id LIKE 'biologia-%';
DELETE FROM contents WHERE subject_id = 'biologia';

INSERT INTO contents (id, subject_id, name) VALUES
  ('citologia', 'biologia', 'Citologia'),
  ('genetica', 'biologia', 'Genética'),
  ('evolucao', 'biologia', 'Evolução'),
  ('ecologia', 'biologia', 'Ecologia'),
  ('fisiologia-humana', 'biologia', 'Fisiologia Humana'),
  ('botanica', 'biologia', 'Botânica'),
  ('zoologia', 'biologia', 'Zoologia'),
  ('microbiologia', 'biologia', 'Microbiologia');

-- Tópicos de Citologia
INSERT INTO topics (id, content_id, name) VALUES
  ('celula', 'citologia', 'Estrutura Celular'),
  ('membrana-plasmatica', 'citologia', 'Membrana Plasmática'),
  ('organelas', 'citologia', 'Organelas Citoplasmáticas'),
  ('nucleo', 'citologia', 'Núcleo Celular'),
  ('metabolismo', 'citologia', 'Metabolismo Energético'),
  ('divisao-celular', 'citologia', 'Divisão Celular');

-- ==========================================
-- HISTÓRIA - Conteúdos e Tópicos
-- ==========================================

DELETE FROM topics WHERE content_id LIKE 'historia-%';
DELETE FROM contents WHERE subject_id = 'historia';

INSERT INTO contents (id, subject_id, name) VALUES
  ('historia-antiga', 'historia', 'História Antiga'),
  ('historia-medieval', 'historia', 'História Medieval'),
  ('historia-moderna', 'historia', 'História Moderna'),
  ('historia-contemporanea', 'historia', 'História Contemporânea'),
  ('historia-brasil', 'historia', 'História do Brasil'),
  ('historia-america', 'historia', 'História da América');

-- Tópicos de História do Brasil
INSERT INTO topics (id, content_id, name) VALUES
  ('brasil-colonial', 'historia-brasil', 'Brasil Colonial'),
  ('imperio', 'historia-brasil', 'Império'),
  ('republica-velha', 'historia-brasil', 'República Velha'),
  ('era-vargas', 'historia-brasil', 'Era Vargas'),
  ('ditadura-militar', 'historia-brasil', 'Ditadura Militar'),
  ('redemocratizacao', 'historia-brasil', 'Redemocratização');

-- ==========================================
-- GEOGRAFIA - Conteúdos e Tópicos
-- ==========================================

DELETE FROM topics WHERE content_id LIKE 'geografia-%';
DELETE FROM contents WHERE subject_id = 'geografia';

INSERT INTO contents (id, subject_id, name) VALUES
  ('geografia-fisica', 'geografia', 'Geografia Física'),
  ('geografia-humana', 'geografia', 'Geografia Humana'),
  ('geografia-brasil', 'geografia', 'Geografia do Brasil'),
  ('geopolitica', 'geografia', 'Geopolítica'),
  ('cartografia', 'geografia', 'Cartografia');

-- Tópicos de Geografia Física
INSERT INTO topics (id, content_id, name) VALUES
  ('clima', 'geografia-fisica', 'Clima e Meteorologia'),
  ('relevo', 'geografia-fisica', 'Relevo'),
  ('hidrografia', 'geografia-fisica', 'Hidrografia'),
  ('vegetacao', 'geografia-fisica', 'Vegetação'),
  ('solos', 'geografia-fisica', 'Solos');

-- ==========================================
-- FILOSOFIA - Conteúdos e Tópicos
-- ==========================================

DELETE FROM topics WHERE content_id LIKE 'filosofia-%';
DELETE FROM contents WHERE subject_id = 'filosofia';

INSERT INTO contents (id, subject_id, name) VALUES
  ('filosofia-antiga', 'filosofia', 'Filosofia Antiga'),
  ('filosofia-medieval', 'filosofia', 'Filosofia Medieval'),
  ('filosofia-moderna', 'filosofia', 'Filosofia Moderna'),
  ('filosofia-contemporanea', 'filosofia', 'Filosofia Contemporânea'),
  ('etica-politica', 'filosofia', 'Ética e Política'),
  ('epistemologia', 'filosofia', 'Epistemologia');

-- Tópicos de Filosofia Antiga
INSERT INTO topics (id, content_id, name) VALUES
  ('pre-socraticos', 'filosofia-antiga', 'Pré-Socráticos'),
  ('socrates', 'filosofia-antiga', 'Sócrates'),
  ('platao', 'filosofia-antiga', 'Platão'),
  ('aristoteles', 'filosofia-antiga', 'Aristóteles');

-- ==========================================
-- SOCIOLOGIA - Conteúdos e Tópicos
-- ==========================================

DELETE FROM topics WHERE content_id LIKE 'sociologia-%';
DELETE FROM contents WHERE subject_id = 'sociologia';

INSERT INTO contents (id, subject_id, name) VALUES
  ('introducao-sociologia', 'sociologia', 'Introdução à Sociologia'),
  ('cultura-sociedade', 'sociologia', 'Cultura e Sociedade'),
  ('estratificacao-social', 'sociologia', 'Estratificação Social'),
  ('movimentos-sociais', 'sociologia', 'Movimentos Sociais'),
  ('trabalho', 'sociologia', 'Trabalho e Sociedade'),
  ('politica-poder', 'sociologia', 'Política e Poder');

-- Tópicos de Cultura e Sociedade
INSERT INTO topics (id, content_id, name) VALUES
  ('cultura', 'cultura-sociedade', 'Cultura'),
  ('identidade', 'cultura-sociedade', 'Identidade'),
  ('diversidade', 'cultura-sociedade', 'Diversidade Cultural'),
  ('etnocentrismo', 'cultura-sociedade', 'Etnocentrismo e Relativismo');

-- ==========================================
-- INGLÊS - Conteúdos e Tópicos
-- ==========================================

DELETE FROM topics WHERE content_id LIKE 'ingles-%';
DELETE FROM contents WHERE subject_id = 'ingles';

INSERT INTO contents (id, subject_id, name) VALUES
  ('gramatica-ingles', 'ingles', 'Gramática'),
  ('interpretacao-ingles', 'ingles', 'Interpretação de Texto'),
  ('vocabulario-ingles', 'ingles', 'Vocabulário'),
  ('compreensao-oral-ingles', 'ingles', 'Compreensão Oral');

-- Tópicos de Gramática Inglês
INSERT INTO topics (id, content_id, name) VALUES
  ('verb-tenses', 'gramatica-ingles', 'Verb Tenses'),
  ('modal-verbs', 'gramatica-ingles', 'Modal Verbs'),
  ('conditionals', 'gramatica-ingles', 'Conditionals'),
  ('passive-voice', 'gramatica-ingles', 'Passive Voice'),
  ('reported-speech', 'gramatica-ingles', 'Reported Speech');

-- ==========================================
-- ESPANHOL - Conteúdos e Tópicos
-- ==========================================

DELETE FROM topics WHERE content_id LIKE 'espanhol-%';
DELETE FROM contents WHERE subject_id = 'espanhol';

INSERT INTO contents (id, subject_id, name) VALUES
  ('gramatica-espanhol', 'espanhol', 'Gramática'),
  ('interpretacao-espanhol', 'espanhol', 'Interpretação de Texto'),
  ('vocabulario-espanhol', 'espanhol', 'Vocabulário'),
  ('compreensao-oral-espanhol', 'espanhol', 'Compreensão Oral');

-- Tópicos de Gramática Espanhol
INSERT INTO topics (id, content_id, name) VALUES
  ('verbos-espanhol', 'gramatica-espanhol', 'Verbos'),
  ('pronomes-espanhol', 'gramatica-espanhol', 'Pronombres'),
  ('preposicoes-espanhol', 'gramatica-espanhol', 'Preposiciones'),
  ('conjuncoes-espanhol', 'gramatica-espanhol', 'Conjunciones');

-- ==========================================
-- REDAÇÃO - Conteúdos e Tópicos
-- ==========================================

DELETE FROM topics WHERE content_id LIKE 'redacao-%';
DELETE FROM contents WHERE subject_id = 'redacao';

INSERT INTO contents (id, subject_id, name) VALUES
  ('tipos-textuais', 'redacao', 'Tipos Textuais'),
  ('tecnicas-redacao', 'redacao', 'Técnicas de Redação'),
  ('argumentacao', 'redacao', 'Argumentação'),
  ('coesao-coerencia', 'redacao', 'Coesão e Coerência');

-- Tópicos de Tipos Textuais
INSERT INTO topics (id, content_id, name) VALUES
  ('dissertacao', 'tipos-textuais', 'Dissertação Argumentativa'),
  ('narrativa', 'tipos-textuais', 'Narrativa'),
  ('descricao', 'tipos-textuais', 'Descrição'),
  ('carta', 'tipos-textuais', 'Carta Argumentativa');