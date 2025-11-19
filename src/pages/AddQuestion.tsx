import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { RichTextEditor } from "@/components/RichTextEditor";
import { useSubjects, useContents, useTopics, useExams } from "@/hooks/useSubjects";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const AddQuestion = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedContent, setSelectedContent] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  const [statement, setStatement] = useState<string>("");
  const [alternatives, setAlternatives] = useState<Record<string, string>>({
    A: "",
    B: "",
    C: "",
    D: "",
    E: "",
  });
  const [explanation, setExplanation] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: subjects = [] } = useSubjects();
  const { data: contents = [] } = useContents(selectedSubject);
  const { data: topics = [] } = useTopics(selectedContent);
  const { data: exams = [] } = useExams();
  
  const years = Array.from({ length: 26 }, (_, i) => 2026 - i);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Você precisa estar autenticado para adicionar questões.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("questions").insert({
        statement,
        subject_id: selectedSubject,
        content_id: selectedContent,
        exam_id: selectedExam,
        year: parseInt(selectedYear),
        difficulty: selectedDifficulty,
        option_a: alternatives.A,
        option_b: alternatives.B,
        option_c: alternatives.C,
        option_d: alternatives.D,
        option_e: alternatives.E,
        correct_answer: correctAnswer,
        explanation: explanation || null,
        created_by: user.id,
      });

      if (error) throw error;

      // Inserir o tópico da questão
      if (selectedTopic) {
        const { data: questionData } = await supabase
          .from("questions")
          .select("id")
          .eq("created_by", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (questionData) {
          await supabase.from("question_topics").insert({
            question_id: questionData.id,
            topic_id: selectedTopic,
          });
        }
      }

      toast({
        title: "Questão adicionada!",
        description: "A questão foi cadastrada com sucesso no banco.",
      });

      // Reset do formulário
      handleClear();
    } catch (error) {
      console.error("Erro ao adicionar questão:", error);
      toast({
        title: "Erro ao adicionar questão",
        description: "Ocorreu um erro ao salvar a questão. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setStatement("");
    setAlternatives({ A: "", B: "", C: "", D: "", E: "" });
    setExplanation("");
    setSelectedSubject("");
    setSelectedContent("");
    setSelectedTopic("");
    setSelectedExam("");
    setSelectedYear("");
    setSelectedDifficulty("");
    setCorrectAnswer("");
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Adicionar Questão</h2>
          <p className="text-muted-foreground">Cadastre uma nova questão no banco de dados</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Dados da Questão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="statement">Enunciado da Questão</Label>
                <RichTextEditor
                  content={statement}
                  onChange={setStatement}
                  placeholder="Digite o enunciado completo da questão. Use a barra de ferramentas para formatar o texto..."
                  minHeight="250px"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="subject">Matéria</Label>
                  <Select 
                    required 
                    value={selectedSubject} 
                    onValueChange={(value) => {
                      setSelectedSubject(value);
                      setSelectedContent("");
                    }}
                  >
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Selecione a matéria" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Conteúdo</Label>
                  <Select 
                    required 
                    value={selectedContent}
                    onValueChange={setSelectedContent}
                    disabled={!selectedSubject}
                  >
                    <SelectTrigger id="content">
                      <SelectValue placeholder={selectedSubject ? "Selecione o conteúdo" : "Selecione a matéria primeiro"} />
                    </SelectTrigger>
                    <SelectContent>
                      {contents.map(content => (
                        <SelectItem key={content.id} value={content.id}>
                          {content.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                  <div className="space-y-2">
                    <Label htmlFor="topic">Tópico Específico</Label>
                    <Select 
                      required 
                      disabled={!selectedContent}
                      value={selectedTopic}
                      onValueChange={setSelectedTopic}
                    >
                      <SelectTrigger id="topic">
                        <SelectValue placeholder={selectedContent ? "Selecione o tópico" : "Selecione o conteúdo primeiro"} />
                      </SelectTrigger>
                      <SelectContent>
                        {topics.map(topic => (
                          <SelectItem key={topic.id} value={topic.id}>
                            {topic.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="exam">Vestibular/Instituição</Label>
                    <Select 
                      required
                      value={selectedExam}
                      onValueChange={setSelectedExam}
                    >
                      <SelectTrigger id="exam">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {exams.map((exam) => (
                          <SelectItem key={exam.id} value={exam.id}>
                            {exam.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Ano</Label>
                  <Select 
                    required
                    value={selectedYear}
                    onValueChange={setSelectedYear}
                  >
                    <SelectTrigger id="year">
                      <SelectValue placeholder="Selecione o ano" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Dificuldade</Label>
                  <Select 
                    required
                    value={selectedDifficulty}
                    onValueChange={setSelectedDifficulty}
                  >
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facil">Fácil</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="dificil">Difícil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Alternativas</Label>
                {["A", "B", "C", "D", "E"].map((letter) => (
                  <div key={letter} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-primary-foreground text-sm shrink-0">
                        {letter}
                      </div>
                      <span className="text-sm font-semibold text-muted-foreground">Alternativa {letter}</span>
                    </div>
                    <RichTextEditor
                      content={alternatives[letter]}
                      onChange={(content) => setAlternatives(prev => ({ ...prev, [letter]: content }))}
                      placeholder={`Digite a alternativa ${letter}...`}
                      minHeight="120px"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="correct">Alternativa Correta</Label>
                <Select 
                  required
                  value={correctAnswer}
                  onValueChange={setCorrectAnswer}
                >
                  <SelectTrigger id="correct">
                    <SelectValue placeholder="Selecione a alternativa correta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">A</SelectItem>
                    <SelectItem value="b">B</SelectItem>
                    <SelectItem value="c">C</SelectItem>
                    <SelectItem value="d">D</SelectItem>
                    <SelectItem value="e">E</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="explanation">Resolução/Explicação (Opcional)</Label>
                <RichTextEditor
                  content={explanation}
                  onChange={setExplanation}
                  placeholder="Digite a resolução detalhada ou explicação da questão..."
                  minHeight="180px"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? "Adicionando..." : "Adicionar Questão"}
                </Button>
                <Button type="button" variant="outline" onClick={handleClear} disabled={isSubmitting}>
                  Limpar
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </Layout>
  );
};

export default AddQuestion;
