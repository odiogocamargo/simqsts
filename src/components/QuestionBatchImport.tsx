import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Loader2, CheckCircle, AlertCircle, Download, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';

interface QuestionInput {
  statement: string;
  subject_id: string;
  exam_id: string;
  year: number;
  difficulty: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_e: string;
  correct_answer: string;
}

export const QuestionBatchImport = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [jsonInput, setJsonInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [results, setResults] = useState<any>(null);

  const exampleJson = [
    {
      statement: "Considere as reações:\n1 C(grafite) + 1/2 O₂(g) → 1 CO(g)   ΔH = -26,4 kcal/mol\n1 C(grafite) + 1 O₂(g) → 1 CO₂(g)   ΔH = -94,1 kcal/mol\n\nA conversão de CO em CO₂ no conversor catalítico é uma reação:",
      subject_id: "quimica",
      exam_id: "PAES UEMA",
      year: 2025,
      difficulty: "medio",
      option_a: "exotérmica e absorve 120,5 kcal/mol",
      option_b: "endotérmica e libera 67,7 kcal/mol",
      option_c: "endotérmica e libera 120,5 kcal/mol",
      option_d: "endotérmica e absorve 67,7 kcal/mol",
      option_e: "exotérmica e libera 67,7 kcal/mol",
      correct_answer: "e"
    }
  ];

  const downloadExample = () => {
    const blob = new Blob([JSON.stringify(exampleJson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exemplo-questoes.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonInput(content);
    };
    reader.readAsText(file);
  };

  const validateAndParseJson = (): QuestionInput[] | null => {
    try {
      const parsed = JSON.parse(jsonInput);
      const questions = Array.isArray(parsed) ? parsed : [parsed];

      // Validar estrutura de cada questão
      const requiredFields = [
        'statement', 'subject_id', 'exam_id', 'year', 'difficulty',
        'option_a', 'option_b', 'option_c', 'option_d', 'option_e', 'correct_answer'
      ];

      for (const q of questions) {
        for (const field of requiredFields) {
          if (!q[field]) {
            throw new Error(`Campo obrigatório ausente: ${field}`);
          }
        }
      }

      return questions;
    } catch (error) {
      toast({
        title: 'Erro no JSON',
        description: error instanceof Error ? error.message : 'JSON inválido',
        variant: 'destructive',
      });
      return null;
    }
  };

  const handleClassifyAndImport = async () => {
    if (!user?.id) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar autenticado',
        variant: 'destructive',
      });
      return;
    }

    const questions = validateAndParseJson();
    if (!questions) return;

    setIsProcessing(true);
    setProcessProgress(0);
    setResults(null);

    try {
      // Passo 1: Classificar questões com IA (30% do progresso)
      console.log('Classificando questões com IA...');
      setProcessProgress(10);

      const { data: classificationData, error: classifyError } = await supabase.functions.invoke(
        'classify-questions-batch',
        { body: { questions } }
      );

      if (classifyError) throw classifyError;
      if (!classificationData.success) throw new Error('Erro na classificação');

      setProcessProgress(30);

      // Passo 2: Inserir questões no banco (70% do progresso restante)
      console.log('Inserindo questões no banco...');
      const classifiedQuestions = classificationData.data.filter((r: any) => r.success);
      
      const insertResults = [];
      const progressPerQuestion = 70 / classifiedQuestions.length;

      for (let i = 0; i < classifiedQuestions.length; i++) {
        const item = classifiedQuestions[i];
        const question = item.question;

        try {
          // Inserir questão
          const { data: questionData, error: questionError } = await supabase
            .from('questions')
            .insert({
              statement: question.statement,
              subject_id: question.subject_id,
              content_id: question.content_id,
              exam_id: question.exam_id,
              year: question.year,
              difficulty: question.difficulty,
              option_a: question.option_a,
              option_b: question.option_b,
              option_c: question.option_c,
              option_d: question.option_d,
              option_e: question.option_e,
              correct_answer: question.correct_answer,
              created_by: user.id,
            })
            .select()
            .single();

          if (questionError) throw questionError;

          // Inserir tópico
          if (question.topic_id && questionData) {
            await supabase.from('question_topics').insert({
              question_id: questionData.id,
              topic_id: question.topic_id,
            });
          }

          insertResults.push({
            success: true,
            question: question.statement.substring(0, 100) + '...',
            classification: item.classification
          });

        } catch (error) {
          console.error('Error inserting question:', error);
          insertResults.push({
            success: false,
            question: question.statement.substring(0, 100) + '...',
            error: error instanceof Error ? error.message : 'Erro desconhecido'
          });
        }

        setProcessProgress(30 + (i + 1) * progressPerQuestion);
      }

      setProcessProgress(100);
      setResults({
        total: questions.length,
        classified: classifiedQuestions.length,
        inserted: insertResults.filter((r: any) => r.success).length,
        failed: insertResults.filter((r: any) => !r.success).length,
        details: insertResults
      });

      toast({
        title: 'Importação concluída!',
        description: `${insertResults.filter((r: any) => r.success).length} questões importadas com sucesso`,
      });

    } catch (error) {
      console.error('Error in batch import:', error);
      toast({
        title: 'Erro na importação',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Importação em Lote com IA
        </CardTitle>
        <CardDescription>
          Cole um JSON com as questões - a IA classificará automaticamente conteúdo e tópico
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={downloadExample}
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar exemplo JSON
            </Button>
            <label htmlFor="file-upload">
              <Button
                type="button"
                variant="outline"
                size="sm"
                asChild
              >
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload JSON
                </span>
              </Button>
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <Textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='Cole ou faça upload do JSON aqui...\n\nExemplo:\n[\n  {\n    "statement": "Enunciado da questão...",\n    "subject_id": "quimica",\n    "exam_id": "ENEM",\n    "year": 2025,\n    "difficulty": "medio",\n    "option_a": "Alternativa A",\n    ...\n  }\n]'
            rows={12}
            className="font-mono text-xs"
            disabled={isProcessing}
          />
        </div>

        {isProcessing && (
          <div className="space-y-2">
            <Progress value={processProgress} className="w-full" />
            <p className="text-sm text-muted-foreground text-center">
              Processando questões... {Math.round(processProgress)}%
            </p>
          </div>
        )}

        {results && (
          <Alert className="border-green-500/50 bg-green-500/10">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">Importação concluída!</p>
                <ul className="text-xs space-y-1 mt-2">
                  <li>• <strong>Total de questões:</strong> {results.total}</li>
                  <li>• <strong>Classificadas com sucesso:</strong> {results.classified}</li>
                  <li>• <strong>Inseridas no banco:</strong> {results.inserted}</li>
                  {results.failed > 0 && (
                    <li className="text-destructive">• <strong>Falharam:</strong> {results.failed}</li>
                  )}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleClassifyAndImport}
          disabled={!jsonInput.trim() || isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Classificar e Importar com IA
            </>
          )}
        </Button>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Campos obrigatórios no JSON:</strong>
            <ul className="mt-1 space-y-0.5 ml-4">
              <li>• statement, subject_id, exam_id, year, difficulty</li>
              <li>• option_a, option_b, option_c, option_d, option_e</li>
              <li>• correct_answer (letra minúscula: a, b, c, d, e)</li>
            </ul>
            <p className="mt-2">
              <strong>A IA classificará automaticamente:</strong> content_id e topic_id
            </p>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
