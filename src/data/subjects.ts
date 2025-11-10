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
        id: "algebra",
        name: "Álgebra",
        topics: [
          { id: "equacoes", name: "Equações" },
          { id: "funcoes", name: "Funções" },
          { id: "progressoes", name: "Progressões" },
          { id: "logaritmos", name: "Logaritmos" },
          { id: "matrizes", name: "Matrizes e Determinantes" },
        ],
      },
      {
        id: "geometria",
        name: "Geometria",
        topics: [
          { id: "plana", name: "Geometria Plana" },
          { id: "espacial", name: "Geometria Espacial" },
          { id: "analitica", name: "Geometria Analítica" },
          { id: "trigonometria", name: "Trigonometria" },
        ],
      },
      {
        id: "calculo",
        name: "Cálculo",
        topics: [
          { id: "limites", name: "Limites" },
          { id: "derivadas", name: "Derivadas" },
          { id: "integrais", name: "Integrais" },
        ],
      },
      {
        id: "estatistica",
        name: "Estatística e Probabilidade",
        topics: [
          { id: "analise-dados", name: "Análise de Dados" },
          { id: "probabilidade", name: "Probabilidade" },
          { id: "combinatoria", name: "Combinatória" },
        ],
      },
    ],
  },
  {
    id: "interpretacao-textual",
    name: "Interpretação Textual",
    contents: [
      {
        id: "compreensao",
        name: "Compreensão Textual",
        topics: [
          { id: "ideia-central", name: "Ideia Central" },
          { id: "argumentacao", name: "Argumentação" },
          { id: "inferencia", name: "Inferência" },
        ],
      },
      {
        id: "generos",
        name: "Gêneros Textuais",
        topics: [
          { id: "narrativo", name: "Narrativo" },
          { id: "dissertativo", name: "Dissertativo" },
          { id: "descritivo", name: "Descritivo" },
          { id: "injuntivo", name: "Injuntivo" },
        ],
      },
      {
        id: "linguagem",
        name: "Linguagem e Sentido",
        topics: [
          { id: "figuras", name: "Figuras de Linguagem" },
          { id: "conotacao", name: "Conotação e Denotação" },
          { id: "ambiguidade", name: "Ambiguidade" },
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
        id: "movimentos",
        name: "Movimentos Literários",
        topics: [
          { id: "barroco", name: "Barroco" },
          { id: "arcadismo", name: "Arcadismo" },
          { id: "romantismo", name: "Romantismo" },
          { id: "realismo", name: "Realismo/Naturalismo" },
          { id: "parnasianismo", name: "Parnasianismo" },
          { id: "simbolismo", name: "Simbolismo" },
          { id: "modernismo", name: "Modernismo" },
          { id: "contemporaneo", name: "Contemporâneo" },
        ],
      },
      {
        id: "analise",
        name: "Análise Literária",
        topics: [
          { id: "narrativa", name: "Narrativa" },
          { id: "poesia", name: "Poesia" },
          { id: "figuras", name: "Figuras de Linguagem" },
        ],
      },
    ],
  },
  {
    id: "fisica",
    name: "Física",
    contents: [
      {
        id: "mecanica",
        name: "Mecânica",
        topics: [
          { id: "cinematica", name: "Cinemática" },
          { id: "dinamica", name: "Dinâmica" },
          { id: "estatica", name: "Estática" },
          { id: "hidrostatica", name: "Hidrostática" },
        ],
      },
      {
        id: "termodinamica",
        name: "Termodinâmica",
        topics: [
          { id: "temperatura", name: "Temperatura e Calor" },
          { id: "leis", name: "Leis da Termodinâmica" },
          { id: "gases", name: "Gases Ideais" },
        ],
      },
      {
        id: "eletromagnetismo",
        name: "Eletromagnetismo",
        topics: [
          { id: "eletrostatica", name: "Eletrostática" },
          { id: "eletrodinamica", name: "Eletrodinâmica" },
          { id: "magnetismo", name: "Magnetismo" },
        ],
      },
      {
        id: "ondulatoria",
        name: "Ondulatória e Óptica",
        topics: [
          { id: "ondas", name: "Ondas" },
          { id: "optica", name: "Óptica Geométrica" },
        ],
      },
    ],
  },
  {
    id: "quimica",
    name: "Química",
    contents: [
      {
        id: "geral",
        name: "Química Geral",
        topics: [
          { id: "atomica", name: "Estrutura Atômica" },
          { id: "tabela", name: "Tabela Periódica" },
          { id: "ligacoes", name: "Ligações Químicas" },
        ],
      },
      {
        id: "fisico-quimica",
        name: "Físico-Química",
        topics: [
          { id: "solucoes", name: "Soluções" },
          { id: "termoquimica", name: "Termoquímica" },
          { id: "cinetica", name: "Cinética Química" },
          { id: "equilibrio", name: "Equilíbrio Químico" },
          { id: "eletroquimica", name: "Eletroquímica" },
        ],
      },
      {
        id: "organica",
        name: "Química Orgânica",
        topics: [
          { id: "funcoes", name: "Funções Orgânicas" },
          { id: "isomeria", name: "Isomeria" },
          { id: "reacoes", name: "Reações Orgânicas" },
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
