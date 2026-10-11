# 📚 REFERÊNCIA COMPLETA - IDs para Importação de Questões

> Gerado a partir da taxonomia em produção (endpoint `public-taxonomy`) em 2026-10-11.
> A fonte da verdade é o banco: se este arquivo divergir, vale o endpoint.

## ⚠️ REGRAS IMPORTANTES
1. Copie os IDs **exatamente** como estão abaixo (kebab-case, com hífen `-`)
2. O `content_id` precisa pertencer ao `subject_id`, e o `topic_id` ao `content_id`
3. Toda questão deve ter um `topic_id`
4. **correct_answer**: Use sempre **minúscula** (`"a"`, `"b"`, `"c"`, `"d"`, `"e"`)
5. **exam_id**: Use um ID da lista de vestibulares cadastrados no sistema (ex.: `enem`, `paes-uema`)

---

## FILOSOFIA (subject_id: "fl") — área: Ciências Humanas

### **content_id: fl-epistemologia** - Conhecimento e ciência
- `fl-ep-ceticismo` - Ceticismo
- `fl-fc-metodo-cientifico` - Método científico
- `fl-ep-racionalismo-empirismo` - Racionalismo e empirismo
- `fl-ep-verdade` - Verdade

### **content_id: fl-etica** - Ética
- `fl-et-dever` - Dever
- `fl-et-bioetica` - Ética aplicada (bioética, ambiental e digital)
- `fl-et-conceitos` - Ética e moral: conceitos
- `fl-et-utilitarismo` - Utilitarismo
- `fl-et-virtude` - Virtude

### **content_id: fl-antiga** - Filosofia antiga
- `fl-an-aristoteles` - Aristóteles
- `fl-he-epicurismo` - Epicurismo
- `fl-he-estoicismo` - Estoicismo
- `fl-an-platao` - Platão
- `fl-an-pre-socraticos` - Pré-socráticos
- `fl-an-socrates` - Sócrates
- `fl-an-sofistas` - Sofistas

### **content_id: fl-contemporanea** - Filosofia contemporânea
- `fl-co-escola-frankfurt` - Escola de Frankfurt
- `fl-co-existencialismo` - Existencialismo
- `fl-co-foucault` - Foucault
- `fl-co-arendt` - Hannah Arendt
- `fl-co-marx` - Marx
- `fl-co-nietzsche` - Nietzsche
- `fl-co-outros` - Outros pensadores contemporâneos

### **content_id: fl-medieval** - Filosofia medieval
- `fl-me-agostinho` - Agostinho
- `fl-me-pensamento` - Pensamento e cultura medieval
- `fl-me-tomas-aquino` - Tomás de Aquino

### **content_id: fl-moderna** - Filosofia moderna
- `fl-mo-descartes` - Descartes
- `fl-mo-hume` - Hume
- `fl-mo-kant` - Kant
- `fl-mo-locke` - Locke

### **content_id: fl-politica** - Filosofia política
- `fl-po-contratualismo` - Contratualismo
- `fl-po-hobbes` - Hobbes
- `fl-po-maquiavel` - Maquiavel
- `fl-po-poder` - Poder e democracia
- `fl-po-rousseau` - Rousseau

### **content_id: fl-introducao** - Introdução à filosofia
- `fl-in-atitude-filosofica` - Atitude filosófica e o filosofar
- `fl-in-logos` - Logos
- `fl-in-mito` - Mito

### **content_id: fl-logica** - Lógica
- `fl-lo-falacias` - Falácias
- `fl-lo-validade` - Validade

---

## GEOGRAFIA (subject_id: "ge") — área: Ciências Humanas

### **content_id: ge-agropecuaria** - Agropecuária
- `ge-ag-agricultura-familiar` - Agricultura familiar
- `ge-ag-agronegocio` - Agronegócio
- `ge-ag-estrutura-fundiaria` - Estrutura fundiária e conflitos no campo
- `ge-ag-modernizacao` - Modernização agrícola

### **content_id: ge-biomas** - Biomas
- `ge-bi-amazonia` - Amazônia
- `ge-bi-caatinga` - Caatinga
- `ge-bi-cerrado` - Cerrado
- `ge-bi-dominios-morfoclimaticos` - Domínios morfoclimáticos
- `ge-bi-mata-atlantica` - Mata Atlântica
- `ge-bi-pampa` - Pampa
- `ge-bi-pantanal` - Pantanal

### **content_id: ge-cartografia** - Cartografia
- `ge-ca-coordenadas-geograficas` - Coordenadas geográficas
- `ge-ca-escalas` - Escalas
- `ge-ca-fusos-horarios` - Fusos horários
- `ge-ca-leitura-mapas` - Linguagem cartográfica e orientação
- `ge-ca-mapas-tematicos` - Mapas temáticos
- `ge-ca-projecoes-cartograficas` - Projeções cartográficas

### **content_id: ge-climatologia** - Climatologia
- `ge-cl-el-nino` - El Niño
- `ge-cl-elementos-clima` - Elementos do clima
- `ge-cl-fenomenos` - Fenômenos climáticos
- `ge-cl-la-nina` - La Niña
- `ge-cl-massas-ar` - Massas de ar
- `ge-cl-tipos-clima` - Tipos de clima

### **content_id: ge-energia** - Energia
- `ge-en-fontes-renovaveis` - Fontes renováveis
- `ge-en-matriz-energetica` - Matriz energética
- `ge-en-petroleo` - Petróleo e combustíveis fósseis

### **content_id: ge-geografia-do-maranhao** - Geografia do Maranhão
- `ge-mr-biomas` - Biomas, vegetação e litoral maranhense
- `ge-mr-clima` - Clima do Maranhão
- `ge-mr-economia-sociedade` - Economia, população e cultura maranhense
- `ge-mr-relevo-hidrografia` - Relevo e hidrografia do Maranhão

### **content_id: ge-geografia-fisica** - Geologia, relevo e solos
- `ge-so-erosao` - Erosão
- `ge-gf-relevo` - Relevo
- `ge-gf-rochas-minerais` - Rochas e minerais
- `ge-gf-solos` - Solos e pedogênese
- `ge-gf-tectonica-placas` - Tectônica de placas

### **content_id: ge-geopolitica** - Geopolítica
- `ge-gp-blocos-economicos` - Blocos econômicos
- `ge-gp-conflitos` - Conflitos e tensões internacionais
- `ge-gp-economia-mundial` - Economia mundial
- `ge-gp-globalizacao` - Globalização
- `ge-gp-ordem-mundial` - Ordem mundial
- `ge-gp-oriente-medio` - Oriente Médio

### **content_id: ge-hidrografia** - Hidrografia
- `ge-hi-aquiferos` - Aquíferos
- `ge-hi-bacias-hidrograficas` - Bacias hidrográficas
- `ge-hi-correntes-maritimas` - Correntes marítimas

### **content_id: ge-industria** - Indústria e transportes
- `ge-in-desconcentracao-industrial` - Desconcentração industrial
- `ge-in-localizacao-industrial` - Localização industrial
- `ge-tr-logistica` - Logística
- `ge-in-revolucoes-industriais` - Revoluções industriais e modelos produtivos

