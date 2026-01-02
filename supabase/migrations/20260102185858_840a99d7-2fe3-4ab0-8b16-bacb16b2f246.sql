-- Limpar dados antigos da taxonomia
DELETE FROM question_topics;
DELETE FROM topics;
DELETE FROM contents;
DELETE FROM subjects;
DELETE FROM areas;

-- Inserir área única (Linguagens e Códigos serve como área principal)
INSERT INTO areas (id, name) VALUES 
('geral', 'Área Geral');

-- Inserir Matérias (subjects)
INSERT INTO subjects (id, name, area_id) VALUES 
('interpretacao-textual', 'Interpretação Textual', 'geral'),
('gramatica', 'Gramática', 'geral'),
('literatura', 'Literatura', 'geral'),
('lingua-estrangeira', 'Língua Estrangeira', 'geral'),
('matematica', 'Matemática', 'geral'),
('fisica', 'Física', 'geral'),
('quimica', 'Química', 'geral'),
('biologia', 'Biologia', 'geral'),
('historia', 'História', 'geral'),
('geografia', 'Geografia', 'geral'),
('filosofia', 'Filosofia', 'geral'),
('sociologia', 'Sociologia', 'geral');

-- Inserir Conteúdos (contents)
-- INTERPRETAÇÃO TEXTUAL
INSERT INTO contents (id, name, subject_id) VALUES 
('it-compreensao-global', 'Compreensão global', 'interpretacao-textual'),
('it-inferencia-implicitos', 'Inferência e implícitos', 'interpretacao-textual'),
('it-intertextualidade', 'Intertextualidade', 'interpretacao-textual'),
('it-generos-tipologias', 'Gêneros e tipologias', 'interpretacao-textual'),
('it-coesao-coerencia', 'Coesão e coerência', 'interpretacao-textual'),
('it-texto-multimodal', 'Texto multimodal', 'interpretacao-textual'),
('it-semantica-efeitos', 'Semântica e efeitos de sentido', 'interpretacao-textual'),
('it-variacao-linguistica', 'Variação linguística', 'interpretacao-textual');

-- GRAMÁTICA
INSERT INTO contents (id, name, subject_id) VALUES 
('gr-ortografia', 'Ortografia', 'gramatica'),
('gr-acentuacao', 'Acentuação', 'gramatica'),
('gr-hifen', 'Hífen', 'gramatica'),
('gr-morfologia', 'Morfologia', 'gramatica'),
('gr-formacao-palavras', 'Formação de palavras', 'gramatica'),
('gr-sintaxe', 'Sintaxe', 'gramatica'),
('gr-periodo-composto', 'Período composto', 'gramatica'),
('gr-concordancia-verbal', 'Concordância verbal', 'gramatica'),
('gr-concordancia-nominal', 'Concordância nominal', 'gramatica'),
('gr-regencia-verbal', 'Regência verbal', 'gramatica'),
('gr-regencia-nominal', 'Regência nominal', 'gramatica'),
('gr-crase', 'Crase', 'gramatica'),
('gr-colocacao-pronominal', 'Colocação pronominal', 'gramatica'),
('gr-pontuacao', 'Pontuação', 'gramatica'),
('gr-semantica-gramatical', 'Semântica gramatical', 'gramatica');

-- LITERATURA
INSERT INTO contents (id, name, subject_id) VALUES 
('li-teoria-literaria', 'Teoria literária', 'literatura'),
('li-trovadorismo', 'Trovadorismo', 'literatura'),
('li-humanismo', 'Humanismo', 'literatura'),
('li-classicismo', 'Classicismo', 'literatura'),
('li-barroco', 'Barroco', 'literatura'),
('li-arcadismo', 'Arcadismo', 'literatura'),
('li-romantismo', 'Romantismo', 'literatura'),
('li-realismo', 'Realismo', 'literatura'),
('li-naturalismo', 'Naturalismo', 'literatura'),
('li-parnasianismo', 'Parnasianismo', 'literatura'),
('li-simbolismo', 'Simbolismo', 'literatura'),
('li-pre-modernismo', 'Pré-Modernismo', 'literatura');

-- LÍNGUA ESTRANGEIRA
INSERT INTO contents (id, name, subject_id) VALUES 
('le-estrategias-leitura', 'Estratégias de leitura', 'lingua-estrangeira'),
('le-compreensao-textual', 'Compreensão textual', 'lingua-estrangeira'),
('le-vocabulario-contexto', 'Vocabulário em contexto', 'lingua-estrangeira'),
('le-coesao-textual', 'Coesão textual', 'lingua-estrangeira'),
('le-intencao-comunicativa', 'Intenção comunicativa', 'lingua-estrangeira'),
('le-gramatica-aplicada', 'Gramática aplicada', 'lingua-estrangeira');

-- MATEMÁTICA
INSERT INTO contents (id, name, subject_id) VALUES 
('ma-fundamentos', 'Fundamentos', 'matematica'),
('ma-proporcionalidade', 'Proporcionalidade', 'matematica'),
('ma-algebra', 'Álgebra', 'matematica'),
('ma-equacoes', 'Equações', 'matematica'),
('ma-inequacoes', 'Inequações', 'matematica'),
('ma-exponencial', 'Exponencial', 'matematica'),
('ma-logaritmos', 'Logaritmos', 'matematica'),
('ma-funcoes', 'Funções', 'matematica'),
('ma-sequencias', 'Sequências', 'matematica'),
('ma-pa', 'PA', 'matematica'),
('ma-pg', 'PG', 'matematica'),
('ma-geometria-plana', 'Geometria plana', 'matematica'),
('ma-trigonometria', 'Trigonometria', 'matematica'),
('ma-geometria-espacial', 'Geometria espacial', 'matematica'),
('ma-geometria-analitica', 'Geometria analítica', 'matematica'),
('ma-combinatoria', 'Combinatória', 'matematica'),
('ma-probabilidade', 'Probabilidade', 'matematica'),
('ma-estatistica', 'Estatística', 'matematica');

-- FÍSICA
INSERT INTO contents (id, name, subject_id) VALUES 
('fi-grandezas-unidades', 'Grandezas e unidades', 'fisica'),
('fi-vetores', 'Vetores', 'fisica'),
('fi-cinematica', 'Cinemática', 'fisica'),
('fi-dinamica', 'Dinâmica', 'fisica'),
('fi-energia', 'Energia', 'fisica'),
('fi-quantidade-movimento', 'Quantidade de movimento', 'fisica'),
('fi-colisoes', 'Colisões', 'fisica'),
('fi-gravitacao', 'Gravitação', 'fisica'),
('fi-estatica', 'Estática', 'fisica'),
('fi-hidrostatica', 'Hidrostática', 'fisica'),
('fi-hidrodinamica', 'Hidrodinâmica', 'fisica'),
('fi-termologia', 'Termologia', 'fisica'),
('fi-calorimetria', 'Calorimetria', 'fisica'),
('fi-gases', 'Gases', 'fisica'),
('fi-termodinamica', 'Termodinâmica', 'fisica'),
('fi-oscilacoes', 'Oscilações', 'fisica'),
('fi-ondulatoria', 'Ondulatória', 'fisica'),
('fi-acustica', 'Acústica', 'fisica'),
('fi-optica', 'Óptica', 'fisica'),
('fi-eletrostatica', 'Eletrostática', 'fisica'),
('fi-eletrodinamica', 'Eletrodinâmica', 'fisica'),
('fi-circuitos', 'Circuitos', 'fisica'),
('fi-magnetismo', 'Magnetismo', 'fisica'),
('fi-inducao', 'Indução', 'fisica'),
('fi-fisica-moderna', 'Física moderna', 'fisica');

-- QUÍMICA
INSERT INTO contents (id, name, subject_id) VALUES 
('qu-materia', 'Matéria', 'quimica'),
('qu-estrutura-atomica', 'Estrutura atômica', 'quimica'),
('qu-tabela-periodica', 'Tabela periódica', 'quimica'),
('qu-ligacoes-quimicas', 'Ligações químicas', 'quimica'),
('qu-interacoes', 'Interações', 'quimica'),
('qu-inorganica', 'Inorgânica', 'quimica'),
('qu-reacoes', 'Reações', 'quimica'),
('qu-estequiometria', 'Estequiometria', 'quimica'),
('qu-solucoes', 'Soluções', 'quimica'),
('qu-termoquimica', 'Termoquímica', 'quimica'),
('qu-cinetica', 'Cinética', 'quimica'),
('qu-equilibrio', 'Equilíbrio', 'quimica'),
('qu-equilibrio-ionico', 'Equilíbrio iônico', 'quimica'),
('qu-eletroquimica', 'Eletroquímica', 'quimica'),
('qu-organica', 'Orgânica', 'quimica'),
('qu-ambiental', 'Ambiental', 'quimica'),
('qu-tecnologica', 'Tecnológica', 'quimica');

-- BIOLOGIA
INSERT INTO contents (id, name, subject_id) VALUES 
('bi-bioquimica', 'Bioquímica', 'biologia'),
('bi-citologia', 'Citologia', 'biologia'),
('bi-metabolismo', 'Metabolismo', 'biologia'),
('bi-divisao-celular', 'Divisão celular', 'biologia'),
('bi-genetica', 'Genética', 'biologia'),
('bi-biologia-molecular', 'Biologia molecular', 'biologia'),
('bi-biotecnologia', 'Biotecnologia', 'biologia'),
('bi-evolucao', 'Evolução', 'biologia'),
('bi-ecologia', 'Ecologia', 'biologia'),
('bi-histologia', 'Histologia', 'biologia'),
('bi-fisiologia', 'Fisiologia', 'biologia'),
('bi-botanica', 'Botânica', 'biologia');

