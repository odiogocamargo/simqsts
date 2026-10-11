-- REORGANIZAÇÃO DA TAXONOMIA - Fase A1: fusões de conteúdos/tópicos sobrepostos e áreas do ENEM

DO $$
DECLARE
  r text[];
BEGIN
  -- Fusão de conteúdos: {antigo, novo, nome do novo}
  FOREACH r SLICE 1 IN ARRAY ARRAY[
    ['fi-circuitos','fi-eletrodinamica','Eletrodinâmica'],
    ['fi-inducao','fi-magnetismo','Eletromagnetismo'],
    ['fi-colisoes','fi-quantidade-movimento','Quantidade de movimento e colisões'],
    ['fi-calorimetria','fi-termologia','Termologia e calorimetria'],
    ['fi-gases','fi-termodinamica','Termodinâmica e gases'],
    ['fi-acustica','fi-ondulatoria','Ondulatória e acústica'],
    ['fi-oscilacoes','fi-ondulatoria','Ondulatória e acústica'],
    ['fi-vetores','fi-grandezas-unidades','Grandezas, unidades e vetores'],
    ['fi-hidrodinamica','fi-hidrostatica','Hidrostática e hidrodinâmica'],
    ['fi-estatica','fi-dinamica','Dinâmica e estática'],
    ['ma-inequacoes','ma-equacoes','Equações, inequações e sistemas'],
    ['ma-pa','ma-sequencias','Sequências e progressões'],
    ['ma-pg','ma-sequencias','Sequências e progressões'],
    ['ma-logaritmos','ma-exponencial','Exponenciais e logaritmos'],
    ['qu-equilibrio-ionico','qu-equilibrio','Equilíbrio químico'],
    ['qu-interacoes','qu-ligacoes-quimicas','Ligações e interações moleculares'],
    ['qu-tecnologica','qu-ambiental','Química ambiental e tecnológica'],
    ['ge-problemas-urbanos','ge-urbanizacao','Urbanização e problemas urbanos'],
    ['ge-solos','ge-geografia-fisica','Geologia, relevo e solos'],
    ['ge-transportes','ge-industria','Indústria e transportes'],
    ['gr-regencia-nominal','gr-regencia-verbal','Regência'],
    ['gr-concordancia-nominal','gr-concordancia-verbal','Concordância'],
    ['gr-hifen','gr-ortografia','Ortografia'],
    ['so-estratificacao','so-desigualdades','Desigualdades e estratificação'],
    ['so-midia','so-cultura','Cultura, mídia e indústria cultural'],
    ['so-capitalismo','so-trabalho','Trabalho e capitalismo'],
    ['so-cidadania','so-politica','Política e cidadania'],
    ['fl-helenistica','fl-antiga','Filosofia antiga'],
    ['fl-filosofia-ciencia','fl-epistemologia','Conhecimento e ciência']
  ] LOOP
    UPDATE public.topics SET content_id = r[2] WHERE content_id = r[1];
    UPDATE public.questions SET content_id = r[2] WHERE content_id = r[1];
    DELETE FROM public.contents WHERE id = r[1];
    UPDATE public.contents SET name = r[3] WHERE id = r[2] AND name <> r[3];
  END LOOP;

  -- Tópicos que mudam de conteúdo (levando as questões junto): {tópico, novo conteúdo}
  FOREACH r SLICE 1 IN ARRAY ARRAY[
    ['ma-al-sistema-linear','ma-equacoes'],
    ['ma-fn-exponencial','ma-exponencial'],
    ['ma-fn-logaritmica','ma-exponencial']
  ] LOOP
    UPDATE public.questions SET content_id = r[2]
      WHERE id IN (SELECT question_id FROM public.question_topics WHERE topic_id = r[1]);
    UPDATE public.topics SET content_id = r[2] WHERE id = r[1];
  END LOOP;

  -- Fusão de tópicos: {antigo, novo}
  FOREACH r SLICE 1 IN ARRAY ARRAY[
    ['ma-fn-dominio','ma-fn-conceito'], ['ma-fn-imagem','ma-fn-conceito'],
    ['ma-pb-evento','ma-pb-espaco-amostral'],
    ['bi-ec-teia-alimentar','bi-ec-cadeia-alimentar'],
    ['bi-ge-gene','bi-ge-alelo'], ['bi-ge-genotipo','bi-ge-alelo'], ['bi-ge-fenotipo','bi-ge-alelo'],
    ['bi-bo-seiva-elaborada','bi-bo-seiva-bruta'],
    ['gr-sg-por-que-final','gr-sg-por-que'], ['gr-sg-porque','gr-sg-por-que'], ['gr-sg-porque-substantivo','gr-sg-por-que'],
    ['gr-sg-conjuncoes-concessivas','gr-sg-conjuncoes-causais'], ['gr-sg-conjuncoes-conclusivas','gr-sg-conjuncoes-causais'],
    ['gr-sg-conjuncoes-condicionais','gr-sg-conjuncoes-causais'], ['gr-sg-conjuncoes-finais','gr-sg-conjuncoes-causais'],
    ['gr-si-sujeito-composto','gr-si-sujeito-simples'], ['gr-si-sujeito-indeterminado','gr-si-sujeito-simples'],
    ['gr-si-sujeito-oculto','gr-si-sujeito-simples'], ['gr-si-oracao-sem-sujeito','gr-si-sujeito-simples'],
    ['gr-si-predicado-verbal','gr-si-predicado-nominal'], ['gr-si-predicado-verbo-nominal','gr-si-predicado-nominal'],
    ['gr-si-objeto-indireto','gr-si-objeto-direto'], ['gr-si-complemento-nominal','gr-si-objeto-direto'],
    ['gr-si-adjunto-adverbial','gr-si-adjunto-adnominal'], ['gr-si-aposto','gr-si-adjunto-adnominal'], ['gr-si-vocativo','gr-si-adjunto-adnominal'],
    ['gr-po-aspas','gr-po-dois-pontos'], ['gr-po-colchetes','gr-po-dois-pontos'], ['gr-po-parenteses','gr-po-dois-pontos'],
    ['gr-po-travessao','gr-po-dois-pontos'], ['gr-po-ponto-virgula','gr-po-dois-pontos'],
    ['it-cc-comparacao','it-cc-causa'], ['it-cc-concessao','it-cc-causa'], ['it-cc-conclusao','it-cc-causa'],
    ['it-cc-condicao','it-cc-causa'], ['it-cc-consequencia','it-cc-causa']
  ] LOOP
    UPDATE public.question_topics SET topic_id = r[2] WHERE topic_id = r[1];
    DELETE FROM public.topics WHERE id = r[1];
  END LOOP;

  -- Renomear: {id, novo nome}
  FOREACH r SLICE 1 IN ARRAY ARRAY[
    ['ma-fn-conceito','Conceito, domínio e imagem'],
    ['ma-pb-espaco-amostral','Probabilidade simples (espaço amostral e eventos)'],
    ['ma-pa-termo-geral','PA: termo geral'], ['ma-pa-soma-termos','PA: soma dos termos'],
    ['ma-pg-termo-geral','PG: termo geral'], ['ma-pg-soma-termos','PG: soma dos termos'],
    ['ma-se-termo-geral','Sequências e padrões numéricos'],
    ['bi-ec-cadeia-alimentar','Cadeias e teias alimentares'],
    ['bi-ge-alelo','Conceitos básicos (gene, alelo, genótipo e fenótipo)'],
    ['bi-bo-seiva-bruta','Transporte de seiva (bruta e elaborada)'],
    ['qu-ei-ph','pH e pOH'],
    ['gr-rn-termos-regidos','Regência nominal'], ['gr-rv-verbos-transitivos','Regência verbal'],
    ['gr-cn-regra-geral','Concordância nominal: regra geral'], ['gr-cn-casos-especiais','Concordância nominal: casos especiais'],
    ['gr-cv-regra-geral','Concordância verbal: regra geral'], ['gr-cv-casos-especiais','Concordância verbal: casos especiais'],
    ['gr-hi-regras-principais','Hífen'],
    ['gr-sg-por-que','Uso dos porquês'],
    ['gr-sg-conjuncoes-causais','Valor semântico das conjunções'],
    ['gr-si-sujeito-simples','Sujeito (tipos)'], ['gr-si-predicado-nominal','Predicado (tipos)'],
    ['gr-si-objeto-direto','Complementos verbais e nominais'],
    ['gr-si-adjunto-adnominal','Termos acessórios (adjuntos, aposto e vocativo)'],
    ['gr-si-agente-passiva','Vozes verbais e agente da passiva'],
    ['gr-po-dois-pontos','Outros sinais de pontuação'],
    ['it-cc-causa','Relações lógicas entre ideias (causa, consequência, condição, concessão)']
  ] LOOP
    UPDATE public.topics SET name = r[2] WHERE id = r[1];
  END LOOP;

  FOREACH r SLICE 1 IN ARRAY ARRAY[
    ['ma-matrizes','Matrizes e determinantes'],
    ['fl-medieval','Filosofia medieval'], ['fl-moderna','Filosofia moderna'],
    ['fl-contemporanea','Filosofia contemporânea'], ['fl-introducao','Introdução à filosofia'],
    ['fl-politica','Filosofia política']
  ] LOOP
    UPDATE public.contents SET name = r[2] WHERE id = r[1];
  END LOOP;
