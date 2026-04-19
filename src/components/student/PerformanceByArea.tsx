import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Mapeamento de matéria → área de conhecimento (padrão ENEM)
const SUBJECT_TO_AREA: Record<string, string> = {
  // Linguagens
  "Português": "Linguagens, Códigos e suas Tecnologias",
  "Gramática": "Linguagens, Códigos e suas Tecnologias",
  "Interpretação Textual": "Linguagens, Códigos e suas Tecnologias",
  "Literatura": "Linguagens, Códigos e suas Tecnologias",
  "Inglês": "Linguagens, Códigos e suas Tecnologias",
  "Espanhol": "Linguagens, Códigos e suas Tecnologias",
  // Matemática
  "Matemática": "Matemática e suas Tecnologias",
  // Ciências da Natureza
  "Biologia": "Ciências da Natureza e suas Tecnologias",
  "Física": "Ciências da Natureza e suas Tecnologias",
  "Química": "Ciências da Natureza e suas Tecnologias",
  // Humanas
  "História": "Ciências Humanas e suas Tecnologias",
  "Geografia": "Ciências Humanas e suas Tecnologias",
  "Filosofia": "Ciências Humanas e suas Tecnologias",
  "Sociologia": "Ciências Humanas e suas Tecnologias",
};

const ALL_AREAS = [
  "Linguagens, Códigos e suas Tecnologias",
  "Matemática e suas Tecnologias",
  "Ciências da Natureza e suas Tecnologias",
  "Ciências Humanas e suas Tecnologias",
];

export function getAreaForSubject(subjectName: string): string {
  return SUBJECT_TO_AREA[subjectName] || "Outras";
}

interface PerformanceBySubject {
  name: string;
  total: number;
  correct: number;
  accuracy: number;
}

interface PerformanceByAreaProps {
  performanceBySubject: PerformanceBySubject[];
}

export function PerformanceByArea({ performanceBySubject }: PerformanceByAreaProps) {
  const areaMap = new Map<string, { total: number; correct: number }>();
  ALL_AREAS.forEach(a => areaMap.set(a, { total: 0, correct: 0 }));

  performanceBySubject.forEach(s => {
    const area = getAreaForSubject(s.name);
    const entry = areaMap.get(area) || { total: 0, correct: 0 };
    entry.total += s.total;
    entry.correct += s.correct;
    areaMap.set(area, entry);
  });

  const areaData = Array.from(areaMap.entries())
    .map(([name, { total, correct }]) => ({
      name,
      total,
      correct,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
    }))
    .sort((a, b) => b.accuracy - a.accuracy);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Desempenho por Área de Conhecimento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {areaData.map((area) => (
            <div key={area.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{area.name}</span>
                <span className="text-muted-foreground">
                  {area.total > 0 ? `${area.correct}/${area.total} • ` : ""}
                  <span className="font-semibold text-foreground">{area.accuracy}%</span>
                </span>
              </div>
              <Progress value={area.accuracy} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
