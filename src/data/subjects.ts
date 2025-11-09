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
        id: "sintaxe",
        name: "Sintaxe",
        topics: [
          { id: "periodo-simples", name: "Período Simples" },
          { id: "periodo-composto", name: "Período Composto" },
          { id: "concordancia", name: "Concordância" },
          { id: "regencia", name: "Regência" },
          { id: "crase", name: "Crase" },
        ],
      },
      {
        id: "morfologia",
        name: "Morfologia",
        topics: [
          { id: "classes-palavras", name: "Classes de Palavras" },
          { id: "verbos", name: "Verbos" },
          { id: "substantivos", name: "Substantivos" },
          { id: "adjetivos", name: "Adjetivos" },
          { id: "pronomes", name: "Pronomes" },
        ],
      },
      {
        id: "pontuacao",
        name: "Pontuação",
        topics: [
          { id: "virgula", name: "Vírgula" },
          { id: "ponto-virgula", name: "Ponto e Vírgula" },
          { id: "dois-pontos", name: "Dois Pontos" },
        ],
      },
      {
        id: "ortografia",
        name: "Ortografia",
        topics: [
          { id: "acentuacao", name: "Acentuação" },
          { id: "hifen", name: "Hífen" },
          { id: "homônimos", name: "Homônimos e Parônimos" },
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
  {
    id: "redacao",
    name: "Redação",
    contents: [
      {
        id: "dissertativa",
        name: "Dissertação Argumentativa",
        topics: [
          { id: "estrutura", name: "Estrutura do Texto" },
          { id: "argumentacao", name: "Argumentação" },
          { id: "proposta", name: "Proposta de Intervenção" },
        ],
      },
      {
        id: "competencias",
        name: "Competências",
        topics: [
          { id: "norma-culta", name: "Norma Culta" },
          { id: "coesao", name: "Coesão e Coerência" },
        ],
      },
    ],
  },
];
