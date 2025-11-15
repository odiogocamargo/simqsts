-- Limpar tópicos antigos para recomeçar
DELETE FROM topics;

-- ==========================================
-- MATEMÁTICA - Todos os Tópicos Completos
-- ==========================================

-- Sequências e Progressões
INSERT INTO topics (id, content_id, name) VALUES
  ('sequencias-numericas', 'sequencias-progressoes', 'Sequências numéricas e padrões'),
  ('progressao-aritmetica', 'sequencias-progressoes', 'Progressão aritmética (PA)'),
  ('progressao-geometrica', 'sequencias-progressoes', 'Progressão geométrica (PG)'),
  ('aplicacoes-pa-pg', 'sequencias-progressoes', 'Aplicações práticas de PA e PG'),
  ('matematica-financeira', 'sequencias-progressoes', 'Matemática financeira');

-- Geometria Plana
INSERT INTO topics (id, content_id, name) VALUES
  ('conceitos-fundamentais-geo', 'geometria-plana', 'Conceitos fundamentais de geometria'),
  ('triangulos', 'geometria-plana', 'Triângulos'),
  ('quadrilateros', 'geometria-plana', 'Quadriláteros'),
  ('poligonos', 'geometria-plana', 'Polígonos'),
  ('circunferencia-circulo', 'geometria-plana', 'Circunferência e círculo'),
  ('areas-perimetros', 'geometria-plana', 'Áreas e perímetros'),
  ('teorema-pitagoras', 'geometria-plana', 'Teorema de Pitágoras'),
  ('relacoes-metricas', 'geometria-plana', 'Relações métricas');

-- Geometria Espacial
INSERT INTO topics (id, content_id, name) VALUES
  ('prismas', 'geometria-espacial', 'Prismas'),
  ('piramides', 'geometria-espacial', 'Pirâmides'),
  ('cilindros', 'geometria-espacial', 'Cilindros'),
  ('cones', 'geometria-espacial', 'Cones'),
  ('esferas', 'geometria-espacial', 'Esferas'),
  ('poliedros', 'geometria-espacial', 'Poliedros'),
  ('volumes', 'geometria-espacial', 'Volumes'),
  ('areas-superficiais', 'geometria-espacial', 'Áreas de superfícies');

-- Trigonometria
INSERT INTO topics (id, content_id, name) VALUES
  ('razoes-trigonometricas', 'trigonometria', 'Razões trigonométricas'),
  ('triangulo-retangulo', 'trigonometria', 'Trigonometria no triângulo retângulo'),
  ('lei-senos', 'trigonometria', 'Lei dos senos'),
  ('lei-cossenos', 'trigonometria', 'Lei dos cossenos'),
  ('circulo-trigonometrico', 'trigonometria', 'Círculo trigonométrico'),
  ('identidades-trigonometricas', 'trigonometria', 'Identidades trigonométricas'),
  ('equacoes-trigonometricas', 'trigonometria', 'Equações trigonométricas'),
  ('transformacoes-trigonometricas', 'trigonometria', 'Transformações trigonométricas');

-- Geometria Analítica
INSERT INTO topics (id, content_id, name) VALUES
  ('plano-cartesiano', 'geometria-analitica', 'Plano cartesiano'),
  ('distancia-ponto-medio', 'geometria-analitica', 'Distância entre pontos e ponto médio'),
  ('equacao-reta', 'geometria-analitica', 'Equação da reta'),
  ('posicoes-relativas-retas', 'geometria-analitica', 'Posições relativas entre retas'),
  ('equacao-circunferencia', 'geometria-analitica', 'Equação da circunferência'),
  ('conicas', 'geometria-analitica', 'Cônicas: elipse, hipérbole e parábola'),
  ('vetores', 'geometria-analitica', 'Vetores no plano');