### **content_id: ge-meio-ambiente** - Meio ambiente
- `ge-ma-politica-ambiental` - Conferências e política ambiental
- `ge-ma-desmatamento` - Desmatamento
- `ge-ma-mudancas-climaticas` - Mudanças climáticas
- `ge-ma-poluicao` - Poluição
- `ge-ma-queimadas` - Queimadas
- `ge-ma-recursos-hidricos` - Recursos hídricos e crise da água

### **content_id: ge-populacao** - População
- `ge-po-distribuicao` - Crescimento e distribuição da população
- `ge-po-diversidade` - Diversidade étnica e cultural
- `ge-po-estrutura-etaria` - Estrutura etária e pirâmides
- `ge-po-indicadores` - Indicadores sociais (IDH e desigualdade)
- `ge-po-migracoes` - Migrações
- `ge-po-trabalho` - Trabalho e mercado de trabalho
- `ge-po-transicao-demografica` - Transição demográfica

### **content_id: ge-brasil-regional** - Regionalização do Brasil
- `ge-rb-formacao-territorial` - Formação territorial
- `ge-rb-regioes` - Regiões e complexos regionais

### **content_id: ge-urbanizacao** - Urbanização e problemas urbanos
- `ge-ur-metropolizacao` - Metropolização
- `ge-ur-mobilidade` - Mobilidade urbana
- `ge-ur-processo` - Processo de urbanização
- `ge-ur-rede-urbana` - Rede urbana
- `ge-pu-saneamento` - Saneamento
- `ge-pu-segregacao-socioespacial` - Segregação socioespacial

---

## HISTÓRIA (subject_id: "hi") — área: Ciências Humanas

### **content_id: hi-america** - América
- `hi-am-colonizacao-espanhola` - Colonização espanhola
- `hi-am-eua` - Estados Unidos: independência e expansão
- `hi-am-independencias` - Independências na América
- `hi-am-pre-colombianos` - Povos pré-colombianos

### **content_id: hi-antiguidade** - Antiguidade
- `hi-an-africa-antiga` - África Antiga
- `hi-an-egito` - Egito
- `hi-an-grecia` - Grécia
- `hi-an-mesopotamia` - Mesopotâmia
- `hi-an-roma` - Roma

### **content_id: hi-brasil-colonia** - Brasil Colônia
- `hi-bc-acucar` - Açúcar
- `hi-bc-administracao` - Administração colonial
- `hi-bc-escravidao` - Escravidão
- `hi-bc-territorio` - Expansão territorial e tratados de limites
- `hi-bc-mineracao` - Mineração
- `hi-bc-pacto-colonial` - Pacto colonial
- `hi-bc-revoltas-coloniais` - Revoltas coloniais
- `hi-bc-sociedade-cultura` - Sociedade e cultura colonial
- `hi-bc-sociedades-indigenas` - Sociedades indígenas
- `hi-bc-invasoes` - União Ibérica e invasões estrangeiras

### **content_id: hi-brasil-imperio** - Brasil Império
- `hi-bi-abolicao` - Escravidão e abolição
- `hi-bi-guerra-paraguai` - Guerra do Paraguai
- `hi-bi-independencia` - Independência
- `hi-bi-periodo-joanino` - Período joanino
- `hi-bi-periodo-regencial` - Período regencial
- `hi-bi-primeiro-reinado` - Primeiro Reinado
- `hi-bi-segundo-reinado` - Segundo reinado

### **content_id: hi-brasil-republica** - Brasil República
- `hi-br-ditadura-militar` - Ditadura militar
- `hi-br-era-vargas` - Era Vargas
- `hi-br-nova-republica` - Nova República
- `hi-br-proclamacao` - Proclamação da República
- `hi-br-redemocratizacao` - Redemocratização
- `hi-br-republica-populista` - República populista
- `hi-br-republica-velha` - República Velha
- `hi-br-revoltas-primeira-republica` - Revoltas da Primeira República

### **content_id: hi-fundamentos** - Fundamentos
- `hi-fu-fontes-historicas` - Fontes históricas
- `hi-fu-cultura-afro-indigena` - História e cultura afro-brasileira e indígena
- `hi-fu-historiografia` - Historiografia
- `hi-fu-memoria-patrimonio` - Memória e patrimônio
- `hi-fu-pre-historia` - Pré-história
- `hi-fu-tempo-historico` - Tempo histórico

### **content_id: hi-historia-do-maranhao** - História do Maranhão
- `hi-ma-independencia` - Adesão do Maranhão à Independência
- `hi-ma-balaiada` - Balaiada
- `hi-ma-estado-grao-para` - Colonização portuguesa e Estado do Maranhão e Grão-Pará
- `hi-ma-economia-colonial` - Economia colonial maranhense
- `hi-ma-franca-equinocial` - França Equinocial e fundação de São Luís
- `hi-ma-invasao-holandesa` - Invasão holandesa (1641–1644)
- `hi-ma-jesuitas` - Jesuítas, trabalho indígena e Revolta de Beckman
- `hi-ma-republica` - Maranhão republicano e oligarquias
- `hi-ma-personalidades` - Personalidades e cultura maranhense
- `hi-ma-ocupacao-inicial` - Primeiras tentativas de colonização (1500–1612)
- `hi-ma-reformas-pombalinas` - Reformas pombalinas e Companhia de Comércio

### **content_id: hi-idade-media** - Idade Média
- `hi-im-crise-seculo-xiv` - Crise do século XIV
- `hi-im-cruzadas` - Cruzadas
- `hi-im-feudalismo` - Feudalismo
- `hi-im-igreja` - Igreja e cultura medieval
- `hi-im-islamismo-bizancio` - Mundo islâmico e Império Bizantino

### **content_id: hi-idade-moderna** - Idade Moderna
- `hi-mo-absolutismo` - Absolutismo
- `hi-mo-expansao-maritima` - Expansão marítima
- `hi-mo-mercantilismo` - Mercantilismo
- `hi-mo-reforma-protestante` - Reforma protestante
- `hi-mo-renascimento` - Renascimento

### **content_id: hi-mundo-contemporaneo** - Mundo contemporâneo
- `hi-mc-conflitos` - Conflitos contemporâneos
- `hi-mc-direitos` - Direitos humanos e movimentos sociais
- `hi-mc-globalizacao` - Globalização
- `hi-mc-nova-ordem` - Nova ordem mundial

### **content_id: hi-revolucoes** - Revoluções
- `hi-rv-iluminismo` - Iluminismo
- `hi-rv-revolucao-francesa` - Revolução francesa
- `hi-rv-revolucao-industrial` - Revolução industrial

### **content_id: hi-seculo-xix** - Século XIX
- `hi-sx-imperialismo` - Imperialismo
- `hi-sx-ideologias` - Liberalismo, socialismo e movimento operário
- `hi-sx-nacionalismos` - Nacionalismos e unificações
- `hi-sx-partilha-africa` - Partilha da África

