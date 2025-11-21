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
import { ImageUpload, QuestionImage } from "@/components/ImageUpload";
import { QuestionImageUpload } from "@/components/QuestionImageUpload";

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
  const [images, setImages] = useState<QuestionImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdQuestionId, setCreatedQuestionId] = useState<string | null>(null);
  
  const { data: subjects = [] } = useSubjects();
  const { data: contents = [] } = useContents(selectedSubject);
  const { data: topics = [] } = useTopics(selectedContent);
  const { data: exams = [] } = useExams();
  
  const years = Array.from({ length: 26 }, (_, i) => 2026 - i);

  const handleExtractedData = async (data: any) => {
    console.log('Handling extracted data:', data);
    
    // Preencher campos básicos
    if (data.exam_id) setSelectedExam(data.exam_id);
    if (data.year) setSelectedYear(data.year.toString());
    if (data.difficulty) setSelectedDifficulty(data.difficulty);
    if (data.correct_answer) setCorrectAnswer(data.correct_answer);
    
    // Preencher enunciado e alternativas
    if (data.statement) setStatement(data.statement);
    if (data.option_a) setAlternatives(prev => ({ ...prev, A: data.option_a }));
    if (data.option_b) setAlternatives(prev => ({ ...prev, B: data.option_b }));
    if (data.option_c) setAlternatives(prev => ({ ...prev, C: data.option_c }));
    if (data.option_d) setAlternatives(prev => ({ ...prev, D: data.option_d }));
    if (data.option_e) setAlternatives(prev => ({ ...prev, E: data.option_e }));
    
    // Preencher matéria
    if (data.subject_id) {
      setSelectedSubject(data.subject_id);
    }
    
    // Buscar e preencher conteúdo (aguardar um pouco para a query de contents carregar)
    if (data.content_id && data.subject_id) {
      setTimeout(async () => {
        // Buscar conteúdos da matéria
        const { data: contentsData } = await supabase
          .from('contents')
          .select('*')
          .eq('subject_id', data.subject_id);
        
        if (contentsData) {
          // Tentar encontrar o conteúdo pelo ID ou nome similar
          const foundContent = contentsData.find(c => 
            c.id === data.content_id || 
            c.id.toLowerCase().includes(data.content_id.toLowerCase()) ||
            data.content_id.toLowerCase().includes(c.id.toLowerCase())
          );
          
          if (foundContent) {
            setSelectedContent(foundContent.id);
            
            // Buscar e preencher tópico
            if (data.topic_id) {
              setTimeout(async () => {
                const { data: topicsData } = await supabase
                  .from('topics')
                  .select('*')
                  .eq('content_id', foundContent.id);
                
                if (topicsData) {
                  const foundTopic = topicsData.find(t => 
                    t.id === data.topic_id || 
                    t.id.toLowerCase().includes(data.topic_id.toLowerCase()) ||
                    data.topic_id.toLowerCase().includes(t.id.toLowerCase())
                  );
                  
                  if (foundTopic) {
                    setSelectedTopic(foundTopic.id);
                  }
                }
              }, 500);
            }
          }
        }
      }, 500);
    }

    toast({
      title: 'Dados extraídos e preenchidos!',
      description: 'Revise os campos abaixo e faça ajustes se necessário antes de salvar.',
    });
  };

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
      const { data: questionData, error } = await supabase
        .from("questions")
        .insert({
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
        })
        .select()
        .single();

      if (error) throw error;

      // Inserir o tópico da questão
      if (selectedTopic && questionData) {
        await supabase.from("question_topics").insert({
          question_id: questionData.id,
          topic_id: selectedTopic,
        });
      }

      // Guardar o ID da questão criada para permitir upload de imagens
      if (questionData) {
        setCreatedQuestionId(questionData.id);
      }

      toast({
        title: "Questão adicionada!",
        description: images.length > 0 
          ? "Questão cadastrada! Agora você pode fazer upload das imagens." 
          : "A questão foi cadastrada com sucesso no banco.",
      });

      // Se não houver imagens, limpar o formulário
      if (images.length === 0) {
        handleClear();
      }
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
    setImages([]);
    setCreatedQuestionId(null);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Adicionar Questão</h2>
          <p className="text-muted-foreground">Cadastre uma nova questão no banco de dados ou use IA para extrair de uma imagem</p>
        </div>

        <QuestionImageUpload onDataExtracted={handleExtractedData} />

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

              <div className="space-y-2">
                <Label>Imagens da Questão (Opcional)</Label>
                <ImageUpload
                  questionId={createdQuestionId || undefined}
                  onImagesChange={setImages}
                  initialImages={images}
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
