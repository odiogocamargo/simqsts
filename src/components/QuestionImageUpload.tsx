import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Loader2, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ExtractedQuestionData {
  exam_id: string;
  subject_id: string;
  content_id?: string;
  topic_id?: string;
  statement: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_e: string;
  correct_answer: string;
  year?: number;
  difficulty?: string;
  confidence?: number;
  notes?: string;
}

interface QuestionImageUploadProps {
  onDataExtracted: (data: ExtractedQuestionData) => void;
}

export const QuestionImageUpload = ({ onDataExtracted }: QuestionImageUploadProps) => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedQuestionData | null>(null);

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione uma imagem válida',
        variant: 'destructive',
      });
      return;
    }

    // Validar tamanho (máx 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'Erro',
        description: 'A imagem deve ter no máximo 10MB',
        variant: 'destructive',
      });
      return;
    }

    // Criar preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Analisar imagem
    await analyzeImage(file);
  };

  const analyzeImage = async (file: File) => {
    setIsAnalyzing(true);
    setExtractedData(null);

    try {
      // Converter imagem para base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      
      const imageBase64 = await base64Promise;

      console.log('Sending image to AI for analysis...');

      // Chamar edge function
      const { data, error } = await supabase.functions.invoke('analyze-question-image', {
        body: { imageBase64 }
      });

      if (error) {
        console.error('Error invoking function:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Erro ao analisar imagem');
      }

      console.log('AI analysis completed:', data.data);
      setExtractedData(data.data);
      
      toast({
        title: 'Análise concluída!',
        description: `Questão identificada com ${Math.round((data.data.confidence || 0.8) * 100)}% de confiança`,
      });

      // Passar dados extraídos para o componente pai
      onDataExtracted(data.data);

    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: 'Erro na análise',
        description: error instanceof Error ? error.message : 'Erro ao processar imagem',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetUpload = () => {
    setPreviewUrl(null);
    setExtractedData(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Upload de Questão por Imagem
        </CardTitle>
        <CardDescription>
          Faça upload de um print da questão e a IA irá extrair automaticamente todos os dados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!previewUrl ? (
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              disabled={isAnalyzing}
            />
            <label 
              htmlFor="image-upload" 
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <Upload className="h-12 w-12 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Clique para fazer upload
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WEBP até 10MB
                </p>
              </div>
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden border">
              <img 
                src={previewUrl} 
                alt="Preview da questão"
                className="w-full h-auto max-h-96 object-contain"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white space-y-2">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                    <p className="text-sm font-medium">Analisando imagem...</p>
                  </div>
                </div>
              )}
            </div>

            {extractedData && (
              <Alert className="border-green-500/50 bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p className="font-medium">Dados extraídos com sucesso!</p>
                    <ul className="text-xs space-y-1 mt-2">
                      <li>• <strong>Vestibular:</strong> {extractedData.exam_id}</li>
                      <li>• <strong>Matéria:</strong> {extractedData.subject_id}</li>
                      {extractedData.content_id && (
                        <li>• <strong>Conteúdo sugerido:</strong> {extractedData.content_id}</li>
                      )}
                      {extractedData.topic_id && (
                        <li>• <strong>Tópico sugerido:</strong> {extractedData.topic_id}</li>
                      )}
                      <li>• <strong>Resposta correta:</strong> {extractedData.correct_answer.toUpperCase()}</li>
                      {extractedData.year && (
                        <li>• <strong>Ano:</strong> {extractedData.year}</li>
                      )}
                      {extractedData.statement && (
                        <li>• <strong>Enunciado:</strong> {extractedData.statement.substring(0, 100)}...</li>
                      )}
                    </ul>
                    {extractedData.notes && (
                      <p className="text-xs mt-2 text-muted-foreground italic">
                        {extractedData.notes}
                      </p>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {!isAnalyzing && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={resetUpload}
                  className="flex-1"
                >
                  Nova Imagem
                </Button>
                {extractedData && (
                  <Button 
                    onClick={() => {
                      toast({
                        title: 'Dados aplicados!',
                        description: 'Revise os campos abaixo antes de salvar',
                      });
                    }}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Usar Dados
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Dica:</strong> Para melhores resultados, certifique-se de que:
            <ul className="mt-1 space-y-0.5 ml-4">
              <li>• A imagem está nítida e bem iluminada</li>
              <li>• A alternativa correta está grifada em verde</li>
              <li>• Todo o texto da questão está visível</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
