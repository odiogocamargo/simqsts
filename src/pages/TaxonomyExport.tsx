import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Copy, Download, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TaxonomyExport() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formattedText, setFormattedText] = useState('');
  const [jsonData, setJsonData] = useState('');
  const [stats, setStats] = useState({ subjects: 0, contents: 0, topics: 0 });

  const fetchTaxonomy = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('export-taxonomy');
      
      if (error) throw error;

      setFormattedText(data.formatted_text);
      setJsonData(JSON.stringify(data.taxonomy, null, 2));
      setStats({
        subjects: data.total_subjects,
        contents: data.total_contents,
        topics: data.total_topics
      });

      toast({
        title: "Taxonomia carregada!",
        description: `${data.total_subjects} matérias, ${data.total_contents} conteúdos, ${data.total_topics} tópicos`,
      });
    } catch (error) {
      console.error('Error fetching taxonomy:', error);
      toast({
        title: "Erro ao carregar taxonomia",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${label} copiado para a área de transferência`,
    });
  };

  const downloadAsFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download iniciado!",
      description: `Arquivo ${filename} está sendo baixado`,
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Exportar Taxonomia</h1>
          <p className="text-muted-foreground">
            Exporte todos os IDs válidos de matérias, conteúdos e tópicos para usar no seu bot do ChatGPT
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Estatísticas da Taxonomia</CardTitle>
            <CardDescription>Total de elementos cadastrados na plataforma</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{stats.subjects}</div>
              <div className="text-sm text-muted-foreground">Matérias</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{stats.contents}</div>
              <div className="text-sm text-muted-foreground">Conteúdos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{stats.topics}</div>
              <div className="text-sm text-muted-foreground">Tópicos</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Carregar Taxonomia Atualizada</CardTitle>
            <CardDescription>
              Clique no botão abaixo para carregar a taxonomia mais recente do banco de dados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchTaxonomy} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Carregando...' : 'Carregar Taxonomia'}
            </Button>
          </CardContent>
        </Card>

        {formattedText && (
          <Card>
            <CardHeader>
              <CardTitle>Dados Exportados</CardTitle>
              <CardDescription>
                Escolha o formato que deseja usar no seu bot do ChatGPT
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="formatted" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="formatted">Texto Formatado</TabsTrigger>
                  <TabsTrigger value="json">JSON</TabsTrigger>
                </TabsList>
                
                <TabsContent value="formatted" className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(formattedText, 'Texto formatado')}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copiar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => downloadAsFile(formattedText, 'taxonomia-sim-questoes.txt')}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                  <Textarea
                    value={formattedText}
                    readOnly
                    className="font-mono text-xs h-[500px]"
                  />
                  <div className="text-sm text-muted-foreground">
                    💡 Cole este texto nas instruções do seu bot do ChatGPT
                  </div>
                </TabsContent>
                
                <TabsContent value="json" className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(jsonData, 'JSON')}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copiar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => downloadAsFile(jsonData, 'taxonomia-sim-questoes.json')}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                  <Textarea
                    value={jsonData}
                    readOnly
                    className="font-mono text-xs h-[500px]"
                  />
                  <div className="text-sm text-muted-foreground">
                    💡 Use este JSON se seu bot precisar de dados estruturados
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