-- Estatística e Probabilidade
INSERT INTO topics (id, content_id, name) VALUES
  ('medidas-centrais', 'estatistica-probabilidade', 'Medidas de tendência central'),
  ('medidas-dispersao', 'estatistica-probabilidade', 'Medidas de dispersão'),
  ('graficos-tabelas', 'estatistica-probabilidade', 'Gráficos e tabelas'),
  ('probabilidade-basica', 'estatistica-probabilidade', 'Probabilidade básica'),
  ('probabilidade-condicional', 'estatistica-probabilidade', 'Probabilidade condicional'),
  ('distribuicoes', 'estatistica-probabilidade', 'Distribuições de probabilidade'),
  ('amostragem', 'estatistica-probabilidade', 'Amostragem');

-- Análise Combinatória
INSERT INTO topics (id, content_id, name) VALUES
  ('principio-fundamental', 'analise-combinatoria', 'Princípio fundamental da contagem'),
  ('permutacoes', 'analise-combinatoria', 'Permutações'),
  ('arranjos', 'analise-combinatoria', 'Arranjos'),
  ('combinacoes', 'analise-combinatoria', 'Combinações'),
  ('binomio-newton', 'analise-combinatoria', 'Binômio de Newton');

-- Matrizes e Determinantes
INSERT INTO topics (id, content_id, name) VALUES
  ('tipos-matrizes', 'matrizes-determinantes', 'Tipos de matrizes'),
  ('operacoes-matrizes', 'matrizes-determinantes', 'Operações com matrizes'),
  ('determinantes', 'matrizes-determinantes', 'Determinantes'),
  ('matriz-inversa', 'matrizes-determinantes', 'Matriz inversa'),
  ('sistemas-lineares-matrizes', 'matrizes-determinantes', 'Sistemas lineares e matrizes');

-- Números Complexos
INSERT INTO topics (id, content_id, name) VALUES
  ('forma-algebrica', 'numeros-complexos', 'Forma algébrica'),
  ('operacoes-complexos', 'numeros-complexos', 'Operações com números complexos'),
  ('forma-trigonometrica', 'numeros-complexos', 'Forma trigonométrica'),
  ('potenciacao-radiciacao-complexos', 'numeros-complexos', 'Potenciação e radiciação'),
  ('plano-argand-gauss', 'numeros-complexos', 'Plano de Argand-Gauss');

-- Polinômios
INSERT INTO topics (id, content_id, name) VALUES
  ('grau-polinomio', 'polinomios', 'Grau de polinômio'),
  ('operacoes-polinomios', 'polinomios', 'Operações com polinômios'),
  ('divisao-polinomios', 'polinomios', 'Divisão de polinômios'),
  ('teorema-resto', 'polinomios', 'Teorema do resto'),
  ('raizes-polinomios', 'polinomios', 'Raízes de polinômios'),
  ('relacoes-girard', 'polinomios', 'Relações de Girard');

-- ==========================================
-- PORTUGUÊS - Todos os Tópicos Completos
-- ==========================================

-- Interpretação de Texto
INSERT INTO topics (id, content_id, name) VALUES
  ('leitura-compreensao', 'interpretacao-texto', 'Leitura e compreensão'),
  ('interpretacao-inferencia', 'interpretacao-texto', 'Interpretação e inferência'),
  ('generos-textuais', 'interpretacao-texto', 'Gêneros textuais'),
  ('tipologia-textual', 'interpretacao-texto', 'Tipologia textual'),
  ('coesao-textual', 'interpretacao-texto', 'Coesão textual'),
  ('coerencia-textual', 'interpretacao-texto', 'Coerência textual'),
  ('figuras-linguagem', 'interpretacao-texto', 'Figuras de linguagem');

-- Redação (Português)
INSERT INTO topics (id, content_id, name) VALUES
  ('dissertacao-argumentativa', 'redacao', 'Dissertação argumentativa'),
  ('tecnicas-argumentacao', 'redacao', 'Técnicas de argumentação'),
  ('estrutura-textual', 'redacao', 'Estrutura textual'),
  ('introducao-conclusao', 'redacao', 'Introdução e conclusão'),
  ('paragrafacao', 'redacao', 'Paragrafação');