### **content_id: hi-seculo-xx** - Século XX
- `hi-sxx-anos-60` - Contracultura e movimentos de 1968
- `hi-sxx-crise-1929` - Crise de 1929
- `hi-sxx-cultura` - Cultura, arte e ciência no século XX
- `hi-sxx-descolonizacao` - Descolonização
- `hi-sxx-america-latina` - Ditaduras e movimentos na América Latina
- `hi-sxx-guerra-fria` - Guerra fria
- `hi-sxx-primeira-guerra` - Primeira guerra mundial
- `hi-sxx-revolucao-russa` - Revolução russa
- `hi-sxx-segunda-guerra` - Segunda guerra mundial
- `hi-sxx-totalitarismos` - Totalitarismos

---

## SOCIOLOGIA (subject_id: "so") — área: Ciências Humanas

### **content_id: so-classicos** - Clássicos
- `so-cl-durkheim` - Durkheim
- `so-cl-marx` - Marx
- `so-cl-merton` - Merton
- `so-cl-weber` - Weber

### **content_id: so-cultura** - Cultura, mídia e indústria cultural
- `so-cu-corpo` - Corpo, padrões e controle social
- `so-cu-esportivizacao` - Esportivização
- `so-cu-etnocentrismo` - Etnocentrismo
- `so-mi-industria-cultural` - Indústria cultural
- `so-cu-patrimonio` - Patrimônio cultural e memória
- `so-cu-relativismo-cultural` - Relativismo cultural

### **content_id: so-desigualdades** - Desigualdades e estratificação
- `so-es-classes-sociais` - Classes sociais
- `so-de-desigualdade-renda` - Desigualdade de renda
- `so-de-genero` - Gênero
- `so-es-mobilidade-social` - Mobilidade social
- `so-de-racismo-estrutural` - Racismo estrutural

### **content_id: so-globalizacao** - Globalização
- `so-gl-redes-fluxos` - Redes e fluxos

### **content_id: so-identidade** - Identidade
- `so-id-identidade-social` - Identidade social

### **content_id: so-introducao** - Introdução
- `so-in-instituicoes-sociais` - Instituições sociais
- `so-in-socializacao` - Socialização

### **content_id: so-movimentos-sociais** - Movimentos sociais
- `so-ms-acao-coletiva` - Ação coletiva
- `so-ms-campo-cidade` - Movimentos do campo e urbanos
- `so-ms-identitarios` - Movimentos negro, feminista e LGBTQIA+

### **content_id: so-politica** - Política e cidadania
- `so-po-democracia` - Democracia
- `so-ci-direitos-humanos` - Direitos humanos
- `so-po-estado` - Estado
- `so-po-participacao` - Participação política
- `so-po-poder` - Poder e dominação
- `so-po-violencia` - Violência e controle social

### **content_id: so-trabalho** - Trabalho e capitalismo
- `so-tr-alienacao` - Alienação
- `so-ca-consumo` - Consumo
- `so-tr-divisao-social-trabalho` - Divisão social do trabalho
- `so-tr-fordismo-toyotismo` - Fordismo e toyotismo
- `so-tr-precarizacao` - Precarização e novas formas de trabalho

---

## ESPANHOL (subject_id: "es") — área: Linguagens

### **content_id: es-compreensao-textual** - Compreensão textual
- `es-ct-detalhes-especificos` - Detalhes específicos
- `es-ct-ideia-principal` - Ideia principal
- `es-ct-inferencia` - Inferência
- `es-ct-poemas-cancoes` - Poemas e letras de canção

### **content_id: es-cultura** - Cultura e variação linguística
- `es-cu-cultura-hispanica` - Cultura hispânica
- `es-cu-variacao` - Variação linguística do espanhol

### **content_id: es-gramatica-aplicada** - Gramática aplicada
- `es-ga-conectores` - Conectores e conjunções
- `es-ga-classes` - Outras classes de palavras
- `es-ga-pronomes-artigos` - Pronomes e artigos
- `es-ga-verbos` - Verbos e tempos verbais

### **content_id: es-intencao-comunicativa** - Intenção comunicativa
- `es-ic-generos` - Gêneros textuais e finalidade
- `es-ic-humor-ironia` - Humor e ironia

### **content_id: es-vocabulario-contexto** - Vocabulário em contexto
- `es-vc-expressoes` - Expressões idiomáticas
- `es-vc-falsos-cognatos` - Falsos cognatos
- `es-vc-vocabulario` - Vocabulário em contexto

---

## GRAMÁTICA (subject_id: "gr") — área: Linguagens

### **content_id: gr-acentuacao** - Acentuação
- `gr-ac-hiatos` - Hiatos
- `gr-ac-oxitonas` - Oxítonas
- `gr-ac-paroxitonas` - Paroxítonas
- `gr-ac-proparoxitonas` - Proparoxítonas
- `gr-ac-regras-gerais` - Regras gerais de acentuação

### **content_id: gr-colocacao-pronominal** - Colocação pronominal
- `gr-cp-enclise` - Ênclise
- `gr-cp-mesoclise` - Mesóclise
- `gr-cp-proclise` - Próclise

### **content_id: gr-concordancia-verbal** - Concordância
- `gr-cn-casos-especiais` - Concordância nominal: casos especiais
- `gr-cn-regra-geral` - Concordância nominal: regra geral
- `gr-cv-casos-especiais` - Concordância verbal: casos especiais
- `gr-cv-regra-geral` - Concordância verbal: regra geral

### **content_id: gr-crase** - Crase
- `gr-cr-casos-facultativos` - Casos facultativos
- `gr-cr-casos-obrigatorios` - Casos obrigatórios
- `gr-cr-casos-proibidos` - Casos proibidos

### **content_id: gr-formacao-palavras** - Formação de palavras
- `gr-fp-composicao` - Composição
- `gr-fp-derivacao` - Derivação
- `gr-fp-neologismo` - Neologismo
- `gr-fp-parassintese` - Parassíntese
- `gr-fp-sigla` - Sigla

### **content_id: gr-morfologia** - Morfologia
- `gr-mo-adjetivo` - Adjetivo
- `gr-mo-adverbio` - Advérbio
- `gr-mo-artigo` - Artigo
- `gr-mo-conjuncao` - Conjunção
- `gr-mo-interjeicao` - Interjeição
- `gr-mo-numeral` - Numeral
- `gr-mo-preposicao` - Preposição
- `gr-mo-pronome` - Pronome
- `gr-mo-substantivo` - Substantivo
- `gr-mo-verbo` - Verbo

### **content_id: gr-ortografia** - Ortografia
- `gr-hi-regras-principais` - Hífen
- `gr-or-homonimos` - Homônimos
- `gr-or-paronimos` - Parônimos
- `gr-or-uso-letras` - Uso de letras

### **content_id: gr-periodo-composto** - Período composto
- `gr-pc-coordenacao` - Coordenação
- `gr-pc-subordinacao-adjetiva` - Subordinação adjetiva
- `gr-pc-subordinacao-adverbial` - Subordinação adverbial
- `gr-pc-subordinacao-substantiva` - Subordinação substantiva

