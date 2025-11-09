import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Eye, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { subjects } from "@/data/subjects";
import { QuestionViewModal } from "@/components/QuestionViewModal";
import { QuestionEditModal } from "@/components/QuestionEditModal";

interface Question {
  id: number;
  text: string;
  subject: string;
  subjectId: string;
  content: string;
  contentId: string;
  topic: string;
  topicId: string;
  exam: string;
  difficulty: string;
  year: number;
  alternatives?: {
    a: string;
    b: string;
    c: string;
    d: string;
    e: string;
  };
  correctAnswer?: string;
  explanation?: string;
}

const Questions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>();
  const [selectedContent, setSelectedContent] = useState<string | undefined>();
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>();
  const [selectedExam, setSelectedExam] = useState<string | undefined>();
  const [selectedYear, setSelectedYear] = useState<string | undefined>();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | undefined>();
  const [viewQuestion, setViewQuestion] = useState<Question | null>(null);
  const [editQuestion, setEditQuestion] = useState<Question | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const currentSubject = subjects.find(s => s.id === selectedSubject);
  const currentContent = currentSubject?.contents.find(c => c.id === selectedContent);

  // Mock data - será substituído por dados reais do banco
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      text: "Calcule a integral definida de f(x) = x² + 2x no intervalo [0, 2]",
      subject: "Matemática",
      subjectId: "matematica",
      content: "Cálculo",
      contentId: "calculo",
      topic: "Integrais",
      topicId: "integrais",
      exam: "ENEM",
      difficulty: "Média",
      year: 2023,
      alternatives: {
        a: "10/3",
        b: "16/3",
        c: "20/3",
        d: "8/3",
        e: "12/3"
      },
      correctAnswer: "b",
      explanation: "Para resolver esta integral definida, primeiro encontramos a primitiva de f(x) = x² + 2x, que é F(x) = x³/3 + x². Aplicando o Teorema Fundamental do Cálculo, calculamos F(2) - F(0) = (8/3 + 4) - 0 = 16/3."
    },
    {
      id: 2,
      text: "Analise o trecho literário e identifique as características do Modernismo brasileiro",
      subject: "Literatura",
      subjectId: "literatura",
      content: "Movimentos Literários",
      contentId: "movimentos",
      topic: "Modernismo",
      topicId: "modernismo",
      exam: "FUVEST",
      difficulty: "Difícil",
      year: 2023,
      alternatives: {
        a: "Linguagem rebuscada e vocabulário erudito",
        b: "Ruptura com padrões, linguagem coloquial e temática brasileira",
        c: "Apego às formas clássicas e métricas rígidas",
        d: "Valorização do passado colonial",
        e: "Formalismo excessivo e distanciamento da realidade"
      },
      correctAnswer: "b",
      explanation: "O Modernismo brasileiro se caracteriza pela ruptura com os padrões estéticos anteriores, uso de linguagem coloquial, valorização da cultura e temática nacional, liberdade formal e experimentação estética."
    },
    {
      id: 3,
      text: "Determine a aceleração de um corpo em movimento retilíneo uniformemente variado",
      subject: "Física",
      subjectId: "fisica",
      content: "Mecânica",
      contentId: "mecanica",
      topic: "Cinemática",
      topicId: "cinematica",
      exam: "UNICAMP",
      difficulty: "Fácil",
      year: 2023,
      alternatives: {
        a: "2 m/s²",
        b: "4 m/s²",
        c: "6 m/s²",
        d: "8 m/s²",
        e: "10 m/s²"
      },
      correctAnswer: "a",
      explanation: "Em movimento retilíneo uniformemente variado (MRUV), a aceleração é constante. Utilizando a equação v = v₀ + at, onde v é a velocidade final, v₀ é a velocidade inicial e t é o tempo, podemos calcular a aceleração."
    },
    {
      id: 4,
      text: "Calcule o pH de uma solução ácida com concentração de H+ igual a 10⁻³",
      subject: "Química",
      subjectId: "quimica",
      content: "Físico-Química",
      contentId: "fisico-quimica",
      topic: "Soluções",
      topicId: "solucoes",
      exam: "ENEM",
      difficulty: "Média",
      year: 2023,
      alternatives: {
        a: "pH = 1",
        b: "pH = 2",
        c: "pH = 3",
        d: "pH = 4",
        e: "pH = 5"
      },
      correctAnswer: "c",
      explanation: "O pH é calculado pela fórmula pH = -log[H+]. Substituindo [H+] = 10⁻³, temos pH = -log(10⁻³) = 3."
    },
    {
      id: 5,
      text: "Explique o processo de fotossíntese e sua importância para os seres vivos",
      subject: "Biologia",
      subjectId: "biologia",
      content: "Fisiologia",
      contentId: "fisiologia",
      topic: "Fisiologia Vegetal",
      topicId: "vegetal",
      exam: "ENEM",
      difficulty: "Fácil",
      year: 2024,
      alternatives: {
        a: "Processo de respiração celular das plantas",
        b: "Conversão de luz solar em energia química através de clorofila",
        c: "Absorção de nutrientes do solo pelas raízes",
        d: "Reprodução assexuada das plantas",
        e: "Transpiração das folhas"
      },
      correctAnswer: "b",
      explanation: "A fotossíntese é o processo pelo qual as plantas convertem luz solar em energia química (glicose) usando clorofila. É fundamental pois produz oxigênio e é a base da cadeia alimentar."
    },
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil":
        return "bg-success/10 text-success border-success/20";
      case "Média":
        return "bg-accent/10 text-accent border-accent/20";
      case "Difícil":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Filtragem das questões
  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = question.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !selectedSubject || question.subjectId === selectedSubject;
    const matchesContent = !selectedContent || question.contentId === selectedContent;
    const matchesTopic = !selectedTopic || question.topicId === selectedTopic;
    const matchesExam = !selectedExam || question.exam === selectedExam;
    const matchesYear = !selectedYear || question.year.toString() === selectedYear;
    const matchesDifficulty = !selectedDifficulty || question.difficulty === selectedDifficulty;

    return matchesSearch && matchesSubject && matchesContent && matchesTopic && matchesExam && matchesYear && matchesDifficulty;
  });

  const hasActiveFilters = selectedSubject || selectedContent || selectedTopic || selectedExam || selectedYear || selectedDifficulty;

  const clearFilters = () => {
    setSelectedSubject(undefined);
    setSelectedContent(undefined);
    setSelectedTopic(undefined);
    setSelectedExam(undefined);
    setSelectedYear(undefined);
    setSelectedDifficulty(undefined);
    setSearchTerm("");
  };

  const handleSaveQuestion = (updatedQuestion: Question) => {
    setQuestions(questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
  };

  const handleViewQuestion = (question: Question) => {
    setViewQuestion(question);
    setIsViewModalOpen(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditQuestion(question);
    setIsEditModalOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Questões</h2>
          <p className="text-muted-foreground">Visualize e gerencie todas as questões do banco</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar questões..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Select 
                    value={selectedSubject} 
                    onValueChange={(value) => {
                      setSelectedSubject(value);
                      setSelectedContent(undefined);
                      setSelectedTopic(undefined);
                    }}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Matéria" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select 
                    value={selectedContent} 
                    onValueChange={(value) => {
                      setSelectedContent(value);
                      setSelectedTopic(undefined);
                    }}
                    disabled={!selectedSubject}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Conteúdo" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentSubject?.contents.map(content => (
                        <SelectItem key={content.id} value={content.id}>
                          {content.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select 
                    value={selectedTopic} 
                    onValueChange={setSelectedTopic}
                    disabled={!selectedContent}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Tópico" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentContent?.topics.map(topic => (
                        <SelectItem key={topic.id} value={topic.id}>
                          {topic.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedExam} onValueChange={setSelectedExam}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Vestibular" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ENEM">ENEM</SelectItem>
                      <SelectItem value="FUVEST">FUVEST</SelectItem>
                      <SelectItem value="UNICAMP">UNICAMP</SelectItem>
                      <SelectItem value="UNESP">UNESP</SelectItem>
                      <SelectItem value="UERJ">UERJ</SelectItem>
                      <SelectItem value="UFMG">UFMG</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Ano" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2020">2020</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Dificuldade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fácil">Fácil</SelectItem>
                      <SelectItem value="Média">Média</SelectItem>
                      <SelectItem value="Difícil">Difícil</SelectItem>
                    </SelectContent>
                  </Select>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="icon" onClick={clearFilters}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              {hasActiveFilters && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{filteredQuestions.length} questões encontradas</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Enunciado</TableHead>
                  <TableHead className="w-32">Matéria</TableHead>
                  <TableHead className="w-32">Conteúdo</TableHead>
                  <TableHead className="w-32">Tópico</TableHead>
                  <TableHead className="w-28">Vestibular</TableHead>
                  <TableHead className="w-20">Ano</TableHead>
                  <TableHead className="w-28">Dificuldade</TableHead>
                  <TableHead className="w-20">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuestions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      Nenhuma questão encontrada com os filtros selecionados.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQuestions.map((question) => (
                    <TableRow key={question.id}>
                      <TableCell className="font-medium">{question.id}</TableCell>
                      <TableCell>
                        <p className="line-clamp-2 text-sm">{question.text}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                          {question.subject}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{question.content}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{question.topic}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-secondary">
                          {question.exam}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{question.year}</TableCell>
                      <TableCell>
                        <Badge className={getDifficultyColor(question.difficulty)}>
                          {question.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleViewQuestion(question)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <QuestionViewModal 
          question={viewQuestion}
          open={isViewModalOpen}
          onOpenChange={setIsViewModalOpen}
          onEdit={handleEditQuestion}
        />

        <QuestionEditModal 
          question={editQuestion}
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSave={handleSaveQuestion}
        />
      </div>
    </Layout>
  );
};

export default Questions;
