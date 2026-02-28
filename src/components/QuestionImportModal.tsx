import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, FileJson, Download } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Database } from "@/integrations/supabase/types";

interface QuestionImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

type QuestionInsert = Database['public']['Tables']['questions']['Insert'];

interface QuestionJSON {
  statement: string;
  subject_id: string;
  content_id: string;
  topic_id?: string;
  exam_id: string;
  year: number;
  difficulty?: string;
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
  option_e?: string;
  correct_answer?: string;
  explanation?: string;
  question_type?: "multipla_escolha" | "discursiva" | "verdadeiro_falso";
  images?: Array<{
    url: string; // URL direta ou base64
    display_order?: number;
  }>;
}

export const QuestionImportModal = ({ open, onOpenChange, onSuccess }: QuestionImportModalProps) => {
  const [jsonContent, setJsonContent] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const handleDownloadTemplate = () => {
    const template = [
      {
        statement: "Qual é a fórmula da água?",
        subject_id: "quimica",
        content_id: "quimica_geral",
        topic_id: "substancias_e_misturas",
        exam_id: "enem",
        year: 2024,
        difficulty: "facil",
        option_a: "H2O",
        option_b: "CO2",
        option_c: "O2",
        option_d: "N2",
        option_e: "H2SO4",
        correct_answer: "a",
        explanation: "A água é formada por dois átomos de hidrogênio e um de oxigênio (H2O).",
        question_type: "multipla_escolha",
        images: [
          {
            url: "https://exemplo.com/imagem-da-questao.png",
            display_order: 0
          }
        ]
      },
      {
        statement: "Observe a imagem abaixo. Qual elemento químico está representado?",
        subject_id: "quimica",
        content_id: "quimica_geral",
        topic_id: "tabela_periodica",
        exam_id: "enem",
        year: 2024,
        difficulty: "medio",
        option_a: "Hidrogênio",
        option_b: "Oxigênio",
        option_c: "Carbono",
        option_d: "Nitrogênio",
        option_e: "Hélio",
        correct_answer: "a",
        explanation: "O elemento representado é o Hidrogênio (H), primeiro elemento da tabela periódica.",
        question_type: "multipla_escolha",
        images: [
          {
            url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
            display_order: 0
          }
        ]
      },
      {
        statement: "Analise o gráfico e responda: qual é o comportamento da função?",
        subject_id: "ma",
        content_id: "funcoes",
        topic_id: "funcao_primeiro_grau",
        exam_id: "paes_uema",
        year: 2024,
        difficulty: "dificil",
        option_a: "Crescente",
        option_b: "Decrescente",
        option_c: "Constante",
        option_d: "Não é função",
        option_e: "Função quadrática",
        correct_answer: "a",
        explanation: "O gráfico mostra uma função crescente, onde y aumenta conforme x aumenta.",
        question_type: "multipla_escolha",
        images: [
          {
            url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNk+M9Qz0AEYBxVSF+FAP0KBIGvdF9PAAAAAElFTkSuQmCC",
            display_order: 0
          }
        ]
      },
      {
        statement: "Questão dissertativa: Explique o processo de fotossíntese com base na imagem fornecida.",
        subject_id: "bi",
        content_id: "ecologia",
        topic_id: "fotossintese",
        exam_id: "paes_uema",
        year: 2024,
        difficulty: "medio",
        question_type: "discursiva",
        explanation: "A fotossíntese é o processo pelo qual as plantas convertem luz solar, água e CO2 em glicose e oxigênio.",
        images: [
          {
            url: "https://exemplo.com/diagrama-fotossintese.jpg",
            display_order: 0
          }
        ]
      },
      {
        statement: "INSTRUÇÕES: Para converter suas imagens para base64, você pode usar:\n\n1. Sites online: https://www.base64-image.de/\n2. Python: import base64; base64.b64encode(open('imagem.png', 'rb').read()).decode()\n3. Node.js: Buffer.from(fs.readFileSync('imagem.png')).toString('base64')\n\nO formato completo deve ser: data:image/png;base64,SEU_CODIGO_BASE64_AQUI\n\nSuporte para: PNG, JPG, JPEG, GIF, WebP",
        subject_id: "ma",
        content_id: "algebra",
        exam_id: "enem",
        year: 2024,
        difficulty: "facil",
        option_a: "Exemplo",
        option_b: "Template",
        option_c: "Instruções",
        option_d: "Ajuda",
        option_e: "Info",
        correct_answer: "c",
        question_type: "multipla_escolha"
      }
    ];

    const jsonString = JSON.stringify(template, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "template-questoes.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Template baixado",
      description: "Preencha o arquivo com suas questões e importe novamente.",
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonContent(content);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!jsonContent.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, adicione o conteúdo JSON",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);

    try {
      let questions: QuestionJSON[];
      
      try {
        questions = JSON.parse(jsonContent);
      } catch (parseError: any) {
        throw new Error(`JSON inválido: ${parseError.message}`);

      }

      if (!Array.isArray(questions)) {
        throw new Error("O JSON deve ser um array de questões. Exemplo: [{...}, {...}]");
      }

      if (questions.length === 0) {
        throw new Error("O array de questões está vazio");
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      console.log(`Iniciando importação de ${questions.length} questões...`);

      for (const [index, question] of questions.entries()) {
        try {
          // Validar campos obrigatórios
          const requiredFields = ['statement', 'subject_id', 'content_id', 'exam_id', 'year'];
          const missingFields = requiredFields.filter(field => !question[field as keyof QuestionJSON]);
          
          if (missingFields.length > 0) {
            throw new Error(`Campos obrigatórios ausentes: ${missingFields.join(', ')}`);
          }

          console.log(`Importando questão ${index + 1}:`, question.statement.substring(0, 50) + '...');
          // Insert question
          const questionData: QuestionInsert = {
            statement: question.statement,
            subject_id: question.subject_id,
            content_id: question.content_id,
            exam_id: question.exam_id,
            year: question.year,
            difficulty: question.difficulty || "medio",
            option_a: question.option_a || null,
            option_b: question.option_b || null,
            option_c: question.option_c || null,
            option_d: question.option_d || null,
            option_e: question.option_e || null,
            correct_answer: question.correct_answer || null,
            explanation: question.explanation || null,
            question_type: question.question_type || "multipla_escolha",
            created_by: user.id,
          };

          const { data: insertedQuestion, error: questionError } = await supabase
            .from("questions")
            .insert(questionData)
            .select()
            .single();

          if (questionError) throw questionError;

          // Insert topic relationship if topic_id is provided
          if (question.topic_id && insertedQuestion) {
            const { error: topicError } = await supabase
              .from("question_topics")
              .insert({
                question_id: insertedQuestion.id,
                topic_id: question.topic_id,
              });

            if (topicError) throw topicError;
          }

          // Process images if provided
          if (question.images && question.images.length > 0 && insertedQuestion) {
            for (const image of question.images) {
              let imageUrl = image.url;
              
              // Se for base64, fazer upload para o storage
              if (image.url.startsWith("data:image")) {
                try {
                  // Extrair o tipo de imagem e os dados base64
                  const matches = image.url.match(/^data:image\/(\w+);base64,(.+)$/);
                  if (matches) {
                    const imageType = matches[1];
                    const base64Data = matches[2];
                    
                    // Converter base64 para blob
                    const byteCharacters = atob(base64Data);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                      byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: `image/${imageType}` });
                    
                    // Upload para o storage
                    const fileName = `${insertedQuestion.id}/${Date.now()}_${image.display_order || 0}.${imageType}`;
                    const { data: uploadData, error: uploadError } = await supabase.storage
                      .from("question-images")
                      .upload(fileName, blob, {
                        cacheControl: "3600",
                        upsert: false
                      });
                    
                    if (uploadError) throw uploadError;
                    
                    // Obter URL pública
                    const { data: { publicUrl } } = supabase.storage
                      .from("question-images")
                      .getPublicUrl(uploadData.path);
                    
                    imageUrl = publicUrl;
                  }
                } catch (uploadError: any) {
                  console.error("Erro ao fazer upload de imagem base64:", uploadError);
                  // Continua com a próxima imagem em caso de erro
                  continue;
                }
              }
              
              // Inserir registro da imagem no banco
              const { error: imageError } = await supabase
                .from("question_images")
                .insert({
                  question_id: insertedQuestion.id,
                  image_url: imageUrl,
                  image_type: "question",
                  display_order: image.display_order || 0
                });
              
              if (imageError) {
                console.error("Erro ao inserir imagem:", imageError);
              }
            }
          }

          console.log(`Questão ${index + 1} importada com sucesso!`);
          successCount++;
        } catch (error: any) {
          errorCount++;
          const errorMsg = `Questão ${index + 1}: ${error.message}`;
          errors.push(errorMsg);
          console.error(errorMsg, error);
        }
      }

      if (successCount > 0) {
        toast({
          title: "Importação concluída",
          description: `${successCount} questões importadas com sucesso${errorCount > 0 ? `. ${errorCount} com erro.` : ""}`,
        });
        onSuccess();
        onOpenChange(false);
        setJsonContent("");
      } else {
        const errorDetails = errors.length > 0 ? `\n\nDetalhes:\n${errors.slice(0, 3).join('\n')}` : "";
        throw new Error(`Nenhuma questão foi importada.${errorDetails}`);
      }

      if (errors.length > 0) {
        console.error("Erros durante importação:", errors);
        toast({
          title: "Atenção",
          description: `${errorCount} questões com erro. Veja o console para detalhes.`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Erro geral na importação:", error);
      toast({
        title: "Erro ao importar",
        description: error.message || "Verifique o formato do JSON",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar Questões (JSON)</DialogTitle>
          <DialogDescription>
            Faça upload de um arquivo JSON com um array de questões. Baixe o template para ver a estrutura correta.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadTemplate}
          >
            <Download className="mr-2 h-4 w-4" />
            Baixar Template
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="file-upload" className="cursor-pointer">
              <div className="border-2 border-dashed rounded-lg p-6 hover:border-primary/50 transition-colors">
                <div className="flex flex-col items-center gap-2">
                  <FileJson className="h-10 w-10 text-muted-foreground" />
                  <div className="text-sm font-medium">Clique para selecionar arquivo JSON</div>
                  <div className="text-xs text-muted-foreground">ou cole o JSON abaixo</div>
                </div>
              </div>
              <input
                id="file-upload"
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileUpload}
              />
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="json-content">Conteúdo JSON</Label>
            <Textarea
              id="json-content"
              placeholder='[{"statement": "Qual é...?", "subject_id": "ma", ...}]'
              value={jsonContent}
              onChange={(e) => setJsonContent(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isImporting}
            >
              Cancelar
            </Button>
            <Button onClick={handleImport} disabled={isImporting}>
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importando...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Importar Questões
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