### **content_id: gr-pontuacao** - Pontuação
- `gr-po-dois-pontos` - Outros sinais de pontuação
- `gr-po-virgula` - Vírgula

### **content_id: gr-regencia-verbal** - Regência
- `gr-rn-termos-regidos` - Regência nominal
- `gr-rv-verbos-transitivos` - Regência verbal

### **content_id: gr-semantica-gramatical** - Semântica gramatical
- `gr-sg-por-que` - Uso dos porquês
- `gr-sg-conjuncoes-causais` - Valor semântico das conjunções
- `gr-sg-valores-como` - Valores do "como"
- `gr-sg-valores-que` - Valores do "que"
- `gr-sg-valores-se` - Valores do "se"

### **content_id: gr-sintaxe** - Sintaxe
- `gr-si-objeto-direto` - Complementos verbais e nominais
- `gr-si-predicado-nominal` - Predicado (tipos)
- `gr-si-sujeito-simples` - Sujeito (tipos)
- `gr-si-adjunto-adnominal` - Termos acessórios (adjuntos, aposto e vocativo)
- `gr-si-agente-passiva` - Vozes verbais e agente da passiva

---

## INGLÊS (subject_id: "in") — área: Linguagens

### **content_id: in-coesao-textual** - Coesão textual
- `in-ct-conectores` - Conectores
- `in-ct-pronomes-referenciais` - Pronomes referenciais

### **content_id: in-compreensao-textual** - Compreensão textual
- `in-ct-detalhes-especificos` - Detalhes específicos
- `in-ct-ideia-principal` - Ideia principal
- `in-ct-inferencia` - Inferência
- `in-ct-poemas-cancoes` - Poemas e letras de canção

### **content_id: in-estrategias-leitura** - Estratégias de leitura
- `in-el-scanning` - Scanning
- `in-el-skimming` - Skimming

### **content_id: in-gramatica-aplicada** - Gramática aplicada
- `in-ga-graduacao-intensidade` - Graduação e intensidade
- `in-ga-modalizacao` - Modalização
- `in-ga-tempos-verbais` - Tempos verbais

### **content_id: in-intencao-comunicativa** - Intenção comunicativa
- `in-ic-humor` - Humor
- `in-ic-ironia` - Ironia
- `in-ic-objetivo` - Objetivo e finalidade do texto

### **content_id: in-vocabulario-contexto** - Vocabulário em contexto
- `in-vc-cognatos` - Cognatos
- `in-vc-falsos-cognatos` - Falsos cognatos
- `in-vc-expressoes` - Vocabulário e expressões em contexto

---

## INTERPRETAÇÃO TEXTUAL (subject_id: "it") — área: Linguagens

### **content_id: it-artes-corpo** - Artes, práticas corporais e tecnologias
- `it-ac-artes` - Artes e manifestações culturais
- `it-ac-praticas-corporais` - Práticas corporais e educação física
- `it-ac-tecnologias` - Tecnologias da informação e comunicação

### **content_id: it-coesao-coerencia** - Coesão e coerência
- `it-cc-conectivos` - Conectivos
- `it-cc-elipse` - Elipse
- `it-cc-justaposicao` - Justaposição
- `it-cc-modalizacao` - Modalização
- `it-cc-progressao-tematica` - Progressão temática
- `it-cc-referenciacao-pronominal` - Referenciação pronominal
- `it-cc-causa` - Relações lógicas entre ideias (causa, consequência, condição, concessão)
- `it-cc-substituicao-lexical` - Substituição lexical

### **content_id: it-compreensao-global** - Compreensão global
- `it-cg-comparacao-textos` - Comparação entre textos
- `it-cg-estrategias-argumentativas` - Estratégias argumentativas
- `it-cg-fato` - Fato
- `it-cg-funcoes-linguagem` - Funções da linguagem
- `it-cg-ideia-central` - Ideia central
- `it-cg-objetivo-texto` - Objetivo do texto
- `it-cg-opiniao` - Opinião
- `it-cg-ponto-vista-autor` - Ponto de vista do autor
- `it-cg-tema` - Tema
- `it-cg-tese` - Tese

### **content_id: it-generos-tipologias** - Gêneros e tipologias
- `it-gt-anuncio` - Anúncio
- `it-gt-artigo-opiniao` - Artigo de opinião
- `it-gt-carta` - Carta (do leitor, aberta e pessoal)
- `it-gt-cronica` - Crônica
- `it-gt-descricao` - Descrição
- `it-gt-dissertacao` - Dissertação
- `it-gt-editorial` - Editorial
- `it-gt-exposicao` - Exposição
- `it-gt-hibridismo` - Hibridismo e subversão de gêneros
- `it-gt-injuncao` - Injunção
- `it-gt-narracao` - Narração
- `it-gt-noticia` - Notícia
- `it-gt-propaganda` - Propaganda
- `it-gt-reportagem` - Reportagem
- `it-gt-resenha` - Resenha
- `it-gt-divulgacao-cientifica` - Texto de divulgação científica
- `it-gt-verbete` - Verbete

### **content_id: it-inferencia-implicitos** - Inferência e implícitos
- `it-ii-ambiguidade` - Ambiguidade
- `it-ii-duplo-sentido` - Duplo sentido
- `it-ii-humor` - Humor
- `it-ii-inferencia` - Inferência
- `it-ii-ironia` - Ironia
- `it-ii-pressuposto` - Pressuposto
- `it-ii-subentendido` - Subentendido

### **content_id: it-intertextualidade** - Intertextualidade
- `it-in-alusao` - Alusão
- `it-in-citacao` - Citação
- `it-in-parafrase` - Paráfrase
- `it-in-parodia` - Paródia

### **content_id: it-semantica-efeitos** - Semântica e efeitos de sentido
- `it-se-antitese` - Antítese
- `it-se-campo-semantico` - Campo semântico
- `it-se-conotacao` - Conotação
- `it-se-denotacao` - Denotação
- `it-se-eufemismo` - Eufemismo
- `it-se-hiperbole` - Hipérbole
- `it-se-metafora` - Metáfora
- `it-se-metonimia` - Metonímia
- `it-se-paradoxo` - Paradoxo
- `it-se-polissemia` - Polissemia

### **content_id: it-texto-multimodal** - Texto multimodal
- `it-tm-cartaz` - Cartaz e campanha (verbal e não verbal)
- `it-tm-charge` - Charge
- `it-tm-grafico` - Gráfico
- `it-tm-infografico` - Infográfico
- `it-tm-mapa` - Mapa
- `it-tm-meme` - Meme
- `it-tm-tabela` - Tabela
- `it-tm-tira` - Tira

### **content_id: it-variacao-linguistica** - Variação linguística
- `it-vl-adequacao-linguistica` - Adequação linguística
- `it-vl-linguagem-formal` - Linguagem formal
- `it-vl-linguagem-informal` - Linguagem informal
- `it-vl-marcas-oralidade` - Marcas de oralidade
- `it-vl-norma-padrao` - Norma-padrão
- `it-vl-preconceito-linguistico` - Preconceito linguístico
- `it-vl-tipos-variacao` - Tipos de variação (regional, social e histórica)

