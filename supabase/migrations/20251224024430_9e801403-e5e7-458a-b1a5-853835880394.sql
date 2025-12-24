
-- =====================================================
-- ATUALIZAÇÃO DA TAXONOMIA V2 (Apenas Bio, Fís, Mat, Quí)
-- Mantendo outras disciplinas intactas
-- =====================================================

-- 1. INSERIR NOVOS CONTENTS para as 4 disciplinas
INSERT INTO public.contents (id, name, subject_id) VALUES
  -- Biologia
  ('bio_celulas', 'Células', 'biologia'),
  ('bio_energia', 'Energia', 'biologia'),
  ('bio_genetica', 'Genética', 'biologia'),
  ('bio_sistematica', 'Sistemática', 'biologia'),
  ('bio_sistemas', 'Sistemas', 'biologia'),
  ('bio_ecologia', 'Ecologia', 'biologia'),
  -- Física
  ('fis_mecanica', 'Mecânica', 'fisica'),
  ('fis_ondas', 'Ondas', 'fisica'),
  ('fis_termodinamica', 'Termodinâmica', 'fisica'),
  ('fis_eletromagnetismo', 'Eletromagnetismo', 'fisica'),
  ('fis_optica', 'Óptica', 'fisica'),
  ('fis_moderna', 'Física Moderna', 'fisica'),
  -- Matemática
  ('mat_algebra', 'Álgebra', 'matematica'),
  ('mat_geometria', 'Geometria', 'matematica'),
  ('mat_trigonometria', 'Trigonometria', 'matematica'),
  ('mat_funcoes', 'Funções', 'matematica'),
  ('mat_combinatoria', 'Análise Combinatória', 'matematica'),
  ('mat_probabilidade', 'Probabilidade e Estatística', 'matematica'),
  -- Química
  ('qui_geral', 'Química Geral', 'quimica'),
  ('qui_inorganica', 'Química Inorgânica', 'quimica'),
  ('qui_organica', 'Química Orgânica', 'quimica'),
  ('qui_fisico', 'Físico-Química', 'quimica')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, subject_id = EXCLUDED.subject_id;

