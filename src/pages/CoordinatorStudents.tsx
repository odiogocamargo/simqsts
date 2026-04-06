import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { UserPlus, Upload, Trash2, Search, Loader2, FileJson } from "lucide-react";
import { StudentJsonImportDialog } from "@/components/schools/StudentJsonImportDialog";

export default function CoordinatorStudents() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClassId, setSelectedClassId] = useState<string>("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<any[] | null>(null);
  const [isJsonImportOpen, setIsJsonImportOpen] = useState(false);

  const { data: coordLink } = useQuery({
    queryKey: ["coordinator-school", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("school_coordinators")
        .select("school_id, schools(name)")
        .eq("user_id", user!.id)
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const schoolId = coordLink?.school_id;

  // Fetch classes for filter
  const { data: classes } = useQuery({
    queryKey: ["school-classes", schoolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("school_classes")
        .select("id, name, year, shift")
        .eq("school_id", schoolId!)
        .eq("active", true)
        .order("name");
      if (error) throw error;
      return data as { id: string; name: string; year: number; shift: string | null }[];
    },
    enabled: !!schoolId,
  });

  // Fetch class-student links when a class is selected
  const { data: classStudentIds } = useQuery({
    queryKey: ["class-student-ids", selectedClassId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("school_class_students")
        .select("student_id")
        .eq("class_id", selectedClassId);
      if (error) throw error;
      return new Set((data || []).map((d: any) => d.student_id));
    },
    enabled: selectedClassId !== "all" && selectedClassId !== "no_class",
  });

  const { data: students, isLoading } = useQuery({
    queryKey: ["school-students", schoolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("school_students")
        .select("id, user_id, created_at")
        .eq("school_id", schoolId!)
        .order("created_at", { ascending: false });
      if (error) throw error;

      const userIds = data.map((d: any) => d.user_id);
      if (userIds.length === 0) return [];

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, cpf, whatsapp")
        .in("id", userIds);

      const profileMap = new Map(profiles?.map((p: any) => [p.id, p]) || []);
      return data.map((d: any) => ({ ...d, profile: profileMap.get(d.user_id) || null }));
    },
    enabled: !!schoolId,
  });

  // Fetch ALL class-student links for "no_class" filter
  const { data: allClassStudentIds } = useQuery({
    queryKey: ["all-class-student-ids", schoolId],
    queryFn: async () => {
      if (!classes || classes.length === 0) return new Set<string>();
      const classIds = classes.map(c => c.id);
      const { data, error } = await supabase
        .from("school_class_students")
        .select("student_id")
        .in("class_id", classIds);
      if (error) throw error;
      return new Set((data || []).map((d: any) => d.student_id));
    },
    enabled: selectedClassId === "no_class" && !!classes,
  });

  const createStudentMutation = useMutation({
    mutationFn: async () => {
      const response = await supabase.functions.invoke("create-school-student", {
        body: { school_id: schoolId, students: [{ email: studentEmail, password: studentPassword, full_name: studentName }] },
      });
      if (response.error) throw new Error(response.error.message);
      if (response.data?.error) throw new Error(response.data.error);
      if (response.data?.results?.[0]?.error) throw new Error(response.data.results[0].error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-students", schoolId] });
      toast.success("Aluno criado com sucesso!");
      setIsAddOpen(false);
      setStudentName(""); setStudentEmail(""); setStudentPassword("");
    },
    onError: (error) => toast.error("Erro: " + error.message),
  });

  const handleImportCSV = async () => {
    if (!csvFile) return;
    setImporting(true);
    setImportResults(null);
    try {
      const text = await csvFile.text();
      const lines = text.split("\n").filter(l => l.trim());
      const startIdx = lines[0].toLowerCase().includes("email") ? 1 : 0;
      const studentsToCreate: { email: string; password: string; full_name: string }[] = [];
      for (let i = startIdx; i < lines.length; i++) {
        const parts = lines[i].split(/[;,]/).map(p => p.trim().replace(/^"|"$/g, ""));
        if (parts.length >= 2) {
          studentsToCreate.push({ full_name: parts[0] || "", email: parts[1] || "", password: parts[2] || "123456" });
        }
      }
      if (studentsToCreate.length === 0) { toast.error("Nenhum aluno encontrado no arquivo"); return; }
      const response = await supabase.functions.invoke("create-school-student", { body: { school_id: schoolId, students: studentsToCreate } });
      if (response.error) throw new Error(response.error.message);
      setImportResults(response.data?.results || []);
      queryClient.invalidateQueries({ queryKey: ["school-students", schoolId] });
      const created = response.data?.created || 0;
      const failed = response.data?.failed || 0;
      if (failed === 0) toast.success(`${created} aluno(s) importado(s)!`);
      else toast.warning(`${created} criado(s), ${failed} com erro(s)`);
    } catch (error: any) {
      toast.error("Erro na importação: " + error.message);
    } finally { setImporting(false); }
  };

  const unlinkMutation = useMutation({
    mutationFn: async (linkId: string) => {
      const { error } = await supabase.from("school_students").delete().eq("id", linkId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-students", schoolId] });
      toast.success("Aluno desvinculado!");
    },
    onError: (error) => toast.error("Erro: " + error.message),
  });

  // Apply filters
  const filtered = (students || []).filter((s: any) => {
    const matchesSearch =
      !searchTerm ||
      s.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.profile?.cpf?.includes(searchTerm);

    let matchesClass = true;
    if (selectedClassId === "no_class") {
      matchesClass = !allClassStudentIds?.has(s.user_id);
    } else if (selectedClassId !== "all") {
      matchesClass = classStudentIds?.has(s.user_id) ?? false;
    }

    return matchesSearch && matchesClass;
  });

  if (!schoolId) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gerenciar Alunos</h1>
          <p className="text-muted-foreground">Adicione e gerencie os alunos da sua escola</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={() => setIsAddOpen(true)} className="gap-2">
            <UserPlus className="h-4 w-4" /> Adicionar Aluno
          </Button>
          <Button variant="outline" onClick={() => setIsImportOpen(true)} className="gap-2">
            <Upload className="h-4 w-4" /> Importar CSV
          </Button>
          <Button variant="outline" onClick={() => setIsJsonImportOpen(true)} className="gap-2">
            <FileJson className="h-4 w-4" /> Importar JSON
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar aluno..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
          <Select value={selectedClassId} onValueChange={setSelectedClassId}>
            <SelectTrigger className="w-full sm:w-[220px]">
              <SelectValue placeholder="Filtrar por turma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as turmas</SelectItem>
              <SelectItem value="no_class">Sem turma</SelectItem>
              {(classes || []).map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name} ({c.year}{c.shift ? ` - ${c.shift}` : ""})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">{searchTerm || selectedClassId !== "all" ? "Nenhum aluno encontrado" : "Nenhum aluno vinculado"}</div>
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
                  {filtered.map((student: any) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.profile?.full_name || "Sem nome"}</TableCell>
                      <TableCell className="text-muted-foreground">{student.profile?.cpf || "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{student.profile?.whatsapp || "—"}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{new Date(student.created_at).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Desvincular aluno?</AlertDialogTitle>
                              <AlertDialogDescription>O aluno será desvinculado da escola.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => unlinkMutation.mutate(student.id)}>Desvincular</AlertDialogAction>
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
            <DialogDescription>Crie uma conta de aluno vinculada à escola</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Nome Completo</Label><Input value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Nome do aluno" /></div>
            <div className="space-y-2"><Label>Email *</Label><Input type="email" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} placeholder="aluno@email.com" /></div>
            <div className="space-y-2"><Label>Senha *</Label><Input type="password" value={studentPassword} onChange={(e) => setStudentPassword(e.target.value)} placeholder="Mínimo 6 caracteres" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancelar</Button>
            <Button onClick={() => createStudentMutation.mutate()} disabled={!studentEmail || !studentPassword || createStudentMutation.isPending}>
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
            <DialogDescription>Formato: Nome, Email, Senha (uma linha por aluno)</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Arquivo CSV</Label><Input type="file" accept=".csv,.txt" onChange={(e) => { setCsvFile(e.target.files?.[0] || null); setImportResults(null); }} /></div>
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
            <Button variant="outline" onClick={() => setIsImportOpen(false)}>Fechar</Button>
            <Button onClick={handleImportCSV} disabled={!csvFile || importing}>{importing ? "Importando..." : "Importar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {schoolId && (
        <StudentJsonImportDialog
          open={isJsonImportOpen}
          onOpenChange={setIsJsonImportOpen}
          schoolId={schoolId}
        />
      )}
    </Layout>
  );
}