---

## LITERATURA (subject_id: "li") — área: Linguagens

### **content_id: li-arcadismo** - Arcadismo
- `li-ar-autores` - Arcadismo: autores e obras
- `li-ar-bucolismo` - Arcadismo: contexto e características

### **content_id: li-barroco** - Barroco
- `li-ba-autores` - Barroco: autores e obras
- `li-ba-conceptismo` - Barroco: contexto e características

### **content_id: li-classicismo** - Classicismo
- `li-cl-camoes` - Classicismo: Camões e outros autores
- `li-cl-humanismo-renascentista` - Classicismo: contexto e características

### **content_id: li-humanismo** - Humanismo
- `li-hu-cronica-historica` - Humanismo: contexto e características
- `li-hu-autores` - Humanismo: Gil Vicente e outros autores

### **content_id: li-contemporanea** - Literatura contemporânea
- `li-ct-poesia` - Poesia contemporânea
- `li-ct-prosa` - Prosa contemporânea

### **content_id: li-modernismo** - Modernismo
- `li-mo-portugues` - Modernismo em Portugal (Fernando Pessoa)
- `li-mo-primeira-geracao` - Primeira geração modernista
- `li-mo-segunda-geracao` - Segunda geração modernista
- `li-mo-terceira-geracao` - Terceira geração modernista

### **content_id: li-naturalismo** - Naturalismo
- `li-na-autores` - Naturalismo: autores e obras
- `li-na-determinismo` - Naturalismo: contexto e características

### **content_id: li-parnasianismo** - Parnasianismo
- `li-pa-autores` - Parnasianismo: autores e obras
- `li-pa-culto-forma` - Parnasianismo: contexto e características

### **content_id: li-pre-modernismo** - Pré-Modernismo
- `li-pm-autores` - Pré-Modernismo: autores e obras
- `li-pm-regionalismo` - Pré-Modernismo: contexto e características

### **content_id: li-quinhentismo** - Quinhentismo
- `li-qu-literatura-informacao` - Literatura de informação e jesuítica

### **content_id: li-realismo** - Realismo
- `li-re-critica-social` - Realismo: contexto e características
- `li-re-autores` - Realismo: Machado de Assis e outros autores

### **content_id: li-romantismo** - Romantismo
- `li-ro-condoreirismo` - Condoreirismo
- `li-ro-indianismo` - Indianismo
- `li-ro-nacionalismo` - Nacionalismo
- `li-ro-prosa` - Prosa romântica
- `li-ro-ultrarromantismo` - Ultrarromantismo

### **content_id: li-simbolismo** - Simbolismo
- `li-si-autores` - Simbolismo: autores e obras
- `li-si-musicalidade` - Simbolismo: contexto e características

### **content_id: li-teoria-literaria** - Teoria literária
- `li-tl-cronica` - Crônica
- `li-tl-enredo` - Enredo
- `li-tl-espaco` - Espaço
- `li-tl-eu-lirico` - Eu lírico
- `li-tl-figuras-linguagem` - Figuras de linguagem na literatura
- `li-tl-foco-narrativo` - Foco narrativo
- `li-tl-genero-dramatico` - Gênero dramático
- `li-tl-genero-lirico` - Gênero lírico
- `li-tl-genero-narrativo` - Gênero narrativo
- `li-tl-intertextualidade-literaria` - Intertextualidade literária
- `li-tl-narrador` - Narrador
- `li-tl-personagem` - Personagem
- `li-tl-tempo` - Tempo

### **content_id: li-trovadorismo** - Trovadorismo
- `li-tr-cantigas-amigo` - Cantigas de amigo
- `li-tr-cantigas-amor` - Cantigas de amor
- `li-tr-cantigas-satiricas` - Cantigas satíricas

---

## MATEMÁTICA (subject_id: "ma") — área: Matemática

### **content_id: ma-algebra** - Álgebra
- `ma-al-expressoes` - Expressões algébricas
- `ma-al-fatoracao` - Fatoração
- `ma-al-fracoes-algebricas` - Frações algébricas
- `ma-al-complexos` - Números complexos
- `ma-al-polinomios` - Polinômios
- `ma-al-produtos-notaveis` - Produtos notáveis

### **content_id: ma-aritmetica** - Aritmética
- `ma-ar-fracoes-decimais` - Frações e números decimais
- `ma-ar-mmc-mdc` - MMC, MDC e divisibilidade
- `ma-ar-operacoes` - Operações e problemas com números
- `ma-ar-potenciacao-radiciacao` - Potenciação e radiciação

### **content_id: ma-combinatoria** - Combinatória
- `ma-co-arranjo` - Arranjo
- `ma-co-combinacao` - Combinação
- `ma-co-permutacao` - Permutação
- `ma-co-principio-fundamental` - Princípio fundamental da contagem

### **content_id: ma-equacoes** - Equações, inequações e sistemas
- `ma-eq-primeiro-grau` - Equação do primeiro grau
- `ma-eq-segundo-grau` - Equação do segundo grau
- `ma-in-primeiro-grau` - Inequação do primeiro grau
- `ma-in-segundo-grau` - Inequação do segundo grau
- `ma-al-sistema-linear` - Sistema linear

### **content_id: ma-estatistica** - Estatística
- `ma-es-dispersao` - Desvio padrão e variância
- `ma-es-leitura-graficos` - Leitura de gráficos e tabelas
- `ma-es-media` - Média
- `ma-es-mediana` - Mediana
- `ma-es-moda` - Moda

### **content_id: ma-exponencial** - Exponenciais e logaritmos
- `ma-ex-equacao-exponencial` - Equação exponencial
- `ma-lo-equacao-logaritmica` - Equação logarítmica
- `ma-fn-exponencial` - Função exponencial
- `ma-fn-logaritmica` - Função logarítmica
- `ma-ex-propriedades-log` - Propriedades dos logaritmos

### **content_id: ma-funcoes** - Funções
- `ma-fn-calculo` - Cálculo (derivadas e integrais)
- `ma-fn-conceito` - Conceito, domínio e imagem
- `ma-fn-afim` - Função afim
- `ma-fn-modular` - Função modular
- `ma-fn-quadratica` - Função quadrática
- `ma-fn-grafico-interpretacao` - Gráfico e interpretação

### **content_id: ma-fundamentos** - Fundamentos
- `ma-fu-conjuntos` - Conjuntos
- `ma-fu-intervalos` - Intervalos
- `ma-fu-logica` - Lógica e raciocínio lógico
- `ma-fu-modulo` - Módulo
- `ma-fu-resolucao-problemas` - Resolução de problemas
- `ma-fu-numeracao` - Sistemas de numeração e valor posicional

### **content_id: ma-geometria-analitica** - Geometria analítica
- `ma-ga-circunferencia` - Circunferência
- `ma-ga-conicas` - Cônicas e interseção de curvas
- `ma-ga-distancia-pontos` - Distância entre pontos
- `ma-ga-equacao-reta` - Equação da reta
- `ma-ga-plano-cartesiano` - Plano cartesiano e coordenadas
- `ma-ga-ponto-medio` - Ponto médio