-- 2. INSERIR NOVOS TOPICS
INSERT INTO public.topics (id, name, content_id) VALUES
  -- Biologia > Células
  ('bio_cel_celula_procarionte', 'Célula procarionte', 'bio_celulas'),
  ('bio_cel_celula_eucarionte', 'Célula eucarionte', 'bio_celulas'),
  ('bio_cel_organelas', 'Organelas celulares', 'bio_celulas'),
  ('bio_cel_membrana', 'Membrana e transportes', 'bio_celulas'),
  ('bio_cel_divisao', 'Divisão celular', 'bio_celulas'),
  ('bio_cel_ciclo', 'Ciclo celular e câncer', 'bio_celulas'),
  -- Biologia > Energia
  ('bio_ene_metabolismo', 'Metabolismo celular', 'bio_energia'),
  ('bio_ene_fotossintese', 'Fotossíntese', 'bio_energia'),
  ('bio_ene_quimiossintese', 'Quimiossíntese', 'bio_energia'),
  ('bio_ene_respiracao', 'Respiração celular', 'bio_energia'),
  ('bio_ene_fermentacao', 'Fermentação', 'bio_energia'),
  -- Biologia > Genética
  ('bio_gen_mendel', 'Leis de Mendel', 'bio_genetica'),
  ('bio_gen_extensoes', 'Extensões do mendelismo', 'bio_genetica'),
  ('bio_gen_ligados', 'Genes ligados e mapas', 'bio_genetica'),
  ('bio_gen_sexo', 'Herança e sexo', 'bio_genetica'),
  ('bio_gen_molecular', 'Genética molecular', 'bio_genetica'),
  ('bio_gen_engenharia', 'Engenharia genética', 'bio_genetica'),
  ('bio_gen_humana', 'Genética humana e doenças', 'bio_genetica'),
  ('bio_gen_populacoes', 'Genética de populações', 'bio_genetica'),
  ('bio_gen_evolucao', 'Evolução', 'bio_genetica'),
  -- Biologia > Sistemática
  ('bio_sis_taxonomia', 'Taxonomia e filogenia', 'bio_sistematica'),
  ('bio_sis_virus', 'Vírus', 'bio_sistematica'),
  ('bio_sis_monera', 'Monera', 'bio_sistematica'),
  ('bio_sis_protista', 'Protista', 'bio_sistematica'),
  ('bio_sis_fungos', 'Fungos', 'bio_sistematica'),
  ('bio_sis_plantas', 'Plantas', 'bio_sistematica'),
  ('bio_sis_invertebrados', 'Invertebrados', 'bio_sistematica'),
  ('bio_sis_vertebrados', 'Vertebrados', 'bio_sistematica'),
  -- Biologia > Sistemas
  ('bio_sist_nutricao', 'Nutrição e digestão', 'bio_sistemas'),
  ('bio_sist_respiracao', 'Respiração', 'bio_sistemas'),
  ('bio_sist_circulacao', 'Circulação', 'bio_sistemas'),
  ('bio_sist_excrecao', 'Excreção', 'bio_sistemas'),
  ('bio_sist_nervoso', 'Sistema nervoso', 'bio_sistemas'),
  ('bio_sist_endocrino', 'Sistema endócrino', 'bio_sistemas'),
  ('bio_sist_sensorial', 'Órgãos dos sentidos', 'bio_sistemas'),
  ('bio_sist_sustentacao', 'Sustentação e locomoção', 'bio_sistemas'),
  ('bio_sist_imune', 'Sistema imune', 'bio_sistemas'),
  ('bio_sist_reproducao', 'Reprodução', 'bio_sistemas'),
  ('bio_sist_embriologia', 'Embriologia', 'bio_sistemas'),
  -- Biologia > Ecologia
  ('bio_eco_conceitos', 'Conceitos fundamentais', 'bio_ecologia'),
  ('bio_eco_fluxo', 'Fluxo de energia', 'bio_ecologia'),
  ('bio_eco_ciclos', 'Ciclos biogeoquímicos', 'bio_ecologia'),
  ('bio_eco_dinamica', 'Dinâmica de populações', 'bio_ecologia'),
  ('bio_eco_interacoes', 'Interações ecológicas', 'bio_ecologia'),
  ('bio_eco_sucessao', 'Sucessão ecológica', 'bio_ecologia'),
  ('bio_eco_biomas', 'Biomas', 'bio_ecologia'),
  ('bio_eco_impactos', 'Impactos ambientais', 'bio_ecologia'),
  -- Física > Mecânica
  ('fis_mec_cinematica_escalar', 'Cinemática escalar', 'fis_mecanica'),
  ('fis_mec_cinematica_vetorial', 'Cinemática vetorial', 'fis_mecanica'),
  ('fis_mec_dinamica', 'Dinâmica', 'fis_mecanica'),
  ('fis_mec_trabalho_energia', 'Trabalho e energia', 'fis_mecanica'),
  ('fis_mec_impulso_momento', 'Impulso e quantidade de movimento', 'fis_mecanica'),
  ('fis_mec_gravitacao', 'Gravitação', 'fis_mecanica'),
  ('fis_mec_estatica', 'Estática', 'fis_mecanica'),
  ('fis_mec_hidrostatica', 'Hidrostática', 'fis_mecanica'),
  -- Física > Ondas
  ('fis_ond_mhs', 'MHS', 'fis_ondas'),
  ('fis_ond_ondas', 'Ondas', 'fis_ondas'),
  ('fis_ond_acustica', 'Acústica', 'fis_ondas'),
  -- Física > Termodinâmica
  ('fis_ter_termometria', 'Termometria', 'fis_termodinamica'),
  ('fis_ter_dilatacao', 'Dilatação', 'fis_termodinamica'),
  ('fis_ter_calorimetria', 'Calorimetria', 'fis_termodinamica'),
  ('fis_ter_mudanca_fase', 'Mudança de fase', 'fis_termodinamica'),
  ('fis_ter_transmissao', 'Transmissão de calor', 'fis_termodinamica'),
  ('fis_ter_gases', 'Gases', 'fis_termodinamica'),
  ('fis_ter_leis', 'Leis da termodinâmica', 'fis_termodinamica'),
  -- Física > Eletromagnetismo
  ('fis_ele_eletrostatica', 'Eletrostática', 'fis_eletromagnetismo'),
  ('fis_ele_eletrodinamica', 'Eletrodinâmica', 'fis_eletromagnetismo'),
  ('fis_ele_magnetismo', 'Magnetismo', 'fis_eletromagnetismo'),
  ('fis_ele_inducao', 'Indução eletromagnética', 'fis_eletromagnetismo'),
  -- Física > Óptica
  ('fis_opt_geometrica', 'Óptica geométrica', 'fis_optica'),
  ('fis_opt_ondulatoria', 'Óptica ondulatória', 'fis_optica'),
  -- Física > Física Moderna
  ('fis_mod_relatividade', 'Relatividade', 'fis_moderna'),
  ('fis_mod_quantica', 'Física quântica', 'fis_moderna'),
  ('fis_mod_nuclear', 'Física nuclear', 'fis_moderna'),
  -- Matemática > Álgebra
  ('mat_alg_conjuntos', 'Conjuntos', 'mat_algebra'),
  ('mat_alg_potenciacao', 'Potenciação e radiciação', 'mat_algebra'),
  ('mat_alg_produtos_notaveis', 'Produtos notáveis e fatoração', 'mat_algebra'),
  ('mat_alg_equacoes_1grau', 'Equações de 1º grau', 'mat_algebra'),
  ('mat_alg_equacoes_2grau', 'Equações de 2º grau', 'mat_algebra'),
  ('mat_alg_sistemas', 'Sistemas lineares', 'mat_algebra'),
  ('mat_alg_matrizes', 'Matrizes', 'mat_algebra'),
  ('mat_alg_determinantes', 'Determinantes', 'mat_algebra'),
  ('mat_alg_polinomios', 'Polinômios', 'mat_algebra'),
  ('mat_alg_numeros_complexos', 'Números complexos', 'mat_algebra'),
  -- Matemática > Geometria
  ('mat_geo_plana', 'Geometria plana', 'mat_geometria'),
  ('mat_geo_espacial', 'Geometria espacial', 'mat_geometria'),
  ('mat_geo_analitica', 'Geometria analítica', 'mat_geometria'),
  -- Matemática > Trigonometria
  ('mat_tri_triangulo', 'Trigonometria no triângulo', 'mat_trigonometria'),
  ('mat_tri_ciclo', 'Ciclo trigonométrico', 'mat_trigonometria'),
  ('mat_tri_funcoes', 'Funções trigonométricas', 'mat_trigonometria'),
  ('mat_tri_equacoes', 'Equações trigonométricas', 'mat_trigonometria'),
  -- Matemática > Funções
  ('mat_fun_conceitos', 'Conceitos de função', 'mat_funcoes'),
  ('mat_fun_afim', 'Função afim', 'mat_funcoes'),
  ('mat_fun_quadratica', 'Função quadrática', 'mat_funcoes'),
  ('mat_fun_modular', 'Função modular', 'mat_funcoes'),
  ('mat_fun_exponencial', 'Função exponencial', 'mat_funcoes'),
  ('mat_fun_logaritmica', 'Função logarítmica', 'mat_funcoes'),
  ('mat_fun_sequencias', 'Sequências e séries', 'mat_funcoes'),
  -- Matemática > Análise Combinatória
  ('mat_comb_principios', 'Princípios de contagem', 'mat_combinatoria'),
  ('mat_comb_permutacao', 'Permutação', 'mat_combinatoria'),
  ('mat_comb_arranjo', 'Arranjo', 'mat_combinatoria'),
  ('mat_comb_combinacao', 'Combinação', 'mat_combinatoria'),
  ('mat_comb_binomio', 'Binômio de Newton', 'mat_combinatoria'),
  -- Matemática > Probabilidade e Estatística
  ('mat_prob_probabilidade', 'Probabilidade', 'mat_probabilidade'),
  ('mat_prob_estatistica', 'Estatística', 'mat_probabilidade'),
  -- Química > Química Geral
  ('qui_ger_estrutura', 'Estrutura atômica', 'qui_geral'),
  ('qui_ger_tabela', 'Tabela periódica', 'qui_geral'),
  ('qui_ger_ligacoes', 'Ligações químicas', 'qui_geral'),
  ('qui_ger_geometria', 'Geometria molecular', 'qui_geral'),
  ('qui_ger_polaridade', 'Polaridade e forças intermoleculares', 'qui_geral'),
  ('qui_ger_nox', 'NOX', 'qui_geral'),
  -- Química > Química Inorgânica
  ('qui_ino_funcoes', 'Funções inorgânicas', 'qui_inorganica'),
  ('qui_ino_reacoes', 'Reações inorgânicas', 'qui_inorganica'),
  -- Química > Química Orgânica
  ('qui_org_introducao', 'Introdução à orgânica', 'qui_organica'),
  ('qui_org_hidrocarbonetos', 'Hidrocarbonetos', 'qui_organica'),
  ('qui_org_funcoes', 'Funções orgânicas oxigenadas e nitrogenadas', 'qui_organica'),
  ('qui_org_isomeria', 'Isomeria', 'qui_organica'),
  ('qui_org_reacoes', 'Reações orgânicas', 'qui_organica'),
  ('qui_org_polimeros', 'Polímeros', 'qui_organica'),
  ('qui_org_bioquimica', 'Bioquímica', 'qui_organica'),
  -- Química > Físico-Química
  ('qui_fis_estequiometria', 'Estequiometria', 'qui_fisico'),
  ('qui_fis_gases', 'Gases', 'qui_fisico'),
  ('qui_fis_solucoes', 'Soluções', 'qui_fisico'),
  ('qui_fis_propriedades', 'Propriedades coligativas', 'qui_fisico'),
  ('qui_fis_termoquimica', 'Termoquímica', 'qui_fisico'),
  ('qui_fis_cinetica', 'Cinética química', 'qui_fisico'),
  ('qui_fis_equilibrio', 'Equilíbrio químico', 'qui_fisico'),
  ('qui_fis_ph', 'pH e pOH', 'qui_fisico'),
  ('qui_fis_eletroquimica', 'Eletroquímica', 'qui_fisico'),
  ('qui_fis_radioatividade', 'Radioatividade', 'qui_fisico')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, content_id = EXCLUDED.content_id;