-- HISTÓRIA
INSERT INTO contents (id, name, subject_id) VALUES 
('hi-fundamentos', 'Fundamentos', 'historia'),
('hi-antiguidade', 'Antiguidade', 'historia'),
('hi-idade-media', 'Idade Média', 'historia'),
('hi-idade-moderna', 'Idade Moderna', 'historia'),
('hi-revolucoes', 'Revoluções', 'historia'),
('hi-seculo-xix', 'Século XIX', 'historia'),
('hi-seculo-xx', 'Século XX', 'historia'),
('hi-mundo-contemporaneo', 'Mundo contemporâneo', 'historia'),
('hi-brasil-colonia', 'Brasil Colônia', 'historia'),
('hi-brasil-imperio', 'Brasil Império', 'historia'),
('hi-brasil-republica', 'Brasil República', 'historia');

-- GEOGRAFIA
INSERT INTO contents (id, name, subject_id) VALUES 
('ge-cartografia', 'Cartografia', 'geografia'),
('ge-geografia-fisica', 'Geografia física', 'geografia'),
('ge-climatologia', 'Climatologia', 'geografia'),
('ge-hidrografia', 'Hidrografia', 'geografia'),
('ge-solos', 'Solos', 'geografia'),
('ge-biomas', 'Biomas', 'geografia'),
('ge-meio-ambiente', 'Meio ambiente', 'geografia'),
('ge-populacao', 'População', 'geografia'),
('ge-urbanizacao', 'Urbanização', 'geografia'),
('ge-problemas-urbanos', 'Problemas urbanos', 'geografia'),
('ge-industria', 'Indústria', 'geografia'),
('ge-agropecuaria', 'Agropecuária', 'geografia'),
('ge-energia', 'Energia', 'geografia'),
('ge-transportes', 'Transportes', 'geografia');

-- FILOSOFIA
INSERT INTO contents (id, name, subject_id) VALUES 
('fl-introducao', 'Introdução', 'filosofia'),
('fl-antiga', 'Antiga', 'filosofia'),
('fl-helenistica', 'Helenística', 'filosofia'),
('fl-medieval', 'Medieval', 'filosofia'),
('fl-moderna', 'Moderna', 'filosofia'),
('fl-politica', 'Política', 'filosofia'),
('fl-contemporanea', 'Contemporânea', 'filosofia'),
('fl-etica', 'Ética', 'filosofia'),
('fl-epistemologia', 'Epistemologia', 'filosofia'),
('fl-logica', 'Lógica', 'filosofia'),
('fl-filosofia-ciencia', 'Filosofia da ciência', 'filosofia');

-- SOCIOLOGIA
INSERT INTO contents (id, name, subject_id) VALUES 
('so-introducao', 'Introdução', 'sociologia'),
('so-classicos', 'Clássicos', 'sociologia'),
('so-cultura', 'Cultura', 'sociologia'),
('so-identidade', 'Identidade', 'sociologia'),
('so-estratificacao', 'Estratificação', 'sociologia'),
('so-desigualdades', 'Desigualdades', 'sociologia'),
('so-trabalho', 'Trabalho', 'sociologia'),
('so-capitalismo', 'Capitalismo', 'sociologia'),
('so-politica', 'Política', 'sociologia'),
('so-cidadania', 'Cidadania', 'sociologia'),
('so-movimentos-sociais', 'Movimentos sociais', 'sociologia'),
('so-midia', 'Mídia', 'sociologia'),
('so-globalizacao', 'Globalização', 'sociologia');

-- Inserir Tópicos (topics)
-- INTERPRETAÇÃO TEXTUAL - Compreensão global
INSERT INTO topics (id, name, content_id) VALUES 
('it-cg-tema', 'Tema', 'it-compreensao-global'),
('it-cg-ideia-central', 'Ideia central', 'it-compreensao-global'),
('it-cg-tese', 'Tese', 'it-compreensao-global'),
('it-cg-ponto-vista-autor', 'Ponto de vista do autor', 'it-compreensao-global'),
('it-cg-objetivo-texto', 'Objetivo do texto', 'it-compreensao-global'),
('it-cg-fato', 'Fato', 'it-compreensao-global'),
('it-cg-opiniao', 'Opinião', 'it-compreensao-global');

-- INTERPRETAÇÃO TEXTUAL - Inferência e implícitos
INSERT INTO topics (id, name, content_id) VALUES 
('it-ii-inferencia', 'Inferência', 'it-inferencia-implicitos'),
('it-ii-pressuposto', 'Pressuposto', 'it-inferencia-implicitos'),
('it-ii-subentendido', 'Subentendido', 'it-inferencia-implicitos'),
('it-ii-ambiguidade', 'Ambiguidade', 'it-inferencia-implicitos'),
('it-ii-duplo-sentido', 'Duplo sentido', 'it-inferencia-implicitos'),
('it-ii-ironia', 'Ironia', 'it-inferencia-implicitos'),
('it-ii-humor', 'Humor', 'it-inferencia-implicitos');

-- INTERPRETAÇÃO TEXTUAL - Intertextualidade
INSERT INTO topics (id, name, content_id) VALUES 
('it-in-citacao', 'Citação', 'it-intertextualidade'),
('it-in-alusao', 'Alusão', 'it-intertextualidade'),
('it-in-parafrase', 'Paráfrase', 'it-intertextualidade'),
('it-in-parodia', 'Paródia', 'it-intertextualidade');

-- INTERPRETAÇÃO TEXTUAL - Gêneros e tipologias
INSERT INTO topics (id, name, content_id) VALUES 
('it-gt-narracao', 'Narração', 'it-generos-tipologias'),
('it-gt-descricao', 'Descrição', 'it-generos-tipologias'),
('it-gt-dissertacao', 'Dissertação', 'it-generos-tipologias'),
('it-gt-exposicao', 'Exposição', 'it-generos-tipologias'),
('it-gt-injuncao', 'Injunção', 'it-generos-tipologias'),
('it-gt-noticia', 'Notícia', 'it-generos-tipologias'),
('it-gt-reportagem', 'Reportagem', 'it-generos-tipologias'),
('it-gt-editorial', 'Editorial', 'it-generos-tipologias'),
('it-gt-artigo-opiniao', 'Artigo de opinião', 'it-generos-tipologias'),
('it-gt-cronica', 'Crônica', 'it-generos-tipologias'),
('it-gt-propaganda', 'Propaganda', 'it-generos-tipologias'),
('it-gt-anuncio', 'Anúncio', 'it-generos-tipologias'),
('it-gt-divulgacao-cientifica', 'Texto de divulgação científica', 'it-generos-tipologias'),
('it-gt-verbete', 'Verbete', 'it-generos-tipologias');

-- INTERPRETAÇÃO TEXTUAL - Coesão e coerência
INSERT INTO topics (id, name, content_id) VALUES 
('it-cc-referenciacao-pronominal', 'Referenciação pronominal', 'it-coesao-coerencia'),
('it-cc-elipse', 'Elipse', 'it-coesao-coerencia'),
('it-cc-substituicao-lexical', 'Substituição lexical', 'it-coesao-coerencia'),
('it-cc-conectivos', 'Conectivos', 'it-coesao-coerencia'),
('it-cc-progressao-tematica', 'Progressão temática', 'it-coesao-coerencia'),
('it-cc-causa', 'Causa', 'it-coesao-coerencia'),
('it-cc-consequencia', 'Consequência', 'it-coesao-coerencia'),
('it-cc-condicao', 'Condição', 'it-coesao-coerencia'),
('it-cc-concessao', 'Concessão', 'it-coesao-coerencia'),
('it-cc-comparacao', 'Comparação', 'it-coesao-coerencia'),
('it-cc-conclusao', 'Conclusão', 'it-coesao-coerencia'),
('it-cc-contradicao', 'Contradição', 'it-coesao-coerencia'),
('it-cc-fuga-tema', 'Fuga do tema', 'it-coesao-coerencia');

-- INTERPRETAÇÃO TEXTUAL - Texto multimodal
INSERT INTO topics (id, name, content_id) VALUES 
('it-tm-charge', 'Charge', 'it-texto-multimodal'),
('it-tm-tira', 'Tira', 'it-texto-multimodal'),
('it-tm-meme', 'Meme', 'it-texto-multimodal'),
('it-tm-grafico', 'Gráfico', 'it-texto-multimodal'),
('it-tm-tabela', 'Tabela', 'it-texto-multimodal'),
('it-tm-infografico', 'Infográfico', 'it-texto-multimodal'),
('it-tm-mapa', 'Mapa', 'it-texto-multimodal');

-- INTERPRETAÇÃO TEXTUAL - Semântica e efeitos de sentido
INSERT INTO topics (id, name, content_id) VALUES 
('it-se-denotacao', 'Denotação', 'it-semantica-efeitos'),
('it-se-conotacao', 'Conotação', 'it-semantica-efeitos'),
('it-se-polissemia', 'Polissemia', 'it-semantica-efeitos'),
('it-se-campo-semantico', 'Campo semântico', 'it-semantica-efeitos'),
('it-se-metafora', 'Metáfora', 'it-semantica-efeitos'),
('it-se-metonimia', 'Metonímia', 'it-semantica-efeitos'),
('it-se-hiperbole', 'Hipérbole', 'it-semantica-efeitos'),
('it-se-eufemismo', 'Eufemismo', 'it-semantica-efeitos'),
('it-se-antitese', 'Antítese', 'it-semantica-efeitos'),
('it-se-paradoxo', 'Paradoxo', 'it-semantica-efeitos');

