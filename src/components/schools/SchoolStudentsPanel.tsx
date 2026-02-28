import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, UserPlus, Upload, Trash2, Search, Loader2, Building2, Download } from "lucide-react";

interface SchoolStudentsPanelProps {
  school: { id: string; name: string; logo_url?: string | null };
  onBack: () => void;
}

interface StudentRow {
  id: string; // school_students.id
  user_id: string;
  created_at: string;
  profile: {
    full_name: string | null;
    cpf: string | null;
    whatsapp: string | null;
  } | null;
  email?: string;
}

export function SchoolStudentsPanel({ school, onBack }: SchoolStudentsPanelProps) {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Single student form
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");

  // Import
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<any[] | null>(null);

  const { data: students, isLoading } = useQuery({
    queryKey: ["school-students", school.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("school_students")
        .select("id, user_id, created_at")
        .eq("school_id", school.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch profiles
      const userIds = data.map((d: any) => d.user_id);
      if (userIds.length === 0) return [];

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, cpf, whatsapp")
        .in("id", userIds);

      const profileMap = new Map(profiles?.map((p: any) => [p.id, p]) || []);

      return data.map((d: any) => ({
        ...d,
        profile: profileMap.get(d.user_id) || null,
      })) as StudentRow[];
    },
  });

  const createStudentMutation = useMutation({
    mutationFn: async () => {
      const response = await supabase.functions.invoke("create-school-student", {
        body: {
          school_id: school.id,
          students: [{ email: studentEmail, password: studentPassword, full_name: studentName }],
        },
      });

      if (response.error) throw new Error(response.error.message);
      if (response.data?.error) throw new Error(response.data.error);
      if (response.data?.results?.[0]?.error) throw new Error(response.data.results[0].error);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-students", school.id] });
      toast.success("Aluno criado com sucesso!");
      setIsAddOpen(false);
      setStudentName("");
      setStudentEmail("");
      setStudentPassword("");
    },
    onError: (error) => {
      toast.error("Erro: " + error.message);
    },
  });

  const handleImportCSV = async () => {
    if (!csvFile) return;

    setImporting(true);
    setImportResults(null);

    try {
      const text = await csvFile.text();
      const lines = text.split("\n").filter(l => l.trim());

      // Skip header if present
      const startIdx = lines[0].toLowerCase().includes("email") ? 1 : 0;
      const studentsToCreate: { email: string; password: string; full_name: string }[] = [];

      for (let i = startIdx; i < lines.length; i++) {
        const parts = lines[i].split(/[;,]/).map(p => p.trim().replace(/^"|"$/g, ""));
        if (parts.length >= 2) {
          studentsToCreate.push({
            full_name: parts[0] || "",
            email: parts[1] || "",
            password: parts[2] || "123456",
          });
        }
      }

      if (studentsToCreate.length === 0) {
        toast.error("Nenhum aluno encontrado no arquivo");
        return;
      }

      const response = await supabase.functions.invoke("create-school-student", {
        body: { school_id: school.id, students: studentsToCreate },
      });

      if (response.error) throw new Error(response.error.message);

      setImportResults(response.data?.results || []);
      queryClient.invalidateQueries({ queryKey: ["school-students", school.id] });

      const created = response.data?.created || 0;
      const failed = response.data?.failed || 0;
      if (failed === 0) {
        toast.success(`${created} aluno(s) importado(s) com sucesso!`);
      } else {
        toast.warning(`${created} criado(s), ${failed} com erro(s)`);
      }
    } catch (error: any) {
      toast.error("Erro na importação: " + error.message);
    } finally {
      setImporting(false);
    }
  };

  const unlinkMutation = useMutation({
    mutationFn: async (linkId: string) => {
      const { error } = await supabase.from("school_students").delete().eq("id", linkId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-students", school.id] });
      toast.success("Aluno desvinculado!");
    },
    onError: (error) => {
      toast.error("Erro: " + error.message);
    },
  });

  const filteredStudents = students?.filter(s =>
    s.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.profile?.cpf?.includes(searchTerm)
  ) || [];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            {school.logo_url ? (
              <img src={school.logo_url} alt={school.name} className="h-10 w-10 rounded-lg object-cover" />
            ) : (
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-foreground">{school.name}</h1>
              <p className="text-muted-foreground">Alunos vinculados: {students?.length || 0}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={() => setIsAddOpen(true)} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Adicionar Aluno
          </Button>
          <Button variant="outline" onClick={() => setIsImportOpen(true)} className="gap-2">
            <Upload className="h-4 w-4" />
            Importar CSV
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar aluno..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Students Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {searchTerm ? "Nenhum aluno encontrado" : "Nenhum aluno vinculado a esta escola"}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead>Vinculado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.profile?.full_name || "Sem nome"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {student.profile?.cpf || "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {student.profile?.whatsapp || "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(student.created_at).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Desvincular aluno?</AlertDialogTitle>
                              <AlertDialogDescription>
                                O aluno será desvinculado da escola, mas sua conta não será excluída.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => unlinkMutation.mutate(student.id)}>
                                Desvincular
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Student Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Aluno</DialogTitle>
            <DialogDescription>Crie uma conta de aluno vinculada a {school.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Nome do aluno" />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} placeholder="aluno@email.com" />
            </div>
            <div className="space-y-2">
              <Label>Senha *</Label>
              <Input type="password" value={studentPassword} onChange={(e) => setStudentPassword(e.target.value)} placeholder="Mínimo 6 caracteres" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancelar</Button>
            <Button
              onClick={() => createStudentMutation.mutate()}
              disabled={!studentEmail || !studentPassword || createStudentMutation.isPending}
            >
              {createStudentMutation.isPending ? "Criando..." : "Criar Aluno"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import CSV Dialog */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Importar Alunos via CSV</DialogTitle>
            <DialogDescription>
              Formato: Nome, Email, Senha (uma linha por aluno). Se a senha for omitida, será usada "123456".
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Arquivo CSV</Label>
              <Input type="file" accept=".csv,.txt" onChange={(e) => {
                setCsvFile(e.target.files?.[0] || null);
                setImportResults(null);
              }} />
            </div>
            <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
              <p className="font-medium mb-1">Exemplo do formato:</p>
              <pre className="text-xs">
{`Nome,Email,Senha
João Silva,joao@email.com,senha123
Maria Santos,maria@email.com,`}
              </pre>
            </div>

            {importResults && (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {importResults.map((r: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Badge variant={r.success ? "default" : "destructive"} className="text-xs">
                      {r.success ? "OK" : "Erro"}
                    </Badge>
                    <span>{r.email}</span>
                    {r.error && <span className="text-destructive text-xs">({r.error})</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportOpen(false)}>Fechar</Button>
            <Button
              onClick={handleImportCSV}
              disabled={!csvFile || importing}
            >
              {importing ? "Importando..." : "Importar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