-- 3. REALOCAR QUESTÕES: atualizar content_id das questões existentes
-- Biologia
UPDATE public.questions SET content_id = 'bio_celulas' WHERE content_id = 'citologia';
UPDATE public.questions SET content_id = 'bio_ecologia' WHERE content_id = 'ecologia';
UPDATE public.questions SET content_id = 'bio_sistemas' WHERE content_id = 'fisiologia-humana';
UPDATE public.questions SET content_id = 'bio_genetica' WHERE content_id = 'genetica';
UPDATE public.questions SET content_id = 'bio_sistematica' WHERE content_id = 'microbiologia';
UPDATE public.questions SET content_id = 'bio_sistematica' WHERE content_id = 'zoologia';

-- Física
UPDATE public.questions SET content_id = 'fis_eletromagnetismo' WHERE content_id = 'eletricidade';
UPDATE public.questions SET content_id = 'fis_mecanica' WHERE content_id = 'mecanica';
UPDATE public.questions SET content_id = 'fis_ondas' WHERE content_id = 'ondas';
UPDATE public.questions SET content_id = 'fis_optica' WHERE content_id = 'optica';
UPDATE public.questions SET content_id = 'fis_termodinamica' WHERE content_id = 'termodinamica';

-- Matemática
UPDATE public.questions SET content_id = 'mat_probabilidade' WHERE content_id = 'estatistica-probabilidade';
UPDATE public.questions SET content_id = 'mat_geometria' WHERE content_id = 'geometria-espacial';
UPDATE public.questions SET content_id = 'mat_geometria' WHERE content_id = 'geometria-plana';
UPDATE public.questions SET content_id = 'mat_algebra' WHERE content_id = 'numeros-operacoes';
UPDATE public.questions SET content_id = 'mat_funcoes' WHERE content_id = 'sequencias-progressoes';