-- INTERPRETAÇÃO TEXTUAL - Variação linguística
INSERT INTO topics (id, name, content_id) VALUES 
('it-vl-norma-padrao', 'Norma-padrão', 'it-variacao-linguistica'),
('it-vl-linguagem-formal', 'Linguagem formal', 'it-variacao-linguistica'),
('it-vl-linguagem-informal', 'Linguagem informal', 'it-variacao-linguistica'),
('it-vl-marcas-oralidade', 'Marcas de oralidade', 'it-variacao-linguistica'),
('it-vl-preconceito-linguistico', 'Preconceito linguístico', 'it-variacao-linguistica'),
('it-vl-adequacao-linguistica', 'Adequação linguística', 'it-variacao-linguistica');

-- GRAMÁTICA - Ortografia
INSERT INTO topics (id, name, content_id) VALUES 
('gr-or-uso-letras', 'Uso de letras', 'gr-ortografia'),
('gr-or-homonimos', 'Homônimos', 'gr-ortografia'),
('gr-or-paronimos', 'Parônimos', 'gr-ortografia');

-- GRAMÁTICA - Acentuação
INSERT INTO topics (id, name, content_id) VALUES 
('gr-ac-oxitonas', 'Oxítonas', 'gr-acentuacao'),
('gr-ac-paroxitonas', 'Paroxítonas', 'gr-acentuacao'),
('gr-ac-proparoxitonas', 'Proparoxítonas', 'gr-acentuacao'),
('gr-ac-hiatos', 'Hiatos', 'gr-acentuacao');

-- GRAMÁTICA - Hífen
INSERT INTO topics (id, name, content_id) VALUES 
('gr-hi-regras-principais', 'Regras principais', 'gr-hifen');

-- GRAMÁTICA - Morfologia
INSERT INTO topics (id, name, content_id) VALUES 
('gr-mo-substantivo', 'Substantivo', 'gr-morfologia'),
('gr-mo-adjetivo', 'Adjetivo', 'gr-morfologia'),
('gr-mo-artigo', 'Artigo', 'gr-morfologia'),
('gr-mo-numeral', 'Numeral', 'gr-morfologia'),
('gr-mo-pronome', 'Pronome', 'gr-morfologia'),
('gr-mo-verbo', 'Verbo', 'gr-morfologia'),
('gr-mo-adverbio', 'Advérbio', 'gr-morfologia'),
('gr-mo-preposicao', 'Preposição', 'gr-morfologia'),
('gr-mo-conjuncao', 'Conjunção', 'gr-morfologia'),
('gr-mo-interjeicao', 'Interjeição', 'gr-morfologia');

-- GRAMÁTICA - Formação de palavras
INSERT INTO topics (id, name, content_id) VALUES 
('gr-fp-derivacao', 'Derivação', 'gr-formacao-palavras'),
('gr-fp-composicao', 'Composição', 'gr-formacao-palavras'),
('gr-fp-parassintese', 'Parassíntese', 'gr-formacao-palavras'),
('gr-fp-sigla', 'Sigla', 'gr-formacao-palavras'),
('gr-fp-neologismo', 'Neologismo', 'gr-formacao-palavras');

-- GRAMÁTICA - Sintaxe
INSERT INTO topics (id, name, content_id) VALUES 
('gr-si-sujeito-simples', 'Sujeito simples', 'gr-sintaxe'),
('gr-si-sujeito-composto', 'Sujeito composto', 'gr-sintaxe'),
('gr-si-sujeito-oculto', 'Sujeito oculto', 'gr-sintaxe'),
('gr-si-sujeito-indeterminado', 'Sujeito indeterminado', 'gr-sintaxe'),
('gr-si-oracao-sem-sujeito', 'Oração sem sujeito', 'gr-sintaxe'),
('gr-si-predicado-verbal', 'Predicado verbal', 'gr-sintaxe'),
('gr-si-predicado-nominal', 'Predicado nominal', 'gr-sintaxe'),
('gr-si-predicado-verbo-nominal', 'Predicado verbo-nominal', 'gr-sintaxe'),
('gr-si-objeto-direto', 'Objeto direto', 'gr-sintaxe'),
('gr-si-objeto-indireto', 'Objeto indireto', 'gr-sintaxe'),
('gr-si-complemento-nominal', 'Complemento nominal', 'gr-sintaxe'),
('gr-si-agente-passiva', 'Agente da passiva', 'gr-sintaxe'),
('gr-si-adjunto-adnominal', 'Adjunto adnominal', 'gr-sintaxe'),
('gr-si-adjunto-adverbial', 'Adjunto adverbial', 'gr-sintaxe'),
('gr-si-aposto', 'Aposto', 'gr-sintaxe'),
('gr-si-vocativo', 'Vocativo', 'gr-sintaxe');

-- GRAMÁTICA - Período composto
INSERT INTO topics (id, name, content_id) VALUES 
('gr-pc-coordenacao', 'Coordenação', 'gr-periodo-composto'),
('gr-pc-subordinacao-substantiva', 'Subordinação substantiva', 'gr-periodo-composto'),
('gr-pc-subordinacao-adjetiva', 'Subordinação adjetiva', 'gr-periodo-composto'),
('gr-pc-subordinacao-adverbial', 'Subordinação adverbial', 'gr-periodo-composto');

-- GRAMÁTICA - Concordância verbal
INSERT INTO topics (id, name, content_id) VALUES 
('gr-cv-regra-geral', 'Regra geral', 'gr-concordancia-verbal'),
('gr-cv-casos-especiais', 'Casos especiais', 'gr-concordancia-verbal');

-- GRAMÁTICA - Concordância nominal
INSERT INTO topics (id, name, content_id) VALUES 
('gr-cn-regra-geral', 'Regra geral', 'gr-concordancia-nominal'),
('gr-cn-casos-especiais', 'Casos especiais', 'gr-concordancia-nominal');

-- GRAMÁTICA - Regência verbal
INSERT INTO topics (id, name, content_id) VALUES 
('gr-rv-verbos-transitivos', 'Verbos transitivos', 'gr-regencia-verbal');

-- GRAMÁTICA - Regência nominal
INSERT INTO topics (id, name, content_id) VALUES 
('gr-rn-termos-regidos', 'Termos regidos', 'gr-regencia-nominal');

-- GRAMÁTICA - Crase
INSERT INTO topics (id, name, content_id) VALUES 
('gr-cr-casos-obrigatorios', 'Casos obrigatórios', 'gr-crase'),
('gr-cr-casos-proibidos', 'Casos proibidos', 'gr-crase'),
('gr-cr-casos-facultativos', 'Casos facultativos', 'gr-crase');

-- GRAMÁTICA - Colocação pronominal
INSERT INTO topics (id, name, content_id) VALUES 
('gr-cp-proclise', 'Próclise', 'gr-colocacao-pronominal'),
('gr-cp-enclise', 'Ênclise', 'gr-colocacao-pronominal'),
('gr-cp-mesoclise', 'Mesóclise', 'gr-colocacao-pronominal');

-- GRAMÁTICA - Pontuação
INSERT INTO topics (id, name, content_id) VALUES 
('gr-po-virgula', 'Vírgula', 'gr-pontuacao'),
('gr-po-dois-pontos', 'Dois pontos', 'gr-pontuacao'),
('gr-po-ponto-virgula', 'Ponto e vírgula', 'gr-pontuacao'),
('gr-po-aspas', 'Aspas', 'gr-pontuacao'),
('gr-po-travessao', 'Travessão', 'gr-pontuacao'),
('gr-po-parenteses', 'Parênteses', 'gr-pontuacao');

-- GRAMÁTICA - Semântica gramatical
INSERT INTO topics (id, name, content_id) VALUES 
('gr-sg-valores-que', 'Valores do "que"', 'gr-semantica-gramatical'),
('gr-sg-valores-se', 'Valores do "se"', 'gr-semantica-gramatical'),
('gr-sg-valores-como', 'Valores do "como"', 'gr-semantica-gramatical'),
('gr-sg-por-que', 'Por que', 'gr-semantica-gramatical'),
('gr-sg-porque', 'Porque', 'gr-semantica-gramatical'),
('gr-sg-por-que-final', 'Por quê', 'gr-semantica-gramatical'),
('gr-sg-porque-substantivo', 'Porquê', 'gr-semantica-gramatical'),
('gr-sg-conjuncoes-causais', 'Conjunções causais', 'gr-semantica-gramatical'),
('gr-sg-conjuncoes-concessivas', 'Conjunções concessivas', 'gr-semantica-gramatical'),
('gr-sg-conjuncoes-condicionais', 'Conjunções condicionais', 'gr-semantica-gramatical'),
('gr-sg-conjuncoes-finais', 'Conjunções finais', 'gr-semantica-gramatical'),
('gr-sg-conjuncoes-conclusivas', 'Conjunções conclusivas', 'gr-semantica-gramatical');

-- LITERATURA - Teoria literária
INSERT INTO topics (id, name, content_id) VALUES 
('li-tl-narrador', 'Narrador', 'li-teoria-literaria'),
('li-tl-foco-narrativo', 'Foco narrativo', 'li-teoria-literaria'),
('li-tl-enredo', 'Enredo', 'li-teoria-literaria'),
('li-tl-personagem', 'Personagem', 'li-teoria-literaria'),
('li-tl-tempo', 'Tempo', 'li-teoria-literaria'),
('li-tl-espaco', 'Espaço', 'li-teoria-literaria'),
('li-tl-genero-lirico', 'Gênero lírico', 'li-teoria-literaria'),
('li-tl-genero-narrativo', 'Gênero narrativo', 'li-teoria-literaria'),
('li-tl-genero-dramatico', 'Gênero dramático', 'li-teoria-literaria'),
('li-tl-eu-lirico', 'Eu lírico', 'li-teoria-literaria'),
('li-tl-figuras-linguagem', 'Figuras de linguagem na literatura', 'li-teoria-literaria'),
('li-tl-intertextualidade-literaria', 'Intertextualidade literária', 'li-teoria-literaria');