END $$;

-- Tópicos vazios e redundantes
DELETE FROM public.topics t
WHERE t.id IN ('it-cc-contradicao','it-cc-fuga-tema','ge-gp-asia-pacifico','hi-sxx-revolucao-iraniana')
  AND NOT EXISTS (SELECT 1 FROM public.question_topics qt WHERE qt.topic_id = t.id);

-- Áreas do ENEM
INSERT INTO public.areas (id, name) VALUES
  ('linguagens','Linguagens, Códigos e suas Tecnologias'),
  ('humanas','Ciências Humanas e suas Tecnologias'),
  ('natureza','Ciências da Natureza e suas Tecnologias'),
  ('matematica','Matemática e suas Tecnologias')
ON CONFLICT (id) DO NOTHING;

UPDATE public.subjects SET area_id = 'linguagens' WHERE id IN ('gr','it','li','in','es');
UPDATE public.subjects SET area_id = 'humanas' WHERE id IN ('hi','ge','fl','so');
UPDATE public.subjects SET area_id = 'natureza' WHERE id IN ('bi','fi','qu');
UPDATE public.subjects SET area_id = 'matematica' WHERE id = 'ma';
DELETE FROM public.areas a WHERE a.id = 'geral' AND NOT EXISTS (SELECT 1 FROM public.subjects s WHERE s.area_id = a.id);
