import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { useSubjects, useContents, useTopics, useExams } from "@/hooks/useSubjects";

interface Question {
  id: string;
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

interface QuestionEditModalProps {
  question: Question | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (question: Question) => void;
}

export function QuestionEditModal({ question, open, onOpenChange, onSave }: QuestionEditModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Question | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedContent, setSelectedContent] = useState<string>("");

  const { data: subjects = [] } = useSubjects();
  const { data: contents = [] } = useContents(selectedSubject);
  const { data: topics = [] } = useTopics(selectedContent);
  const { data: exams = [] } = useExams();

  useEffect(() => {
    if (question) {
      setFormData(question);
      setSelectedSubject(question.subjectId || "");
      setSelectedContent(question.contentId || "");
    }
  }, [question]);

  if (!formData) return null;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 35 }, (_, i) => currentYear - i);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentSubject = subjects.find(s => s.id === selectedSubject);
    const currentContent = contents.find(c => c.id === selectedContent);
    const currentTopic = topics.find(t => t.id === formData.topicId);
    
    const updatedQuestion = {
      ...formData,
      subject: currentSubject?.name || formData.subject,
      subjectId: selectedSubject,
      content: currentContent?.name || formData.content,
      contentId: selectedContent,
      topic: currentTopic?.name || formData.topic,
    };

    onSave(updatedQuestion);
    toast({
      title: "Questão atualizada!",
      description: "As alterações foram salvas com sucesso.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Questão #{formData.id}</DialogTitle>
          <DialogDescription>
            Faça as alterações necessárias e clique em salvar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-statement">Enunciado da Questão</Label>
            <Textarea
              id="edit-statement"
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              rows={6}
              required
            />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="edit-subject">Matéria</Label>
              <Select
                required
                value={selectedSubject}
                onValueChange={(value) => {
                  setSelectedSubject(value);
                  setSelectedContent("");
                  setFormData({ ...formData, topicId: "" });
                }}
              >
                <SelectTrigger id="edit-subject">
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
              <Label htmlFor="edit-content">Conteúdo</Label>
              <Select
                required
                value={selectedContent}
                onValueChange={(value) => {
                  setSelectedContent(value);
                  setFormData({ ...formData, topicId: "" });
                }}
                disabled={!selectedSubject}
              >
                <SelectTrigger id="edit-content">
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
              <Label htmlFor="edit-topic">Tópico Específico</Label>
              <Select 
                required 
                value={formData.topicId}
                onValueChange={(value) => setFormData({ ...formData, topicId: value })}
                disabled={!selectedContent}
              >
                <SelectTrigger id="edit-topic">
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
              <Label htmlFor="edit-exam">Vestibular/Instituição</Label>
              <Select 
                required
                value={formData.exam}
                onValueChange={(value) => setFormData({ ...formData, exam: value })}
              >
                <SelectTrigger id="edit-exam">
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
              <Label htmlFor="edit-year">Ano</Label>
              <Select 
                required
                value={formData.year.toString()}
                onValueChange={(value) => setFormData({ ...formData, year: parseInt(value) })}
              >
                <SelectTrigger id="edit-year">
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
              <Label htmlFor="edit-difficulty">Dificuldade</Label>
              <Select 
                required
                value={formData.difficulty}
                onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
              >
                <SelectTrigger id="edit-difficulty">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fácil">Fácil</SelectItem>
                  <SelectItem value="Média">Média</SelectItem>
                  <SelectItem value="Difícil">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.alternatives && (
            <div className="space-y-4">
              <Label>Alternativas</Label>
              {Object.entries(formData.alternatives).map(([letter, text]) => (
                <div key={letter} className="flex gap-3 items-start">
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center font-semibold text-foreground shrink-0">
                    {letter.toUpperCase()}
                  </div>
                  <Textarea
                    value={text}
                    onChange={(e) => setFormData({
                      ...formData,
                      alternatives: {
                        ...formData.alternatives!,
                        [letter]: e.target.value
                      }
                    })}
                    rows={2}
                    required
                  />
                </div>
              ))}
            </div>
          )}

          {formData.correctAnswer && (
            <div className="space-y-2">
              <Label htmlFor="edit-correct">Alternativa Correta</Label>
              <Select 
                required
                value={formData.correctAnswer}
                onValueChange={(value) => setFormData({ ...formData, correctAnswer: value })}
              >
                <SelectTrigger id="edit-correct">
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
          )}

          {formData.explanation !== undefined && (
            <div className="space-y-2">
              <Label htmlFor="edit-explanation">Resolução/Explicação</Label>
              <Textarea
                id="edit-explanation"
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                rows={4}
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Salvar Alterações
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