-- LITERATURA - Trovadorismo
INSERT INTO topics (id, name, content_id) VALUES 
('li-tr-cantigas-amor', 'Cantigas de amor', 'li-trovadorismo'),
('li-tr-cantigas-amigo', 'Cantigas de amigo', 'li-trovadorismo'),
('li-tr-cantigas-satiricas', 'Cantigas satíricas', 'li-trovadorismo');

-- LITERATURA - Humanismo
INSERT INTO topics (id, name, content_id) VALUES 
('li-hu-cronica-historica', 'Crônica histórica', 'li-humanismo');

-- LITERATURA - Classicismo
INSERT INTO topics (id, name, content_id) VALUES 
('li-cl-humanismo-renascentista', 'Humanismo renascentista', 'li-classicismo'),
('li-cl-camoes', 'Camões', 'li-classicismo');

-- LITERATURA - Barroco
INSERT INTO topics (id, name, content_id) VALUES 
('li-ba-conceptismo', 'Conceptismo', 'li-barroco'),
('li-ba-cultismo', 'Cultismo', 'li-barroco');

-- LITERATURA - Arcadismo
INSERT INTO topics (id, name, content_id) VALUES 
('li-ar-bucolismo', 'Bucolismo', 'li-arcadismo'),
('li-ar-neoclassicismo', 'Neoclassicismo', 'li-arcadismo');

-- LITERATURA - Romantismo
INSERT INTO topics (id, name, content_id) VALUES 
('li-ro-nacionalismo', 'Nacionalismo', 'li-romantismo'),
('li-ro-indianismo', 'Indianismo', 'li-romantismo'),
('li-ro-ultrarromantismo', 'Ultrarromantismo', 'li-romantismo'),
('li-ro-condoreirismo', 'Condoreirismo', 'li-romantismo');

-- LITERATURA - Realismo
INSERT INTO topics (id, name, content_id) VALUES 
('li-re-critica-social', 'Crítica social', 'li-realismo');

-- LITERATURA - Naturalismo
INSERT INTO topics (id, name, content_id) VALUES 
('li-na-determinismo', 'Determinismo', 'li-naturalismo');

-- LITERATURA - Parnasianismo
INSERT INTO topics (id, name, content_id) VALUES 
('li-pa-culto-forma', 'Culto à forma', 'li-parnasianismo');

-- LITERATURA - Simbolismo
INSERT INTO topics (id, name, content_id) VALUES 
('li-si-musicalidade', 'Musicalidade', 'li-simbolismo');

-- LITERATURA - Pré-Modernismo
INSERT INTO topics (id, name, content_id) VALUES 
('li-pm-denuncia-social', 'Denúncia social', 'li-pre-modernismo'),
('li-pm-regionalismo', 'Regionalismo', 'li-pre-modernismo');

-- LÍNGUA ESTRANGEIRA - Estratégias de leitura
INSERT INTO topics (id, name, content_id) VALUES 
('le-el-skimming', 'Skimming', 'le-estrategias-leitura'),
('le-el-scanning', 'Scanning', 'le-estrategias-leitura');

-- LÍNGUA ESTRANGEIRA - Compreensão textual
INSERT INTO topics (id, name, content_id) VALUES 
('le-ct-ideia-principal', 'Ideia principal', 'le-compreensao-textual'),
('le-ct-detalhes-especificos', 'Detalhes específicos', 'le-compreensao-textual'),
('le-ct-inferencia', 'Inferência', 'le-compreensao-textual');

-- LÍNGUA ESTRANGEIRA - Vocabulário em contexto
INSERT INTO topics (id, name, content_id) VALUES 
('le-vc-cognatos', 'Cognatos', 'le-vocabulario-contexto'),
('le-vc-falsos-cognatos', 'Falsos cognatos', 'le-vocabulario-contexto');

-- LÍNGUA ESTRANGEIRA - Coesão textual
INSERT INTO topics (id, name, content_id) VALUES 
('le-ct-pronomes-referenciais', 'Pronomes referenciais', 'le-coesao-textual'),
('le-ct-conectores', 'Conectores', 'le-coesao-textual');

-- LÍNGUA ESTRANGEIRA - Intenção comunicativa
INSERT INTO topics (id, name, content_id) VALUES 
('le-ic-ironia', 'Ironia', 'le-intencao-comunicativa'),
('le-ic-humor', 'Humor', 'le-intencao-comunicativa');

-- LÍNGUA ESTRANGEIRA - Gramática aplicada
INSERT INTO topics (id, name, content_id) VALUES 
('le-ga-tempos-verbais', 'Tempos verbais essenciais', 'le-gramatica-aplicada'),
('le-ga-modalizacao', 'Modalização', 'le-gramatica-aplicada');

-- MATEMÁTICA - Fundamentos
INSERT INTO topics (id, name, content_id) VALUES 
('ma-fu-conjuntos', 'Conjuntos', 'ma-fundamentos'),
('ma-fu-intervalos', 'Intervalos', 'ma-fundamentos'),
('ma-fu-modulo', 'Módulo', 'ma-fundamentos');

-- MATEMÁTICA - Proporcionalidade
INSERT INTO topics (id, name, content_id) VALUES 
('ma-pr-razao', 'Razão', 'ma-proporcionalidade'),
('ma-pr-proporcao', 'Proporção', 'ma-proporcionalidade'),
('ma-pr-regra-tres-simples', 'Regra de três simples', 'ma-proporcionalidade'),
('ma-pr-regra-tres-composta', 'Regra de três composta', 'ma-proporcionalidade'),
('ma-pr-porcentagem', 'Porcentagem', 'ma-proporcionalidade'),
('ma-pr-desconto-sucessivo', 'Desconto sucessivo', 'ma-proporcionalidade'),
('ma-pr-acrescimo-sucessivo', 'Acréscimo sucessivo', 'ma-proporcionalidade');

-- MATEMÁTICA - Álgebra
INSERT INTO topics (id, name, content_id) VALUES 
('ma-al-produtos-notaveis', 'Produtos notáveis', 'ma-algebra'),
('ma-al-fatoracao', 'Fatoração', 'ma-algebra'),
('ma-al-fracoes-algebricas', 'Frações algébricas', 'ma-algebra'),
('ma-al-sistema-linear', 'Sistema linear', 'ma-algebra');

-- MATEMÁTICA - Equações
INSERT INTO topics (id, name, content_id) VALUES 
('ma-eq-primeiro-grau', 'Equação do primeiro grau', 'ma-equacoes'),
('ma-eq-segundo-grau', 'Equação do segundo grau', 'ma-equacoes');

-- MATEMÁTICA - Inequações
INSERT INTO topics (id, name, content_id) VALUES 
('ma-in-primeiro-grau', 'Inequação do primeiro grau', 'ma-inequacoes'),
('ma-in-segundo-grau', 'Inequação do segundo grau', 'ma-inequacoes');

-- MATEMÁTICA - Exponencial
INSERT INTO topics (id, name, content_id) VALUES 
('ma-ex-equacao-exponencial', 'Equação exponencial', 'ma-exponencial');

-- MATEMÁTICA - Logaritmos
INSERT INTO topics (id, name, content_id) VALUES 
('ma-lo-equacao-logaritmica', 'Equação logarítmica', 'ma-logaritmos');

-- MATEMÁTICA - Funções
INSERT INTO topics (id, name, content_id) VALUES 
('ma-fn-conceito', 'Conceito de função', 'ma-funcoes'),
('ma-fn-dominio', 'Domínio', 'ma-funcoes'),
('ma-fn-imagem', 'Imagem', 'ma-funcoes'),
('ma-fn-grafico-interpretacao', 'Gráfico e interpretação', 'ma-funcoes'),
('ma-fn-afim', 'Função afim', 'ma-funcoes'),
('ma-fn-quadratica', 'Função quadrática', 'ma-funcoes'),
('ma-fn-modular', 'Função modular', 'ma-funcoes'),
('ma-fn-exponencial', 'Função exponencial', 'ma-funcoes'),
('ma-fn-logaritmica', 'Função logarítmica', 'ma-funcoes');

-- MATEMÁTICA - Sequências
INSERT INTO topics (id, name, content_id) VALUES 
('ma-se-termo-geral', 'Termo geral', 'ma-sequencias');

-- MATEMÁTICA - PA
INSERT INTO topics (id, name, content_id) VALUES 
('ma-pa-termo-geral', 'Termo geral', 'ma-pa'),
('ma-pa-soma-termos', 'Soma dos termos', 'ma-pa');

-- MATEMÁTICA - PG
INSERT INTO topics (id, name, content_id) VALUES 
('ma-pg-termo-geral', 'Termo geral', 'ma-pg'),
('ma-pg-soma-termos', 'Soma dos termos', 'ma-pg');

-- MATEMÁTICA - Geometria plana
INSERT INTO topics (id, name, content_id) VALUES 
('ma-gp-triangulos', 'Triângulos', 'ma-geometria-plana'),
('ma-gp-semelhanca', 'Semelhança', 'ma-geometria-plana'),
('ma-gp-teorema-tales', 'Teorema de Tales', 'ma-geometria-plana'),
('ma-gp-teorema-pitagoras', 'Teorema de Pitágoras', 'ma-geometria-plana'),
('ma-gp-poligonos', 'Polígonos', 'ma-geometria-plana'),
('ma-gp-circunferencia', 'Circunferência', 'ma-geometria-plana'),
('ma-gp-area-figuras-planas', 'Área de figuras planas', 'ma-geometria-plana');