-- Semântica e Estilos
INSERT INTO topics (id, content_id, name) VALUES
  ('sinonimos-antonimos', 'semantica-estilos', 'Sinônimos e antônimos'),
  ('homonimos-paronimos', 'semantica-estilos', 'Homônimos e parônimos'),
  ('polissemia', 'semantica-estilos', 'Polissemia'),
  ('denotacao-conotacao', 'semantica-estilos', 'Denotação e conotação'),
  ('variacoes-linguisticas', 'semantica-estilos', 'Variações linguísticas'),
  ('funcoes-linguagem', 'semantica-estilos', 'Funções da linguagem');

-- ==========================================
-- FÍSICA - Todos os Tópicos Completos
-- ==========================================

-- Termodinâmica
INSERT INTO topics (id, content_id, name) VALUES
  ('temperatura-calor', 'termodinamica', 'Temperatura e calor'),
  ('dilatacao-termica', 'termodinamica', 'Dilatação térmica'),
  ('calorimetria', 'termodinamica', 'Calorimetria'),
  ('mudancas-estado', 'termodinamica', 'Mudanças de estado'),
  ('gases-ideais', 'termodinamica', 'Gases ideais'),
  ('leis-termodinamica', 'termodinamica', 'Leis da termodinâmica'),
  ('maquinas-termicas', 'termodinamica', 'Máquinas térmicas');

-- Ondas
INSERT INTO topics (id, content_id, name) VALUES
  ('caracteristicas-ondas', 'ondas', 'Características das ondas'),
  ('tipos-ondas', 'ondas', 'Tipos de ondas'),
  ('fenomenos-ondulatorios', 'ondas', 'Fenômenos ondulatórios'),
  ('ondas-sonoras', 'ondas', 'Ondas sonoras'),
  ('efeito-doppler', 'ondas', 'Efeito Doppler'),
  ('interferencia', 'ondas', 'Interferência');

-- Óptica
INSERT INTO topics (id, content_id, name) VALUES
  ('luz-propagacao', 'optica', 'Luz e propagação'),
  ('reflexao-luz', 'optica', 'Reflexão da luz'),
  ('refracao-luz', 'optica', 'Refração da luz'),
  ('espelhos', 'optica', 'Espelhos planos e esféricos'),
  ('lentes', 'optica', 'Lentes'),
  ('instrumentos-opticos', 'optica', 'Instrumentos ópticos'),
  ('optica-olho-humano', 'optica', 'Óptica e olho humano');

-- Eletricidade
INSERT INTO topics (id, content_id, name) VALUES
  ('carga-eletrica', 'eletricidade', 'Carga elétrica'),
  ('lei-coulomb', 'eletricidade', 'Lei de Coulomb'),
  ('campo-eletrico', 'eletricidade', 'Campo elétrico'),
  ('potencial-eletrico', 'eletricidade', 'Potencial elétrico'),
  ('corrente-eletrica', 'eletricidade', 'Corrente elétrica'),
  ('resistores', 'eletricidade', 'Resistores'),
  ('lei-ohm', 'eletricidade', 'Lei de Ohm'),
  ('circuitos-eletricos', 'eletricidade', 'Circuitos elétricos'),
  ('potencia-eletrica', 'eletricidade', 'Potência elétrica');

-- Magnetismo
INSERT INTO topics (id, content_id, name) VALUES
  ('imas-magnetismo', 'magnetismo', 'Ímãs e magnetismo'),
  ('campo-magnetico', 'magnetismo', 'Campo magnético'),
  ('forca-magnetica', 'magnetismo', 'Força magnética'),
  ('inducao-eletromagnetica', 'magnetismo', 'Indução eletromagnética'),
  ('lei-faraday', 'magnetismo', 'Lei de Faraday'),
  ('transformadores', 'magnetismo', 'Transformadores');

-- Física Moderna
INSERT INTO topics (id, content_id, name) VALUES
  ('relatividade', 'fisica-moderna', 'Relatividade'),
  ('quantica', 'fisica-moderna', 'Física quântica'),
  ('efeito-fotoeletrico', 'fisica-moderna', 'Efeito fotoelétrico'),
  ('radioatividade', 'fisica-moderna', 'Radioatividade'),
  ('energia-nuclear', 'fisica-moderna', 'Energia nuclear');

