import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,
  DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Users as UsersIcon, Calendar, Trash2, Search, RefreshCw,
  UserPlus, Eye, EyeOff, Key
} from "lucide-react";
import { useState, useMemo } from "react";

interface UserWithDetails {
  id: string;
  full_name: string | null;
  created_at: string;
  roles: string[];
}

export default function Users() {
  const queryClient = useQueryClient();
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newEmployeeEmail, setNewEmployeeEmail] = useState("");
  const [newEmployeePassword, setNewEmployeePassword] = useState("");
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeeRole, setNewEmployeeRole] = useState<"professor" | "admin">("professor");
  const [showPassword, setShowPassword] = useState(false);

  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [selectedUserForPassword, setSelectedUserForPassword] = useState<UserWithDetails | null>(null);
  const [newUserPassword, setNewUserPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ["users-admin"],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, created_at")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const usersWithDetails = await Promise.all(
        (profiles ?? []).map(async (profile) => {
          const { data: rolesData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", profile.id);

          return {
            id: profile.id,
            full_name: profile.full_name,
            created_at: profile.created_at,
            roles: rolesData?.map((r) => r.role as string) ?? [],
          } as UserWithDetails;
        })
      );

      return usersWithDetails;
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: string }) => {
      const { error: deleteError } = await supabase.from("user_roles").delete().eq("user_id", userId);
      if (deleteError) throw deleteError;
      const { error: insertError } = await supabase
        .from("user_roles")
        .insert([{ user_id: userId, role: newRole as any }]);
      if (insertError) throw insertError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-admin"] });
      toast.success("Permissão atualizada!");
      setUpdatingUserId(null);
    },
    onError: (error: any) => {
      toast.error("Erro ao atualizar: " + error.message);
      setUpdatingUserId(null);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await supabase.functions.invoke("delete-user", { body: { userId } });
      if (response.error) throw new Error(response.error.message || "Erro ao excluir");
      if (response.data?.error) throw new Error(response.data.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-admin"] });
      toast.success("Usuário excluído!");
      setDeletingUserId(null);
    },
    onError: (error: any) => {
      toast.error("Erro: " + error.message);
      setDeletingUserId(null);
    },
  });

  const createEmployeeMutation = useMutation({
    mutationFn: async () => {
      const response = await supabase.functions.invoke("create-employee", {
        body: {
          email: newEmployeeEmail,
          password: newEmployeePassword,
          full_name: newEmployeeName,
          role: newEmployeeRole,
        },
      });
      if (response.error) throw new Error(response.error.message || "Erro ao criar");
      if (response.data?.error) throw new Error(response.data.error);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-admin"] });
      toast.success("Usuário criado com sucesso!");
      setIsCreateDialogOpen(false);
      setNewEmployeeEmail("");
      setNewEmployeePassword("");
      setNewEmployeeName("");
      setNewEmployeeRole("professor");
    },
    onError: (error: any) => toast.error("Erro: " + error.message),
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async () => {
      if (!selectedUserForPassword) throw new Error("Nenhum usuário selecionado");
      const response = await supabase.functions.invoke("update-user-password", {
        body: { userId: selectedUserForPassword.id, newPassword: newUserPassword },
      });
      if (response.error) throw new Error(response.error.message || "Erro");
      if (response.data?.error) throw new Error(response.data.error);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Senha alterada!");
      setIsPasswordDialogOpen(false);
      setSelectedUserForPassword(null);
      setNewUserPassword("");
      setShowNewPassword(false);
    },
    onError: (error: any) => toast.error("Erro: " + error.message),
  });

  const handleRoleChange = (userId: string, newRole: string) => {
    setUpdatingUserId(userId);
    updateRoleMutation.mutate({ userId, newRole });
  };

  const handleDeleteUser = (userId: string) => {
    setDeletingUserId(userId);
    deleteUserMutation.mutate(userId);
  };

  const handleCreateEmployee = () => {
    if (!newEmployeeEmail || !newEmployeePassword) {
      toast.error("Email e senha são obrigatórios");
      return;
    }
    if (newEmployeePassword.length < 8) {
      toast.error("A senha deve ter pelo menos 8 caracteres");
      return;
    }
    createEmployeeMutation.mutate();
  };

  const handleOpenPasswordDialog = (user: UserWithDetails) => {
    setSelectedUserForPassword(user);
    setNewUserPassword("");
    setShowNewPassword(false);
    setIsPasswordDialogOpen(true);
  };

  const handleUpdatePassword = () => {
    if (!newUserPassword || newUserPassword.length < 8) {
      toast.error("Senha deve ter pelo menos 8 caracteres");
      return;
    }
    updatePasswordMutation.mutate();
  };

  const getRoleBadgeVariant = (role: string) => {
    if (role === "admin") return "destructive" as const;
    if (role === "professor") return "default" as const;
    return "outline" as const;
  };

  const getRoleLabel = (role: string) => {
    if (role === "admin") return "Administrador";
    if (role === "professor") return "Professor";
    return role;
  };

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    if (!searchTerm.trim()) return users;
    const term = searchTerm.toLowerCase();
    return users.filter((u) => u.full_name?.toLowerCase().includes(term));
  }, [users, searchTerm]);

  const stats = useMemo(() => {
    if (!users) return { total: 0, admins: 0, professors: 0, semRole: 0 };
    return {
      total: users.length,
      admins: users.filter((u) => u.roles.includes("admin")).length,
      professors: users.filter((u) => u.roles.includes("professor")).length,
      semRole: users.filter((u) => u.roles.length === 0).length,
    };
  }, [users]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <UsersIcon className="h-8 w-8 text-primary" />
              Gerenciamento de Usuários
            </h1>
            <p className="text-muted-foreground mt-2">
              Gerencie administradores e professores com acesso ao banco de questões
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Criar Usuário
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Usuário</DialogTitle>
                  <DialogDescription>
                    Crie uma conta de Administrador ou Professor. Compartilhe email e senha com a pessoa.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="emp-name">Nome completo</Label>
                    <Input id="emp-name" value={newEmployeeName} onChange={(e) => setNewEmployeeName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emp-email">Email *</Label>
                    <Input id="emp-email" type="email" value={newEmployeeEmail} onChange={(e) => setNewEmployeeEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emp-pass">Senha *</Label>
                    <div className="relative">
                      <Input id="emp-pass" type={showPassword ? "text" : "password"} placeholder="Mínimo 8 caracteres" value={newEmployeePassword} onChange={(e) => setNewEmployeePassword(e.target.value)} />
                      <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emp-role">Função</Label>
                    <Select value={newEmployeeRole} onValueChange={(v) => setNewEmployeeRole(v as "professor" | "admin")}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professor">Professor (adicionar questões)</SelectItem>
                        <SelectItem value="admin">Administrador (acesso total)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancelar</Button>
                  <Button onClick={handleCreateEmployee} disabled={createEmployeeMutation.isPending}>
                    {createEmployeeMutation.isPending ? "Criando..." : "Criar Usuário"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Alterar Senha</DialogTitle>
                  <DialogDescription>
                    Alterar senha de <strong>{selectedUserForPassword?.full_name || "Sem nome"}</strong>
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-pass">Nova senha *</Label>
                    <div className="relative">
                      <Input id="new-pass" type={showNewPassword ? "text" : "password"} placeholder="Mínimo 8 caracteres" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} />
                      <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowNewPassword(!showNewPassword)}>
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>Cancelar</Button>
                  <Button onClick={handleUpdatePassword} disabled={updatePasswordMutation.isPending}>
                    {updatePasswordMutation.isPending ? "Alterando..." : "Alterar Senha"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={() => refetch()} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardContent className="pt-4"><div className="text-2xl font-bold">{stats.total}</div><p className="text-xs text-muted-foreground">Total</p></CardContent></Card>
          <Card><CardContent className="pt-4"><div className="text-2xl font-bold text-red-500">{stats.admins}</div><p className="text-xs text-muted-foreground">Administradores</p></CardContent></Card>
          <Card><CardContent className="pt-4"><div className="text-2xl font-bold text-blue-500">{stats.professors}</div><p className="text-xs text-muted-foreground">Professores</p></CardContent></Card>
          <Card><CardContent className="pt-4"><div className="text-2xl font-bold text-amber-500">{stats.semRole}</div><p className="text-xs text-muted-foreground">Sem permissão</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Usuários</CardTitle>
                <CardDescription>Lista de usuários internos com acesso ao banco</CardDescription>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por nome..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-2" />
                <p className="text-muted-foreground">Carregando...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Nenhum usuário encontrado</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Permissão</TableHead>
                      <TableHead>Alterar</TableHead>
                      <TableHead>Cadastro</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="text-sm font-bold text-primary">
                                {user.full_name?.charAt(0).toUpperCase() || "?"}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{user.full_name || "Sem nome"}</p>
                              <p className="text-xs text-muted-foreground">{user.id.slice(0, 8)}...</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {user.roles.length === 0 && <Badge variant="outline">Sem permissão</Badge>}
                            {user.roles.map((role) => (
                              <Badge key={role} variant={getRoleBadgeVariant(role)}>
                                {getRoleLabel(role)}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={user.roles[0] || ""}
                            onValueChange={(value) => handleRoleChange(user.id, value)}
                            disabled={updatingUserId === user.id}
                          >
                            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Selecionar..." /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Administrador</SelectItem>
                              <SelectItem value="professor">Professor</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(user.created_at).toLocaleDateString("pt-BR")}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenPasswordDialog(user)} title="Alterar senha">
                              <Key className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" disabled={deletingUserId === user.id}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Excluir usuário?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta ação é permanente. O usuário <strong>{user.full_name || "Sem nome"}</strong> será removido.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteUser(user.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
