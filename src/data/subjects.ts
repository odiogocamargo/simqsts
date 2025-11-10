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
        id: "introducao-origem-vida",
        name: "Introdução à Biologia e Origem da Vida",
        topics: [
          { id: "conceito-biologia", name: "Conceito de Biologia" },
          { id: "caracteristicas-seres-vivos", name: "Características dos seres vivos" },
          { id: "niveis-organizacao", name: "Níveis de organização biológica" },
          { id: "teorias-origem-vida", name: "Teorias sobre a origem da vida (abiogênese e biogênese)" },
          { id: "teoria-celular-evolucao", name: "Teoria celular e evolução dos modelos celulares" },
        ],
      },
      {
        id: "bioquimica-celular",
        name: "Bioquímica Celular",
        topics: [
          { id: "composicao-quimica", name: "Composição química dos seres vivos" },
          { id: "importancia-agua-sais", name: "Importância da água e dos sais minerais" },
          { id: "funcoes-carboidratos", name: "Funções biológicas dos carboidratos" },
          { id: "lipidios", name: "Lipídios" },
          { id: "proteinas", name: "Proteínas" },
          { id: "vitaminas", name: "Vitaminas" },
          { id: "estrutura-funcao-enzimas", name: "Estrutura e função das enzimas" },
          { id: "acidos-nucleicos", name: "Ácidos nucleicos (DNA e RNA)" },
        ],
      },
      {
        id: "citologia",
        name: "Citologia (Estrutura e Função Celular)",
        topics: [
          { id: "tipos-celula", name: "Tipos de célula (procariónte e eucariónte)" },
          { id: "membrana-plasmatica", name: "Membrana plasmática (estrutura e transporte)" },
          { id: "citoplasma-organelas", name: "Citoplasma e organelas celulares" },
          { id: "nucleo-cromatina-cromossomos", name: "Núcleo, cromatina e cromossomos" },
          { id: "metabolismo-energetico", name: "Metabolismo energético (fotossíntese e respiração celular)" },
        ],
      },
      {
        id: "divisao-celular",
        name: "Divisão Celular e Ciclo Celular",
        topics: [
          { id: "mitose-fases", name: "Mitose e suas fases" },
          { id: "meiose-fases", name: "Meiose e suas fases" },
          { id: "importancia-divisoes", name: "Importância biológica das divisões celulares" },
          { id: "controle-ciclo-celular", name: "Controle do ciclo celular" },
          { id: "relacao-divisao-cancer", name: "Relação entre divisão celular e câncer" },
        ],
      },
      {
        id: "histologia",
        name: "Histologia Animal e Vegetal",
        topics: [
          { id: "tecidos-animais-epitelial", name: "Tecidos animais (epitelial, conjuntivo, muscular e nervoso)" },
          { id: "tecidos-vegetais", name: "Tecidos vegetais (meristemáticos e permanentes)" },
          { id: "organizacao-tecidos-funcoes", name: "Organização dos tecidos e suas funções" },
        ],
      },
      {
        id: "genetica-conceitos-basicos",
        name: "Genética: Conceitos Básicos",
        topics: [
          { id: "experimentos-mendel", name: "Experimentos de Mendel" },
          { id: "primeira-lei-mendel", name: "1ª e 2ª Leis de Mendel" },
          { id: "dominancia-recessividade", name: "Dominância, recessividade, co-dominância e herança intermediária" },
          { id: "alelos-multiplos", name: "Alelos múltiplos" },
          { id: "heranca-ligada-sexo", name: "Herança ligada ao sexo" },
        ],
      },
      {
        id: "genetica-molecular",
        name: "Genética Molecular",
        topics: [
          { id: "estrutura-duplicacao-dna", name: "Estrutura e duplicação do DNA" },
          { id: "rna-sintese-proteica", name: "RNA e síntese proteica (transcrição e tradução)" },
          { id: "codigo-genetico", name: "Código genético" },
          { id: "mutacoes-genicas-cromossomicas", name: "Mutações gênicas e cromossômicas" },
          { id: "biotecnologia", name: "Biotecnologia (clonagem, transgênicos, terapia gênica, PCR)" },
        ],
      },
      {
        id: "evolucao-biologica",
        name: "Evolução Biológica",
        topics: [
          { id: "lamarckismo-darwinismo", name: "Lamarckismo e Darwinismo" },
          { id: "neodarwinismo-selecao-natural", name: "Neodarwinismo e seleção natural" },
          { id: "deriva-genetica-mutacoes", name: "Deriva genética e mutações" },
          { id: "isolamento-especiacao", name: "Isolamento reprodutivo e especiação" },
          { id: "evidencias-evolucao", name: "Evidências evolutivas (fósseis, órgãos homólogos, análogos e vestigiais)" },
        ],
      },
      {
        id: "microbiologia-virus",
        name: "Microbiologia e Vírus",
        topics: [
          { id: "estrutura-reproducao-virus", name: "Estrutura e reprodução dos vírus" },
          { id: "bacteriofagos", name: "Bacteriófagos" },
          { id: "principais-doencas-virais", name: "Principais doenças virais" },
          { id: "caracteristicas-bacterias", name: "Características gerais das bactérias, protozoários, fungos e algas" },
          { id: "importancia-ecologica-industrial", name: "Importância ecológica e industrial dos microrganismos" },
        ],
      },
      {
        id: "reino-monera",
        name: "Reino Monera (Bactérias e Cianobactérias)",
        topics: [
          { id: "estrutura-reproducao-nutricao", name: "Estrutura, reprodução e nutrição das bactérias" },
          { id: "doencas-bacterianas", name: "Doenças bacterianas" },
          { id: "importancia-ecologica-industrial-medica", name: "Importância ecológica, industrial e médica" },
        ],
      },
      {
        id: "reino-protista-fungi",
        name: "Reino Protista e Reino Fungi",
        topics: [
          { id: "protozoarios-algas", name: "Protozoários e algas: características gerais, reprodução e doenças" },
          { id: "fungos-estrutura-reproducao", name: "Fungos: estrutura, reprodução, decomposição, micorrizas e doenças fúngicas" },
        ],
      },
      {
        id: "reino-plantae",
        name: "Reino Plantae (Botânica)",
        topics: [
          { id: "classificacao-plantas", name: "Classificação das plantas (briófitas, pteridófitas, gimnospermas e angiospermas)" },
          { id: "tecidos-vegetais", name: "Tecidos vegetais" },
          { id: "fotossintese-flor-fruto-semente", name: "Fotossíntese; flor, fruto e semente" },
          { id: "reproducao-ciclo-reprodutivo", name: "Reprodução e ciclo reprodutivo vegetal" },
        ],
      },
      {
        id: "reino-animalia",
        name: "Reino Animalia (Zoologia)",
        topics: [
          { id: "classificacao-filos", name: "Classificação e principais filos: poríferos, cnidários, platelmintos, nematelmintos, moluscos, anelídeos, artrópodes e equinodermos" },
          { id: "vertebrados-peixes-anfibios", name: "Vertebrados (peixes, anfíbios, répteis, aves e mamíferos)" },
          { id: "caracteristicas-reproducao-fisiologia", name: "Características, reprodução e fisiologia geral" },
        ],
      },
      {
        id: "fisiologia-humana",
        name: "Fisiologia Humana",
        topics: [
          { id: "sistemas-corpo-humano", name: "Sistemas do corpo humano: digestório, respiratório, circulatório, excretor, nervoso, endócrino, tegumentar, reprodutor e imunológico" },
          { id: "funcionamento-principais-doencas", name: "Funcionamento e principais doenças" },
        ],
      },
      {
        id: "imunologia-saude",
        name: "Imunologia e Saúde",
        topics: [
          { id: "tipos-imunidade", name: "Tipos de imunidade (inata, adquirida, ativa e passiva)" },
          { id: "vacinas-soros", name: "Vacinas e soros" },
          { id: "respostas-imunes", name: "Respostas imunes" },
          { id: "doencas-infecciosas-parasitarias", name: "Doenças infecciosas e parasitárias" },
          { id: "importancia-vacinacao-saude-publica", name: "Importância da vacinação e da saúde pública" },
        ],
      },
      {
        id: "ecologia",
        name: "Ecologia",
        topics: [
          { id: "ecossistemas-fatores-bioticos-abioticos", name: "Ecossistemas e fatores bióticos e abióticos" },
          { id: "cadeias-teias-alimentares", name: "Cadeias e teias alimentares" },
          { id: "fluxo-energia-ciclos-biogeoquimicos", name: "Fluxo de energia e ciclos biogeoquímicos (água, carbono, nitrogênio e oxigênio)" },
          { id: "piramides-ecologicas", name: "Pirâmides ecológicas" },
          { id: "populacoes-comunidades", name: "Populações e comunidades" },
          { id: "sucessao-ecologica", name: "Sucessão ecológica" },
          { id: "biomas-brasileiros", name: "Biomas brasileiros" },
        ],
      },
      {
        id: "relacoes-ecologicas-impactos",
        name: "Relações Ecológicas e Impactos Ambientais",
        topics: [
          { id: "relacoes-intra-interespecificas", name: "Relações intra e interespecíficas (competição, mutualismo, parasitismo, etc.)" },
          { id: "impactos-ambientais", name: "Impactos ambientais (poluição, desmatamento, efeito estufa, chuva ácida, aquecimento global)" },
          { id: "conservacao-biodiversidade", name: "Conservação da biodiversidade e desenvolvimento sustentável" },
        ],
      },
      {
        id: "biotecnologia-genetica-aplicada",
        name: "Biotecnologia e Genética Aplicada",
        topics: [
          { id: "clonagem-dna-recombinante", name: "Clonagem, DNA recombinante, transgênicos, células-tronco, bioengenharia e ética na manipulação genética" },
        ],
      },
      {
        id: "educacao-ambiental-sustentabilidade",
        name: "Educação Ambiental e Sustentabilidade",
        topics: [
          { id: "conservacao-ecossistemas", name: "Conservação dos ecossistemas" },
          { id: "energias-renovaveis", name: "Energias renováveis" },
          { id: "descarte-residuos-reciclagem", name: "Descarte de resíduos e reciclagem" },
          { id: "importancia-sustentabilidade-cidadania", name: "Importância da sustentabilidade e cidadania ambiental" },
        ],
      },
    ],
  },
  {
    id: "historia",
    name: "História",
    contents: [
      {
        id: "antiguidade-oriental",
        name: "Antiguidade Oriental",
        topics: [
          { id: "civilizacoes-crescente-fertil", name: "Civilizações do Crescente Fértil (Mesopotâmia e Egito)" },
          { id: "organizacao-politica-social", name: "Organização política, social e econômica" },
          { id: "religiao-cultura", name: "Religião e cultura" },
          { id: "povos-hebreus-fenicios-persas", name: "Povos hebreus, fenícios e persas" },
        ],
      },
      {
        id: "antiguidade-classica",
        name: "Antiguidade Clássica",
        topics: [
          { id: "grecia-antiga", name: "Grécia Antiga: polis, democracia ateniense, cultura e filosofia" },
          { id: "roma-antiga", name: "Roma Antiga: monarquia, república e império" },
          { id: "cidadania-escravidao", name: "Cidadania, escravidão, expansão territorial e crise do império" },
        ],
      },
      {
        id: "idade-media-europeia",
        name: "Idade Média Europeia",
        topics: [
          { id: "queda-imperio-romano", name: "Queda do Império Romano" },
          { id: "feudalismo", name: "Feudalismo: economia, sociedade e política" },
          { id: "igreja-catolica-poder", name: "Igreja Católica e poder religioso" },
          { id: "cruzadas-renascimento-comercial", name: "Cruzadas e Renascimento Comercial e Urbano" },
          { id: "formacao-monarquias-nacionais", name: "Formação das monarquias nacionais" },
        ],
      },
      {
        id: "civilizacoes-pre-colombianas",
        name: "Civilizações Pré-Colombianas",
        topics: [
          { id: "astecas-maias-incas", name: "Astecas, Maias e Incas: organização política e religiosa" },
          { id: "cultura-conquistas", name: "Cultura e conquistas" },
          { id: "colonizacao-destruicao", name: "Colonização e destruição das civilizações indígenas" },
        ],
      },
      {
        id: "expansao-maritima-comercial",
        name: "Expansão Marítima e Comercial Europeia",
        topics: [
          { id: "motivacoes-economicas-politicas", name: "Motivações econômicas e políticas" },
          { id: "pioneirismo-portugues-espanhol", name: "Pioneirismo português e espanhol" },
          { id: "avancos-tecnicos", name: "Avanços técnicos" },
          { id: "tratado-tordesilhas", name: "Tratado de Tordesilhas" },
          { id: "consequencias-expansao", name: "Consequências da expansão ultramarina" },
        ],
      },
      {
        id: "renascimento-humanismo",
        name: "Renascimento e Humanismo",
        topics: [
          { id: "arte-ciencia-renascimento", name: "Arte e ciência no Renascimento" },
          { id: "principais-artistas-pensadores", name: "Principais artistas e pensadores" },
          { id: "transicao-teocentrismo-antropocentrismo", name: "Transição do teocentrismo para o antropocentrismo" },
          { id: "impactos-visao-mundo", name: "Impactos na visão de mundo moderna" },
        ],
      },
      {
        id: "reforma-contrarreforma",
        name: "Reforma e Contrarreforma Religiosa",
        topics: [
          { id: "contexto-crise-igreja", name: "Contexto da crise da Igreja Católica" },
          { id: "lutero-luteranismo", name: "Lutero e o Luteranismo" },
          { id: "calvino-calvinismo", name: "Calvino e o Calvinismo" },
          { id: "anglicanismo", name: "Anglicanismo" },
          { id: "inquisicao-concilio-trento", name: "Inquisição e Concílio de Trento" },
        ],
      },
      {
        id: "absolutismo-mercantilismo",
        name: "Absolutismo e Mercantilismo",
        topics: [
          { id: "formacao-estados-nacionais", name: "Formação dos Estados Nacionais" },
          { id: "caracteristicas-absolutismo", name: "Características do absolutismo europeu" },
          { id: "principais-monarquias", name: "Principais monarquias (França, Inglaterra e Portugal)" },
          { id: "teoria-direito-divino", name: "Teoria do direito divino" },
          { id: "politicas-mercantilistas", name: "Políticas mercantilistas" },
        ],
      },
      {
        id: "colonizacao-america",
        name: "Colonização da América",
        topics: [
          { id: "dominacao-espanhola-portuguesa", name: "Dominação espanhola e portuguesa" },
          { id: "sistemas-coloniais", name: "Sistemas coloniais (encomienda, mita, plantation)" },
          { id: "economia-acucareira", name: "Economia açucareira" },
          { id: "escravidao-indigena-africana", name: "Escravidão indígena e africana" },
          { id: "sociedade-colonial-administracao", name: "Sociedade colonial e administração metropolitana" },
        ],
      },
      {
        id: "brasil-colonia",
        name: "Brasil Colônia",
        topics: [
          { id: "capitanias-hereditarias-governo-geral", name: "Capitanias hereditárias e Governo-Geral" },
          { id: "ciclo-acucar-mineracao", name: "Ciclo do açúcar e mineração" },
          { id: "sociedade-escravocrata", name: "Sociedade escravocrata" },
          { id: "invasoes-estrangeiras", name: "Invasões estrangeiras" },
          { id: "movimentos-nativistas-emancipacionistas", name: "Movimentos nativistas e emancipacionistas" },
        ],
      },
      {
        id: "iluminismo-revolucoes-seculo-xviii",
        name: "Iluminismo e Revoluções do Século XVIII",
        topics: [
          { id: "pensamento-iluminista-contratualismo", name: "Pensamento iluminista e contratualismo" },
          { id: "revolucao-industrial", name: "Revolução Industrial" },
          { id: "revolucao-francesa", name: "Revolução Francesa" },
          { id: "independencia-eua", name: "Independência dos EUA" },
          { id: "consequencias-politicas-sociais", name: "Consequências políticas e sociais das revoluções burguesas" },
        ],
      },
      {
        id: "brasil-independente-primeiro-reinado",
        name: "Brasil Independente e Primeiro Reinado",
        topics: [
          { id: "proclamacao-independencia", name: "Proclamação da Independência" },
          { id: "constituicao-1824", name: "Constituição de 1824" },
          { id: "governo-d-pedro-i", name: "O governo de D. Pedro I" },
          { id: "crise-abdicacao", name: "Crise e abdicação" },
        ],
      },
      {
        id: "periodo-regencial-segundo-reinado",
        name: "Período Regencial e Segundo Reinado",
        topics: [
          { id: "regencias-revoltas-provinciais", name: "Regências e revoltas provinciais" },
          { id: "consolidacao-monarquia", name: "Consolidação da monarquia" },
          { id: "economia-cafeeira-industrializacao", name: "Economia cafeeira e industrialização incipiente" },
          { id: "imigracao-europeia", name: "Imigração europeia" },
          { id: "escravidao-movimento-abolicionista", name: "Escravidão e movimento abolicionista" },
          { id: "queda-imperio", name: "Queda do Império" },
        ],
      },
      {
        id: "republica-velha",
        name: "República Velha (1889–1930)",
        topics: [
          { id: "proclamacao-republica", name: "Proclamação da República" },
          { id: "constituicao-1891", name: "Constituição de 1891" },
          { id: "coronelismo-politica-governadores", name: "Coronelismo e política dos governadores" },
          { id: "revoltas-sociais-urbanas", name: "Revoltas sociais e urbanas" },
          { id: "tenentismo-crise-oligarquia", name: "Tenentismo e crise da oligarquia" },
        ],
      },
      {
        id: "era-vargas",
        name: "Era Vargas (1930–1945)",
        topics: [
          { id: "revolucao-1930-governo-provisorio", name: "Revolução de 1930 e governo provisório" },
          { id: "constituicao-1934", name: "Constituição de 1934" },
          { id: "estado-novo", name: "Estado Novo" },
          { id: "centralizacao-poder", name: "Centralização do poder" },
          { id: "leis-trabalhistas-nacionalismo", name: "Leis trabalhistas e nacionalismo econômico" },
        ],
      },
      {
        id: "brasil-contemporaneo",
        name: "Brasil Contemporâneo (1945–Atualidade)",
        topics: [
          { id: "redemocratizacao-1946", name: "Redemocratização de 1946" },
          { id: "governo-jk-desenvolvimentismo", name: "Governo JK e o desenvolvimentismo" },
          { id: "regime-militar-1964-1985", name: "Regime militar (1964–1985): censura, repressão e economia" },
          { id: "abertura-politica-constituicao-1988", name: "Abertura política e Constituição de 1988" },
          { id: "nova-republica-globalizacao", name: "Nova República, globalização e política recente" },
        ],
      },
      {
        id: "revolucoes-transformacoes-seculo-xix",
        name: "Revoluções e Transformações Mundiais (Século XIX)",
        topics: [
          { id: "revolucoes-1848", name: "Revoluções de 1848" },
          { id: "unificacoes-italia-alemanha", name: "Unificações da Itália e Alemanha" },
          { id: "imperialismo-neocolonialismo", name: "Imperialismo e neocolonialismo" },
          { id: "segunda-revolucao-industrial", name: "Segunda Revolução Industrial" },
          { id: "movimentos-operarios-socialistas", name: "Movimentos operários e socialistas" },
        ],
      },
      {
        id: "guerras-mundiais-entre-guerras",
        name: "Guerras Mundiais e Período Entre-Guerras",
        topics: [
          { id: "primeira-guerra-mundial", name: "Primeira Guerra Mundial: causas, eventos e consequências" },
          { id: "tratado-versalhes-crise", name: "Tratado de Versalhes e crise econômica" },
          { id: "regimes-totalitarios", name: "Regimes totalitários: fascismo, nazismo e stalinismo" },
          { id: "segunda-guerra-mundial-ordem-bipolar", name: "Segunda Guerra Mundial e a ordem bipolar" },
        ],
      },
      {
        id: "guerra-fria-nova-ordem",
        name: "Guerra Fria e Nova Ordem Mundial",
        topics: [
          { id: "bipolarizacao-eua-urss", name: "Bipolarização EUA x URSS" },
          { id: "corrida-armamentista-espacial", name: "Corrida armamentista e espacial" },
          { id: "conflitos-indiretos", name: "Conflitos indiretos (Coreia, Vietnã, Cuba, Afeganistão)" },
          { id: "queda-muro-berlim-globalizacao", name: "Queda do Muro de Berlim e globalização" },
          { id: "novas-potencias-mundiais", name: "Novas potências mundiais" },
        ],
      },
      {
        id: "historia-africa-oriente",
        name: "História da África e do Oriente",
        topics: [
          { id: "reinos-africanos-pre-coloniais", name: "Reinos africanos pré-coloniais" },
          { id: "escravidao-trafico-atlantico", name: "Escravidão e tráfico atlântico" },
          { id: "descolonizacao-africa-asia", name: "Descolonização da África e da Ásia" },
          { id: "apartheid-lutas-direitos-civis", name: "Apartheid e lutas por direitos civis" },
          { id: "oriente-medio-conflitos", name: "Oriente Médio e conflitos contemporâneos" },
        ],
      },
      {
        id: "historia-maranhao-brasil-regional",
        name: "História do Maranhão e do Brasil Regional",
        topics: [
          { id: "colonizacao-economia-maranhense", name: "Colonização e economia maranhense" },
          { id: "balaiada", name: "Balaiada" },
          { id: "ciclos-economicos-regionais", name: "Ciclos econômicos regionais" },
          { id: "cultura-religiosidade-formacao-social", name: "Cultura, religiosidade e formação social" },
          { id: "insercao-maranhao-contexto-nacional", name: "Inserção do Maranhão no contexto nacional" },
        ],
      },
    ],
  },
  {
    id: "geografia",
    name: "Geografia",
    contents: [
      {
        id: "introducao-geografia-cartografia",
        name: "Introdução à Geografia e Cartografia",
        topics: [
          { id: "conceito-importancia-geografia", name: "Conceito e importância da Geografia: paisagem, espaço, lugar, território e região" },
          { id: "escala-geografica", name: "Escala geográfica" },
          { id: "coordenadas-geograficas", name: "Coordenadas geográficas" },
          { id: "fusos-horarios", name: "Fusos horários" },
          { id: "projecoes-cartograficas", name: "Projeções cartográficas" },
          { id: "leitura-interpretacao-mapas", name: "Leitura e interpretação de mapas, gráficos e imagens" },
        ],
      },
      {
        id: "estrutura-terra-dinamica-interna",
        name: "Estrutura da Terra e Dinâmica Interna",
        topics: [
          { id: "composicao-interna-terra", name: "Composição interna da Terra (crosta, manto e núcleo)" },
          { id: "placas-tectonicas-deriva-continental", name: "Placas tectônicas e deriva continental" },
          { id: "terremotos-vulcanismo", name: "Terremotos, vulcanismo e formação de montanhas" },
          { id: "distribuicao-placas-riscos", name: "Distribuição das placas e riscos geológicos" },
        ],
      },
      {
        id: "relevo-terrestre-agentes",
        name: "Relevo Terrestre e Agentes Modeladores",
        topics: [
          { id: "agentes-internos-externos", name: "Agentes internos (tectonismo e vulcanismo) e externos (intemperismo e erosão)" },
          { id: "formas-relevo", name: "Formas de relevo (planaltos, planícies e depressões)" },
          { id: "tipos-solos-formacao", name: "Tipos de solos e sua formação" },
          { id: "erosao-desertificacao-manejo", name: "Erosão, desertificação e manejo sustentável" },
        ],
      },
      {
        id: "clima-atmosfera",
        name: "Clima e Atmosfera",
        topics: [
          { id: "estrutura-atmosfera", name: "Estrutura da atmosfera" },
          { id: "fatores-elementos-clima", name: "Fatores e elementos do clima (temperatura, pressão, ventos e umidade)" },
          { id: "tipos-clima-brasil-mundo", name: "Tipos de clima do Brasil e do mundo" },
          { id: "massas-ar-frentes", name: "Massas de ar e frentes" },
          { id: "fenomenos-climaticos", name: "Fenômenos climáticos (El Niño, La Niña)" },
          { id: "mudancas-climaticas-aquecimento", name: "Mudanças climáticas e aquecimento global" },
        ],
      },
      {
        id: "hidrografia-recursos-hidricos",
        name: "Hidrografia e Recursos Hídricos",
        topics: [
          { id: "ciclo-agua-tipos-rios", name: "Ciclo da água; tipos de rios e bacias hidrográficas" },
          { id: "principais-bacias-brasileiras", name: "Principais bacias brasileiras (Amazônica, São Francisco, Tocantins-Araguaia, Paraná e Paraguai)" },
          { id: "aguas-subterraneas-aquiferos", name: "Águas subterrâneas e aquíferos" },
          { id: "escassez-poluicao-hidrica", name: "Escassez e poluição hídrica" },
          { id: "gestao-recursos-hidricos", name: "Gestão dos recursos hídricos" },
        ],
      },
      {
        id: "vegetacao-biomas",
        name: "Vegetação e Biomas",
        topics: [
          { id: "dominios-morfoclimaticos-biomas", name: "Domínios morfoclimáticos e biomas brasileiros (Amazônia, Cerrado, Caatinga, Mata Atlântica, Pampa e Pantanal)" },
          { id: "vegetacoes-mundiais", name: "Vegetações mundiais" },
          { id: "devastacao-ambiental-conservacao", name: "Devastação ambiental e conservação da biodiversidade" },
        ],
      },
      {
        id: "populacao-dinamica-demografica",
        name: "População e Dinâmica Demográfica",
        topics: [
          { id: "crescimento-transicao-demografica", name: "Crescimento populacional e transição demográfica" },
          { id: "distribuicao-densidade", name: "Distribuição e densidade" },
          { id: "natalidade-mortalidade-migracoes", name: "Natalidade, mortalidade e migrações" },
          { id: "envelhecimento-populacional", name: "Envelhecimento populacional" },
          { id: "indicadores-sociais-piramides", name: "Indicadores sociais e pirâmides etárias" },
          { id: "urbanizacao-problemas-urbanos", name: "Urbanização e problemas urbanos" },
        ],
      },
      {
        id: "urbanizacao-organizacao-espaco",
        name: "Urbanização e Organização do Espaço Urbano",
        topics: [
          { id: "processo-urbanizacao", name: "Processo de urbanização mundial e brasileira" },
          { id: "metropoles-conurbacoes-regioes", name: "Metrópoles, conurbações e regiões metropolitanas" },
          { id: "favelizacao-segregacao-socioespacial", name: "Favelização e segregação socioespacial" },
          { id: "mobilidade-urbana-politicas", name: "Mobilidade urbana e políticas públicas" },
          { id: "impactos-ambientais-urbanos", name: "Impactos ambientais urbanos" },
        ],
      },
      {
        id: "economia-mundial-globalizacao",
        name: "Economia Mundial e Globalização",
        topics: [
          { id: "divisao-internacional-trabalho", name: "Divisão internacional do trabalho" },
          { id: "blocos-economicos", name: "Blocos econômicos (UE, Mercosul, Nafta, ASEAN)" },
          { id: "fluxos-capital-comercio-tecnologia", name: "Fluxos de capital, comércio e tecnologia" },
          { id: "globalizacao-interdependencia", name: "Globalização e interdependência econômica" },
          { id: "transnacionais-financeirizacao", name: "Transnacionais e financeirização da economia" },
        ],
      },
      {
        id: "economia-brasileira-setores",
        name: "Economia Brasileira e Setores Produtivos",
        topics: [
          { id: "estrutura-produtiva-setores", name: "Estrutura produtiva (setores primário, secundário e terciário)" },
          { id: "industrializacao-brasileira", name: "Industrialização brasileira" },
          { id: "reestruturacao-produtiva-terceirizacao", name: "Reestruturação produtiva e terceirização" },
          { id: "comercio-exterior-agronegocio", name: "Comércio exterior e agronegócio" },
          { id: "desemprego-informalidade-economia-digital", name: "Desemprego, informalidade e economia digital" },
        ],
      },
      {
        id: "agricultura-questao-agraria",
        name: "Agricultura e Questão Agrária",
        topics: [
          { id: "estrutura-fundiaria-concentracao", name: "Estrutura fundiária e concentração de terras" },
          { id: "reforma-agraria-movimentos", name: "Reforma agrária e movimentos sociais" },
          { id: "agricultura-familiar-agronegocio", name: "Agricultura familiar e agronegócio" },
          { id: "modernizacao-agricola", name: "Modernização agrícola" },
          { id: "impactos-ambientais-producao", name: "Impactos ambientais da produção" },
          { id: "commodities-exportacoes", name: "Commodities e exportações" },
        ],
      },
      {
        id: "fontes-energia-matriz",
        name: "Fontes de Energia e Matriz Energética",
        topics: [
          { id: "tipos-energia", name: "Tipos de energia (hidráulica, térmica, eólica, solar, nuclear e biomassa)" },
          { id: "matriz-energetica-brasil-mundo", name: "Matriz energética brasileira e mundial" },
          { id: "impactos-ambientais-transicao", name: "Impactos ambientais e transição energética" },
          { id: "energias-renovaveis-nao-renovaveis", name: "Energias renováveis e não renováveis" },
          { id: "crise-energetica-sustentabilidade", name: "Crise energética e sustentabilidade" },
        ],
      },
      {
        id: "geopolitica-relacoes-internacionais",
        name: "Geopolítica e Relações Internacionais",
        topics: [
          { id: "conceitos-poder-territorio", name: "Conceitos de poder e território" },
          { id: "guerra-fria-nova-ordem", name: "Guerra Fria e Nova Ordem Mundial" },
          { id: "globalizacao-blocos-regionais", name: "Globalização e blocos regionais" },
          { id: "conflitos-territoriais-religiosos", name: "Conflitos territoriais e religiosos" },
          { id: "imperialismo-neocolonialismo", name: "Imperialismo e neocolonialismo" },
          { id: "papel-brasil-geopolitica", name: "Papel do Brasil na geopolítica mundial" },
        ],
      },
      {
        id: "regioes-regionalizacoes-mundo",
        name: "Regiões e Regionalizações do Espaço Mundial",
        topics: [
          { id: "criterios-regionalizacao", name: "Critérios de regionalização (físicos, econômicos e culturais)" },
          { id: "america-europa-africa-asia-oceania", name: "América, Europa, África, Ásia e Oceania" },
          { id: "caracteristicas-socioeconomicas-culturais", name: "Características socioeconômicas e culturais dos continentes" },
          { id: "paises-desenvolvidos-subdesenvolvidos", name: "Países desenvolvidos e subdesenvolvidos" },
          { id: "potencias-emergentes", name: "Potências emergentes" },
        ],
      },
      {
        id: "geografia-brasil-formacao-estrutura",
        name: "Geografia do Brasil: Formação e Estrutura",
        topics: [
          { id: "formacao-territorial-brasil", name: "Formação territorial brasileira" },
          { id: "divisao-politico-administrativa", name: "Divisão político-administrativa" },
          { id: "regioes-geoeconomicas", name: "Regiões geoeconômicas" },
          { id: "integracao-nacional", name: "Integração nacional" },
          { id: "fronteiras-regionalizacao-ibge", name: "Fronteiras e regionalização segundo o IBGE" },
        ],
      },
      {
        id: "industria-infraestrutura-brasil",
        name: "Indústria e Infraestrutura no Brasil",
        topics: [
          { id: "processo-industrializacao", name: "Processo de industrialização" },
          { id: "polos-industriais-parques-tecnologicos", name: "Polos industriais e parques tecnológicos" },
          { id: "infraestrutura-transporte-logistica", name: "Infraestrutura de transporte e logística (rodovias, ferrovias, portos e hidrovias)" },
          { id: "politicas-desenvolvimento-regional", name: "Políticas de desenvolvimento regional" },
        ],
      },
      {
        id: "meio-ambiente-sustentabilidade",
        name: "Meio Ambiente e Sustentabilidade",
        topics: [
          { id: "recursos-naturais-renovaveis-nao", name: "Recursos naturais renováveis e não renováveis" },
          { id: "poluicao-ar-agua-solo", name: "Poluição do ar, da água e do solo" },
          { id: "desmatamento-queimadas", name: "Desmatamento e queimadas" },
          { id: "mudancas-climaticas-preservacao", name: "Mudanças climáticas e preservação ambiental" },
          { id: "unidades-conservacao-leis", name: "Unidades de conservação e leis ambientais" },
        ],
      },
      {
        id: "geografia-populacao-trabalho",
        name: "Geografia da População e do Trabalho",
        topics: [
          { id: "distribuicao-populacao-brasileira", name: "Distribuição da população brasileira" },
          { id: "movimentos-migratorios-internos-externos", name: "Movimentos migratórios internos e externos" },
          { id: "exodo-rural-metropolizacao", name: "Êxodo rural e metropolização" },
          { id: "mercado-trabalho-desigualdades", name: "Mercado de trabalho, desigualdades regionais e sociais" },
          { id: "informalidade-economia-criativa", name: "Informalidade e economia criativa" },
        ],
      },
      {
        id: "geografia-politica-economica-maranhao",
        name: "Geografia Política e Econômica do Maranhão (ou região local)",
        topics: [
          { id: "formacao-territorial-economia-regional", name: "Formação territorial e economia regional" },
          { id: "atividades-produtivas", name: "Atividades produtivas (agronegócio, extrativismo e serviços)" },
          { id: "infraestrutura-urbanizacao", name: "Infraestrutura e urbanização" },
          { id: "desigualdades-regionais-desafios", name: "Desigualdades regionais e desafios ambientais" },
          { id: "insercao-maranhao-economia-nacional", name: "Inserção do Maranhão na economia nacional" },
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
