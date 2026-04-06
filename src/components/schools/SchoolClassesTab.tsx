import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Users, Loader2, ChevronRight, ChevronLeft, UserPlus, UserMinus, FileJson } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { StudentJsonImportDialog } from "@/components/schools/StudentJsonImportDialog";

interface SchoolClassesTabProps {
  schoolId: string;
  schoolName: string;
}

interface SchoolClass {
  id: string;
  name: string;
  year: number;
  shift: string | null;
  active: boolean;
  created_at: string;
  student_count?: number;
}

interface StudentRow {
  id: string;
  user_id: string;
  profile: { full_name: string | null } | null;
}

export function SchoolClassesTab({ schoolId, schoolName }: SchoolClassesTabProps) {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<SchoolClass | null>(null);
  const [className, setClassName] = useState("");
  const [classYear, setClassYear] = useState(new Date().getFullYear().toString());
  const [classShift, setClassShift] = useState("");
  const [isAddStudentsOpen, setIsAddStudentsOpen] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isJsonImportOpen, setIsJsonImportOpen] = useState(false);

  // Fetch classes
  const { data: classes, isLoading: loadingClasses } = useQuery({
    queryKey: ["school-classes", schoolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("school_classes" as any)
        .select("*")
        .eq("school_id", schoolId)
        .order("year", { ascending: false })
        .order("name");
      if (error) throw error;

      // Get student counts
      const classIds = (data as any[]).map((c: any) => c.id);
      if (classIds.length === 0) return data as unknown as SchoolClass[];

      const { data: counts } = await supabase
        .from("school_class_students" as any)
        .select("class_id")
        .in("class_id", classIds);

      const countMap = new Map<string, number>();
      (counts as any[] || []).forEach((c: any) => {
        countMap.set(c.class_id, (countMap.get(c.class_id) || 0) + 1);
      });

      return (data as any[]).map((c: any) => ({
        ...c,
        student_count: countMap.get(c.id) || 0,
      })) as SchoolClass[];
    },
  });

  // Fetch students in selected class
  const { data: classStudents, isLoading: loadingStudents } = useQuery({
    queryKey: ["class-students", selectedClass?.id],
    enabled: !!selectedClass,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("school_class_students" as any)
        .select("id, student_id")
        .eq("class_id", selectedClass!.id);
      if (error) throw error;

      const studentIds = (data as any[]).map((d: any) => d.student_id);
      if (studentIds.length === 0) return [];

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", studentIds);

      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);
      return (data as any[]).map((d: any) => ({
        id: d.id,
        user_id: d.student_id,
        profile: profileMap.get(d.student_id) || null,
      })) as StudentRow[];
    },
  });

  // Fetch school students NOT in this class (for adding)
  const { data: availableStudents } = useQuery({
    queryKey: ["available-students-for-class", schoolId, selectedClass?.id],
    enabled: isAddStudentsOpen && !!selectedClass,
    queryFn: async () => {
      // Get all school students
      const { data: allStudents } = await supabase
        .from("school_students")
        .select("user_id")
        .eq("school_id", schoolId);

      // Get students already in this class
      const { data: inClass } = await supabase
        .from("school_class_students" as any)
        .select("student_id")
        .eq("class_id", selectedClass!.id);

      const inClassSet = new Set((inClass as any[] || []).map((s: any) => s.student_id));
      const availableIds = (allStudents || [])
        .map((s) => s.user_id)
        .filter((id) => !inClassSet.has(id));

      if (availableIds.length === 0) return [];

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", availableIds);

      return (profiles || []).map((p) => ({
        user_id: p.id,
        full_name: p.full_name,
      }));
    },
  });

  // Create class
  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("school_classes" as any).insert({
        school_id: schoolId,
        name: className,
        year: parseInt(classYear),
        shift: classShift || null,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-classes", schoolId] });
      toast.success("Turma criada!");
      setIsCreateOpen(false);
      setClassName("");
      setClassShift("");
    },
    onError: (e) => toast.error("Erro: " + e.message),
  });

  // Delete class
  const deleteMutation = useMutation({
    mutationFn: async (classId: string) => {
      const { error } = await supabase.from("school_classes" as any).delete().eq("id", classId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-classes", schoolId] });
      if (selectedClass) setSelectedClass(null);
      toast.success("Turma removida!");
    },
    onError: (e) => toast.error("Erro: " + e.message),
  });

  // Add students to class
  const addStudentsMutation = useMutation({
    mutationFn: async () => {
      const rows = selectedStudentIds.map((sid) => ({
        class_id: selectedClass!.id,
        student_id: sid,
      }));
      const { error } = await supabase.from("school_class_students" as any).insert(rows as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-students", selectedClass?.id] });
      queryClient.invalidateQueries({ queryKey: ["available-students-for-class"] });
      queryClient.invalidateQueries({ queryKey: ["school-classes", schoolId] });
      toast.success(`${selectedStudentIds.length} aluno(s) adicionado(s)!`);
      setIsAddStudentsOpen(false);
      setSelectedStudentIds([]);
    },
    onError: (e) => toast.error("Erro: " + e.message),
  });

  // Remove student from class
  const removeStudentMutation = useMutation({
    mutationFn: async (linkId: string) => {
      const { error } = await supabase.from("school_class_students" as any).delete().eq("id", linkId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-students", selectedClass?.id] });
      queryClient.invalidateQueries({ queryKey: ["school-classes", schoolId] });
      toast.success("Aluno removido da turma!");
    },
    onError: (e) => toast.error("Erro: " + e.message),
  });

  const toggleStudent = (userId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  // Detail view of a class
  if (selectedClass) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setSelectedClass(null)}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
          </Button>
          <div>
            <h3 className="text-lg font-semibold">{selectedClass.name}</h3>
            <p className="text-sm text-muted-foreground">
              {selectedClass.year}{selectedClass.shift ? ` · ${selectedClass.shift}` : ""}
            </p>
          </div>
        </div>

        <Button onClick={() => { setIsAddStudentsOpen(true); setSelectedStudentIds([]); }} className="gap-2">
          <UserPlus className="h-4 w-4" /> Adicionar Alunos
        </Button>

        <Card>
          <CardContent className="p-0">
            {loadingStudents ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : !classStudents?.length ? (
              <div className="text-center py-12 text-muted-foreground">Nenhum aluno nesta turma</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classStudents.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.profile?.full_name || "Sem nome"}</TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <UserMinus className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remover da turma?</AlertDialogTitle>
                              <AlertDialogDescription>O aluno será removido da turma, mas continuará vinculado à escola.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => removeStudentMutation.mutate(s.id)}>Remover</AlertDialogAction>
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

        {/* Add students dialog */}
        <Dialog open={isAddStudentsOpen} onOpenChange={setIsAddStudentsOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Alunos à Turma</DialogTitle>
              <DialogDescription>Selecione os alunos da escola para adicionar a {selectedClass.name}</DialogDescription>
            </DialogHeader>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {!availableStudents?.length ? (
                <p className="text-sm text-muted-foreground text-center py-4">Todos os alunos já estão nesta turma</p>
              ) : (
                availableStudents.map((s) => (
                  <label key={s.user_id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer">
                    <Checkbox
                      checked={selectedStudentIds.includes(s.user_id)}
                      onCheckedChange={() => toggleStudent(s.user_id)}
                    />
                    <span className="text-sm">{s.full_name || "Sem nome"}</span>
                  </label>
                ))
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddStudentsOpen(false)}>Cancelar</Button>
              <Button
                onClick={() => addStudentsMutation.mutate()}
                disabled={selectedStudentIds.length === 0 || addStudentsMutation.isPending}
              >
                {addStudentsMutation.isPending ? "Adicionando..." : `Adicionar (${selectedStudentIds.length})`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Classes list view
  return (
    <div className="space-y-4">
      <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" /> Nova Turma
      </Button>

      {loadingClasses ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : !classes?.length ? (
        <Card>
          <CardContent className="text-center py-12 text-muted-foreground">
            Nenhuma turma cadastrada
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((c) => (
            <Card
              key={c.id}
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => setSelectedClass(c)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{c.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {c.year}{c.shift ? ` · ${c.shift}` : ""}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      <span>{c.student_count || 0} aluno(s)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive h-8 w-8"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir turma?</AlertDialogTitle>
                          <AlertDialogDescription>A turma e todos os vínculos de alunos serão removidos.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteMutation.mutate(c.id)}>Excluir</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create class dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Turma</DialogTitle>
            <DialogDescription>Crie uma turma para {schoolName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome da Turma *</Label>
              <Input value={className} onChange={(e) => setClassName(e.target.value)} placeholder="Ex: 3º Ano A" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ano</Label>
                <Input type="number" value={classYear} onChange={(e) => setClassYear(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Turno</Label>
                <Select value={classShift} onValueChange={setClassShift}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manhã">Manhã</SelectItem>
                    <SelectItem value="tarde">Tarde</SelectItem>
                    <SelectItem value="noite">Noite</SelectItem>
                    <SelectItem value="integral">Integral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
            <Button onClick={() => createMutation.mutate()} disabled={!className.trim() || createMutation.isPending}>
              {createMutation.isPending ? "Criando..." : "Criar Turma"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
