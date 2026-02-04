import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2, Play, Filter, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SimulationFilters } from "@/hooks/useSimulations";

interface CreateSimulationFormProps {
  onSubmit: (questionCount: number, filters: SimulationFilters) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

interface Subject {
  id: string;
  name: string;
}

interface Content {
  id: string;
  name: string;
  subject_id: string;
}

interface Exam {
  id: string;
  name: string;
}

const QUESTION_COUNTS = [10, 20, 30, 50, 100];
const DIFFICULTIES = [
  { value: "facil", label: "Fácil" },
  { value: "medio", label: "Médio" },
  { value: "dificil", label: "Difícil" },
];
const YEARS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

export function CreateSimulationForm({ onSubmit, isLoading, onCancel }: CreateSimulationFormProps) {
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedContents, setSelectedContents] = useState<string[]>([]);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [contents, setContents] = useState<Content[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [availableQuestions, setAvailableQuestions] = useState<number | null>(null);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Carregar opções de filtros
  useEffect(() => {
    const loadOptions = async () => {
      const [subjectsRes, contentsRes, examsRes] = await Promise.all([
        supabase.from("subjects").select("id, name").order("name"),
        supabase.from("contents").select("id, name, subject_id").order("name"),
        supabase.from("exams").select("id, name").order("name"),
      ]);

      setSubjects(subjectsRes.data || []);
      setContents(contentsRes.data || []);
      setExams(examsRes.data || []);
      setLoadingOptions(false);
    };

    loadOptions();
  }, []);

  // Calcular questões disponíveis com os filtros
  useEffect(() => {
    const countQuestions = async () => {
      let query = supabase
        .from("questions")
        .select("id", { count: "exact", head: true })
        .eq("question_type", "multipla_escolha");

      if (selectedSubjects.length > 0) {
        query = query.in("subject_id", selectedSubjects);
      }
      if (selectedContents.length > 0) {
        query = query.in("content_id", selectedContents);
      }
      if (selectedExams.length > 0) {
        query = query.in("exam_id", selectedExams);
      }
      if (selectedDifficulties.length > 0) {
        query = query.in("difficulty", selectedDifficulties);
      }
      if (selectedYears.length > 0) {
        query = query.in("year", selectedYears);
      }

      const { count } = await query;
      setAvailableQuestions(count);
    };

    countQuestions();
  }, [selectedSubjects, selectedContents, selectedExams, selectedDifficulties, selectedYears]);

  const filteredContents = selectedSubjects.length > 0
    ? contents.filter((c) => selectedSubjects.includes(c.subject_id))
    : contents;

  const toggleSubject = (id: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
    // Limpar conteúdos selecionados que não pertencem mais às matérias selecionadas
    if (selectedSubjects.includes(id)) {
      setSelectedContents((prev) =>
        prev.filter((c) => {
          const content = contents.find((ct) => ct.id === c);
          return content && selectedSubjects.filter((s) => s !== id).includes(content.subject_id);
        })
      );
    }
  };

  const toggleContent = (id: string) => {
    setSelectedContents((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleExam = (id: string) => {
    setSelectedExams((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const toggleDifficulty = (value: string) => {
    setSelectedDifficulties((prev) =>
      prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value]
    );
  };

  const toggleYear = (year: number) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };

  const clearFilters = () => {
    setSelectedSubjects([]);
    setSelectedContents([]);
    setSelectedExams([]);
    setSelectedDifficulties([]);
    setSelectedYears([]);
  };

  const hasFilters = selectedSubjects.length > 0 || selectedContents.length > 0 || 
    selectedExams.length > 0 || selectedDifficulties.length > 0 || selectedYears.length > 0;

  const handleSubmit = async () => {
    await onSubmit(questionCount, {
      subjectIds: selectedSubjects.length > 0 ? selectedSubjects : undefined,
      contentIds: selectedContents.length > 0 ? selectedContents : undefined,
      examIds: selectedExams.length > 0 ? selectedExams : undefined,
      difficultyLevels: selectedDifficulties.length > 0 ? selectedDifficulties : undefined,
      years: selectedYears.length > 0 ? selectedYears : undefined,
    });
  };

  if (loadingOptions) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Configurar Simulado
        </CardTitle>
        <CardDescription>
          Escolha a quantidade de questões e aplique filtros para personalizar seu simulado
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quantidade de questões */}
        <div className="space-y-2">
          <Label>Quantidade de Questões</Label>
          <Select value={questionCount.toString()} onValueChange={(v) => setQuestionCount(parseInt(v))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {QUESTION_COUNTS.map((count) => (
                <SelectItem key={count} value={count.toString()}>
                  {count} questões
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Vestibulares */}
        <div className="space-y-2">
          <Label>Vestibulares</Label>
          <div className="flex flex-wrap gap-2">
            {exams.map((exam) => (
              <Badge
                key={exam.id}
                variant={selectedExams.includes(exam.id) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleExam(exam.id)}
              >
                {exam.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Matérias */}
        <div className="space-y-2">
          <Label>Matérias</Label>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {subjects.map((subject) => (
              <Badge
                key={subject.id}
                variant={selectedSubjects.includes(subject.id) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleSubject(subject.id)}
              >
                {subject.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Conteúdos (apenas se tiver matéria selecionada) */}
        {selectedSubjects.length > 0 && (
          <div className="space-y-2">
            <Label>Conteúdos</Label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {filteredContents.map((content) => (
                <Badge
                  key={content.id}
                  variant={selectedContents.includes(content.id) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => toggleContent(content.id)}
                >
                  {content.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Dificuldade */}
        <div className="space-y-2">
          <Label>Dificuldade</Label>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.map((diff) => (
              <Badge
                key={diff.value}
                variant={selectedDifficulties.includes(diff.value) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleDifficulty(diff.value)}
              >
                {diff.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Anos */}
        <div className="space-y-2">
          <Label>Anos</Label>
          <div className="flex flex-wrap gap-2">
            {YEARS.map((year) => (
              <Badge
                key={year}
                variant={selectedYears.includes(year) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleYear(year)}
              >
                {year}
              </Badge>
            ))}
          </div>
        </div>

        {/* Resumo */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="space-y-1">
            <p className="text-sm font-medium">Questões disponíveis</p>
            <p className="text-2xl font-bold">
              {availableQuestions !== null ? availableQuestions : "..."}
            </p>
          </div>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Limpar filtros
            </Button>
          )}
        </div>

        {/* Ações */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || (availableQuestions !== null && availableQuestions === 0)}
            className="flex-1 gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            Criar Simulado
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