-- Química
UPDATE public.questions SET content_id = 'qui_fisico' WHERE content_id = 'fisico-quimica';
UPDATE public.questions SET content_id = 'qui_geral' WHERE content_id = 'quimica-ambiental';
UPDATE public.questions SET content_id = 'qui_geral' WHERE content_id = 'quimica-geral';
UPDATE public.questions SET content_id = 'qui_organica' WHERE content_id = 'quimica-organica';

-- 4. REMOVER question_topics órfãos (tópicos antigos das 4 disciplinas)
DELETE FROM public.question_topics 
WHERE topic_id IN (
  SELECT t.id FROM public.topics t
  JOIN public.contents c ON t.content_id = c.id
  WHERE c.subject_id IN ('biologia', 'fisica', 'matematica', 'quimica')
  AND t.id NOT LIKE 'bio_%' AND t.id NOT LIKE 'fis_%' AND t.id NOT LIKE 'mat_%' AND t.id NOT LIKE 'qui_%'
);

-- 5. REMOVER tópicos antigos das 4 disciplinas
DELETE FROM public.topics 
WHERE content_id IN (
  SELECT id FROM public.contents 
  WHERE subject_id IN ('biologia', 'fisica', 'matematica', 'quimica')
)
AND id NOT LIKE 'bio_%' AND id NOT LIKE 'fis_%' AND id NOT LIKE 'mat_%' AND id NOT LIKE 'qui_%';

-- 6. REMOVER conteúdos antigos das 4 disciplinas (agora sem referências)
DELETE FROM public.contents 
WHERE subject_id IN ('biologia', 'fisica', 'matematica', 'quimica')
AND id NOT LIKE 'bio_%' AND id NOT LIKE 'fis_%' AND id NOT LIKE 'mat_%' AND id NOT LIKE 'qui_%';
