
-- Inserir tópicos de História do Brasil
INSERT INTO topics (id, name, content_id) VALUES
('indigenas-formacao-territorio', 'Indígenas e Formação do Território', 'historia-brasil'),
('chegada-portugueses', 'Chegada dos Portugueses e Colonização', 'historia-brasil'),
('economia-acucareira', 'Economia Açucareira', 'historia-brasil'),
('mineracao-seculo-xviii', 'Mineração no Século XVIII', 'historia-brasil'),
('administracao-colonial', 'Administração Colonial Portuguesa', 'historia-brasil'),
('movimentos-nativistas', 'Movimentos Nativistas', 'historia-brasil'),
('movimentos-emancipacionistas', 'Movimentos Emancipacionistas', 'historia-brasil'),
('independencia-brasil', 'Independência do Brasil', 'historia-brasil'),
('primeiro-reinado', 'Primeiro Reinado', 'historia-brasil'),
('periodo-regencial', 'Período Regencial', 'historia-brasil'),
('segundo-reinado', 'Segundo Reinado', 'historia-brasil'),
('escravidao-abolicionismo', 'Escravidão e Abolicionismo', 'historia-brasil'),
('proclamacao-republica', 'Proclamação da República', 'historia-brasil'),
('republica-velha', 'República Velha', 'historia-brasil'),
('era-vargas', 'Era Vargas', 'historia-brasil'),
('periodo-democratico-46-64', 'Período Democrático (1946–1964)', 'historia-brasil'),
('ditadura-militar', 'Ditadura Militar (1964–1985)', 'historia-brasil'),
('nova-republica', 'Nova República', 'historia-brasil'),
('constituicao-1988', 'Constituição de 1988', 'historia-brasil'),
('brasil-contemporaneo', 'Brasil Contemporâneo', 'historia-brasil')
ON CONFLICT (id) DO NOTHING;

-- Inserir tópicos de Álgebra e Funções
INSERT INTO topics (id, name, content_id) VALUES
('funcao-afim', 'Função Afim (1º grau)', 'algebra-funcoes'),
('funcao-quadratica', 'Função Quadrática (2º grau)', 'algebra-funcoes'),
('funcoes-exponenciais', 'Funções Exponenciais', 'algebra-funcoes'),
('funcoes-logaritmicas', 'Funções Logarítmicas', 'algebra-funcoes'),
('funcao-modular', 'Função Modular', 'algebra-funcoes'),
('funcoes-trigonometricas-basicas', 'Funções Trigonométricas (noções básicas)', 'algebra-funcoes'),
('funcoes-compostas', 'Funções Compostas', 'algebra-funcoes'),
('funcoes-inversas', 'Funções Inversas', 'algebra-funcoes'),
('sistemas-equacoes', 'Sistemas de Equações', 'algebra-funcoes'),
('inequacoes-algebraicas', 'Inequações Algébricas', 'algebra-funcoes')
ON CONFLICT (id) DO NOTHING;

-- Inserir tópicos de Conjuntos e Lógica
INSERT INTO topics (id, name, content_id) VALUES
('operacoes-conjuntos', 'Operações com Conjuntos', 'conjuntos-logica'),
('diagramas-venn', 'Diagramas de Venn', 'conjuntos-logica'),
('conjuntos-numericos', 'Conjuntos Numéricos', 'conjuntos-logica'),
('proposicoes-conectivos', 'Proposições e Conectivos Lógicos', 'conjuntos-logica'),
('tabelas-verdade', 'Tabelas-Verdade', 'conjuntos-logica'),
('equivalencias-logicas', 'Equivalências Lógicas', 'conjuntos-logica'),
('argumentos-validade', 'Argumentos e Validade', 'conjuntos-logica'),
('quantificadores', 'Quantificadores (todo, existe)', 'conjuntos-logica'),
('problemas-contagem-simples', 'Problemas de Contagem Simples', 'conjuntos-logica'),
('principio-aditivo-multiplicativo', 'Princípio Aditivo e Multiplicativo', 'conjuntos-logica')
ON CONFLICT (id) DO NOTHING;

-- Inserir tópicos de Números e Operações
INSERT INTO topics (id, name, content_id) VALUES
('numeros-naturais', 'Números Naturais', 'numeros-operacoes'),
('numeros-inteiros', 'Números Inteiros', 'numeros-operacoes'),
('numeros-racionais', 'Números Racionais', 'numeros-operacoes'),
('numeros-irracionais', 'Números Irracionais', 'numeros-operacoes'),
('numeros-reais', 'Números Reais', 'numeros-operacoes'),
('operacoes-fundamentais', 'Operações Fundamentais', 'numeros-operacoes'),
('potenciacao-radiciacao', 'Potenciação e Radiciação', 'numeros-operacoes'),
('fracoes', 'Frações', 'numeros-operacoes'),
('porcentagem', 'Porcentagem', 'numeros-operacoes'),
('razao-proporcao', 'Razão e Proporção', 'numeros-operacoes')
ON CONFLICT (id) DO NOTHING;