-- ==========================================
-- QUÍMICA - Todos os Tópicos Completos
-- ==========================================

-- Físico-Química
INSERT INTO topics (id, content_id, name) VALUES
  ('termoquimica', 'fisico-quimica', 'Termoquímica'),
  ('cinetica-quimica', 'fisico-quimica', 'Cinética química'),
  ('equilibrio-quimico', 'fisico-quimica', 'Equilíbrio químico'),
  ('eletroquimica', 'fisico-quimica', 'Eletroquímica'),
  ('propriedades-coligativas', 'fisico-quimica', 'Propriedades coligativas'),
  ('ph-poh', 'fisico-quimica', 'pH e pOH');

-- Química Orgânica
INSERT INTO topics (id, content_id, name) VALUES
  ('introducao-organica', 'quimica-organica', 'Introdução à química orgânica'),
  ('hidrocarbonetos', 'quimica-organica', 'Hidrocarbonetos'),
  ('funcoes-organicas', 'quimica-organica', 'Funções orgânicas'),
  ('isomeria', 'quimica-organica', 'Isomeria'),
  ('reacoes-organicas', 'quimica-organica', 'Reações orgânicas'),
  ('polimeros', 'quimica-organica', 'Polímeros'),
  ('biomoleculas', 'quimica-organica', 'Biomoléculas');

-- Química Inorgânica
INSERT INTO topics (id, content_id, name) VALUES
  ('acidos-bases', 'quimica-inorganica', 'Ácidos e bases'),
  ('sais', 'quimica-inorganica', 'Sais'),
  ('oxidos', 'quimica-inorganica', 'Óxidos'),
  ('funcoes-inorganicas', 'quimica-inorganica', 'Funções inorgânicas'),
  ('nomenclatura-inorganica', 'quimica-inorganica', 'Nomenclatura inorgânica');

-- Química Ambiental
INSERT INTO topics (id, content_id, name) VALUES
  ('poluicao-ar', 'quimica-ambiental', 'Poluição do ar'),
  ('poluicao-agua', 'quimica-ambiental', 'Poluição da água'),
  ('efeito-estufa', 'quimica-ambiental', 'Efeito estufa'),
  ('chuva-acida', 'quimica-ambiental', 'Chuva ácida'),
  ('tratamento-agua', 'quimica-ambiental', 'Tratamento de água'),
  ('reciclagem', 'quimica-ambiental', 'Reciclagem');

-- ==========================================
-- BIOLOGIA - Todos os Tópicos Completos
-- ==========================================

-- Genética
INSERT INTO topics (id, content_id, name) VALUES
  ('primeira-lei-mendel', 'genetica', 'Primeira lei de Mendel'),
  ('segunda-lei-mendel', 'genetica', 'Segunda lei de Mendel'),
  ('alelos-multiplos', 'genetica', 'Alelos múltiplos'),
  ('heranca-sexo', 'genetica', 'Herança ligada ao sexo'),
  ('interacao-genica', 'genetica', 'Interação gênica'),
  ('dna-rna', 'genetica', 'DNA e RNA'),
  ('sintese-proteinas', 'genetica', 'Síntese de proteínas'),
  ('biotecnologia', 'genetica', 'Biotecnologia');

-- Evolução
INSERT INTO topics (id, content_id, name) VALUES
  ('teorias-evolucao', 'evolucao', 'Teorias da evolução'),
  ('selecao-natural', 'evolucao', 'Seleção natural'),
  ('especiacao', 'evolucao', 'Especiação'),
  ('evidencias-evolucao', 'evolucao', 'Evidências da evolução'),
  ('origem-vida', 'evolucao', 'Origem da vida');

