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

const Questions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>();
  const [selectedExam, setSelectedExam] = useState<string | undefined>();
  const [selectedYear, setSelectedYear] = useState<string | undefined>();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | undefined>();

  // Mock data - será substituído por dados reais do banco
  const questions = [
    {
      id: 1,
      text: "Calcule a integral definida de f(x) = x² + 2x no intervalo [0, 2]",
      subject: "Matemática",
      topic: "Cálculo Integral",
      exam: "ENEM",
      difficulty: "Média",
      year: 2023,
    },
    {
      id: 2,
      text: "Analise o trecho literário e identifique as características do Modernismo brasileiro",
      subject: "Literatura",
      topic: "Modernismo",
      exam: "FUVEST",
      difficulty: "Difícil",
      year: 2023,
    },
    {
      id: 3,
      text: "Determine a aceleração de um corpo em movimento retilíneo uniformemente variado",
      subject: "Física",
      topic: "Cinemática",
      exam: "UNICAMP",
      difficulty: "Fácil",
      year: 2023,
    },
    {
      id: 4,
      text: "Calcule o pH de uma solução ácida com concentração de H+ igual a 10⁻³",
      subject: "Química",
      topic: "pH e pOH",
      exam: "ENEM",
      difficulty: "Média",
      year: 2023,
    },
    {
      id: 5,
      text: "Explique o processo de fotossíntese e sua importância para os seres vivos",
      subject: "Biologia",
      topic: "Fisiologia Vegetal",
      exam: "ENEM",
      difficulty: "Fácil",
      year: 2024,
    },
  ];

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
    const matchesSubject = !selectedSubject || question.subject === selectedSubject;
    const matchesExam = !selectedExam || question.exam === selectedExam;
    const matchesYear = !selectedYear || question.year.toString() === selectedYear;
    const matchesDifficulty = !selectedDifficulty || question.difficulty === selectedDifficulty;

    return matchesSearch && matchesSubject && matchesExam && matchesYear && matchesDifficulty;
  });

  const hasActiveFilters = selectedSubject || selectedExam || selectedYear || selectedDifficulty;

  const clearFilters = () => {
    setSelectedSubject(undefined);
    setSelectedExam(undefined);
    setSelectedYear(undefined);
    setSelectedDifficulty(undefined);
    setSearchTerm("");
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
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Matéria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Matemática">Matemática</SelectItem>
                      <SelectItem value="Português">Português</SelectItem>
                      <SelectItem value="Literatura">Literatura</SelectItem>
                      <SelectItem value="Física">Física</SelectItem>
                      <SelectItem value="Química">Química</SelectItem>
                      <SelectItem value="Biologia">Biologia</SelectItem>
                      <SelectItem value="História">História</SelectItem>
                      <SelectItem value="Geografia">Geografia</SelectItem>
                      <SelectItem value="Filosofia">Filosofia</SelectItem>
                      <SelectItem value="Sociologia">Sociologia</SelectItem>
                      <SelectItem value="Inglês">Inglês</SelectItem>
                      <SelectItem value="Espanhol">Espanhol</SelectItem>
                      <SelectItem value="Redação">Redação</SelectItem>
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
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
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
                      <Button variant="ghost" size="icon">
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
      </div>
    </Layout>
  );
};

export default Questions;
