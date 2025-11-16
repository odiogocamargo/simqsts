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

const AddQuestion = () => {
  const { toast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedContent, setSelectedContent] = useState<string>("");
  const [statement, setStatement] = useState<string>("");
  const [alternatives, setAlternatives] = useState<Record<string, string>>({
    A: "",
    B: "",
    C: "",
    D: "",
    E: "",
  });
  const [explanation, setExplanation] = useState<string>("");
  
  const { data: subjects = [] } = useSubjects();
  const { data: contents = [] } = useContents(selectedSubject);
  const { data: topics = [] } = useTopics(selectedContent);
  const { data: exams = [] } = useExams();
  
  const years = Array.from({ length: 26 }, (_, i) => 2026 - i);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Questão adicionada!",
      description: "A questão foi cadastrada com sucesso no banco.",
    });
  };

  const handleClear = () => {
    setStatement("");
    setAlternatives({ A: "", B: "", C: "", D: "", E: "" });
    setExplanation("");
    setSelectedSubject("");
    setSelectedContent("");
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
                    <Select required disabled={!selectedContent}>
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
                    <Select required>
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
                  <Select required>
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
                  <Select required>
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
                <Select required>
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
                <Button type="submit" className="flex-1">
                  Adicionar Questão
                </Button>
                <Button type="button" variant="outline" onClick={handleClear}>
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