-- Ecologia
INSERT INTO topics (id, content_id, name) VALUES
  ('ecossistemas', 'ecologia', 'Ecossistemas'),
  ('cadeias-alimentares', 'ecologia', 'Cadeias e teias alimentares'),
  ('ciclos-biogeoquimicos', 'ecologia', 'Ciclos biogeoquímicos'),
  ('relacoes-ecologicas', 'ecologia', 'Relações ecológicas'),
  ('populacoes', 'ecologia', 'Dinâmica de populações'),
  ('biomas', 'ecologia', 'Biomas'),
  ('impactos-ambientais', 'ecologia', 'Impactos ambientais');

-- Fisiologia Humana
INSERT INTO topics (id, content_id, name) VALUES
  ('sistema-circulatorio', 'fisiologia-humana', 'Sistema circulatório'),
  ('sistema-respiratorio', 'fisiologia-humana', 'Sistema respiratório'),
  ('sistema-digestorio', 'fisiologia-humana', 'Sistema digestório'),
  ('sistema-nervoso', 'fisiologia-humana', 'Sistema nervoso'),
  ('sistema-endocrino', 'fisiologia-humana', 'Sistema endócrino'),
  ('sistema-urinario', 'fisiologia-humana', 'Sistema urinário'),
  ('sistema-reprodutor', 'fisiologia-humana', 'Sistema reprodutor'),
  ('sistema-imunologico', 'fisiologia-humana', 'Sistema imunológico');

-- Botânica
INSERT INTO topics (id, content_id, name) VALUES
  ('classificacao-vegetal', 'botanica', 'Classificação dos vegetais'),
  ('morfologia-vegetal', 'botanica', 'Morfologia vegetal'),
  ('fisiologia-vegetal', 'botanica', 'Fisiologia vegetal'),
  ('fotossintese', 'botanica', 'Fotossíntese'),
  ('reproducao-vegetal', 'botanica', 'Reprodução vegetal');

-- Zoologia
INSERT INTO topics (id, content_id, name) VALUES
  ('invertebrados', 'zoologia', 'Invertebrados'),
  ('vertebrados', 'zoologia', 'Vertebrados'),
  ('classificacao-animal', 'zoologia', 'Classificação dos animais'),
  ('anatomia-comparada', 'zoologia', 'Anatomia comparada');

-- Microbiologia
INSERT INTO topics (id, content_id, name) VALUES
  ('bacterias', 'microbiologia', 'Bactérias'),
  ('virus', 'microbiologia', 'Vírus'),
  ('fungos', 'microbiologia', 'Fungos'),
  ('protozoarios', 'microbiologia', 'Protozoários'),
  ('doencas-infecciosas', 'microbiologia', 'Doenças infecciosas');

-- ==========================================
-- HISTÓRIA - Todos os Tópicos Completos
-- ==========================================

-- História Antiga
INSERT INTO topics (id, content_id, name) VALUES
  ('mesopotamia', 'historia-antiga', 'Mesopotâmia'),
  ('egito', 'historia-antiga', 'Egito'),
  ('grecia', 'historia-antiga', 'Grécia'),
  ('roma', 'historia-antiga', 'Roma'),
  ('fenicios', 'historia-antiga', 'Fenícios'),
  ('hebreus', 'historia-antiga', 'Hebreus');

-- História Medieval
INSERT INTO topics (id, content_id, name) VALUES
  ('feudalismo', 'historia-medieval', 'Feudalismo'),
  ('igreja-medieval', 'historia-medieval', 'Igreja na Idade Média'),
  ('cruzadas', 'historia-medieval', 'Cruzadas'),
  ('imperio-bizantino', 'historia-medieval', 'Império Bizantino'),
  ('islamismo', 'historia-medieval', 'Islamismo');

-- História Moderna
INSERT INTO topics (id, content_id, name) VALUES
  ('renascimento', 'historia-moderna', 'Renascimento'),
  ('reforma-protestante', 'historia-moderna', 'Reforma Protestante'),
  ('absolutismo', 'historia-moderna', 'Absolutismo'),
  ('iluminismo', 'historia-moderna', 'Iluminismo'),
  ('revolucao-francesa', 'historia-moderna', 'Revolução Francesa'),
  ('revolucao-industrial', 'historia-moderna', 'Revolução Industrial');

