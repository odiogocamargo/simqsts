import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserPlus, Trash2, Search, Loader2, Pencil } from "lucide-react";
import { EditStudentModal } from "./EditStudentModal";

interface SchoolCoordinatorsTabProps {
  schoolId: string;
  schoolName: string;
}

interface CoordinatorRow {
  id: string;
  user_id: string;
  created_at: string;
  profile: {
    full_name: string | null;
    cpf: string | null;
    whatsapp: string | null;
  } | null;
}

export function SchoolCoordinatorsTab({ schoolId, schoolName }: SchoolCoordinatorsTabProps) {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCoord, setEditingCoord] = useState<{ user_id: string; full_name: string | null; cpf: string | null; whatsapp: string | null } | null>(null);

  const [coordName, setCoordName] = useState("");
  const [coordEmail, setCoordEmail] = useState("");
  const [coordPassword, setCoordPassword] = useState("");

  const { data: coordinators, isLoading } = useQuery({
    queryKey: ["school-coordinators", schoolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("school_coordinators")
        .select("id, user_id, created_at")
        .eq("school_id", schoolId)
        .order("created_at", { ascending: false });

      if (error) throw error;

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
      })) as CoordinatorRow[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const response = await supabase.functions.invoke("create-school-coordinator", {
        body: { school_id: schoolId, email: coordEmail, password: coordPassword, full_name: coordName },
      });
      if (response.error) throw new Error(response.error.message);
      if (response.data?.error) throw new Error(response.data.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-coordinators", schoolId] });
      toast.success("Coordenador criado com sucesso!");
      setIsAddOpen(false);
      setCoordName("");
      setCoordEmail("");
      setCoordPassword("");
    },
    onError: (error) => toast.error("Erro: " + error.message),
  });

  const unlinkMutation = useMutation({
    mutationFn: async (linkId: string) => {
      const { error } = await supabase.from("school_coordinators").delete().eq("id", linkId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-coordinators", schoolId] });
      toast.success("Coordenador desvinculado!");
    },
    onError: (error) => toast.error("Erro: " + error.message),
  });

  const filtered = coordinators?.filter(c =>
    c.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.profile?.cpf?.includes(searchTerm)
  ) || [];

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={() => setIsAddOpen(true)} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Adicionar Coordenador
          </Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar coordenador..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {searchTerm ? "Nenhum coordenador encontrado" : "Nenhum coordenador vinculado"}
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
                  {filtered.map((coord) => (
                    <TableRow key={coord.id}>
                      <TableCell className="font-medium">{coord.profile?.full_name || "Sem nome"}</TableCell>
                      <TableCell className="text-muted-foreground">{coord.profile?.cpf || "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{coord.profile?.whatsapp || "—"}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(coord.created_at).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => setEditingCoord({
                          user_id: coord.user_id,
                          full_name: coord.profile?.full_name || null,
                          cpf: coord.profile?.cpf || null,
                          whatsapp: coord.profile?.whatsapp || null,
                        })}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Desvincular coordenador?</AlertDialogTitle>
                              <AlertDialogDescription>O coordenador será desvinculado da escola.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => unlinkMutation.mutate(coord.id)}>Desvincular</AlertDialogAction>
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

      {/* Add Coordinator Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Coordenador</DialogTitle>
            <DialogDescription>Crie uma conta de coordenador vinculada a {schoolName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input value={coordName} onChange={(e) => setCoordName(e.target.value)} placeholder="Nome do coordenador" />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" value={coordEmail} onChange={(e) => setCoordEmail(e.target.value)} placeholder="coordenador@email.com" />
            </div>
            <div className="space-y-2">
              <Label>Senha *</Label>
              <Input type="password" value={coordPassword} onChange={(e) => setCoordPassword(e.target.value)} placeholder="Mínimo 6 caracteres" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancelar</Button>
            <Button onClick={() => createMutation.mutate()} disabled={!coordEmail || !coordPassword || createMutation.isPending}>
              {createMutation.isPending ? "Criando..." : "Criar Coordenador"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditStudentModal
        open={!!editingCoord}
        onOpenChange={(open) => { if (!open) setEditingCoord(null); }}
        student={editingCoord}
        schoolId={schoolId}
      />
    </>
  );
}
