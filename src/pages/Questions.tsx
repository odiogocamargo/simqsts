import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, X, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
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
import { QuestionViewModal } from "@/components/QuestionViewModal";
import { QuestionEditModal } from "@/components/QuestionEditModal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSubjects, useContents, useTopics, useExams } from "@/hooks/useSubjects";

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

  const { data: subjects = [] } = useSubjects();
  const { data: contents = [] } = useContents(selectedSubject);
  const { data: topics = [] } = useTopics(selectedContent);
  const { data: exams = [] } = useExams();

  // Buscar questões do banco de dados
  const { data: questions = [], refetch } = useQuery({
    queryKey: ['questions', selectedSubject, selectedContent, selectedTopic, selectedExam, selectedYear, selectedDifficulty],
    queryFn: async () => {
      let query = supabase
        .from('questions')
        .select(`
          id,
          statement,
          year,
          question_type,
          option_a,
          option_b,
          option_c,
          option_d,
          option_e,
          correct_answer,
          explanation,
          difficulty,
          subjects(id, name),
          contents(id, name),
          exams(id, name)
        `)
        .order('created_at', { ascending: false });

      if (selectedSubject) {
        query = query.eq('subject_id', selectedSubject);
      }
      if (selectedContent) {
        query = query.eq('content_id', selectedContent);
      }
      if (selectedExam) {
        query = query.eq('exam_id', selectedExam);
      }
      if (selectedYear) {
        query = query.eq('year', parseInt(selectedYear));
      }
      if (selectedDifficulty) {
        query = query.eq('difficulty', selectedDifficulty);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching questions:', error);
        return [];
      }

      return (data || []).map((q: any) => ({
        id: q.id,
        text: q.statement,
        subject: q.subjects?.name || 'Desconhecida',
        subjectId: q.subjects?.id || '',
        content: q.contents?.name || 'Desconhecido',
        contentId: q.contents?.id || '',
        topic: '', // Buscar tópicos separadamente se necessário
        topicId: '',
        exam: q.exams?.name || 'Desconhecido',
        difficulty: q.difficulty || 'medio',
        year: q.year,
        alternatives: q.question_type === 'multipla_escolha' ? {
          a: q.option_a || '',
          b: q.option_b || '',
          c: q.option_c || '',
          d: q.option_d || '',
          e: q.option_e || '',
        } : undefined,
        correctAnswer: q.correct_answer,
        explanation: q.explanation,
      }));
    },
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "facil":
      case "fácil":
        return "bg-success/10 text-success border-success/20";
      case "medio":
      case "média":
        return "bg-accent/10 text-accent border-accent/20";
      case "dificil":
      case "difícil":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatDifficulty = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "facil": return "Fácil";
      case "medio": return "Média";
      case "dificil": return "Difícil";
      default: return difficulty;
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

  const handleSaveQuestion = async (updatedQuestion: Question) => {
    // Atualizar questão no banco e recarregar
    await refetch();
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Questões</h2>
            <p className="text-muted-foreground">Visualize e gerencie todas as questões do banco</p>
          </div>
          <Link to="/add-question">
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Adicionar Questão
            </Button>
          </Link>
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
                      {contents.map(content => (
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
                      {topics.map(topic => (
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
                      {exams.map((exam) => (
                        <SelectItem key={exam.id} value={exam.id}>
                          {exam.name}
                        </SelectItem>
                      ))}
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
                      <SelectItem value="facil">Fácil</SelectItem>
                      <SelectItem value="medio">Média</SelectItem>
                      <SelectItem value="dificil">Difícil</SelectItem>
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">#</TableHead>
                    <TableHead className="min-w-[300px] max-w-[400px]">Enunciado</TableHead>
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
                        <TableCell className="min-w-[300px] max-w-[400px]">
                          <p className="line-clamp-2 text-sm break-words">{question.text}</p>
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
                          {formatDifficulty(question.difficulty)}
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
            </div>
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