### **content_id: ma-geometria-espacial** - Geometria espacial
- `ma-ge-area-total` - Área total
- `ma-ge-cilindro` - Cilindro
- `ma-ge-cone` - Cone
- `ma-ge-esfera` - Esfera
- `ma-ge-piramides` - Pirâmides
- `ma-ge-poliedros` - Poliedros e relação de Euler
- `ma-ge-prismas` - Prismas
- `ma-ge-projecoes` - Sólidos: vistas, projeções e planificações
- `ma-ge-volume` - Volume

### **content_id: ma-geometria-plana** - Geometria plana
- `ma-gp-angulos` - Ângulos
- `ma-gp-area-figuras-planas` - Área de figuras planas
- `ma-gp-circunferencia` - Circunferência
- `ma-gp-perimetro` - Perímetro
- `ma-gp-poligonos` - Polígonos
- `ma-gp-semelhanca` - Semelhança
- `ma-gp-simetria` - Simetrias e transformações geométricas
- `ma-gp-teorema-pitagoras` - Teorema de Pitágoras
- `ma-gp-teorema-tales` - Teorema de Tales
- `ma-gp-triangulos` - Triângulos

### **content_id: ma-grandezas-medidas** - Grandezas e medidas
- `ma-gm-escala` - Escala
- `ma-gm-notacao-cientifica` - Notação científica e ordem de grandeza
- `ma-gm-unidades` - Unidades de medida e conversões

### **content_id: ma-financeira** - Matemática financeira
- `ma-mf-juros-compostos` - Juros compostos
- `ma-mf-juros-simples` - Juros simples

### **content_id: ma-matrizes** - Matrizes e determinantes
- `ma-mt-determinantes` - Determinantes
- `ma-mt-operacoes` - Operações com matrizes
- `ma-mt-potencia-matrizes` - Potência de matrizes

### **content_id: ma-probabilidade** - Probabilidade
- `ma-pb-probabilidade-condicional` - Probabilidade condicional
- `ma-pb-espaco-amostral` - Probabilidade simples (espaço amostral e eventos)
- `ma-pb-uniao-intersecao` - União e interseção de eventos

### **content_id: ma-proporcionalidade** - Proporcionalidade
- `ma-pr-acrescimo-sucessivo` - Acréscimo sucessivo
- `ma-pr-desconto-sucessivo` - Desconto sucessivo
- `ma-pr-porcentagem` - Porcentagem
- `ma-pr-proporcao` - Proporção
- `ma-pr-razao` - Razão
- `ma-pr-regra-tres-composta` - Regra de três composta
- `ma-pr-regra-tres-simples` - Regra de três simples

### **content_id: ma-sequencias** - Sequências e progressões
- `ma-pa-soma-termos` - PA: soma dos termos
- `ma-pa-termo-geral` - PA: termo geral
- `ma-pg-soma-termos` - PG: soma dos termos
- `ma-pg-termo-geral` - PG: termo geral
- `ma-se-termo-geral` - Sequências e padrões numéricos

### **content_id: ma-trigonometria** - Trigonometria
- `ma-tr-ciclo` - Ciclo trigonométrico
- `ma-tr-funcoes` - Funções trigonométricas
- `ma-tr-identidades` - Identidades e equações trigonométricas
- `ma-tr-lei-cossenos` - Lei dos cossenos
- `ma-tr-lei-senos` - Lei dos senos
- `ma-tr-razoes-trigonometricas` - Razões trigonométricas

---

## BIOLOGIA (subject_id: "bi") — área: Ciências da Natureza

### **content_id: bi-biologia-molecular** - Biologia molecular
- `bi-bm-dna` - DNA
- `bi-bm-expressao-genica` - Expressão gênica e epigenética
- `bi-bm-mutacoes` - Mutações
- `bi-bm-rna` - RNA
- `bi-bm-sintese-proteica` - Síntese proteica

### **content_id: bi-bioquimica** - Bioquímica
- `bi-bq-carboidratos` - Carboidratos
- `bi-bq-enzimas` - Enzimas
- `bi-bq-lipidios` - Lipídios
- `bi-bq-proteinas` - Proteínas

### **content_id: bi-biotecnologia** - Biotecnologia
- `bi-bt-clonagem` - Clonagem e células-tronco
- `bi-bt-engenharia-genetica` - Engenharia genética e DNA recombinante
- `bi-bt-dna-forense` - Teste de DNA e identificação genética
- `bi-bt-transgenicos` - Transgênicos

### **content_id: bi-botanica** - Botânica
- `bi-bo-grupos-vegetais` - Grupos vegetais
- `bi-bo-hormonios` - Hormônios e movimentos vegetais
- `bi-bo-reproducao` - Reprodução vegetal
- `bi-bo-transpiracao` - Transpiração
- `bi-bo-seiva-bruta` - Transporte de seiva (bruta e elaborada)

### **content_id: bi-citologia** - Citologia
- `bi-ct-membrana-plasmatica` - Membrana plasmática
- `bi-ct-organelas` - Organelas
- `bi-ct-transporte-celular` - Transporte celular

### **content_id: bi-divisao-celular** - Divisão celular
- `bi-dc-meiose` - Meiose
- `bi-dc-mitose` - Mitose

### **content_id: bi-ecologia** - Ecologia
- `bi-ec-biomas-brasileiros` - Biomas brasileiros
- `bi-ec-cadeia-alimentar` - Cadeias e teias alimentares
- `bi-ec-ciclo-agua` - Ciclo da água
- `bi-ec-ciclo-carbono` - Ciclo do carbono
- `bi-ec-ciclo-nitrogenio` - Ciclo do nitrogênio
- `bi-ec-conservacao` - Conservação e sustentabilidade
- `bi-ec-dinamica-populacoes` - Dinâmica de populações
- `bi-ec-impactos-ambientais` - Impactos ambientais e poluição
- `bi-ec-nicho` - Nicho, habitat e biodiversidade
- `bi-ec-piramides-ecologicas` - Pirâmides ecológicas
- `bi-ec-relacoes-ecologicas` - Relações ecológicas
- `bi-ec-sucessao-ecologica` - Sucessão ecológica

### **content_id: bi-evolucao** - Evolução
- `bi-ev-cladistica` - Cladística
- `bi-ev-especiacao` - Especiação
- `bi-ev-evidencias` - Evidências da evolução
- `bi-ev-origem-vida` - Origem da vida
- `bi-ev-selecao-natural` - Seleção natural
- `bi-ev-teorias` - Teorias evolutivas (Lamarck e Darwin)

### **content_id: bi-fisiologia** - Fisiologia
- `bi-fi-sistema-circulatorio` - Sistema circulatório
- `bi-fi-sistema-digestorio` - Sistema digestório
- `bi-fi-sistema-endocrino` - Sistema endócrino
- `bi-fi-sistema-excretor` - Sistema excretor
- `bi-fi-sistema-imunologico` - Sistema imunológico
- `bi-fi-sistema-nervoso` - Sistema nervoso
- `bi-fi-sistema-respiratorio` - Sistema respiratório

