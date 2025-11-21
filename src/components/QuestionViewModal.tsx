import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Edit, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Question {
  id: string;
  text: string;
  subject: string;
  content: string;
  topic: string;
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

interface QuestionViewModalProps {
  question: Question | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (question: Question) => void;
}

export function QuestionViewModal({ question, open, onOpenChange, onEdit }: QuestionViewModalProps) {
  if (!question) return null;

  const { data: images = [] } = useQuery({
    queryKey: ['question-images', question.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('question_images')
        .select('*')
        .eq('question_id', question.id)
        .order('display_order');
      
      if (error) throw error;
      return data || [];
    },
    enabled: open && !!question.id,
  });

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-xl">Questão #{question.id}</DialogTitle>
              <DialogDescription className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                  {question.subject}
                </Badge>
                <Badge variant="outline" className="bg-secondary">
                  {question.exam}
                </Badge>
                <Badge className={getDifficultyColor(question.difficulty)}>
                  {question.difficulty}
                </Badge>
                <Badge variant="outline">Ano: {question.year}</Badge>
              </DialogDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onEdit(question);
                onOpenChange(false);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Hierarquia</h4>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-foreground">{question.subject}</span>
              <span className="text-muted-foreground">→</span>
              <span className="text-foreground">{question.content}</span>
              <span className="text-muted-foreground">→</span>
              <span className="text-foreground">{question.topic}</span>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-3">Enunciado</h4>
            <p className="text-foreground leading-relaxed">{question.text}</p>
          </div>

          {images.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3">Imagens</h4>
                <div className="grid grid-cols-2 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="rounded-lg overflow-hidden border border-border">
                      <img
                        src={image.image_url}
                        alt={`Imagem da questão ${image.display_order}`}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {question.alternatives && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3">Alternativas</h4>
                <div className="space-y-3">
                  {Object.entries(question.alternatives).map(([letter, text]) => {
                    const isCorrect = question.correctAnswer?.toLowerCase() === letter;
                    return (
                      <div
                        key={letter}
                        className={`flex gap-3 p-3 rounded-lg border ${
                          isCorrect
                            ? "bg-success/5 border-success/20"
                            : "bg-muted/30 border-border"
                        }`}
                      >
                        <div
                          className={`h-8 w-8 rounded-lg flex items-center justify-center font-semibold shrink-0 ${
                            isCorrect
                              ? "bg-success/20 text-success"
                              : "bg-secondary text-foreground"
                          }`}
                        >
                          {letter.toUpperCase()}
                        </div>
                        <p className="text-sm text-foreground flex-1">{text}</p>
                        {isCorrect && (
                          <Badge className="bg-success/10 text-success border-success/20 shrink-0">
                            Correta
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {question.explanation && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3">
                  Resolução/Explicação
                </h4>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {question.explanation}
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
