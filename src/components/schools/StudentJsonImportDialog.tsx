import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Download, FileJson } from "lucide-react";

interface StudentJsonImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolId: string;
  classId?: string;
  className?: string;
}

const JSON_TEMPLATE = [
  { full_name: "João Silva", email: "joao@email.com", password: "senha123" },
  { full_name: "Maria Santos", email: "maria@email.com", password: "senha456" },
];

export function StudentJsonImportDialog({ open, onOpenChange, schoolId }: StudentJsonImportDialogProps) {
  const queryClient = useQueryClient();
  const [jsonText, setJsonText] = useState("");
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<any[] | null>(null);

  const handleDownloadTemplate = () => {
    const blob = new Blob([JSON.stringify(JSON_TEMPLATE, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template_alunos.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (file: File) => {
    const text = await file.text();
    setJsonText(text);
    setImportResults(null);
  };

  const handleImport = async () => {
    setImporting(true);
    setImportResults(null);
    try {
      const parsed = JSON.parse(jsonText);
      const students = Array.isArray(parsed) ? parsed : [parsed];

      if (students.length === 0) {
        toast.error("Nenhum aluno encontrado no JSON");
        return;
      }

      const invalidEntries = students.filter((s: any) => !s.email);
      if (invalidEntries.length > 0) {
        toast.error(`${invalidEntries.length} entrada(s) sem email obrigatório`);
        return;
      }

      const studentsToCreate = students.map((s: any) => ({
        full_name: s.full_name || s.nome || "",
        email: s.email,
        password: s.password || s.senha || "123456",
      }));

      const response = await supabase.functions.invoke("create-school-student", {
        body: { school_id: schoolId, students: studentsToCreate },
      });

      if (response.error) throw new Error(response.error.message);

      setImportResults(response.data?.results || []);
      queryClient.invalidateQueries({ queryKey: ["school-students", schoolId] });

      const created = response.data?.created || 0;
      const failed = response.data?.failed || 0;
      if (failed === 0) toast.success(`${created} aluno(s) importado(s)!`);
      else toast.warning(`${created} criado(s), ${failed} com erro(s)`);
    } catch (error: any) {
      if (error instanceof SyntaxError) {
        toast.error("JSON inválido. Verifique a formatação.");
      } else {
        toast.error("Erro na importação: " + error.message);
      }
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) { setJsonText(""); setImportResults(null); } }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><FileJson className="h-5 w-5" /> Importar Alunos via JSON</DialogTitle>
          <DialogDescription>Cole o JSON ou faça upload de um arquivo .json com os alunos</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Button variant="outline" size="sm" onClick={handleDownloadTemplate} className="gap-2">
            <Download className="h-4 w-4" /> Baixar Template JSON
          </Button>

          <div className="space-y-2">
            <Label>Arquivo JSON</Label>
            <Input type="file" accept=".json" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} />
          </div>

          <div className="space-y-2">
            <Label>Ou cole o JSON abaixo</Label>
            <Textarea
              value={jsonText}
              onChange={(e) => { setJsonText(e.target.value); setImportResults(null); }}
              placeholder={JSON.stringify(JSON_TEMPLATE, null, 2)}
              className="min-h-[200px] font-mono text-xs"
            />
          </div>

          <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground space-y-1">
            <p className="font-medium">Campos aceitos:</p>
            <p><code>email</code> (obrigatório), <code>full_name</code> ou <code>nome</code>, <code>password</code> ou <code>senha</code> (padrão: 123456)</p>
          </div>

          {importResults && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {importResults.map((r: any, i: number) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Badge variant={r.success ? "default" : "destructive"} className="text-xs">{r.success ? "OK" : "Erro"}</Badge>
                  <span>{r.email}</span>
                  {r.error && <span className="text-destructive text-xs">({r.error})</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
          <Button onClick={handleImport} disabled={!jsonText.trim() || importing}>
            {importing ? "Importando..." : "Importar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