-- MATEMÁTICA - Trigonometria
INSERT INTO topics (id, name, content_id) VALUES 
('ma-tr-razoes-trigonometricas', 'Razões trigonométricas', 'ma-trigonometria'),
('ma-tr-lei-senos', 'Lei dos senos', 'ma-trigonometria'),
('ma-tr-lei-cossenos', 'Lei dos cossenos', 'ma-trigonometria');

-- MATEMÁTICA - Geometria espacial
INSERT INTO topics (id, name, content_id) VALUES 
('ma-ge-prismas', 'Prismas', 'ma-geometria-espacial'),
('ma-ge-piramides', 'Pirâmides', 'ma-geometria-espacial'),
('ma-ge-cilindro', 'Cilindro', 'ma-geometria-espacial'),
('ma-ge-cone', 'Cone', 'ma-geometria-espacial'),
('ma-ge-esfera', 'Esfera', 'ma-geometria-espacial'),
('ma-ge-volume', 'Volume', 'ma-geometria-espacial'),
('ma-ge-area-total', 'Área total', 'ma-geometria-espacial');

-- MATEMÁTICA - Geometria analítica
INSERT INTO topics (id, name, content_id) VALUES 
('ma-ga-distancia-pontos', 'Distância entre pontos', 'ma-geometria-analitica'),
('ma-ga-ponto-medio', 'Ponto médio', 'ma-geometria-analitica'),
('ma-ga-equacao-reta', 'Equação da reta', 'ma-geometria-analitica'),
('ma-ga-circunferencia', 'Circunferência', 'ma-geometria-analitica');

-- MATEMÁTICA - Combinatória
INSERT INTO topics (id, name, content_id) VALUES 
('ma-co-principio-fundamental', 'Princípio fundamental da contagem', 'ma-combinatoria'),
('ma-co-permutacao', 'Permutação', 'ma-combinatoria'),
('ma-co-arranjo', 'Arranjo', 'ma-combinatoria'),
('ma-co-combinacao', 'Combinação', 'ma-combinatoria');

-- MATEMÁTICA - Probabilidade
INSERT INTO topics (id, name, content_id) VALUES 
('ma-pb-espaco-amostral', 'Espaço amostral', 'ma-probabilidade'),
('ma-pb-evento', 'Evento', 'ma-probabilidade'),
('ma-pb-probabilidade-condicional', 'Probabilidade condicional', 'ma-probabilidade');

-- MATEMÁTICA - Estatística
INSERT INTO topics (id, name, content_id) VALUES 
('ma-es-media', 'Média', 'ma-estatistica');

-- FÍSICA - Grandezas e unidades
INSERT INTO topics (id, name, content_id) VALUES 
('fi-gu-sistema-internacional', 'Sistema internacional', 'fi-grandezas-unidades'),
('fi-gu-notacao-cientifica', 'Notação científica', 'fi-grandezas-unidades');

-- FÍSICA - Vetores
INSERT INTO topics (id, name, content_id) VALUES 
('fi-ve-decomposicao-vetorial', 'Decomposição vetorial', 'fi-vetores');

-- FÍSICA - Cinemática
INSERT INTO topics (id, name, content_id) VALUES 
('fi-ci-mru', 'MRU', 'fi-cinematica'),
('fi-ci-mruv', 'MRUV', 'fi-cinematica'),
('fi-ci-queda-livre', 'Queda livre', 'fi-cinematica'),
('fi-ci-graficos-movimento', 'Gráficos do movimento', 'fi-cinematica');

-- FÍSICA - Dinâmica
INSERT INTO topics (id, name, content_id) VALUES 
('fi-di-primeira-lei-newton', 'Primeira lei de Newton', 'fi-dinamica'),
('fi-di-segunda-lei-newton', 'Segunda lei de Newton', 'fi-dinamica'),
('fi-di-terceira-lei-newton', 'Terceira lei de Newton', 'fi-dinamica'),
('fi-di-atrito', 'Atrito', 'fi-dinamica'),
('fi-di-plano-inclinado', 'Plano inclinado', 'fi-dinamica'),
('fi-di-movimento-circular', 'Movimento circular', 'fi-dinamica');

-- FÍSICA - Energia
INSERT INTO topics (id, name, content_id) VALUES 
('fi-en-trabalho', 'Trabalho', 'fi-energia'),
('fi-en-energia-cinetica', 'Energia cinética', 'fi-energia'),
('fi-en-energia-potencial', 'Energia potencial', 'fi-energia'),
('fi-en-conservacao-energia', 'Conservação de energia', 'fi-energia'),
('fi-en-potencia', 'Potência', 'fi-energia'),
('fi-en-rendimento', 'Rendimento', 'fi-energia');

-- FÍSICA - Quantidade de movimento
INSERT INTO topics (id, name, content_id) VALUES 
('fi-qm-impulso', 'Impulso', 'fi-quantidade-movimento'),
('fi-qm-conservacao-momento', 'Conservação do momento', 'fi-quantidade-movimento');

-- FÍSICA - Colisões
INSERT INTO topics (id, name, content_id) VALUES 
('fi-co-colisao-elastica', 'Colisão elástica', 'fi-colisoes'),
('fi-co-colisao-inelastica', 'Colisão inelástica', 'fi-colisoes');

-- FÍSICA - Gravitação
INSERT INTO topics (id, name, content_id) VALUES 
('fi-gr-lei-gravitacao-universal', 'Lei da gravitação universal', 'fi-gravitacao'),
('fi-gr-campo-gravitacional', 'Campo gravitacional', 'fi-gravitacao');

-- FÍSICA - Estática
INSERT INTO topics (id, name, content_id) VALUES 
('fi-es-torque', 'Torque', 'fi-estatica'),
('fi-es-equilibrio-corpos', 'Equilíbrio de corpos', 'fi-estatica'),
('fi-es-alavancas', 'Alavancas', 'fi-estatica');

-- FÍSICA - Hidrostática
INSERT INTO topics (id, name, content_id) VALUES 
('fi-hs-pressao', 'Pressão', 'fi-hidrostatica'),
('fi-hs-principio-pascal', 'Princípio de Pascal', 'fi-hidrostatica'),
('fi-hs-empuxo', 'Empuxo', 'fi-hidrostatica');

-- FÍSICA - Hidrodinâmica
INSERT INTO topics (id, name, content_id) VALUES 
('fi-hd-continuidade', 'Continuidade', 'fi-hidrodinamica'),
('fi-hd-equacao-bernoulli', 'Equação de Bernoulli', 'fi-hidrodinamica');

-- FÍSICA - Termologia
INSERT INTO topics (id, name, content_id) VALUES 
('fi-te-escalas-termometricas', 'Escalas termométricas', 'fi-termologia'),
('fi-te-dilatacao-linear', 'Dilatação linear', 'fi-termologia'),
('fi-te-dilatacao-superficial', 'Dilatação superficial', 'fi-termologia'),
('fi-te-dilatacao-volumetrica', 'Dilatação volumétrica', 'fi-termologia');

-- FÍSICA - Calorimetria
INSERT INTO topics (id, name, content_id) VALUES 
('fi-ca-calor-sensivel', 'Calor sensível', 'fi-calorimetria'),
('fi-ca-calor-especifico', 'Calor específico', 'fi-calorimetria'),
('fi-ca-capacidade-termica', 'Capacidade térmica', 'fi-calorimetria'),
('fi-ca-equilibrio-termico', 'Equilíbrio térmico', 'fi-calorimetria'),
('fi-ca-mudancas-estado', 'Mudanças de estado', 'fi-calorimetria'),
('fi-ca-calor-latente', 'Calor latente', 'fi-calorimetria'),
('fi-ca-graficos-aquecimento', 'Gráficos de aquecimento', 'fi-calorimetria');

-- FÍSICA - Gases
INSERT INTO topics (id, name, content_id) VALUES 
('fi-ga-transformacoes-gasosas', 'Transformações gasosas', 'fi-gases'),
('fi-ga-equacao-clapeyron', 'Equação de Clapeyron', 'fi-gases');

-- FÍSICA - Termodinâmica
INSERT INTO topics (id, name, content_id) VALUES 
('fi-td-primeira-lei', 'Primeira lei da termodinâmica', 'fi-termodinamica'),
('fi-td-segunda-lei', 'Segunda lei da termodinâmica', 'fi-termodinamica'),
('fi-td-maquinas-termicas', 'Máquinas térmicas', 'fi-termodinamica');

-- FÍSICA - Oscilações
INSERT INTO topics (id, name, content_id) VALUES 
('fi-os-mhs-massa-mola', 'MHS massa–mola', 'fi-oscilacoes'),
('fi-os-movimento-pendular', 'Movimento pendular', 'fi-oscilacoes'),
('fi-os-periodo', 'Período', 'fi-oscilacoes'),
('fi-os-ressonancia', 'Ressonância', 'fi-oscilacoes');

-- FÍSICA - Ondulatória
INSERT INTO topics (id, name, content_id) VALUES 
('fi-on-velocidade-propagacao', 'Velocidade de propagação', 'fi-ondulatoria'),
('fi-on-comprimento-onda', 'Comprimento de onda', 'fi-ondulatoria'),
('fi-on-frequencia', 'Frequência', 'fi-ondulatoria'),
('fi-on-interferencia', 'Interferência', 'fi-ondulatoria'),
('fi-on-difracao', 'Difração', 'fi-ondulatoria');