-- História Contemporânea
INSERT INTO topics (id, content_id, name) VALUES
  ('imperialismo', 'historia-contemporanea', 'Imperialismo'),
  ('primeira-guerra', 'historia-contemporanea', 'Primeira Guerra Mundial'),
  ('revolucao-russa', 'historia-contemporanea', 'Revolução Russa'),
  ('nazifascismo', 'historia-contemporanea', 'Nazifascismo'),
  ('segunda-guerra', 'historia-contemporanea', 'Segunda Guerra Mundial'),
  ('guerra-fria', 'historia-contemporanea', 'Guerra Fria'),
  ('descolonizacao', 'historia-contemporanea', 'Descolonização'),
  ('globalizacao', 'historia-contemporanea', 'Globalização');

-- História da América
INSERT INTO topics (id, content_id, name) VALUES
  ('pre-colombiana', 'historia-america', 'América Pré-Colombiana'),
  ('colonizacao-espanhola', 'historia-america', 'Colonização Espanhola'),
  ('colonizacao-inglesa', 'historia-america', 'Colonização Inglesa'),
  ('independencias', 'historia-america', 'Independências na América'),
  ('america-seculo-xx', 'historia-america', 'América no século XX');

-- ==========================================
-- GEOGRAFIA - Todos os Tópicos Completos
-- ==========================================

-- Geografia Humana
INSERT INTO topics (id, content_id, name) VALUES
  ('populacao', 'geografia-humana', 'População'),
  ('urbanizacao', 'geografia-humana', 'Urbanização'),
  ('migracao', 'geografia-humana', 'Migrações'),
  ('industria', 'geografia-humana', 'Indústria'),
  ('agricultura', 'geografia-humana', 'Agricultura'),
  ('comercio', 'geografia-humana', 'Comércio');

-- Geografia do Brasil
INSERT INTO topics (id, content_id, name) VALUES
  ('regioes-brasil', 'geografia-brasil', 'Regiões do Brasil'),
  ('clima-brasil', 'geografia-brasil', 'Clima do Brasil'),
  ('relevo-brasil', 'geografia-brasil', 'Relevo do Brasil'),
  ('hidrografia-brasil', 'geografia-brasil', 'Hidrografia do Brasil'),
  ('vegetacao-brasil', 'geografia-brasil', 'Vegetação do Brasil'),
  ('economia-brasil', 'geografia-brasil', 'Economia do Brasil'),
  ('populacao-brasil', 'geografia-brasil', 'População do Brasil');

-- Geopolítica
INSERT INTO topics (id, content_id, name) VALUES
  ('ordem-mundial', 'geopolitica', 'Ordem mundial'),
  ('blocos-economicos', 'geopolitica', 'Blocos econômicos'),
  ('conflitos-mundiais', 'geopolitica', 'Conflitos mundiais'),
  ('onu', 'geopolitica', 'ONU e organizações internacionais'),
  ('globalizacao-geo', 'geopolitica', 'Globalização');

-- Cartografia
INSERT INTO topics (id, content_id, name) VALUES
  ('coordenadas-geograficas', 'cartografia', 'Coordenadas geográficas'),
  ('fusos-horarios', 'cartografia', 'Fusos horários'),
  ('escalas', 'cartografia', 'Escalas'),
  ('projecoes-cartograficas', 'cartografia', 'Projeções cartográficas'),
  ('tipos-mapas', 'cartografia', 'Tipos de mapas');

-- ==========================================
-- FILOSOFIA - Todos os Tópicos Completos
-- ==========================================

-- Filosofia Medieval
INSERT INTO topics (id, content_id, name) VALUES
  ('patristica', 'filosofia-medieval', 'Patrística'),
  ('escolastica', 'filosofia-medieval', 'Escolástica'),
  ('santo-agostinho', 'filosofia-medieval', 'Santo Agostinho'),
  ('tomas-aquino', 'filosofia-medieval', 'Tomás de Aquino');

