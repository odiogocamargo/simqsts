import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { School, Plus, Edit, Trash2, Users, Search, Building2, Eye, EyeOff, Upload, UserPlus, Loader2 } from "lucide-react";
import { SchoolStudentsPanel } from "@/components/schools/SchoolStudentsPanel";

interface SchoolData {
  id: string;
  name: string;
  cnpj: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  active: boolean;
  created_at: string;
  student_count?: number;
}

export default function Schools() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<SchoolData | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<SchoolData | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formCnpj, setFormCnpj] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const { data: schools, isLoading } = useQuery({
    queryKey: ["schools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schools")
        .select("*")
        .order("name");

      if (error) throw error;

      // Count students per school
      const { data: counts, error: countError } = await supabase
        .from("school_students")
        .select("school_id");

      if (countError) throw countError;

      const countMap = new Map<string, number>();
      counts?.forEach((c: any) => {
        countMap.set(c.school_id, (countMap.get(c.school_id) || 0) + 1);
      });

      return (data as SchoolData[]).map(s => ({
        ...s,
        student_count: countMap.get(s.id) || 0,
      }));
    },
  });

  const resetForm = () => {
    setFormName("");
    setFormCnpj("");
    setFormAddress("");
    setFormPhone("");
    setFormEmail("");
    setLogoFile(null);
    setEditingSchool(null);
  };

  const openCreateForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEditForm = (school: SchoolData) => {
    setEditingSchool(school);
    setFormName(school.name);
    setFormCnpj(school.cnpj || "");
    setFormAddress(school.address || "");
    setFormPhone(school.phone || "");
    setFormEmail(school.email || "");
    setLogoFile(null);
    setIsFormOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      let logoUrl = editingSchool?.logo_url || null;

      // Upload logo if provided
      if (logoFile) {
        const ext = logoFile.name.split(".").pop();
        const fileName = `${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("school-logos")
          .upload(fileName, logoFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage
          .from("school-logos")
          .getPublicUrl(fileName);

        logoUrl = publicUrl.publicUrl;
      }

      const payload = {
        name: formName,
        cnpj: formCnpj || null,
        address: formAddress || null,
        phone: formPhone || null,
        email: formEmail || null,
        logo_url: logoUrl,
      };

      if (editingSchool) {
        const { error } = await supabase
          .from("schools")
          .update(payload)
          .eq("id", editingSchool.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("schools")
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      toast.success(editingSchool ? "Escola atualizada!" : "Escola cadastrada!");
      setIsFormOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Erro: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("schools").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      toast.success("Escola excluída!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir: " + error.message);
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("schools").update({ active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      toast.success("Status atualizado!");
    },
  });

  const filteredSchools = schools?.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.cnpj?.includes(searchTerm) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // If a school is selected, show the students panel
  if (selectedSchool) {
    return (
      <SchoolStudentsPanel
        school={selectedSchool}
        onBack={() => {
          setSelectedSchool(null);
          queryClient.invalidateQueries({ queryKey: ["schools"] });
        }}
      />
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Escolas Parceiras</h1>
            <p className="text-muted-foreground">Gerencie escolas e seus alunos</p>
          </div>
          <Button onClick={openCreateForm} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Escola
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{schools?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Escolas cadastradas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">
                    {schools?.reduce((sum, s) => sum + (s.student_count || 0), 0) || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Alunos vinculados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <School className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">
                    {schools?.filter(s => s.active).length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Escolas ativas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, CNPJ ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredSchools.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {searchTerm ? "Nenhuma escola encontrada" : "Nenhuma escola cadastrada"}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Escola</TableHead>
                    <TableHead>CNPJ</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead className="text-center">Alunos</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchools.map((school) => (
                    <TableRow key={school.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedSchool(school)}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {school.logo_url ? (
                            <img src={school.logo_url} alt={school.name} className="h-8 w-8 rounded-md object-cover" />
                          ) : (
                            <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                              <Building2 className="h-4 w-4 text-primary" />
                            </div>
                          )}
                          <span className="font-medium">{school.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{school.cnpj || "—"}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {school.email || school.phone || "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{school.student_count || 0}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={school.active ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleActiveMutation.mutate({ id: school.id, active: !school.active });
                          }}
                        >
                          {school.active ? "Ativa" : "Inativa"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" onClick={() => setSelectedSchool(school)}>
                            <Users className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEditForm(school)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir escola?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Isso removerá a escola e todos os vínculos de alunos. Os alunos não serão excluídos.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteMutation.mutate(school.id)}>
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingSchool ? "Editar Escola" : "Nova Escola"}</DialogTitle>
            <DialogDescription>
              {editingSchool ? "Atualize os dados da escola" : "Cadastre uma nova escola parceira"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Nome da escola" />
            </div>
            <div className="space-y-2">
              <Label>CNPJ</Label>
              <Input value={formCnpj} onChange={(e) => setFormCnpj(e.target.value)} placeholder="00.000.000/0000-00" />
            </div>
            <div className="space-y-2">
              <Label>Endereço</Label>
              <Input value={formAddress} onChange={(e) => setFormAddress(e.target.value)} placeholder="Endereço completo" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="(00) 0000-0000" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="contato@escola.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Logo</Label>
              <Input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
            <Button onClick={() => saveMutation.mutate()} disabled={!formName || saveMutation.isPending}>
              {saveMutation.isPending ? "Salvando..." : editingSchool ? "Salvar" : "Cadastrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