-- FÍSICA - Acústica
INSERT INTO topics (id, name, content_id) VALUES 
('fi-ac-intensidade-sonora', 'Intensidade sonora', 'fi-acustica'),
('fi-ac-efeito-doppler', 'Efeito Doppler', 'fi-acustica');

-- FÍSICA - Óptica
INSERT INTO topics (id, name, content_id) VALUES 
('fi-op-reflexao', 'Reflexão', 'fi-optica'),
('fi-op-refracao', 'Refração', 'fi-optica'),
('fi-op-lei-snell', 'Lei de Snell', 'fi-optica'),
('fi-op-espelhos-esfericos', 'Espelhos esféricos', 'fi-optica'),
('fi-op-lentes-delgadas', 'Lentes delgadas', 'fi-optica');

-- FÍSICA - Eletrostática
INSERT INTO topics (id, name, content_id) VALUES 
('fi-el-lei-coulomb', 'Lei de Coulomb', 'fi-eletrostatica'),
('fi-el-campo-eletrico', 'Campo elétrico', 'fi-eletrostatica'),
('fi-el-potencial-eletrico', 'Potencial elétrico', 'fi-eletrostatica');

-- FÍSICA - Eletrodinâmica
INSERT INTO topics (id, name, content_id) VALUES 
('fi-ed-corrente-eletrica', 'Corrente elétrica', 'fi-eletrodinamica'),
('fi-ed-resistencia-eletrica', 'Resistência elétrica', 'fi-eletrodinamica'),
('fi-ed-lei-ohm', 'Lei de Ohm', 'fi-eletrodinamica'),
('fi-ed-potencia-eletrica', 'Potência elétrica', 'fi-eletrodinamica');

-- FÍSICA - Circuitos
INSERT INTO topics (id, name, content_id) VALUES 
('fi-cr-associacao-resistores', 'Associação de resistores', 'fi-circuitos');

-- FÍSICA - Magnetismo
INSERT INTO topics (id, name, content_id) VALUES 
('fi-mg-campo-magnetico', 'Campo magnético', 'fi-magnetismo');

-- FÍSICA - Indução
INSERT INTO topics (id, name, content_id) VALUES 
('fi-in-lei-faraday', 'Lei de Faraday', 'fi-inducao');

-- FÍSICA - Física moderna
INSERT INTO topics (id, name, content_id) VALUES 
('fi-fm-efeito-fotoeletrico', 'Efeito fotoelétrico', 'fi-fisica-moderna'),
('fi-fm-radioatividade', 'Radioatividade', 'fi-fisica-moderna');

-- QUÍMICA - Matéria
INSERT INTO topics (id, name, content_id) VALUES 
('qu-ma-estados-fisicos', 'Estados físicos', 'qu-materia'),
('qu-ma-misturas', 'Misturas', 'qu-materia'),
('qu-ma-separacao-misturas', 'Separação de misturas', 'qu-materia');

-- QUÍMICA - Estrutura atômica
INSERT INTO topics (id, name, content_id) VALUES 
('qu-ea-modelos-atomicos', 'Modelos atômicos', 'qu-estrutura-atomica'),
('qu-ea-numero-atomico', 'Número atômico', 'qu-estrutura-atomica'),
('qu-ea-massa-atomica', 'Massa atômica', 'qu-estrutura-atomica');

-- QUÍMICA - Tabela periódica
INSERT INTO topics (id, name, content_id) VALUES 
('qu-tp-propriedades-periodicas', 'Propriedades periódicas', 'qu-tabela-periodica'),
('qu-tp-familias', 'Famílias', 'qu-tabela-periodica');

-- QUÍMICA - Ligações químicas
INSERT INTO topics (id, name, content_id) VALUES 
('qu-lq-ligacao-ionica', 'Ligação iônica', 'qu-ligacoes-quimicas'),
('qu-lq-ligacao-covalente', 'Ligação covalente', 'qu-ligacoes-quimicas'),
('qu-lq-ligacao-metalica', 'Ligação metálica', 'qu-ligacoes-quimicas');

-- QUÍMICA - Interações
INSERT INTO topics (id, name, content_id) VALUES 
('qu-it-forcas-intermoleculares', 'Forças intermoleculares', 'qu-interacoes'),
('qu-it-polaridade', 'Polaridade', 'qu-interacoes');

-- QUÍMICA - Inorgânica
INSERT INTO topics (id, name, content_id) VALUES 
('qu-in-acidos', 'Ácidos', 'qu-inorganica'),
('qu-in-bases', 'Bases', 'qu-inorganica'),
('qu-in-sais', 'Sais', 'qu-inorganica'),
('qu-in-oxidos', 'Óxidos', 'qu-inorganica');

-- QUÍMICA - Reações
INSERT INTO topics (id, name, content_id) VALUES 
('qu-re-balanceamento', 'Balanceamento', 'qu-reacoes'),
('qu-re-tipos-reacao', 'Tipos de reação', 'qu-reacoes');

-- QUÍMICA - Estequiometria
INSERT INTO topics (id, name, content_id) VALUES 
('qu-et-mol', 'Mol', 'qu-estequiometria'),
('qu-et-reagente-limitante', 'Reagente limitante', 'qu-estequiometria'),
('qu-et-rendimento', 'Rendimento', 'qu-estequiometria');

-- QUÍMICA - Soluções
INSERT INTO topics (id, name, content_id) VALUES 
('qu-so-concentracao', 'Concentração', 'qu-solucoes'),
('qu-so-diluicao', 'Diluição', 'qu-solucoes'),
('qu-so-solubilidade', 'Solubilidade', 'qu-solucoes');

-- QUÍMICA - Termoquímica
INSERT INTO topics (id, name, content_id) VALUES 
('qu-tq-entalpia', 'Entalpia', 'qu-termoquimica'),
('qu-tq-lei-hess', 'Lei de Hess', 'qu-termoquimica');

-- QUÍMICA - Cinética
INSERT INTO topics (id, name, content_id) VALUES 
('qu-ci-velocidade-reacao', 'Velocidade de reação', 'qu-cinetica'),
('qu-ci-catalisadores', 'Catalisadores', 'qu-cinetica');

-- QUÍMICA - Equilíbrio
INSERT INTO topics (id, name, content_id) VALUES 
('qu-eq-constante-equilibrio', 'Constante de equilíbrio', 'qu-equilibrio'),
('qu-eq-le-chatelier', 'Le Chatelier', 'qu-equilibrio');

-- QUÍMICA - Equilíbrio iônico
INSERT INTO topics (id, name, content_id) VALUES 
('qu-ei-ph', 'pH', 'qu-equilibrio-ionico'),
('qu-ei-hidrolise-sais', 'Hidrólise de sais', 'qu-equilibrio-ionico');

-- QUÍMICA - Eletroquímica
INSERT INTO topics (id, name, content_id) VALUES 
('qu-el-pilhas', 'Pilhas', 'qu-eletroquimica'),
('qu-el-eletrolise', 'Eletrólise', 'qu-eletroquimica'),
('qu-el-corrosao', 'Corrosão', 'qu-eletroquimica');

-- QUÍMICA - Orgânica
INSERT INTO topics (id, name, content_id) VALUES 
('qu-or-cadeias-carbonicas', 'Cadeias carbônicas', 'qu-organica'),
('qu-or-funcoes-organicas', 'Funções orgânicas', 'qu-organica'),
('qu-or-isomeria', 'Isomeria', 'qu-organica'),
('qu-or-polimeros', 'Polímeros', 'qu-organica');

-- QUÍMICA - Ambiental
INSERT INTO topics (id, name, content_id) VALUES 
('qu-am-poluicao-agua', 'Poluição da água', 'qu-ambiental'),
('qu-am-tratamento-agua', 'Tratamento de água', 'qu-ambiental');

-- QUÍMICA - Tecnológica
INSERT INTO topics (id, name, content_id) VALUES 
('qu-te-combustiveis', 'Combustíveis', 'qu-tecnologica');

-- BIOLOGIA - Bioquímica
INSERT INTO topics (id, name, content_id) VALUES 
('bi-bq-carboidratos', 'Carboidratos', 'bi-bioquimica'),
('bi-bq-lipidios', 'Lipídios', 'bi-bioquimica'),
('bi-bq-proteinas', 'Proteínas', 'bi-bioquimica'),
('bi-bq-enzimas', 'Enzimas', 'bi-bioquimica');

-- BIOLOGIA - Citologia
INSERT INTO topics (id, name, content_id) VALUES 
('bi-ct-membrana-plasmatica', 'Membrana plasmática', 'bi-citologia'),
('bi-ct-transporte-celular', 'Transporte celular', 'bi-citologia'),
('bi-ct-organelas', 'Organelas', 'bi-citologia');

-- BIOLOGIA - Metabolismo
INSERT INTO topics (id, name, content_id) VALUES 
('bi-me-respiracao-celular', 'Respiração celular', 'bi-metabolismo'),
('bi-me-fotossintese', 'Fotossíntese', 'bi-metabolismo');

-- BIOLOGIA - Divisão celular
INSERT INTO topics (id, name, content_id) VALUES 
('bi-dc-mitose', 'Mitose', 'bi-divisao-celular'),
('bi-dc-meiose', 'Meiose', 'bi-divisao-celular');

