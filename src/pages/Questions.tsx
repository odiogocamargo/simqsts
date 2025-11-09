import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Questions = () => {
  // Mock data - será substituído por dados reais do banco
  const questions = [
    {
      id: 1,
      text: "Calcule a integral definida de f(x) = x² + 2x no intervalo [0, 2]",
      subject: "Matemática",
      exam: "ENEM 2023",
      difficulty: "Média",
      year: 2023,
    },
    {
      id: 2,
      text: "Analise o trecho literário e identifique as características do Modernismo brasileiro",
      subject: "Português",
      exam: "FUVEST 2023",
      difficulty: "Difícil",
      year: 2023,
    },
    {
      id: 3,
      text: "Determine a aceleração de um corpo em movimento retilíneo uniformemente variado",
      subject: "Física",
      exam: "UNICAMP 2023",
      difficulty: "Fácil",
      year: 2023,
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

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Questões</h2>
          <p className="text-muted-foreground">Visualize e gerencie todas as questões do banco</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar questões..."
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Matéria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matematica">Matemática</SelectItem>
                    <SelectItem value="portugues">Português</SelectItem>
                    <SelectItem value="fisica">Física</SelectItem>
                    <SelectItem value="quimica">Química</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Vestibular" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enem">ENEM</SelectItem>
                    <SelectItem value="fuvest">FUVEST</SelectItem>
                    <SelectItem value="unicamp">UNICAMP</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {questions.map((question) => (
            <Card key={question.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-foreground leading-relaxed flex-1">{question.text}</p>
                    <Badge className={getDifficultyColor(question.difficulty)}>
                      {question.difficulty}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                      {question.subject}
                    </Badge>
                    <Badge variant="outline" className="bg-secondary">
                      {question.exam}
                    </Badge>
                    <span className="text-muted-foreground">{question.year}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Questions;
