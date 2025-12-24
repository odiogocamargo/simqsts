import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface MigrationResult {
  questionId: string;
  oldSubjectId: string;
  oldContentId: string;
  oldTopicId: string | null;
  oldTopicName: string | null;
  newSubjectId: string | null;
  newContentId: string | null;
  newTopicId: string | null;
  status: 'migrated' | 'needs_review';
  confidence: string;
  reason: string;
}

interface MigrationReport {
  summary: {
    dryRun: boolean;
    totalQuestions: number;
    migratedQuestions: number;
    needsReviewQuestions: number;
    successRate: string;
  };
  taxonomy: {
    areas: number;
    subjects: number;
    contents: number;
    topics: number;
  };
  migrationDetails: MigrationResult[];
  newTaxonomyPreview: {
    areas: { id: string; name: string }[];
    subjects: { id: string; name: string; area_id: string }[];
    contents: { id: string; name: string; subject_id: string }[];
    topics: { id: string; name: string; content_id: string }[];
  };
}

export default function TaxonomyMigration() {
  const [csvContent, setCsvContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<MigrationReport | null>(null);
  const [dryRun, setDryRun] = useState(true);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCsvContent(content);
      toast.success('Arquivo CSV carregado');
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!csvContent) {
      toast.error('Por favor, carregue um arquivo CSV primeiro');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('import-taxonomy-v3', {
        body: { csvContent, dryRun }
      });

      if (error) throw error;

      setReport(data);
      
      if (dryRun) {
        toast.info('Análise concluída (dry run). Nenhuma alteração foi feita.');
      } else {
        toast.success('Migração executada com sucesso!');
      }
    } catch (error) {
      console.error('Error importing taxonomy:', error);
      toast.error('Erro ao importar taxonomia');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!report) return;

    const reportText = generateReportText(report);
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-migracao-v3-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Relatório baixado');
  };

  const generateReportText = (report: MigrationReport): string => {
    let text = '='.repeat(60) + '\n';
    text += 'RELATÓRIO DE MIGRAÇÃO - TAXONOMIA V3\n';
    text += `Data: ${new Date().toLocaleString('pt-BR')}\n`;
    text += `Modo: ${report.summary.dryRun ? 'SIMULAÇÃO (Dry Run)' : 'EXECUÇÃO REAL'}\n`;
    text += '='.repeat(60) + '\n\n';

    text += '📊 RESUMO\n';
    text += '-'.repeat(40) + '\n';
    text += `Total de questões: ${report.summary.totalQuestions}\n`;
    text += `Questões migradas: ${report.summary.migratedQuestions}\n`;
    text += `Questões para revisão: ${report.summary.needsReviewQuestions}\n`;
    text += `Taxa de sucesso: ${report.summary.successRate}\n\n`;

    text += '🏗️ NOVA TAXONOMIA\n';
    text += '-'.repeat(40) + '\n';
    text += `Áreas: ${report.taxonomy.areas}\n`;
    text += `Matérias: ${report.taxonomy.subjects}\n`;
    text += `Conteúdos/Temas: ${report.taxonomy.contents}\n`;
    text += `Tópicos: ${report.taxonomy.topics}\n\n`;

    const migrated = report.migrationDetails.filter(r => r.status === 'migrated');
    const needsReview = report.migrationDetails.filter(r => r.status === 'needs_review');

    if (migrated.length > 0) {
      text += '✅ QUESTÕES MIGRADAS COM SUCESSO\n';
      text += '-'.repeat(40) + '\n';
      migrated.forEach(r => {
        text += `ID: ${r.questionId}\n`;
        text += `  De: ${r.oldSubjectId} / ${r.oldContentId} / ${r.oldTopicId || 'sem tópico'}\n`;
        text += `  Para: ${r.newSubjectId} / ${r.newContentId} / ${r.newTopicId}\n`;
        text += `  Confiança: ${r.confidence} | Motivo: ${r.reason}\n\n`;
      });
    }

    if (needsReview.length > 0) {
      text += '\n⚠️ QUESTÕES QUE PRECISAM DE REVISÃO MANUAL\n';
      text += '-'.repeat(40) + '\n';
      needsReview.forEach(r => {
        text += `ID: ${r.questionId}\n`;
        text += `  Subject atual: ${r.oldSubjectId}\n`;
        text += `  Content atual: ${r.oldContentId}\n`;
        text += `  Topic atual: ${r.oldTopicId || 'nenhum'} (${r.oldTopicName || 'sem nome'})\n`;
        text += `  Motivo: ${r.reason}\n\n`;
      });
    }

    text += '\n' + '='.repeat(60) + '\n';
    text += 'FIM DO RELATÓRIO\n';
    text += '='.repeat(60) + '\n';

    return text;
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Migração de Taxonomia V3</h1>
          <p className="text-muted-foreground">
            Importe a nova taxonomia e migre as questões existentes
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Upload CSV */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Carregar CSV
              </CardTitle>
              <CardDescription>
                Faça upload do arquivo CSV com a taxonomia V3
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileText className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Clique para upload</span> ou arraste
                    </p>
                    <p className="text-xs text-muted-foreground">CSV com colunas: area, subject, theme, topic</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>

              {csvContent && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    ✓ CSV carregado ({csvContent.split('\n').length - 1} linhas)
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Controles */}
          <Card>
            <CardHeader>
              <CardTitle>Configuração da Migração</CardTitle>
              <CardDescription>
                Configure e execute a migração
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="dry-run"
                  checked={dryRun}
                  onCheckedChange={setDryRun}
                />
                <Label htmlFor="dry-run">
                  Modo simulação (Dry Run)
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                {dryRun 
                  ? '🔒 Apenas analisa e gera relatório, sem fazer alterações no banco.'
                  : '⚠️ ATENÇÃO: Irá modificar o banco de dados. Certifique-se de ter backup!'}
              </p>

              <Button
                onClick={handleImport}
                disabled={loading || !csvContent}
                className="w-full"
                variant={dryRun ? 'default' : 'destructive'}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : dryRun ? (
                  'Analisar (Dry Run)'
                ) : (
                  'Executar Migração'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Relatório */}
        {report && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Relatório de Migração
                    {report.summary.dryRun ? (
                      <Badge variant="outline">Simulação</Badge>
                    ) : (
                      <Badge variant="default">Executado</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Resultado da análise/migração da taxonomia
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={downloadReport}>
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Relatório
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{report.summary.totalQuestions}</div>
                    <p className="text-sm text-muted-foreground">Total de Questões</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-green-600">
                      {report.summary.migratedQuestions}
                    </div>
                    <p className="text-sm text-muted-foreground">Migradas</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-yellow-600">
                      {report.summary.needsReviewQuestions}
                    </div>
                    <p className="text-sm text-muted-foreground">Para Revisão</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{report.summary.successRate}</div>
                    <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                  </CardContent>
                </Card>
              </div>

              {/* Taxonomy Stats */}
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Nova Taxonomia V3</h3>
                <div className="flex gap-4 text-sm">
                  <span>Áreas: <strong>{report.taxonomy.areas}</strong></span>
                  <span>Matérias: <strong>{report.taxonomy.subjects}</strong></span>
                  <span>Conteúdos: <strong>{report.taxonomy.contents}</strong></span>
                  <span>Tópicos: <strong>{report.taxonomy.topics}</strong></span>
                </div>
              </div>

              {/* Migration Details Table */}
              <div>
                <h3 className="font-semibold mb-2">Detalhes da Migração</h3>
                <ScrollArea className="h-[400px] rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>ID Questão</TableHead>
                        <TableHead>Tópico Antigo</TableHead>
                        <TableHead>Novo Tópico</TableHead>
                        <TableHead>Confiança</TableHead>
                        <TableHead>Motivo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {report.migrationDetails.map((detail, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {detail.status === 'migrated' ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {detail.questionId.slice(0, 8)}...
                          </TableCell>
                          <TableCell className="text-xs">
                            {detail.oldTopicName || detail.oldTopicId || '-'}
                          </TableCell>
                          <TableCell className="text-xs">
                            {detail.newTopicId || '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              detail.confidence === 'exact' ? 'default' :
                              detail.confidence === 'equivalent' ? 'secondary' :
                              detail.confidence === 'parent' ? 'outline' :
                              'destructive'
                            }>
                              {detail.confidence}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                            {detail.reason}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