-- BIOLOGIA - Genética
INSERT INTO topics (id, name, content_id) VALUES 
('bi-ge-gene', 'Gene', 'bi-genetica'),
('bi-ge-alelo', 'Alelo', 'bi-genetica'),
('bi-ge-genotipo', 'Genótipo', 'bi-genetica'),
('bi-ge-fenotipo', 'Fenótipo', 'bi-genetica'),
('bi-ge-primeira-lei-mendel', 'Primeira lei de Mendel', 'bi-genetica'),
('bi-ge-segunda-lei-mendel', 'Segunda lei de Mendel', 'bi-genetica'),
('bi-ge-heredogramas', 'Heredogramas', 'bi-genetica'),
('bi-ge-sistema-abo', 'Sistema ABO', 'bi-genetica'),
('bi-ge-fator-rh', 'Fator Rh', 'bi-genetica');

-- BIOLOGIA - Biologia molecular
INSERT INTO topics (id, name, content_id) VALUES 
('bi-bm-dna', 'DNA', 'bi-biologia-molecular'),
('bi-bm-rna', 'RNA', 'bi-biologia-molecular'),
('bi-bm-mutacoes', 'Mutações', 'bi-biologia-molecular');

-- BIOLOGIA - Biotecnologia
INSERT INTO topics (id, name, content_id) VALUES 
('bi-bt-transgenicos', 'Transgênicos', 'bi-biotecnologia');

-- BIOLOGIA - Evolução
INSERT INTO topics (id, name, content_id) VALUES 
('bi-ev-selecao-natural', 'Seleção natural', 'bi-evolucao'),
('bi-ev-especiacao', 'Especiação', 'bi-evolucao');

-- BIOLOGIA - Ecologia
INSERT INTO topics (id, name, content_id) VALUES 
('bi-ec-cadeia-alimentar', 'Cadeia alimentar', 'bi-ecologia'),
('bi-ec-teia-alimentar', 'Teia alimentar', 'bi-ecologia'),
('bi-ec-piramides-ecologicas', 'Pirâmides ecológicas', 'bi-ecologia'),
('bi-ec-ciclo-carbono', 'Ciclo do carbono', 'bi-ecologia'),
('bi-ec-ciclo-nitrogenio', 'Ciclo do nitrogênio', 'bi-ecologia'),
('bi-ec-relacoes-ecologicas', 'Relações ecológicas', 'bi-ecologia'),
('bi-ec-sucessao-ecologica', 'Sucessão ecológica', 'bi-ecologia'),
('bi-ec-biomas-brasileiros', 'Biomas brasileiros', 'bi-ecologia');

-- BIOLOGIA - Histologia
INSERT INTO topics (id, name, content_id) VALUES 
('bi-hi-tecido-epitelial', 'Tecido epitelial', 'bi-histologia'),
('bi-hi-tecido-conjuntivo', 'Tecido conjuntivo', 'bi-histologia'),
('bi-hi-tecido-muscular', 'Tecido muscular', 'bi-histologia'),
('bi-hi-tecido-nervoso', 'Tecido nervoso', 'bi-histologia');

-- BIOLOGIA - Fisiologia
INSERT INTO topics (id, name, content_id) VALUES 
('bi-fi-sistema-digestorio', 'Sistema digestório', 'bi-fisiologia'),
('bi-fi-sistema-respiratorio', 'Sistema respiratório', 'bi-fisiologia'),
('bi-fi-sistema-circulatorio', 'Sistema circulatório', 'bi-fisiologia'),
('bi-fi-sistema-excretor', 'Sistema excretor', 'bi-fisiologia'),
('bi-fi-sistema-endocrino', 'Sistema endócrino', 'bi-fisiologia'),
('bi-fi-sistema-nervoso', 'Sistema nervoso', 'bi-fisiologia'),
('bi-fi-sistema-imunologico', 'Sistema imunológico', 'bi-fisiologia');

-- BIOLOGIA - Botânica
INSERT INTO topics (id, name, content_id) VALUES 
('bi-bo-seiva-bruta', 'Seiva bruta', 'bi-botanica'),
('bi-bo-seiva-elaborada', 'Seiva elaborada', 'bi-botanica'),
('bi-bo-transpiracao', 'Transpiração', 'bi-botanica');

-- HISTÓRIA - Fundamentos
INSERT INTO topics (id, name, content_id) VALUES 
('hi-fu-fontes-historicas', 'Fontes históricas', 'hi-fundamentos'),
('hi-fu-tempo-historico', 'Tempo histórico', 'hi-fundamentos');

-- HISTÓRIA - Antiguidade
INSERT INTO topics (id, name, content_id) VALUES 
('hi-an-egito', 'Egito', 'hi-antiguidade'),
('hi-an-mesopotamia', 'Mesopotâmia', 'hi-antiguidade'),
('hi-an-grecia', 'Grécia', 'hi-antiguidade'),
('hi-an-roma', 'Roma', 'hi-antiguidade');

-- HISTÓRIA - Idade Média
INSERT INTO topics (id, name, content_id) VALUES 
('hi-im-feudalismo', 'Feudalismo', 'hi-idade-media'),
('hi-im-cruzadas', 'Cruzadas', 'hi-idade-media'),
('hi-im-crise-seculo-xiv', 'Crise do século XIV', 'hi-idade-media');

-- HISTÓRIA - Idade Moderna
INSERT INTO topics (id, name, content_id) VALUES 
('hi-mo-renascimento', 'Renascimento', 'hi-idade-moderna'),
('hi-mo-reforma-protestante', 'Reforma protestante', 'hi-idade-moderna'),
('hi-mo-absolutismo', 'Absolutismo', 'hi-idade-moderna'),
('hi-mo-mercantilismo', 'Mercantilismo', 'hi-idade-moderna'),
('hi-mo-expansao-maritima', 'Expansão marítima', 'hi-idade-moderna');

-- HISTÓRIA - Revoluções
INSERT INTO topics (id, name, content_id) VALUES 
('hi-rv-iluminismo', 'Iluminismo', 'hi-revolucoes'),
('hi-rv-revolucao-industrial', 'Revolução industrial', 'hi-revolucoes'),
('hi-rv-revolucao-francesa', 'Revolução francesa', 'hi-revolucoes');

-- HISTÓRIA - Século XIX
INSERT INTO topics (id, name, content_id) VALUES 
('hi-sx-imperialismo', 'Imperialismo', 'hi-seculo-xix'),
('hi-sx-partilha-africa', 'Partilha da África', 'hi-seculo-xix');

-- HISTÓRIA - Século XX
INSERT INTO topics (id, name, content_id) VALUES 
('hi-sxx-primeira-guerra', 'Primeira guerra mundial', 'hi-seculo-xx'),
('hi-sxx-revolucao-russa', 'Revolução russa', 'hi-seculo-xx'),
('hi-sxx-crise-1929', 'Crise de 1929', 'hi-seculo-xx'),
('hi-sxx-totalitarismos', 'Totalitarismos', 'hi-seculo-xx'),
('hi-sxx-segunda-guerra', 'Segunda guerra mundial', 'hi-seculo-xx'),
('hi-sxx-guerra-fria', 'Guerra fria', 'hi-seculo-xx'),
('hi-sxx-descolonizacao', 'Descolonização', 'hi-seculo-xx');

-- HISTÓRIA - Mundo contemporâneo
INSERT INTO topics (id, name, content_id) VALUES 
('hi-mc-globalizacao', 'Globalização', 'hi-mundo-contemporaneo');

-- HISTÓRIA - Brasil Colônia
INSERT INTO topics (id, name, content_id) VALUES 
('hi-bc-pacto-colonial', 'Pacto colonial', 'hi-brasil-colonia'),
('hi-bc-acucar', 'Açúcar', 'hi-brasil-colonia'),
('hi-bc-mineracao', 'Mineração', 'hi-brasil-colonia'),
('hi-bc-escravidao', 'Escravidão', 'hi-brasil-colonia'),
('hi-bc-revoltas-coloniais', 'Revoltas coloniais', 'hi-brasil-colonia');

-- HISTÓRIA - Brasil Império
INSERT INTO topics (id, name, content_id) VALUES 
('hi-bi-independencia', 'Independência', 'hi-brasil-imperio'),
('hi-bi-periodo-regencial', 'Período regencial', 'hi-brasil-imperio'),
('hi-bi-segundo-reinado', 'Segundo reinado', 'hi-brasil-imperio');

-- HISTÓRIA - Brasil República (adicionando tópicos baseados no contexto)
INSERT INTO topics (id, name, content_id) VALUES 
('hi-br-republica-velha', 'República Velha', 'hi-brasil-republica'),
('hi-br-era-vargas', 'Era Vargas', 'hi-brasil-republica'),
('hi-br-ditadura-militar', 'Ditadura militar', 'hi-brasil-republica'),
('hi-br-redemocratizacao', 'Redemocratização', 'hi-brasil-republica');

-- GEOGRAFIA - Cartografia
INSERT INTO topics (id, name, content_id) VALUES 
('ge-ca-coordenadas-geograficas', 'Coordenadas geográficas', 'ge-cartografia'),
('ge-ca-fusos-horarios', 'Fusos horários', 'ge-cartografia'),
('ge-ca-escalas', 'Escalas', 'ge-cartografia'),
('ge-ca-projecoes-cartograficas', 'Projeções cartográficas', 'ge-cartografia'),
('ge-ca-mapas-tematicos', 'Mapas temáticos', 'ge-cartografia');

-- GEOGRAFIA - Geografia física
INSERT INTO topics (id, name, content_id) VALUES 
('ge-gf-tectonica-placas', 'Tectônica de placas', 'ge-geografia-fisica'),
('ge-gf-relevo', 'Relevo', 'ge-geografia-fisica');