-- Filosofia Moderna
INSERT INTO topics (id, content_id, name) VALUES
  ('racionalismo', 'filosofia-moderna', 'Racionalismo'),
  ('empirismo', 'filosofia-moderna', 'Empirismo'),
  ('descartes', 'filosofia-moderna', 'Descartes'),
  ('kant', 'filosofia-moderna', 'Kant'),
  ('hegel', 'filosofia-moderna', 'Hegel');

-- Filosofia Contemporânea
INSERT INTO topics (id, content_id, name) VALUES
  ('existencialismo', 'filosofia-contemporanea', 'Existencialismo'),
  ('fenomenologia', 'filosofia-contemporanea', 'Fenomenologia'),
  ('nietzsche', 'filosofia-contemporanea', 'Nietzsche'),
  ('sartre', 'filosofia-contemporanea', 'Sartre'),
  ('foucault', 'filosofia-contemporanea', 'Foucault');

-- Ética e Política
INSERT INTO topics (id, content_id, name) VALUES
  ('etica-moral', 'etica-politica', 'Ética e moral'),
  ('teoria-politica', 'etica-politica', 'Teoria política'),
  ('democracia', 'etica-politica', 'Democracia'),
  ('justica', 'etica-politica', 'Justiça'),
  ('direitos-humanos', 'etica-politica', 'Direitos humanos');

-- Epistemologia
INSERT INTO topics (id, content_id, name) VALUES
  ('conhecimento', 'epistemologia', 'Teoria do conhecimento'),
  ('verdade', 'epistemologia', 'Conceito de verdade'),
  ('metodo-cientifico', 'epistemologia', 'Método científico'),
  ('ceticismo', 'epistemologia', 'Ceticismo');

-- ==========================================
-- SOCIOLOGIA - Todos os Tópicos Completos
-- ==========================================

-- Introdução à Sociologia
INSERT INTO topics (id, content_id, name) VALUES
  ('surgimento-sociologia', 'introducao-sociologia', 'Surgimento da sociologia'),
  ('classicos-sociologia', 'introducao-sociologia', 'Clássicos da sociologia'),
  ('marx', 'introducao-sociologia', 'Marx'),
  ('durkheim', 'introducao-sociologia', 'Durkheim'),
  ('weber', 'introducao-sociologia', 'Weber');

-- Estratificação Social
INSERT INTO topics (id, content_id, name) VALUES
  ('classes-sociais', 'estratificacao-social', 'Classes sociais'),
  ('desigualdade-social', 'estratificacao-social', 'Desigualdade social'),
  ('mobilidade-social', 'estratificacao-social', 'Mobilidade social'),
  ('pobreza', 'estratificacao-social', 'Pobreza');

-- Movimentos Sociais
INSERT INTO topics (id, content_id, name) VALUES
  ('tipos-movimentos', 'movimentos-sociais', 'Tipos de movimentos sociais'),
  ('direitos-civis', 'movimentos-sociais', 'Movimentos por direitos civis'),
  ('feminismo', 'movimentos-sociais', 'Feminismo'),
  ('movimento-negro', 'movimentos-sociais', 'Movimento negro'),
  ('lgbtqia', 'movimentos-sociais', 'Movimento LGBTQIA+');

-- Trabalho e Sociedade
INSERT INTO topics (id, content_id, name) VALUES
  ('divisao-trabalho', 'trabalho', 'Divisão do trabalho'),
  ('trabalho-capitalismo', 'trabalho', 'Trabalho no capitalismo'),
  ('fordismo-toyotismo', 'trabalho', 'Fordismo e Toyotismo'),
  ('desemprego', 'trabalho', 'Desemprego'),
  ('sindicatos', 'trabalho', 'Sindicatos');

-- Política e Poder
INSERT INTO topics (id, content_id, name) VALUES
  ('estado-poder', 'politica-poder', 'Estado e poder'),
  ('sistemas-politicos', 'politica-poder', 'Sistemas políticos'),
  ('ideologias', 'politica-poder', 'Ideologias'),
  ('participacao-politica', 'politica-poder', 'Participação política');