### **content_id: bi-genetica** - Genética
- `bi-ge-alelo` - Conceitos básicos (gene, alelo, genótipo e fenótipo)
- `bi-ge-fator-rh` - Fator Rh
- `bi-ge-heranca-sexo` - Herança ligada ao sexo
- `bi-ge-heredogramas` - Heredogramas
- `bi-ge-primeira-lei-mendel` - Primeira lei de Mendel
- `bi-ge-segunda-lei-mendel` - Segunda lei de Mendel
- `bi-ge-sistema-abo` - Sistema ABO

### **content_id: bi-histologia** - Histologia
- `bi-hi-tecido-conjuntivo` - Tecido conjuntivo
- `bi-hi-tecido-epitelial` - Tecido epitelial
- `bi-hi-tecido-muscular` - Tecido muscular
- `bi-hi-tecido-nervoso` - Tecido nervoso

### **content_id: bi-metabolismo** - Metabolismo
- `bi-me-fermentacao` - Fermentação
- `bi-me-fotossintese` - Fotossíntese
- `bi-me-respiracao-celular` - Respiração celular

### **content_id: bi-microbiologia** - Microbiologia e saúde
- `bi-mi-bacterias` - Bactérias e bacterioses
- `bi-mi-epidemiologia` - Epidemiologia e prevenção de doenças
- `bi-mi-parasitoses` - Protozooses e verminoses
- `bi-mi-vacinas` - Vacinas e saúde pública
- `bi-mi-virus` - Vírus e viroses

### **content_id: bi-reproducao** - Reprodução e embriologia
- `bi-rp-embriologia` - Desenvolvimento embrionário
- `bi-rp-reproducao-humana` - Reprodução humana e métodos contraceptivos

### **content_id: bi-zoologia** - Zoologia
- `bi-zo-invertebrados` - Invertebrados
- `bi-zo-vertebrados` - Vertebrados

---

## FÍSICA (subject_id: "fi") — área: Ciências da Natureza

### **content_id: fi-cinematica** - Cinemática
- `fi-ci-graficos-movimento` - Gráficos do movimento
- `fi-ci-lancamentos` - Lançamentos
- `fi-ci-mru` - MRU
- `fi-ci-mruv` - MRUV
- `fi-ci-queda-livre` - Queda livre
- `fi-ci-velocidade-media` - Velocidade média

### **content_id: fi-dinamica** - Dinâmica e estática
- `fi-es-alavancas` - Alavancas
- `fi-di-atrito` - Atrito
- `fi-es-equilibrio-corpos` - Equilíbrio de corpos
- `fi-di-movimento-circular` - Movimento circular
- `fi-di-plano-inclinado` - Plano inclinado
- `fi-di-primeira-lei-newton` - Primeira lei de Newton
- `fi-di-segunda-lei-newton` - Segunda lei de Newton
- `fi-di-terceira-lei-newton` - Terceira lei de Newton
- `fi-es-torque` - Torque

### **content_id: fi-eletrodinamica** - Eletrodinâmica
- `fi-cr-associacao-resistores` - Associação de resistores
- `fi-ed-circuitos` - Circuitos elétricos e instrumentos de medida
- `fi-ed-consumo-energia` - Consumo de energia elétrica
- `fi-ed-corrente-eletrica` - Corrente elétrica
- `fi-ed-geradores` - Geradores e receptores
- `fi-ed-lei-ohm` - Lei de Ohm
- `fi-ed-potencia-eletrica` - Potência elétrica
- `fi-ed-resistencia-eletrica` - Resistência elétrica

### **content_id: fi-magnetismo** - Eletromagnetismo
- `fi-mg-campo-magnetico` - Campo magnético
- `fi-mg-forca-magnetica` - Força magnética
- `fi-in-lei-faraday` - Lei de Faraday

### **content_id: fi-eletrostatica** - Eletrostática
- `fi-el-campo-eletrico` - Campo elétrico
- `fi-el-eletrizacao` - Eletrização e blindagem eletrostática
- `fi-el-lei-coulomb` - Lei de Coulomb
- `fi-el-potencial-eletrico` - Potencial elétrico

### **content_id: fi-energia** - Energia
- `fi-en-conservacao-energia` - Conservação de energia
- `fi-en-energia-cinetica` - Energia cinética
- `fi-en-energia-potencial` - Energia potencial
- `fi-en-fontes` - Fontes e transformações de energia
- `fi-en-potencia` - Potência
- `fi-en-rendimento` - Rendimento
- `fi-en-trabalho` - Trabalho

### **content_id: fi-fisica-moderna** - Física moderna
- `fi-fm-efeito-fotoeletrico` - Efeito fotoelétrico
- `fi-fm-energia-nuclear` - Fissão e fusão nuclear
- `fi-fm-modelos-atomicos` - Modelos atômicos e espectros
- `fi-fm-radioatividade` - Radioatividade

### **content_id: fi-grandezas-unidades** - Grandezas, unidades e vetores
- `fi-ve-decomposicao-vetorial` - Decomposição vetorial
- `fi-gu-notacao-cientifica` - Notação científica
- `fi-gu-sistema-internacional` - Sistema internacional

### **content_id: fi-gravitacao** - Gravitação
- `fi-gr-campo-gravitacional` - Campo gravitacional
- `fi-gr-lei-gravitacao-universal` - Lei da gravitação universal
- `fi-gr-leis-kepler` - Leis de Kepler e movimento planetário

### **content_id: fi-hidrostatica** - Hidrostática e hidrodinâmica
- `fi-hd-continuidade` - Continuidade
- `fi-hs-densidade` - Densidade
- `fi-hs-empuxo` - Empuxo
- `fi-hd-equacao-bernoulli` - Equação de Bernoulli
- `fi-hs-pressao` - Pressão
- `fi-hs-principio-pascal` - Princípio de Pascal
- `fi-hs-stevin` - Teorema de Stevin

### **content_id: fi-ondulatoria** - Ondulatória e acústica
- `fi-on-comprimento-onda` - Comprimento de onda
- `fi-on-difracao` - Difração
- `fi-ac-efeito-doppler` - Efeito Doppler
- `fi-on-frequencia` - Frequência
- `fi-ac-intensidade-sonora` - Intensidade sonora
- `fi-on-interferencia` - Interferência
- `fi-os-mhs-massa-mola` - MHS massa–mola
- `fi-os-movimento-pendular` - Movimento pendular
- `fi-on-ondas-eletromagneticas` - Ondas eletromagnéticas e espectro
- `fi-os-periodo` - Período
- `fi-on-fenomenos` - Reflexão e refração de ondas
- `fi-os-ressonancia` - Ressonância
- `fi-on-velocidade-propagacao` - Velocidade de propagação