-- GEOGRAFIA - Climatologia
INSERT INTO topics (id, name, content_id) VALUES 
('ge-cl-elementos-clima', 'Elementos do clima', 'ge-climatologia'),
('ge-cl-massas-ar', 'Massas de ar', 'ge-climatologia'),
('ge-cl-el-nino', 'El Niño', 'ge-climatologia'),
('ge-cl-la-nina', 'La Niña', 'ge-climatologia');

-- GEOGRAFIA - Hidrografia
INSERT INTO topics (id, name, content_id) VALUES 
('ge-hi-bacias-hidrograficas', 'Bacias hidrográficas', 'ge-hidrografia'),
('ge-hi-aquiferos', 'Aquíferos', 'ge-hidrografia');

-- GEOGRAFIA - Solos
INSERT INTO topics (id, name, content_id) VALUES 
('ge-so-erosao', 'Erosão', 'ge-solos');

-- GEOGRAFIA - Biomas
INSERT INTO topics (id, name, content_id) VALUES 
('ge-bi-amazonia', 'Amazônia', 'ge-biomas'),
('ge-bi-cerrado', 'Cerrado', 'ge-biomas'),
('ge-bi-caatinga', 'Caatinga', 'ge-biomas'),
('ge-bi-mata-atlantica', 'Mata Atlântica', 'ge-biomas');

-- GEOGRAFIA - Meio ambiente
INSERT INTO topics (id, name, content_id) VALUES 
('ge-ma-desmatamento', 'Desmatamento', 'ge-meio-ambiente'),
('ge-ma-queimadas', 'Queimadas', 'ge-meio-ambiente'),
('ge-ma-poluicao', 'Poluição', 'ge-meio-ambiente'),
('ge-ma-mudancas-climaticas', 'Mudanças climáticas', 'ge-meio-ambiente');

-- GEOGRAFIA - População
INSERT INTO topics (id, name, content_id) VALUES 
('ge-po-transicao-demografica', 'Transição demográfica', 'ge-populacao'),
('ge-po-migracoes', 'Migrações', 'ge-populacao');

-- GEOGRAFIA - Urbanização
INSERT INTO topics (id, name, content_id) VALUES 
('ge-ur-metropolizacao', 'Metropolização', 'ge-urbanizacao'),
('ge-ur-rede-urbana', 'Rede urbana', 'ge-urbanizacao');

-- GEOGRAFIA - Problemas urbanos
INSERT INTO topics (id, name, content_id) VALUES 
('ge-pu-segregacao-socioespacial', 'Segregação socioespacial', 'ge-problemas-urbanos'),
('ge-pu-saneamento', 'Saneamento', 'ge-problemas-urbanos');

-- GEOGRAFIA - Indústria
INSERT INTO topics (id, name, content_id) VALUES 
('ge-in-localizacao-industrial', 'Localização industrial', 'ge-industria'),
('ge-in-desconcentracao-industrial', 'Desconcentração industrial', 'ge-industria');

-- GEOGRAFIA - Agropecuária
INSERT INTO topics (id, name, content_id) VALUES 
('ge-ag-agronegocio', 'Agronegócio', 'ge-agropecuaria'),
('ge-ag-agricultura-familiar', 'Agricultura familiar', 'ge-agropecuaria');

-- GEOGRAFIA - Energia
INSERT INTO topics (id, name, content_id) VALUES 
('ge-en-matriz-energetica', 'Matriz energética', 'ge-energia');

-- GEOGRAFIA - Transportes
INSERT INTO topics (id, name, content_id) VALUES 
('ge-tr-logistica', 'Logística', 'ge-transportes');

-- FILOSOFIA - Introdução
INSERT INTO topics (id, name, content_id) VALUES 
('fl-in-mito', 'Mito', 'fl-introducao'),
('fl-in-logos', 'Logos', 'fl-introducao');

-- FILOSOFIA - Antiga
INSERT INTO topics (id, name, content_id) VALUES 
('fl-an-socrates', 'Sócrates', 'fl-antiga'),
('fl-an-platao', 'Platão', 'fl-antiga'),
('fl-an-aristoteles', 'Aristóteles', 'fl-antiga');

-- FILOSOFIA - Helenística
INSERT INTO topics (id, name, content_id) VALUES 
('fl-he-estoicismo', 'Estoicismo', 'fl-helenistica'),
('fl-he-epicurismo', 'Epicurismo', 'fl-helenistica');

-- FILOSOFIA - Medieval
INSERT INTO topics (id, name, content_id) VALUES 
('fl-me-agostinho', 'Agostinho', 'fl-medieval'),
('fl-me-tomas-aquino', 'Tomás de Aquino', 'fl-medieval');

-- FILOSOFIA - Moderna
INSERT INTO topics (id, name, content_id) VALUES 
('fl-mo-descartes', 'Descartes', 'fl-moderna'),
('fl-mo-locke', 'Locke', 'fl-moderna'),
('fl-mo-hume', 'Hume', 'fl-moderna'),
('fl-mo-kant', 'Kant', 'fl-moderna');

-- FILOSOFIA - Política
INSERT INTO topics (id, name, content_id) VALUES 
('fl-po-contratualismo', 'Contratualismo', 'fl-politica');

-- FILOSOFIA - Contemporânea
INSERT INTO topics (id, name, content_id) VALUES 
('fl-co-marx', 'Marx', 'fl-contemporanea'),
('fl-co-nietzsche', 'Nietzsche', 'fl-contemporanea'),
('fl-co-existencialismo', 'Existencialismo', 'fl-contemporanea'),
('fl-co-escola-frankfurt', 'Escola de Frankfurt', 'fl-contemporanea');

-- FILOSOFIA - Ética
INSERT INTO topics (id, name, content_id) VALUES 
('fl-et-virtude', 'Virtude', 'fl-etica'),
('fl-et-dever', 'Dever', 'fl-etica'),
('fl-et-utilitarismo', 'Utilitarismo', 'fl-etica');

-- FILOSOFIA - Epistemologia
INSERT INTO topics (id, name, content_id) VALUES 
('fl-ep-verdade', 'Verdade', 'fl-epistemologia'),
('fl-ep-ceticismo', 'Ceticismo', 'fl-epistemologia');

-- FILOSOFIA - Lógica
INSERT INTO topics (id, name, content_id) VALUES 
('fl-lo-validade', 'Validade', 'fl-logica'),
('fl-lo-falacias', 'Falácias', 'fl-logica');

-- FILOSOFIA - Filosofia da ciência
INSERT INTO topics (id, name, content_id) VALUES 
('fl-fc-metodo-cientifico', 'Método científico', 'fl-filosofia-ciencia');

-- SOCIOLOGIA - Introdução
INSERT INTO topics (id, name, content_id) VALUES 
('so-in-socializacao', 'Socialização', 'so-introducao'),
('so-in-instituicoes-sociais', 'Instituições sociais', 'so-introducao');

-- SOCIOLOGIA - Clássicos
INSERT INTO topics (id, name, content_id) VALUES 
('so-cl-durkheim', 'Durkheim', 'so-classicos'),
('so-cl-weber', 'Weber', 'so-classicos'),
('so-cl-marx', 'Marx', 'so-classicos');

-- SOCIOLOGIA - Cultura
INSERT INTO topics (id, name, content_id) VALUES 
('so-cu-etnocentrismo', 'Etnocentrismo', 'so-cultura'),
('so-cu-relativismo-cultural', 'Relativismo cultural', 'so-cultura');

-- SOCIOLOGIA - Identidade
INSERT INTO topics (id, name, content_id) VALUES 
('so-id-identidade-social', 'Identidade social', 'so-identidade');

-- SOCIOLOGIA - Estratificação
INSERT INTO topics (id, name, content_id) VALUES 
('so-es-classes-sociais', 'Classes sociais', 'so-estratificacao'),
('so-es-mobilidade-social', 'Mobilidade social', 'so-estratificacao');

-- SOCIOLOGIA - Desigualdades
INSERT INTO topics (id, name, content_id) VALUES 
('so-de-desigualdade-renda', 'Desigualdade de renda', 'so-desigualdades'),
('so-de-racismo-estrutural', 'Racismo estrutural', 'so-desigualdades'),
('so-de-genero', 'Gênero', 'so-desigualdades');

-- SOCIOLOGIA - Trabalho
INSERT INTO topics (id, name, content_id) VALUES 
('so-tr-divisao-social-trabalho', 'Divisão social do trabalho', 'so-trabalho'),
('so-tr-alienacao', 'Alienação', 'so-trabalho');

-- SOCIOLOGIA - Capitalismo
INSERT INTO topics (id, name, content_id) VALUES 
('so-ca-consumo', 'Consumo', 'so-capitalismo');

-- SOCIOLOGIA - Política
INSERT INTO topics (id, name, content_id) VALUES 
('so-po-estado', 'Estado', 'so-politica'),
('so-po-democracia', 'Democracia', 'so-politica');

-- SOCIOLOGIA - Cidadania
INSERT INTO topics (id, name, content_id) VALUES 
('so-ci-direitos-humanos', 'Direitos humanos', 'so-cidadania');

-- SOCIOLOGIA - Movimentos sociais
INSERT INTO topics (id, name, content_id) VALUES 
('so-ms-acao-coletiva', 'Ação coletiva', 'so-movimentos-sociais');

-- SOCIOLOGIA - Mídia
INSERT INTO topics (id, name, content_id) VALUES 
('so-mi-industria-cultural', 'Indústria cultural', 'so-midia');

-- SOCIOLOGIA - Globalização
INSERT INTO topics (id, name, content_id) VALUES 
('so-gl-redes-fluxos', 'Redes e fluxos', 'so-globalizacao');