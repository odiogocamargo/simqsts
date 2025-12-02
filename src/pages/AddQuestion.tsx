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
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";

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
  const [isClassifying, setIsClassifying] = useState(false);
  const [classificationSuggestion, setClassificationSuggestion] = useState<any>(null);
  const [jsonInput, setJsonInput] = useState('');
  
  const { data: subjects = [] } = useSubjects();
  const { data: contents = [] } = useContents(selectedSubject);
  const { data: topics = [] } = useTopics(selectedContent);
  const { data: exams = [] } = useExams();
  
  const years = Array.from({ length: 26 }, (_, i) => 2026 - i);

  const handleLoadFromJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      console.log('JSON parsed:', parsed);
      
      // Validar campos obrigatórios
      const requiredFields = [
        'statement', 'subject_id', 'exam_id', 'year', 'difficulty',
        'option_a', 'option_b', 'option_c', 'option_d', 'option_e', 'correct_answer'
      ];

      const missingFields = requiredFields.filter(field => !parsed[field]);
      if (missingFields.length > 0) {
        throw new Error(`Campos obrigatórios ausentes: ${missingFields.join(', ')}`);
      }

      console.log('Filling form fields...');

      // Normalizar exam_id (aceitar ENEM/enem e PAES UEMA/paes-uema)
      let normalizedExamId = parsed.exam_id;
      if (parsed.exam_id.toUpperCase() === 'ENEM') {
        normalizedExamId = 'enem';
      } else if (parsed.exam_id.toUpperCase().includes('PAES') || parsed.exam_id.includes('UEMA')) {
        normalizedExamId = 'paes-uema';
      }

      // Preencher todos os campos do formulário
      setStatement(parsed.statement);
      console.log('Statement set:', parsed.statement);
      
      setSelectedSubject(parsed.subject_id);
      console.log('Subject set:', parsed.subject_id);
      
      setSelectedExam(normalizedExamId);
      console.log('Exam set:', normalizedExamId);
      
      setSelectedYear(parsed.year.toString());
      console.log('Year set:', parsed.year);
      
      setSelectedDifficulty(parsed.difficulty);
      console.log('Difficulty set:', parsed.difficulty);
      
      setCorrectAnswer(parsed.correct_answer.toLowerCase());
      console.log('Correct answer set:', parsed.correct_answer);
      
      setAlternatives({
        A: parsed.option_a,
        B: parsed.option_b,
        C: parsed.option_c,
        D: parsed.option_d,
        E: parsed.option_e,
      });
      console.log('Alternatives set');

      toast({
        title: 'JSON carregado!',
        description: 'Todos os campos foram preenchidos. Agora clique em "Classificar automaticamente" para definir conteúdo e tópico.',
      });

      // Limpar o campo JSON
      setJsonInput('');

    } catch (error) {
      console.error('Error loading JSON:', error);
      toast({
        title: 'Erro ao carregar JSON',
        description: error instanceof Error ? error.message : 'JSON inválido',
        variant: 'destructive',
      });
    }
  };

  const handleAutoClassify = async () => {
    if (!statement.trim()) {
      toast({
        title: 'Erro',
        description: 'Digite o enunciado da questão primeiro',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedSubject) {
      toast({
        title: 'Erro',
        description: 'Selecione a matéria primeiro',
        variant: 'destructive',
      });
      return;
    }

    setIsClassifying(true);
    setClassificationSuggestion(null);

    try {
      console.log('Calling classify-question function...');
      
      const { data, error } = await supabase.functions.invoke('classify-question', {
        body: { statement }
      });

      if (error) {
        console.error('Error invoking function:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Erro ao classificar questão');
      }

      console.log('Classification result:', data.data);
      setClassificationSuggestion(data.data);

      // Aplicar sugestões automaticamente
      if (data.data.subject_id) setSelectedSubject(data.data.subject_id);
      if (data.data.content_id) setSelectedContent(data.data.content_id);
      if (data.data.topic_id) setSelectedTopic(data.data.topic_id);

      toast({
        title: 'Classificação concluída!',
        description: `Questão classificada com ${Math.round((data.data.confidence || 0.8) * 100)}% de confiança`,
      });

    } catch (error) {
      console.error('Error classifying question:', error);
      toast({
        title: 'Erro na classificação',
        description: error instanceof Error ? error.message : 'Erro ao classificar questão',
        variant: 'destructive',
      });
    } finally {
      setIsClassifying(false);
    }
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

    // Validação de campos obrigatórios
    if (!statement.trim()) {
      toast({ title: "Erro", description: "O enunciado é obrigatório.", variant: "destructive" });
      return;
    }
    if (!selectedSubject) {
      toast({ title: "Erro", description: "Selecione a matéria.", variant: "destructive" });
      return;
    }
    if (!selectedContent) {
      toast({ title: "Erro", description: "Selecione o conteúdo.", variant: "destructive" });
      return;
    }
    if (!selectedExam) {
      toast({ title: "Erro", description: "Selecione o vestibular.", variant: "destructive" });
      return;
    }
    if (!selectedYear) {
      toast({ title: "Erro", description: "Selecione o ano.", variant: "destructive" });
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
          <p className="text-muted-foreground">Cadastre uma nova questão - a IA classificará automaticamente conteúdo e tópico</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Carregar do JSON (Opcional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="json-input">Cole o JSON da questão aqui</Label>
                <Textarea
                  id="json-input"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder={`Cole o JSON aqui:\n{\n  "statement": "Enunciado...",\n  "subject_id": "quimica",\n  "exam_id": "ENEM",\n  "year": 2025,\n  "difficulty": "medio",\n  "option_a": "Alt A",\n  "option_b": "Alt B",\n  "option_c": "Alt C",\n  "option_d": "Alt D",\n  "option_e": "Alt E",\n  "correct_answer": "e"\n}`}
                  rows={8}
                  className="font-mono text-xs"
                />
              </div>
              
              <Button
                type="button"
                onClick={handleLoadFromJson}
                disabled={!jsonInput.trim()}
                variant="secondary"
                className="w-full"
              >
                Carregar Dados do JSON
              </Button>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  <strong>Campos obrigatórios:</strong> statement, subject_id, exam_id, year, difficulty, option_a-e, correct_answer
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

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

              <div className="space-y-4">
                <Button
                  type="button"
                  onClick={handleAutoClassify}
                  disabled={!statement.trim() || isClassifying}
                  variant="outline"
                  className="w-full"
                >
                  {isClassifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Classificando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Classificar automaticamente com IA
                    </>
                  )}
                </Button>

                {classificationSuggestion && (
                  <Alert className="border-blue-500/50 bg-blue-500/10">
                    <Sparkles className="h-4 w-4 text-blue-500" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <p className="font-medium">Classificação sugerida:</p>
                        <ul className="text-xs space-y-1 mt-2">
                          <li>• <strong>Matéria:</strong> {subjects.find(s => s.id === classificationSuggestion.subject_id)?.name || classificationSuggestion.subject_id}</li>
                          <li>• <strong>Conteúdo:</strong> {contents.find(c => c.id === classificationSuggestion.content_id)?.name || classificationSuggestion.content_id}</li>
                          <li>• <strong>Tópico:</strong> {topics.find(t => t.id === classificationSuggestion.topic_id)?.name || classificationSuggestion.topic_id}</li>
                          <li>• <strong>Confiança:</strong> {Math.round((classificationSuggestion.confidence || 0) * 100)}%</li>
                        </ul>
                        {classificationSuggestion.reasoning && (
                          <p className="text-xs mt-2 text-muted-foreground italic">
                            {classificationSuggestion.reasoning}
                          </p>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
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
                      <SelectItem value="medio">Média</SelectItem>
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