### **content_id: fi-optica** - Óptica
- `fi-op-espelhos-esfericos` - Espelhos esféricos
- `fi-op-espelhos-planos` - Espelhos planos
- `fi-op-lei-snell` - Lei de Snell
- `fi-op-lentes-delgadas` - Lentes delgadas
- `fi-op-cores` - Luz, cores e espectro
- `fi-op-visao` - Óptica da visão
- `fi-op-reflexao` - Reflexão
- `fi-op-refracao` - Refração

### **content_id: fi-quantidade-movimento** - Quantidade de movimento e colisões
- `fi-co-colisao-elastica` - Colisão elástica
- `fi-co-colisao-inelastica` - Colisão inelástica
- `fi-qm-conservacao-momento` - Conservação do momento
- `fi-qm-impulso` - Impulso

### **content_id: fi-termodinamica** - Termodinâmica e gases
- `fi-ga-equacao-clapeyron` - Equação de Clapeyron
- `fi-td-maquinas-termicas` - Máquinas térmicas
- `fi-td-primeira-lei` - Primeira lei da termodinâmica
- `fi-td-segunda-lei` - Segunda lei da termodinâmica
- `fi-ga-transformacoes-gasosas` - Transformações gasosas

### **content_id: fi-termologia** - Termologia e calorimetria
- `fi-ca-calor-especifico` - Calor específico
- `fi-ca-calor-latente` - Calor latente
- `fi-ca-calor-sensivel` - Calor sensível
- `fi-ca-capacidade-termica` - Capacidade térmica
- `fi-te-dilatacao-linear` - Dilatação linear
- `fi-te-dilatacao-superficial` - Dilatação superficial
- `fi-te-dilatacao-volumetrica` - Dilatação volumétrica
- `fi-ca-equilibrio-termico` - Equilíbrio térmico
- `fi-te-escalas-termometricas` - Escalas termométricas
- `fi-ca-graficos-aquecimento` - Gráficos de aquecimento
- `fi-ca-mudancas-estado` - Mudanças de estado
- `fi-te-propagacao-calor` - Propagação de calor

---

## QUÍMICA (subject_id: "qu") — área: Ciências da Natureza

### **content_id: qu-cinetica** - Cinética
- `qu-ci-catalisadores` - Catalisadores
- `qu-ci-velocidade-reacao` - Velocidade de reação

### **content_id: qu-eletroquimica** - Eletroquímica
- `qu-el-corrosao` - Corrosão
- `qu-el-eletrolise` - Eletrólise
- `qu-el-pilhas` - Pilhas

### **content_id: qu-equilibrio** - Equilíbrio químico
- `qu-eq-constante-equilibrio` - Constante de equilíbrio
- `qu-ei-hidrolise-sais` - Hidrólise de sais
- `qu-eq-le-chatelier` - Le Chatelier
- `qu-ei-ph` - pH e pOH

### **content_id: qu-estequiometria** - Estequiometria
- `qu-et-calculo` - Cálculo estequiométrico
- `qu-et-mol` - Mol
- `qu-et-reagente-limitante` - Reagente limitante
- `qu-et-rendimento` - Rendimento

### **content_id: qu-estrutura-atomica** - Estrutura atômica
- `qu-ea-distribuicao-eletronica` - Distribuição eletrônica
- `qu-ea-massa-atomica` - Massa atômica
- `qu-ea-modelos-atomicos` - Modelos atômicos
- `qu-ea-numero-atomico` - Número atômico

### **content_id: qu-inorganica** - Inorgânica
- `qu-in-acidos` - Ácidos
- `qu-in-bases` - Bases
- `qu-in-oxidos` - Óxidos
- `qu-in-neutralizacao` - Reações de neutralização
- `qu-in-sais` - Sais

### **content_id: qu-ligacoes-quimicas** - Ligações e interações moleculares
- `qu-it-forcas-intermoleculares` - Forças intermoleculares
- `qu-lq-geometria-molecular` - Geometria molecular
- `qu-lq-ligacao-covalente` - Ligação covalente
- `qu-lq-ligacao-ionica` - Ligação iônica
- `qu-lq-ligacao-metalica` - Ligação metálica
- `qu-it-polaridade` - Polaridade

### **content_id: qu-materia** - Matéria
- `qu-ma-estados-fisicos` - Estados físicos
- `qu-ma-misturas` - Misturas
- `qu-ma-propriedades` - Propriedades da matéria (densidade, fusão e ebulição)
- `qu-ma-separacao-misturas` - Separação de misturas

### **content_id: qu-organica** - Orgânica
- `qu-or-biomoleculas` - Biomoléculas
- `qu-or-cadeias-carbonicas` - Cadeias carbônicas
- `qu-or-funcoes-organicas` - Funções orgânicas
- `qu-or-isomeria` - Isomeria
- `qu-or-nomenclatura` - Nomenclatura orgânica
- `qu-or-polimeros` - Polímeros
- `qu-or-propriedades` - Propriedades físicas dos compostos orgânicos
- `qu-or-reacoes-organicas` - Reações orgânicas

### **content_id: qu-ambiental** - Química ambiental e tecnológica
- `qu-am-chuva-acida` - Chuva ácida
- `qu-te-combustiveis` - Combustíveis
- `qu-am-efeito-estufa` - Efeito estufa e camada de ozônio
- `qu-am-residuos` - Lixo, resíduos e reciclagem
- `qu-am-poluicao-ar` - Poluição atmosférica
- `qu-am-poluicao-agua` - Poluição da água
- `qu-am-quimica-verde` - Química verde e sustentabilidade
- `qu-am-solo` - Solo, fertilizantes e remediação
- `qu-am-tratamento-agua` - Tratamento de água

### **content_id: qu-reacoes** - Reações
- `qu-re-balanceamento` - Balanceamento
- `qu-re-oxirreducao` - Oxirredução e Nox
- `qu-re-tipos-reacao` - Tipos de reação

### **content_id: qu-solucoes** - Soluções
- `qu-so-concentracao` - Concentração
- `qu-so-diluicao` - Diluição
- `qu-so-propriedades-coligativas` - Propriedades coligativas
- `qu-so-solubilidade` - Solubilidade

### **content_id: qu-tabela-periodica** - Tabela periódica
- `qu-tp-familias` - Famílias
- `qu-tp-propriedades-periodicas` - Propriedades periódicas

### **content_id: qu-termoquimica** - Termoquímica
- `qu-tq-entalpia` - Entalpia
- `qu-tq-lei-hess` - Lei de Hess

---

## ✅ EXEMPLO DE JSON CORRETO

```json
[
  {
    "statement": "Enunciado da questão aqui...",
    "subject_id": "qu",
    "content_id": "qu-termoquimica",
    "topic_id": "qu-tq-entalpia",
    "exam_id": "enem",
    "year": 2025,
    "difficulty": "medio",
    "option_a": "Alternativa A",
    "option_b": "Alternativa B",
    "option_c": "Alternativa C",
    "option_d": "Alternativa D",
    "option_e": "Alternativa E",
    "correct_answer": "c",
    "explanation": "Explicação da resposta correta.",
    "question_type": "multipla_escolha",
    "images": [
      {
        "url": "https://exemplo.com/imagem.jpg",
        "display_order": 0
      }
    ]
  }
]
```
