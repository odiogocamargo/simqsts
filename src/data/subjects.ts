export interface Topic {
  id: string;
  name: string;
}

export interface Content {
  id: string;
  name: string;
  topics: Topic[];
}

export interface Subject {
  id: string;
  name: string;
  contents: Content[];
}

export const subjects: Subject[] = [
  {
    id: "matematica",
    name: "Matemática",
    contents: [
      {
        id: "conjuntos-logica",
        name: "Conjuntos e Lógica",
        topics: [
          { id: "conjuntos-numericos", name: "Conjuntos numéricos e operações (pertinência, união, interseção, diferença, complemento)" },
          { id: "diagramas-venn", name: "Diagramas de Venn e princípio da inclusão-exclusão" },
          { id: "logica-proposicional", name: "Lógica proposicional: proposições, conectivos, negação, equivalências e implicação" },
          { id: "tabelas-verdade", name: "Tabelas verdade, tautologia, contradição e argumentos válidos" },
        ],
      },
      {
        id: "numeros-operacoes",
        name: "Números e Operações",
        topics: [
          { id: "numeros-naturais-reais", name: "Números naturais, inteiros, racionais e reais" },
          { id: "valor-absoluto", name: "Valor absoluto, intervalos e propriedades" },
          { id: "potenciacao-radiciacao", name: "Potenciação e radiciação, notação científica e operações com expoentes" },
          { id: "razoes-proporcoes", name: "Razões e proporções, regra de três simples e composta" },
          { id: "porcentagem", name: "Porcentagem, acréscimos, descontos e taxas" },
          { id: "juros", name: "Juros simples e compostos, montante e capitalização" },
          { id: "grandezas-medidas", name: "Grandezas e medidas: comprimento, área, volume, tempo e temperatura" },
        ],
      },
      {
        id: "algebra-funcoes",
        name: "Álgebra e Funções",
        topics: [
          { id: "expressoes-algebricas", name: "Expressões algébricas: produtos notáveis, fatoração e frações algébricas" },
          { id: "equacoes-inequacoes", name: "Equações e inequações do 1º e 2º grau, produtos e quocientes" },
          { id: "sistemas-lineares", name: "Sistemas lineares e métodos de resolução" },
          { id: "funcao-afim", name: "Função afim: definição, gráfico, coeficientes e aplicações" },
          { id: "funcao-quadratica", name: "Função quadrática: forma geral, vértice, concavidade e interseções" },
          { id: "funcao-modular", name: "Função modular: conceito e gráficos" },
          { id: "funcao-exponencial", name: "Função exponencial: crescimento e decaimento, aplicações financeiras e biológicas" },
          { id: "funcao-logaritmica", name: "Função logarítmica: propriedades e relação com a exponencial" },
          { id: "funcoes-compostas", name: "Funções compostas e inversas, simetrias e transformações" },
          { id: "funcoes-trigonometricas", name: "Funções trigonométricas: seno, cosseno e tangente, gráfico e periodicidade" },
          { id: "analise-graficos", name: "Análise e interpretação de gráficos e tabelas" },
        ],
      },
      {
        id: "sequencias-progressoes",
        name: "Sequências, Progressões e Matemática Financeira",
        topics: [
          { id: "sequencias-numericas", name: "Sequências numéricas e padrões" },
          { id: "progressao-aritmetica", name: "Progressão aritmética (PA): termo geral, soma dos termos e aplicações" },
          { id: "progressao-geometrica", name: "Progressão geométrica (PG): termo geral, soma de termos finitos e infinitos" },
          { id: "aplicacoes-pa-pg", name: "Aplicações práticas de PA e PG" },
          { id: "matematica-financeira", name: "Matemática financeira: juros simples, compostos, descontos, amortização e inflação" },
        ],
      },
      {
        id: "geometria-plana",
        name: "Geometria Plana",
        topics: [
          { id: "conceitos-fundamentais", name: "Conceitos fundamentais: ponto, reta, plano, ângulos e paralelismo" },
          { id: "triangulos", name: "Triângulos: tipos, propriedades, congruência e semelhança" },
          { id: "teoremas-tales-pitagoras", name: "Teorema de Tales e Teorema de Pitágoras" },
          { id: "quadrilateros-poligonos", name: "Quadriláteros e polígonos regulares" },
          { id: "circunferencia-circulo", name: "Circunferência e círculo: arcos, cordas, ângulos e áreas" },
          { id: "calculo-areas-perimetros", name: "Cálculo de áreas e perímetros de figuras planas" },
          { id: "relacoes-metricas-triangulos", name: "Relações métricas em triângulos e polígonos" },
        ],
      },
      {
        id: "geometria-espacial",
        name: "Geometria Espacial",
        topics: [
          { id: "poliedros-corpos-redondos", name: "Poliedros e corpos redondos: prismas, pirâmides, cilindros, cones e esferas" },
          { id: "planificacao-solidos", name: "Planificação de sólidos e cálculo de áreas totais e laterais" },
          { id: "volume-solidos", name: "Volume dos sólidos geométricos" },
          { id: "relacoes-metricas-espaco", name: "Relações métricas no espaço e diagonais de poliedros" },
          { id: "projecoes-cortes", name: "Projeções ortogonais e cortes geométricos" },
        ],
      },
      {
        id: "geometria-analitica",
        name: "Geometria Analítica",
        topics: [
          { id: "sistema-coordenadas", name: "Sistema de coordenadas cartesianas: ponto, distância e ponto médio" },
          { id: "equacao-reta", name: "Equação da reta: forma geral, coeficiente angular e linear, paralelismo e perpendicularidade" },
          { id: "equacao-circunferencia", name: "Equação da circunferência: centro, raio e posições relativas" },
          { id: "conicas", name: "Cônicas: parábola, elipse e hipérbole (identificação e propriedades básicas)" },
          { id: "areas-distancias-plano", name: "Áreas e distâncias no plano cartesiano" },
        ],
      },
      {
        id: "trigonometria",
        name: "Trigonometria",
        topics: [
          { id: "razoes-triangulo-retangulo", name: "Razões trigonométricas no triângulo retângulo (seno, cosseno e tangente)" },
          { id: "relacoes-identidades", name: "Relações fundamentais e identidades trigonométricas" },
          { id: "lei-senos-cossenos", name: "Lei dos senos e lei dos cossenos" },
          { id: "medida-arcos-angulos", name: "Medida de arcos e ângulos em graus e radianos" },
          { id: "circulo-trigonometrico", name: "Círculo trigonométrico e ângulos notáveis" },
          { id: "funcoes-trig-grafico", name: "Funções trigonométricas: gráfico, período e amplitude" },
          { id: "equacoes-expressoes-trig", name: "Equações e expressões trigonométricas" },
        ],
      },
      {
        id: "estatistica-combinatoria-probabilidade",
        name: "Estatística, Combinatória e Probabilidade",
        topics: [
          { id: "coleta-interpretacao-dados", name: "Coleta, organização e interpretação de dados" },
          { id: "tabelas-graficos", name: "Tabelas e gráficos estatísticos" },
          { id: "tendencia-central", name: "Medidas de tendência central: média, moda e mediana" },
          { id: "dispersao", name: "Medidas de dispersão: amplitude, variância e desvio padrão" },
          { id: "analise-combinatoria", name: "Análise combinatória: princípio multiplicativo, arranjos, combinações e permutações" },
          { id: "probabilidade", name: "Probabilidade: eventos simples e compostos, probabilidade condicional e independência" },
          { id: "estatistica-aplicada", name: "Estatística aplicada a situações reais (ENEM e problemas cotidianos)" },
        ],
      },
    ],
  },
  {
    id: "interpretacao-textual",
    name: "Interpretação Textual",
    contents: [
      {
        id: "compreensao-texto",
        name: "Compreensão de Texto",
        topics: [
          { id: "informacoes-explicitas", name: "Identificação de Informações Explícitas" },
          { id: "informacoes-implicitas", name: "Identificação de Informações Implícitas" },
          { id: "tema-principal", name: "Tema Principal" },
        ],
      },
      {
        id: "interpretacao-analise-critica",
        name: "Interpretação e Análise Crítica",
        topics: [
          { id: "ponto-vista", name: "Ponto de Vista" },
          { id: "ironia", name: "Ironia" },
          { id: "humor", name: "Humor" },
          { id: "inferencia", name: "Inferência" },
          { id: "proposito-comunicativo", name: "Propósito Comunicativo" },
        ],
      },
      {
        id: "tipos-generos-textuais",
        name: "Tipos e Gêneros Textuais",
        topics: [
          { id: "narrativo", name: "Narrativo" },
          { id: "descritivo", name: "Descritivo" },
          { id: "dissertativo", name: "Dissertativo" },
          { id: "injuntivo", name: "Injuntivo" },
          { id: "expositivo", name: "Expositivo" },
          { id: "argumentativo", name: "Argumentativo" },
        ],
      },
      {
        id: "estrutura-coesao",
        name: "Estrutura e Coesão Textual",
        topics: [
          { id: "coesao-referencial", name: "Coesão Referencial" },
          { id: "coesao-sequencial", name: "Coesão Sequencial" },
          { id: "progressao-tematica", name: "Progressão Temática" },
          { id: "paragrafacao", name: "Paragrafação" },
        ],
      },
      {
        id: "figuras-recursos-expressivos",
        name: "Figuras de Linguagem e Recursos Expressivos",
        topics: [
          { id: "metafora", name: "Metáfora" },
          { id: "metonimia", name: "Metonímia" },
          { id: "hiperbole", name: "Hipérbole" },
          { id: "eufemismo", name: "Eufemismo" },
          { id: "ironia", name: "Ironia" },
          { id: "antitese", name: "Antítese" },
          { id: "personificacao", name: "Personificação" },
          { id: "anafora", name: "Anáfora" },
        ],
      },
      {
        id: "funcoes-linguagem",
        name: "Funções da Linguagem",
        topics: [
          { id: "emotiva", name: "Emotiva" },
          { id: "apelativa", name: "Apelativa" },
          { id: "referencial", name: "Referencial" },
          { id: "poetica", name: "Poética" },
          { id: "metalinguistica", name: "Metalinguística" },
          { id: "fatica", name: "Fática" },
        ],
      },
      {
        id: "discurso-ideologia",
        name: "Discurso e Ideologia",
        topics: [
          { id: "analise-critica", name: "Análise Crítica da Linguagem" },
          { id: "intencionalidade", name: "Intencionalidade" },
          { id: "manipulacao", name: "Manipulação" },
          { id: "poder-texto", name: "Poder no Texto" },
        ],
      },
      {
        id: "variacao-linguistica-textos",
        name: "Variação Linguística em Textos",
        topics: [
          { id: "efeitos-sentido", name: "Efeitos de Sentido Causados por Dialetos" },
          { id: "girias", name: "Gírias" },
          { id: "regionalismos", name: "Regionalismos" },
        ],
      },
      {
        id: "intertextualidade-generos-multimodais",
        name: "Intertextualidade e Gêneros Multimodais",
        topics: [
          { id: "relacoes-textos", name: "Relações entre Textos" },
          { id: "memes", name: "Memes" },
          { id: "charges", name: "Charges" },
          { id: "tirinhas", name: "Tirinhas" },
          { id: "hqs", name: "HQs" },
          { id: "publicidade", name: "Publicidade" },
        ],
      },
    ],
  },
  {
    id: "gramatica",
    name: "Gramática",
    contents: [
      {
        id: "fonologia-ortografia",
        name: "Fonologia e Ortografia",
        topics: [
          { id: "fonema", name: "Fonema" },
          { id: "digrafo", name: "Dígrafo" },
          { id: "encontros-vocalicos", name: "Encontros Vocálicos e Consonantais" },
          { id: "ortografia-oficial", name: "Ortografia Oficial" },
          { id: "acentuacao", name: "Acentuação" },
        ],
      },
      {
        id: "morfologia",
        name: "Morfologia (classes de palavras)",
        topics: [
          { id: "substantivo", name: "Substantivo" },
          { id: "adjetivo", name: "Adjetivo" },
          { id: "verbo", name: "Verbo" },
          { id: "adverbio", name: "Advérbio" },
          { id: "pronome", name: "Pronome" },
          { id: "preposicao", name: "Preposição" },
          { id: "conjuncao", name: "Conjunção" },
          { id: "interjeicao", name: "Interjeição" },
          { id: "artigo", name: "Artigo" },
          { id: "numeral", name: "Numeral" },
        ],
      },
      {
        id: "formacao-palavras",
        name: "Formação de Palavras",
        topics: [
          { id: "derivacao", name: "Derivação" },
          { id: "composicao", name: "Composição" },
          { id: "prefixacao", name: "Prefixação" },
          { id: "sufixacao", name: "Sufixação" },
          { id: "neologismo", name: "Neologismo" },
        ],
      },
      {
        id: "sintaxe",
        name: "Sintaxe (estrutura da oração e do período)",
        topics: [
          { id: "termos-essenciais", name: "Termos Essenciais e Acessórios" },
          { id: "sujeito-predicado", name: "Sujeito e Predicado" },
          { id: "periodos", name: "Períodos Simples e Compostos" },
          { id: "coordenacao-subordinacao", name: "Coordenação e Subordinação" },
        ],
      },
      {
        id: "concordancia",
        name: "Concordância",
        topics: [
          { id: "nominal", name: "Nominal" },
          { id: "verbal", name: "Verbal" },
        ],
      },
      {
        id: "regencia",
        name: "Regência",
        topics: [
          { id: "nominal", name: "Nominal" },
          { id: "verbal", name: "Verbal" },
        ],
      },
      {
        id: "crase",
        name: "Crase",
        topics: [
          { id: "uso", name: "Uso" },
          { id: "regras", name: "Regras e Casos Facultativos" },
        ],
      },
      {
        id: "colocacao-pronominal",
        name: "Colocação Pronominal",
        topics: [
          { id: "proclise", name: "Próclise" },
          { id: "enclise", name: "Ênclise" },
          { id: "mesoclise", name: "Mesóclise" },
        ],
      },
      {
        id: "pontuacao",
        name: "Pontuação",
        topics: [
          { id: "virgula", name: "Vírgula" },
          { id: "ponto-virgula", name: "Ponto e Vírgula" },
          { id: "dois-pontos", name: "Dois-pontos" },
          { id: "aspas", name: "Aspas" },
          { id: "travessao", name: "Travessão" },
          { id: "parenteses", name: "Parênteses" },
        ],
      },
      {
        id: "semantica-lexico",
        name: "Semântica e Léxico",
        topics: [
          { id: "denotacao-conotacao", name: "Denotação e Conotação" },
          { id: "polissemia", name: "Polissemia" },
          { id: "ambiguidade", name: "Ambiguidade" },
          { id: "sinonimia-antonimia", name: "Sinonímia e Antonímia" },
          { id: "homonimos-paronimos", name: "Homônimos e Parônimos" },
        ],
      },
      {
        id: "variacao-linguistica",
        name: "Variação Linguística",
        topics: [
          { id: "dialetos", name: "Dialetos" },
          { id: "registros", name: "Registros" },
          { id: "adequacao-comunicativa", name: "Adequação Comunicativa" },
        ],
      },
    ],
  },
  {
    id: "literatura",
    name: "Literatura",
    contents: [
      {
        id: "trovadorismo-humanismo",
        name: "Trovadorismo e Humanismo",
        topics: [
          { id: "cantigas", name: "Cantigas" },
          { id: "satiras", name: "Sátiras" },
          { id: "textos-transicao", name: "Textos de Transição" },
        ],
      },
      {
        id: "classicismo-quinhentismo",
        name: "Classicismo e Quinhentismo",
        topics: [
          { id: "camoes", name: "Camões" },
          { id: "textos-informativos", name: "Textos Informativos" },
          { id: "textos-religiosos", name: "Textos Religiosos" },
        ],
      },
      {
        id: "barroco",
        name: "Barroco",
        topics: [
          { id: "gregorio-matos", name: "Gregório de Matos" },
          { id: "padre-vieira", name: "Padre Vieira" },
          { id: "contraste", name: "Contraste" },
          { id: "religiosidade", name: "Religiosidade" },
        ],
      },
      {
        id: "arcadismo-neoclassicismo",
        name: "Arcadismo / Neoclassicismo",
        topics: [
          { id: "tomas-antonio-gonzaga", name: "Tomás Antônio Gonzaga" },
          { id: "pastoralismo", name: "Pastoralismo" },
          { id: "racionalismo", name: "Racionalismo" },
        ],
      },
      {
        id: "romantismo",
        name: "Romantismo",
        topics: [
          { id: "indianismo", name: "Indianismo" },
          { id: "nacionalismo", name: "Nacionalismo" },
          { id: "sentimentalismo", name: "Sentimentalismo" },
          { id: "fases-poesia", name: "Fases da Poesia" },
          { id: "prosa", name: "Prosa" },
        ],
      },
      {
        id: "realismo-naturalismo",
        name: "Realismo e Naturalismo",
        topics: [
          { id: "machado-assis", name: "Machado de Assis" },
          { id: "aluisio-azevedo", name: "Aluísio Azevedo" },
          { id: "critica-social", name: "Crítica Social" },
          { id: "determinismo", name: "Determinismo" },
        ],
      },
      {
        id: "parnasianismo-simbolismo",
        name: "Parnasianismo e Simbolismo",
        topics: [
          { id: "forma-estetica", name: "Forma e Estética" },
          { id: "subjetividade", name: "Subjetividade" },
          { id: "musicalidade", name: "Musicalidade" },
        ],
      },
      {
        id: "pre-modernismo",
        name: "Pré-Modernismo",
        topics: [
          { id: "euclides-cunha", name: "Euclides da Cunha" },
          { id: "lima-barreto", name: "Lima Barreto" },
          { id: "regionalismo", name: "Regionalismo" },
          { id: "critica-social", name: "Crítica Social" },
        ],
      },
      {
        id: "modernismo-primeira-fase",
        name: "Modernismo (1ª Fase)",
        topics: [
          { id: "semana-22", name: "Semana de 22" },
          { id: "mario-oswald-andrade", name: "Mário e Oswald de Andrade" },
          { id: "manuel-bandeira", name: "Manuel Bandeira" },
        ],
      },
      {
        id: "modernismo-segunda-fase",
        name: "Modernismo (2ª Fase)",
        topics: [
          { id: "drummond", name: "Drummond" },
          { id: "cecilia", name: "Cecília" },
          { id: "graciliano-ramos", name: "Graciliano Ramos" },
          { id: "jorge-amado", name: "Jorge Amado" },
        ],
      },
      {
        id: "modernismo-terceira-fase",
        name: "Modernismo (3ª Fase)",
        topics: [
          { id: "guimaraes-rosa", name: "Guimarães Rosa" },
          { id: "clarice-lispector", name: "Clarice Lispector" },
          { id: "joao-cabral", name: "João Cabral" },
        ],
      },
      {
        id: "literatura-contemporanea",
        name: "Literatura Contemporânea",
        topics: [
          { id: "regionalismo", name: "Regionalismo" },
          { id: "minorias", name: "Minorias" },
          { id: "urbanizacao", name: "Urbanização" },
          { id: "literatura-afro", name: "Literatura Afro" },
          { id: "literatura-indigena", name: "Literatura Indígena" },
        ],
      },
      {
        id: "intertextualidade-artes",
        name: "Intertextualidade e Outras Artes",
        topics: [
          { id: "relacao-literatura", name: "Relação entre Literatura" },
          { id: "cinema", name: "Cinema" },
          { id: "musica", name: "Música" },
          { id: "hqs", name: "HQs" },
        ],
      },
    ],
  },
  {
    id: "fisica",
    name: "Física",
    contents: [
      {
        id: "grandezas-fisicas-medidas",
        name: "Grandezas Físicas e Medidas",
        topics: [
          { id: "conceito-grandeza", name: "Conceito de grandeza física" },
          { id: "escalares-vetoriais", name: "Escalares e vetoriais" },
          { id: "unidades-si", name: "Unidades do SI" },
          { id: "notacao-cientifica", name: "Notação científica" },
          { id: "algarismos-significativos", name: "Algarismos significativos" },
          { id: "erro-absoluto-relativo", name: "Erro absoluto e relativo" },
          { id: "conversao-unidades", name: "Conversão de unidades e ordem de grandeza" },
        ],
      },
      {
        id: "cinematica",
        name: "Cinemática",
        topics: [
          { id: "ponto-material-referencial", name: "Ponto material e referencial" },
          { id: "mru-mruv", name: "Movimento retilíneo uniforme (MRU) e uniformemente variado (MRUV)" },
          { id: "graficos-posicao-velocidade", name: "Gráficos de posição, velocidade e aceleração" },
          { id: "mcu", name: "Movimento circular uniforme (MCU)" },
          { id: "queda-livre-lancamentos", name: "Queda livre e lançamentos (vertical e oblíquo)" },
        ],
      },
      {
        id: "dinamica",
        name: "Dinâmica",
        topics: [
          { id: "conceito-forca-massa", name: "Conceito de força, massa e aceleração" },
          { id: "leis-newton", name: "Leis de Newton" },
          { id: "forca-peso-normal-atrito", name: "Força peso, força normal, atrito estático e cinético, tração e força elástica" },
          { id: "plano-inclinado", name: "Plano inclinado" },
          { id: "resultante-decomposicao", name: "Resultante e decomposição vetorial" },
          { id: "diagramas-forcas", name: "Diagramas de forças" },
        ],
      },
      {
        id: "gravitacao",
        name: "Gravitação",
        topics: [
          { id: "leis-kepler", name: "Leis de Kepler" },
          { id: "lei-gravitacao-universal", name: "Lei da Gravitação Universal" },
          { id: "peso-massa", name: "Peso e massa" },
          { id: "aceleracao-gravidade", name: "Aceleração da gravidade" },
          { id: "forca-centripeta-satelites", name: "Força centrípeta e movimento de satélites" },
          { id: "orbitas-circulares-elipticas", name: "Órbitas circulares e elípticas" },
        ],
      },
      {
        id: "trabalho-energia-potencia",
        name: "Trabalho, Energia e Potência",
        topics: [
          { id: "trabalho-forca-constante", name: "Trabalho da força constante e variável" },
          { id: "energia-cinetica-potencial", name: "Energia cinética e potencial (gravitacional e elástica)" },
          { id: "conservacao-transformacao-energia", name: "Conservação e transformação de energia" },
          { id: "potencia-media-instantanea", name: "Potência média e instantânea" },
          { id: "rendimento-energetico", name: "Rendimento energético" },
        ],
      },
      {
        id: "impulso-quantidade-movimento",
        name: "Impulso e Quantidade de Movimento",
        topics: [
          { id: "quantidade-movimento", name: "Quantidade de movimento (momento linear)" },
          { id: "impulso-variacao", name: "Impulso e variação de movimento" },
          { id: "conservacao-quantidade", name: "Conservação da quantidade de movimento" },
          { id: "colisoes-elasticas-inelasticas", name: "Colisões elásticas e inelásticas" },
          { id: "recuo-sistemas-isolados", name: "Recuo e sistemas isolados" },
        ],
      },
      {
        id: "hidrostatica",
        name: "Hidrostática",
        topics: [
          { id: "massa-especifica-densidade", name: "Massa específica e densidade" },
          { id: "pressao-unidades", name: "Pressão e suas unidades" },
          { id: "principio-pascal", name: "Princípio de Pascal (prensa hidráulica)" },
          { id: "principio-arquimedes", name: "Princípio de Arquimedes (empuxo e flutuação)" },
          { id: "teorema-stevin", name: "Teorema de Stevin (pressão nos líquidos)" },
        ],
      },
      {
        id: "termologia-termodinamica",
        name: "Termologia e Termodinâmica",
        topics: [
          { id: "temperatura-calor-equilibrio", name: "Temperatura, calor e equilíbrio térmico" },
          { id: "escalas-termometricas", name: "Escalas termométricas (Celsius, Kelvin e Fahrenheit)" },
          { id: "dilatacao-termica", name: "Dilatação térmica dos corpos" },
          { id: "calor-sensivel-latente", name: "Calor sensível e calor latente" },
          { id: "mudancas-estado", name: "Mudanças de estado físico" },
          { id: "calorimetria", name: "Calorimetria e trocas de calor" },
          { id: "conducao-conveccao-radiacao", name: "Condução, convecção e radiação" },
          { id: "trabalho-termodinamico", name: "Trabalho termodinâmico e máquinas térmicas" },
          { id: "leis-termodinamica", name: "Primeira e Segunda Leis da Termodinâmica" },
        ],
      },
      {
        id: "ondulatoria-acustica",
        name: "Ondulatória e Acústica",
        topics: [
          { id: "conceito-onda", name: "Conceito de onda, amplitude, frequência, comprimento e velocidade" },
          { id: "ondas-mecanicas-eletromagneticas", name: "Ondas mecânicas e eletromagnéticas" },
          { id: "reflexao-refracao-difracao", name: "Reflexão, refração, difração e interferência" },
          { id: "ressonancia-ondas-estacionarias", name: "Ressonância e ondas estacionárias" },
          { id: "som-caracteristicas", name: "Som (altura, timbre, intensidade e nível sonoro)" },
          { id: "efeito-doppler", name: "Efeito Doppler" },
        ],
      },
      {
        id: "optica-geometrica",
        name: "Óptica Geométrica",
        topics: [
          { id: "principios-propagacao", name: "Princípios da propagação retilínea da luz" },
          { id: "reflexao-refracao", name: "Reflexão e refração" },
          { id: "espelhos-planos-esfericos", name: "Espelhos planos e esféricos" },
          { id: "lentes-delgadas", name: "Lentes delgadas (convergentes e divergentes)" },
          { id: "equacoes-gauss", name: "Equações de Gauss e aumento linear" },
          { id: "instrumentos-opticos", name: "Instrumentos ópticos (olho humano, lupa, microscópio e luneta)" },
          { id: "prismas-dispersao", name: "Prismas e dispersão da luz" },
        ],
      },
      {
        id: "eletricidade-circuitos",
        name: "Eletricidade e Circuitos",
        topics: [
          { id: "cargas-eletricas-eletrizacao", name: "Cargas elétricas e processos de eletrização" },
          { id: "corrente-tensao-resistencia", name: "Corrente elétrica, tensão e resistência" },
          { id: "lei-ohm", name: "Lei de Ohm" },
          { id: "potencia-efeito-joule", name: "Potência e efeito Joule" },
          { id: "associacao-resistores", name: "Associação de resistores (série e paralelo)" },
          { id: "geradores-receptores", name: "Geradores e receptores" },
          { id: "circuitos-eletricos-simples", name: "Circuitos elétricos simples e mistos" },
          { id: "medidores", name: "Medidores (amperímetro e voltímetro)" },
          { id: "consumo-energia", name: "Consumo de energia elétrica" },
        ],
      },
      {
        id: "eletrostatica",
        name: "Eletrostática",
        topics: [
          { id: "campo-eletrico", name: "Campo elétrico: representação e intensidade" },
          { id: "linhas-forca-superficies", name: "Linhas de força e superfícies equipotenciais" },
          { id: "potencial-eletrico", name: "Potencial elétrico e diferença de potencial" },
          { id: "energia-potencial-eletrica", name: "Energia potencial elétrica" },
          { id: "lei-coulomb", name: "Lei de Coulomb" },
          { id: "campo-eletrico-uniforme", name: "Campo elétrico uniforme e aplicações" },
        ],
      },
      {
        id: "magnetismo-inducao-eletromagnetica",
        name: "Magnetismo e Indução Eletromagnética",
        topics: [
          { id: "imas-polos-magneticos", name: "Ímãs e polos magnéticos" },
          { id: "campo-magnetico", name: "Campo magnético (direção, sentido e intensidade)" },
          { id: "forca-magnetica-cargas", name: "Força magnética em cargas em movimento (F = qvB)" },
          { id: "campo-magnetico-espiras", name: "Campo magnético de espiras e solenoides" },
          { id: "lei-faraday-lenz", name: "Lei de Faraday e Lei de Lenz" },
          { id: "inducao-eletromagnetica", name: "Indução eletromagnética" },
          { id: "aplicacoes-transformadores", name: "Aplicações: transformadores, motores e geradores elétricos" },
        ],
      },
      {
        id: "fisica-moderna",
        name: "Física Moderna (noções básicas)",
        topics: [
          { id: "modelos-atomicos", name: "Modelos atômicos (Thomson, Rutherford e Bohr)" },
          { id: "estrutura-atomica-espectros", name: "Estrutura atômica e espectros de emissão" },
          { id: "efeito-fotoeletrico", name: "Efeito fotoelétrico" },
          { id: "radiacoes-alfa-beta-gama", name: "Radiações alfa, beta e gama" },
          { id: "radioatividade-meia-vida", name: "Radioatividade e meia-vida" },
          { id: "fissao-fusao-nuclear", name: "Fissão e fusão nuclear (conceitos gerais)" },
        ],
      },
    ],
  },
  {
    id: "quimica",
    name: "Química",
    contents: [
      {
        id: "materia-transformacoes",
        name: "Matéria e Transformações",
        topics: [
          { id: "conceito-materia-corpo", name: "Conceito de matéria e corpo" },
          { id: "propriedades-gerais-especificas", name: "Propriedades gerais e específicas da matéria" },
          { id: "estados-fisicos", name: "Estados físicos" },
          { id: "substancias-puras-misturas", name: "Substâncias puras e misturas" },
          { id: "sistemas-homogeneos-heterogeneos", name: "Sistemas homogêneos e heterogêneos" },
          { id: "metodos-separacao", name: "Métodos de separação de misturas" },
          { id: "transformacoes-fisicas-quimicas", name: "Transformações físicas e químicas" },
        ],
      },
      {
        id: "modelos-atomicos",
        name: "Modelos Atômicos e Estrutura da Matéria",
        topics: [
          { id: "modelos-dalton-thomson-rutherford-bohr", name: "Modelos de Dalton, Thomson, Rutherford e Bohr" },
          { id: "numero-atomico-massa", name: "Número atômico e número de massa" },
          { id: "isotopos-isobaros-isotonos", name: "Isótopos, isóbaros e isótonos" },
          { id: "estrutura-eletrosfera", name: "Estrutura da eletrosfera" },
          { id: "configuracao-eletronica-camadas", name: "Configuração eletrônica e camadas eletrônicas" },
          { id: "subniveis-distribuicao-eletrons", name: "Subníveis e distribuição de elétrons" },
        ],
      },
      {
        id: "tabela-periodica",
        name: "Tabela Periódica e Propriedades Periódicas",
        topics: [
          { id: "classificacao-elementos", name: "Classificação dos elementos" },
          { id: "grupos-periodos", name: "Grupos e períodos" },
          { id: "metais-ametais-gases-nobres", name: "Metais, ametais e gases nobres" },
          { id: "propriedades-periodicas", name: "Propriedades periódicas (raio atômico, eletronegatividade, energia de ionização e afinidade eletrônica)" },
          { id: "tendencias-tabela", name: "Tendências na tabela periódica" },
        ],
      },
      {
        id: "ligacoes-quimicas",
        name: "Ligações Químicas e Geometria Molecular",
        topics: [
          { id: "ligacoes-ionicas-covalentes-metalicas", name: "Ligações iônicas, covalentes e metálicas" },
          { id: "polaridade-ligacoes-moleculas", name: "Polaridade das ligações e das moléculas" },
          { id: "forcas-intermoleculares", name: "Forças intermoleculares (dipolo-dipolo, íon-dipolo e ligações de hidrogênio)" },
          { id: "geometria-molecular", name: "Geometria molecular (VSEPR)" },
        ],
      },
      {
        id: "funcoes-inorganicas",
        name: "Funções Inorgânicas",
        topics: [
          { id: "conceito-classificacao", name: "Conceito e classificação: ácidos, bases, sais e óxidos" },
          { id: "nomenclatura-iupac", name: "Nomenclatura oficial (IUPAC)" },
          { id: "propriedades-quimicas", name: "Propriedades químicas e exemplos no cotidiano" },
          { id: "reacoes-caracteristicas", name: "Reações características de cada função" },
        ],
      },
      {
        id: "reacoes-quimicas",
        name: "Reações Químicas",
        topics: [
          { id: "identificacao-reacoes", name: "Identificação de reações químicas" },
          { id: "balanceamento-equacoes", name: "Balanceamento de equações" },
          { id: "leis-ponderais", name: "Leis ponderais (Lavoisier e Proust)" },
          { id: "tipos-reacoes", name: "Tipos de reações (síntese, análise, simples e dupla troca, combustão e neutralização)" },
        ],
      },
      {
        id: "estequiometria",
        name: "Estequiometria",
        topics: [
          { id: "mol-numero-avogadro", name: "Mol, número de Avogadro e massa molar" },
          { id: "calculos-proporcoes", name: "Cálculos com proporções químicas" },
          { id: "rendimento-pureza", name: "Rendimento e pureza" },
          { id: "reagente-limitante-excesso", name: "Reagente limitante e excesso" },
          { id: "volume-molar-gases", name: "Volume molar dos gases e condições normais de temperatura e pressão (CNTP)" },
        ],
      },
      {
        id: "solucoes",
        name: "Soluções",
        topics: [
          { id: "conceitos-soluto-solvente", name: "Conceitos de soluto e solvente" },
          { id: "tipos-solucoes", name: "Tipos de soluções (saturada, insaturada e supersaturada)" },
          { id: "unidades-concentracao", name: "Unidades de concentração (g/L, mol/L, ppm)" },
          { id: "diluicao-mistura-solucoes", name: "Diluição e mistura de soluções" },
          { id: "curva-solubilidade", name: "Curva de solubilidade" },
          { id: "titulacao-acido-base", name: "Titulação ácido-base" },
        ],
      },
      {
        id: "termoquimica",
        name: "Termoquímica",
        topics: [
          { id: "conceito-entalpia-calor", name: "Conceito de entalpia e calor de reação" },
          { id: "reacoes-endotermicas-exotermicas", name: "Reações endotérmicas e exotérmicas" },
          { id: "equacoes-termoquimicas", name: "Equações termoquímicas" },
          { id: "lei-hess", name: "Lei de Hess" },
          { id: "energia-ligacao", name: "Energia de ligação" },
          { id: "diagrama-energetico", name: "Diagrama energético" },
          { id: "combustao-neutralizacao", name: "Combustão e neutralização" },
        ],
      },
      {
        id: "cinetica-quimica",
        name: "Cinética Química",
        topics: [
          { id: "velocidade-reacoes", name: "Velocidade das reações químicas" },
          { id: "fatores-influenciam-velocidade", name: "Fatores que influenciam a velocidade (temperatura, concentração, superfície de contato e catalisadores)" },
          { id: "colisoes-efetivas", name: "Colisões efetivas" },
          { id: "energia-ativacao", name: "Energia de ativação" },
          { id: "graficos-energia", name: "Gráficos de energia" },
        ],
      },
      {
        id: "equilibrio-quimico",
        name: "Equilíbrio Químico",
        topics: [
          { id: "condicoes-equilibrio", name: "Condições de equilíbrio" },
          { id: "constante-equilibrio", name: "Constante de equilíbrio (Kc e Kp)" },
          { id: "principio-le-chatelier", name: "Princípio de Le Chatelier" },
          { id: "deslocamento-equilibrio", name: "Deslocamento de equilíbrio" },
          { id: "equilibrio-sistemas-gasosos", name: "Equilíbrio em sistemas gasosos e em solução" },
        ],
      },
      {
        id: "eletroquimica",
        name: "Eletroquímica",
        topics: [
          { id: "reacoes-oxirreducao", name: "Reações de oxirredução (oxidação e redução)" },
          { id: "numero-oxidacao-nox", name: "Número de oxidação (NOX)" },
          { id: "balanceamento-redox", name: "Balanceamento redox" },
          { id: "pilhas-galvanicas-celulas", name: "Pilhas galvânicas e células eletroquímicas" },
          { id: "eletrolise-aplicacoes", name: "Eletrólise e aplicações industriais" },
          { id: "corrosao-galvanoplastia", name: "Corrosão e galvanoplastia" },
        ],
      },
      {
        id: "quimica-organica-estrutura",
        name: "Química Orgânica: Estrutura e Funções",
        topics: [
          { id: "introducao-quimica-organica", name: "Introdução à química orgânica" },
          { id: "ligacoes-covalentes-cadeias", name: "Ligações covalentes e cadeias carbônicas" },
          { id: "classificacao-cadeias", name: "Classificação das cadeias (aberta, fechada, saturada, insaturada, homogênea e heterogênea)" },
          { id: "grupos-funcionais", name: "Grupos funcionais" },
          { id: "funcoes-organicas-oxigenadas", name: "Funções orgânicas oxigenadas, nitrogenadas e halogenadas" },
          { id: "nomenclatura-iupac", name: "Nomenclatura oficial (IUPAC)" },
        ],
      },
      {
        id: "reacoes-organicas",
        name: "Reações Orgânicas",
        topics: [
          { id: "tipos-reacoes", name: "Tipos de reações: adição, substituição, eliminação e oxidação" },
          { id: "combustao-hidrocarbonetos", name: "Combustão de hidrocarbonetos" },
          { id: "isomeria-plana-espacial", name: "Isomeria plana e espacial (geométrica e óptica)" },
          { id: "reconhecimento-produtos-reagentes", name: "Reconhecimento de produtos e reagentes" },
        ],
      },
      {
        id: "polimeros-compostos-organicos",
        name: "Polímeros e Compostos Orgânicos do Cotidiano",
        topics: [
          { id: "polimeros-naturais-sinteticos", name: "Polímeros naturais e sintéticos" },
          { id: "reacoes-polimerizacao", name: "Reações de polimerização" },
          { id: "plasticos-bioplasticos", name: "Plásticos e bioplásticos" },
          { id: "combustiveis-detergentes-cosmeticos", name: "Combustíveis, detergentes e cosméticos" },
          { id: "impacto-ambiental", name: "Impacto ambiental dos compostos orgânicos" },
        ],
      },
      {
        id: "quimica-ambiental",
        name: "Química Ambiental",
        topics: [
          { id: "poluicao-atmosferica-hidrica-solo", name: "Poluição atmosférica, hídrica e do solo" },
          { id: "chuva-acida", name: "Chuva ácida" },
          { id: "efeito-estufa-aquecimento", name: "Efeito estufa e aquecimento global" },
          { id: "camada-ozonio", name: "Camada de ozônio" },
          { id: "residuos-solidos-tratamento-agua", name: "Resíduos sólidos e tratamento de água" },
          { id: "combustiveis-fosseis-biocombastiveis", name: "Combustíveis fósseis e biocombustíveis" },
        ],
      },
      {
        id: "quimica-energia",
        name: "Química e Energia",
        topics: [
          { id: "reacoes-combustao-liberacao", name: "Reações de combustão e liberação de energia" },
          { id: "pilhas-baterias", name: "Pilhas e baterias" },
          { id: "energia-nuclear", name: "Energia nuclear (fissão e fusão — noções básicas)" },
          { id: "fontes-energia-renovaveis", name: "Fontes de energia renováveis e não renováveis" },
          { id: "impacto-ambiental-producao", name: "Impacto ambiental da produção de energia" },
        ],
      },
    ],
  },
  {
    id: "biologia",
    name: "Biologia",
    contents: [
      {
        id: "celular",
        name: "Biologia Celular",
        topics: [
          { id: "citologia", name: "Citologia" },
          { id: "metabolismo", name: "Metabolismo Celular" },
          { id: "divisao", name: "Divisão Celular" },
        ],
      },
      {
        id: "genetica",
        name: "Genética",
        topics: [
          { id: "leis-mendel", name: "Leis de Mendel" },
          { id: "dna", name: "DNA e RNA" },
          { id: "evolucao", name: "Evolução" },
        ],
      },
      {
        id: "fisiologia",
        name: "Fisiologia",
        topics: [
          { id: "vegetal", name: "Fisiologia Vegetal" },
          { id: "animal", name: "Fisiologia Animal" },
          { id: "humana", name: "Fisiologia Humana" },
        ],
      },
      {
        id: "ecologia",
        name: "Ecologia",
        topics: [
          { id: "ecossistemas", name: "Ecossistemas" },
          { id: "cadeias", name: "Cadeias Alimentares" },
          { id: "impactos", name: "Impactos Ambientais" },
        ],
      },
    ],
  },
  {
    id: "historia",
    name: "História",
    contents: [
      {
        id: "brasil",
        name: "História do Brasil",
        topics: [
          { id: "colonial", name: "Brasil Colônia" },
          { id: "imperio", name: "Brasil Império" },
          { id: "republica", name: "República" },
          { id: "contemporaneo", name: "Brasil Contemporâneo" },
        ],
      },
      {
        id: "geral",
        name: "História Geral",
        topics: [
          { id: "antiga", name: "Idade Antiga" },
          { id: "media", name: "Idade Média" },
          { id: "moderna", name: "Idade Moderna" },
          { id: "contemporanea", name: "Idade Contemporânea" },
        ],
      },
    ],
  },
  {
    id: "geografia",
    name: "Geografia",
    contents: [
      {
        id: "fisica",
        name: "Geografia Física",
        topics: [
          { id: "clima", name: "Climatologia" },
          { id: "relevo", name: "Relevo" },
          { id: "hidrografia", name: "Hidrografia" },
          { id: "biomas", name: "Biomas" },
        ],
      },
      {
        id: "humana",
        name: "Geografia Humana",
        topics: [
          { id: "populacao", name: "População" },
          { id: "urbanizacao", name: "Urbanização" },
          { id: "economia", name: "Geografia Econômica" },
          { id: "geopolitica", name: "Geopolítica" },
        ],
      },
      {
        id: "cartografia",
        name: "Cartografia",
        topics: [
          { id: "mapas", name: "Mapas e Escalas" },
          { id: "projecoes", name: "Projeções Cartográficas" },
        ],
      },
    ],
  },
  {
    id: "filosofia",
    name: "Filosofia",
    contents: [
      {
        id: "antiga",
        name: "Filosofia Antiga",
        topics: [
          { id: "pre-socraticos", name: "Pré-Socráticos" },
          { id: "socrates", name: "Sócrates, Platão e Aristóteles" },
        ],
      },
      {
        id: "moderna",
        name: "Filosofia Moderna",
        topics: [
          { id: "racionalismo", name: "Racionalismo" },
          { id: "empirismo", name: "Empirismo" },
          { id: "iluminismo", name: "Iluminismo" },
        ],
      },
      {
        id: "contemporanea",
        name: "Filosofia Contemporânea",
        topics: [
          { id: "existencialismo", name: "Existencialismo" },
          { id: "nietzsche", name: "Nietzsche" },
        ],
      },
    ],
  },
  {
    id: "sociologia",
    name: "Sociologia",
    contents: [
      {
        id: "classicos",
        name: "Pensadores Clássicos",
        topics: [
          { id: "durkheim", name: "Durkheim" },
          { id: "weber", name: "Weber" },
          { id: "marx", name: "Marx" },
        ],
      },
      {
        id: "temas",
        name: "Temas Sociológicos",
        topics: [
          { id: "cultura", name: "Cultura e Sociedade" },
          { id: "estratificacao", name: "Estratificação Social" },
          { id: "movimentos", name: "Movimentos Sociais" },
          { id: "trabalho", name: "Trabalho" },
        ],
      },
    ],
  },
  {
    id: "ingles",
    name: "Inglês",
    contents: [
      {
        id: "interpretacao",
        name: "Interpretação de Texto",
        topics: [
          { id: "compreensao", name: "Compreensão Textual" },
          { id: "vocabulario", name: "Vocabulário" },
          { id: "inferencia", name: "Inferência" },
        ],
      },
      {
        id: "gramatica",
        name: "Gramática",
        topics: [
          { id: "verbos", name: "Tempos Verbais" },
          { id: "conectores", name: "Conectores" },
        ],
      },
    ],
  },
  {
    id: "espanhol",
    name: "Espanhol",
    contents: [
      {
        id: "interpretacao",
        name: "Interpretação de Texto",
        topics: [
          { id: "compreensao", name: "Compreensão Textual" },
          { id: "vocabulario", name: "Vocabulário" },
          { id: "inferencia", name: "Inferência" },
        ],
      },
      {
        id: "gramatica",
        name: "Gramática",
        topics: [
          { id: "verbos", name: "Tempos Verbais" },
          { id: "conectores", name: "Conectores" },
        ],
      },
    ],
  },
];