-- Inserir tópicos de Gramática Português
INSERT INTO topics (id, name, content_id) VALUES
('classes-palavras', 'Classes de Palavras', 'gramatica'),
('flexao-nominal-verbal', 'Flexão Nominal e Verbal', 'gramatica'),
('concordancia-nominal', 'Concordância Nominal', 'gramatica'),
('concordancia-verbal', 'Concordância Verbal', 'gramatica'),
('regencia-nominal', 'Regência Nominal', 'gramatica'),
('regencia-verbal', 'Regência Verbal', 'gramatica'),
('colocacao-pronominal', 'Colocação Pronominal', 'gramatica'),
('pontuacao', 'Pontuação', 'gramatica'),
('formacao-palavras', 'Formação de Palavras', 'gramatica'),
('variacao-linguistica', 'Variação Linguística', 'gramatica')
ON CONFLICT (id) DO NOTHING;

-- Inserir tópicos de Literatura
INSERT INTO topics (id, name, content_id) VALUES
('trovadorismo', 'Trovadorismo', 'literatura'),
('humanismo', 'Humanismo', 'literatura'),
('classicismo', 'Classicismo', 'literatura'),
('quinhentismo', 'Quinhentismo', 'literatura'),
('barroco', 'Barroco', 'literatura'),
('arcadismo', 'Arcadismo', 'literatura'),
('romantismo', 'Romantismo', 'literatura'),
('realismo', 'Realismo', 'literatura'),
('naturalismo', 'Naturalismo', 'literatura'),
('parnasianismo', 'Parnasianismo', 'literatura'),
('simbolismo', 'Simbolismo', 'literatura'),
('pre-modernismo', 'Pré-Modernismo', 'literatura'),
('modernismo-fase1', 'Modernismo – 1ª fase', 'literatura'),
('modernismo-fase2', 'Modernismo – 2ª fase', 'literatura'),
('modernismo-fase3', 'Modernismo – 3ª fase', 'literatura'),
('literatura-contemporanea', 'Literatura Contemporânea', 'literatura'),
('intertextualidade', 'Intertextualidade', 'literatura')
ON CONFLICT (id) DO NOTHING;

-- Inserir tópicos de Química Geral
INSERT INTO topics (id, name, content_id) VALUES
('propriedades-materia', 'Propriedades da Matéria', 'quimica-geral'),
('estrutura-atomica', 'Estrutura Atômica', 'quimica-geral'),
('tabela-periodica', 'Tabela Periódica', 'quimica-geral'),
('ligacoes-quimicas', 'Ligações Químicas', 'quimica-geral'),
('funcoes-inorganicas', 'Funções Inorgânicas', 'quimica-geral'),
('reacoes-quimicas', 'Reações Químicas', 'quimica-geral'),
('estequiometria', 'Estequiometria', 'quimica-geral'),
('solucoes', 'Soluções', 'quimica-geral'),
('acidos-bases', 'Ácidos e Bases', 'quimica-geral'),
('termoquimica', 'Termoquímica', 'quimica-geral')
ON CONFLICT (id) DO NOTHING;

-- Inserir tópicos de Tipos Textuais
INSERT INTO topics (id, name, content_id) VALUES
('narracao', 'Narração', 'tipos-textuais'),
('descricao', 'Descrição', 'tipos-textuais'),
('dissertacao-argumentativa', 'Dissertação Argumentativa', 'tipos-textuais'),
('exposicao-explicativa', 'Exposição Explicativa', 'tipos-textuais'),
('relato', 'Relato', 'tipos-textuais'),
('carta-argumentativa', 'Carta / Carta Argumentativa', 'tipos-textuais'),
('artigo-opiniao', 'Artigo de Opinião', 'tipos-textuais'),
('resenha', 'Resenha', 'tipos-textuais'),
('sequencia-injuntiva', 'Seqüência Injuntiva (instruções, comandos)', 'tipos-textuais'),
('relatorio-texto-tecnico', 'Relatório / Texto Técnico', 'tipos-textuais')
ON CONFLICT (id) DO NOTHING;

-- Inserir tópicos de Cultura e Sociedade
INSERT INTO topics (id, name, content_id) VALUES
('cultura-identidade', 'Cultura e Identidade', 'cultura-sociedade'),
('etnocentrismo-relativismo', 'Etnocentrismo e Relativismo', 'cultura-sociedade'),
('diversidade-cultural', 'Diversidade Cultural', 'cultura-sociedade'),
('industria-cultural', 'Indústria Cultural', 'cultura-sociedade'),
('cultura-massa', 'Cultura de Massa', 'cultura-sociedade'),
('globalizacao-cultural', 'Globalização Cultural', 'cultura-sociedade'),
('choque-cultural', 'Choque Cultural', 'cultura-sociedade'),
('movimentos-culturais', 'Movimentos Culturais', 'cultura-sociedade'),
('patrimonio-cultural', 'Patrimônio Cultural', 'cultura-sociedade'),
('cultura-digital', 'Cultura Digital', 'cultura-sociedade')
ON CONFLICT (id) DO NOTHING;
