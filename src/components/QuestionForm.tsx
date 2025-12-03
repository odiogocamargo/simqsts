import { useState, useEffect } from "react";
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
import { RichTextEditor } from "@/components/RichTextEditor";
import { useSubjects, useContents, useTopics, useExams } from "@/hooks/useSubjects";
import { Sparkles, Loader2, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export interface QuestionData {
  id: string;
  statement: string;
  selectedSubject: string;
  selectedContent: string;
  selectedTopic: string;
  selectedExam: string;
  selectedYear: string;
  selectedDifficulty: string;
  correctAnswer: string;
  alternatives: Record<string, string>;
  explanation: string;
}

interface QuestionFormProps {
  question: QuestionData;
  index: number;
  totalQuestions: number;
  onChange: (id: string, data: Partial<QuestionData>) => void;
  onRemove: (id: string) => void;
}

export const createEmptyQuestion = (): QuestionData => ({
  id: crypto.randomUUID(),
  statement: "",
  selectedSubject: "",
  selectedContent: "",
  selectedTopic: "",
  selectedExam: "",
  selectedYear: "",
  selectedDifficulty: "",
  correctAnswer: "",
  alternatives: { A: "", B: "", C: "", D: "", E: "" },
  explanation: "",
});

export const QuestionForm = ({ question, index, totalQuestions, onChange, onRemove }: QuestionFormProps) => {
  const { toast } = useToast();
  const [isClassifying, setIsClassifying] = useState(false);
  const [classificationSuggestion, setClassificationSuggestion] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(true);

  const { data: subjects = [] } = useSubjects();
  const { data: contents = [] } = useContents(question.selectedSubject);
  const { data: topics = [] } = useTopics(question.selectedContent);
  const { data: exams = [] } = useExams();

  const years = Array.from({ length: 26 }, (_, i) => 2026 - i);

  const handleChange = (field: keyof QuestionData, value: any) => {
    onChange(question.id, { [field]: value });
  };

  const handleAlternativeChange = (letter: string, content: string) => {
    onChange(question.id, {
      alternatives: { ...question.alternatives, [letter]: content }
    });
  };

  const handleSubjectChange = (value: string) => {
    onChange(question.id, {
      selectedSubject: value,
      selectedContent: "",
      selectedTopic: ""
    });
  };

  const handleContentChange = (value: string) => {
    onChange(question.id, {
      selectedContent: value,
      selectedTopic: ""
    });
  };

  const handleAutoClassify = async () => {
    if (!question.statement.trim()) {
      toast({
        title: 'Erro',
        description: 'Digite o enunciado da questão primeiro',
        variant: 'destructive',
      });
      return;
    }

    if (!question.selectedSubject) {
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
      const { data, error } = await supabase.functions.invoke('classify-question', {
        body: { statement: question.statement }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Erro ao classificar questão');

      setClassificationSuggestion(data.data);

      // Aplicar sugestões automaticamente
      const updates: Partial<QuestionData> = {};
      if (data.data.subject_id) updates.selectedSubject = data.data.subject_id;
      if (data.data.content_id) updates.selectedContent = data.data.content_id;
      if (data.data.topic_id) updates.selectedTopic = data.data.topic_id;
      
      onChange(question.id, updates);

      toast({
        title: 'Classificação concluída!',
        description: `Questão ${index + 1} classificada com ${Math.round((data.data.confidence || 0.8) * 100)}% de confiança`,
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

  const questionTitle = question.statement 
    ? `Questão ${index + 1}: ${question.statement.replace(/<[^>]*>/g, '').substring(0, 50)}...`
    : `Questão ${index + 1}`;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 p-0 h-auto hover:bg-transparent">
                {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                <CardTitle className="text-lg">{questionTitle}</CardTitle>
              </Button>
            </CollapsibleTrigger>
            {totalQuestions > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemove(question.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Enunciado da Questão</Label>
              <RichTextEditor
                content={question.statement}
                onChange={(value) => handleChange("statement", value)}
                placeholder="Digite o enunciado completo da questão..."
                minHeight="180px"
              />
            </div>

            <div className="space-y-4">
              <Button
                type="button"
                onClick={handleAutoClassify}
                disabled={!question.statement.trim() || isClassifying}
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
                    <p className="font-medium">Classificação sugerida:</p>
                    <ul className="text-xs space-y-1 mt-2">
                      <li>• <strong>Matéria:</strong> {subjects.find(s => s.id === classificationSuggestion.subject_id)?.name || classificationSuggestion.subject_id}</li>
                      <li>• <strong>Conteúdo:</strong> {classificationSuggestion.content_id}</li>
                      <li>• <strong>Tópico:</strong> {classificationSuggestion.topic_id}</li>
                      <li>• <strong>Confiança:</strong> {Math.round((classificationSuggestion.confidence || 0) * 100)}%</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Matéria</Label>
                <Select value={question.selectedSubject} onValueChange={handleSubjectChange}>
                  <SelectTrigger>
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
                <Label>Conteúdo</Label>
                <Select 
                  value={question.selectedContent}
                  onValueChange={handleContentChange}
                  disabled={!question.selectedSubject}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={question.selectedSubject ? "Selecione o conteúdo" : "Selecione a matéria primeiro"} />
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
                <Label>Tópico Específico</Label>
                <Select 
                  disabled={!question.selectedContent}
                  value={question.selectedTopic}
                  onValueChange={(value) => handleChange("selectedTopic", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={question.selectedContent ? "Selecione o tópico" : "Selecione o conteúdo primeiro"} />
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

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Vestibular/Instituição</Label>
                <Select value={question.selectedExam} onValueChange={(value) => handleChange("selectedExam", value)}>
                  <SelectTrigger>
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
                <Label>Ano</Label>
                <Select value={question.selectedYear} onValueChange={(value) => handleChange("selectedYear", value)}>
                  <SelectTrigger>
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
                <Label>Dificuldade</Label>
                <Select value={question.selectedDifficulty} onValueChange={(value) => handleChange("selectedDifficulty", value)}>
                  <SelectTrigger>
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
                    content={question.alternatives[letter]}
                    onChange={(content) => handleAlternativeChange(letter, content)}
                    placeholder={`Digite a alternativa ${letter}...`}
                    minHeight="100px"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Alternativa Correta</Label>
              <Select value={question.correctAnswer} onValueChange={(value) => handleChange("correctAnswer", value)}>
                <SelectTrigger>
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
              <Label>Resolução/Explicação (Opcional)</Label>
              <RichTextEditor
                content={question.explanation}
                onChange={(value) => handleChange("explanation", value)}
                placeholder="Digite a resolução detalhada ou explicação da questão..."
                minHeight="150px"
              />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