-- ==========================================
-- INGLÊS - Todos os Tópicos Completos
-- ==========================================

-- Interpretação Inglês
INSERT INTO topics (id, content_id, name) VALUES
  ('reading-comprehension', 'interpretacao-ingles', 'Reading Comprehension'),
  ('text-genres-english', 'interpretacao-ingles', 'Text Genres'),
  ('inference-english', 'interpretacao-ingles', 'Inference'),
  ('vocabulary-context', 'interpretacao-ingles', 'Vocabulary in Context');

-- Vocabulário Inglês
INSERT INTO topics (id, content_id, name) VALUES
  ('phrasal-verbs', 'vocabulario-ingles', 'Phrasal Verbs'),
  ('idioms', 'vocabulario-ingles', 'Idioms'),
  ('collocations', 'vocabulario-ingles', 'Collocations'),
  ('false-friends', 'vocabulario-ingles', 'False Friends');

-- Compreensão Oral Inglês
INSERT INTO topics (id, content_id, name) VALUES
  ('listening-strategies', 'compreensao-oral-ingles', 'Listening Strategies'),
  ('pronunciation', 'compreensao-oral-ingles', 'Pronunciation'),
  ('connected-speech', 'compreensao-oral-ingles', 'Connected Speech');

-- ==========================================
-- ESPANHOL - Todos os Tópicos Completos
-- ==========================================

-- Interpretação Espanhol
INSERT INTO topics (id, content_id, name) VALUES
  ('comprension-lectora', 'interpretacao-espanhol', 'Comprensión Lectora'),
  ('generos-textuales', 'interpretacao-espanhol', 'Géneros Textuales'),
  ('inferencia-espanol', 'interpretacao-espanhol', 'Inferencia'),
  ('vocabulario-contexto', 'interpretacao-espanhol', 'Vocabulario en Contexto');

-- Vocabulário Espanhol
INSERT INTO topics (id, content_id, name) VALUES
  ('expresiones', 'vocabulario-espanhol', 'Expresiones'),
  ('modismos', 'vocabulario-espanhol', 'Modismos'),
  ('falsos-amigos', 'vocabulario-espanhol', 'Falsos Amigos'),
  ('regionalismos', 'vocabulario-espanhol', 'Regionalismos');

-- Compreensão Oral Espanhol
INSERT INTO topics (id, content_id, name) VALUES
  ('comprension-auditiva', 'compreensao-oral-espanhol', 'Comprensión Auditiva'),
  ('pronunciacion', 'compreensao-oral-espanhol', 'Pronunciación'),
  ('variantes', 'compreensao-oral-espanhol', 'Variantes del Español');

-- ==========================================
-- REDAÇÃO - Todos os Tópicos Completos
-- ==========================================

-- Técnicas de Redação
INSERT INTO topics (id, content_id, name) VALUES
  ('planejamento-texto', 'tecnicas-redacao', 'Planejamento do texto'),
  ('desenvolvimento-ideias', 'tecnicas-redacao', 'Desenvolvimento de ideias'),
  ('revisao-texto', 'tecnicas-redacao', 'Revisão do texto'),
  ('adequacao-linguistica', 'tecnicas-redacao', 'Adequação linguística');

-- Argumentação
INSERT INTO topics (id, content_id, name) VALUES
  ('tipos-argumento', 'argumentacao', 'Tipos de argumento'),
  ('contra-argumentacao', 'argumentacao', 'Contra-argumentação'),
  ('exemplificacao', 'argumentacao', 'Exemplificação'),
  ('citacoes', 'argumentacao', 'Citações');

-- Coesão e Coerência
INSERT INTO topics (id, content_id, name) VALUES
  ('conectivos', 'coesao-coerencia', 'Conectivos'),
  ('referenciacao', 'coesao-coerencia', 'Referenciação'),
  ('progressao-tematica', 'coesao-coerencia', 'Progressão temática'),
  ('unidade-sentido', 'coesao-coerencia', 'Unidade de sentido');