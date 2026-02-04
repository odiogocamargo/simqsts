import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Users as UsersIcon, Mail, Shield, Calendar, Trash2, Search, Crown, Clock, XCircle, CheckCircle, RefreshCw, Phone, MapPin, UserPlus, Eye, EyeOff, Key, BookOpen, Trophy } from "lucide-react";
import { useState, useMemo } from "react";
interface UserWithDetails {
  id: string;
  full_name: string | null;
  cpf: string | null;
  whatsapp: string | null;
  endereco: string | null;
  created_at: string;
  roles: string[];
  subscription?: {
    status: string;
    plan_name: string | null;
    expires_at: string | null;
    started_at: string | null;
  } | null;
  isInTrial?: boolean;
  trialDaysRemaining?: number;
}

export default function Users() {
  const queryClient = useQueryClient();
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estado para criar funcionário
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newEmployeeEmail, setNewEmployeeEmail] = useState("");
  const [newEmployeePassword, setNewEmployeePassword] = useState("");
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeeRole, setNewEmployeeRole] = useState<"professor" | "admin">("professor");
  const [showPassword, setShowPassword] = useState(false);
  
  // Estado para alterar senha
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [selectedUserForPassword, setSelectedUserForPassword] = useState<UserWithDetails | null>(null);
  const [newUserPassword, setNewUserPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Buscar todos os usuários com seus perfis, roles e assinaturas
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ["users-admin"],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Buscar roles e assinaturas de cada usuário
      const usersWithDetails = await Promise.all(
        profiles.map(async (profile) => {
          const [rolesResult, subscriptionResult] = await Promise.all([
            supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", profile.id),
            supabase
              .from("subscriptions")
              .select("status, plan_name, expires_at, started_at")
              .eq("user_id", profile.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle()
          ]);

          // Calcular trial
          const createdAt = new Date(profile.created_at);
          const now = new Date();
          const trialEndDate = new Date(createdAt.getTime() + 2 * 24 * 60 * 60 * 1000);
          const isInTrial = now < trialEndDate;
          const trialDaysRemaining = Math.max(0, Math.ceil((trialEndDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));

          return {
            ...profile,
            roles: rolesResult.data?.map((r) => r.role) || [],
            subscription: subscriptionResult.data,
            isInTrial,
            trialDaysRemaining,
          } as UserWithDetails;
        })
      );

      return usersWithDetails;
    },
  });

  // Buscar contagem de questões por professor
  const { data: professorQuestionCounts } = useQuery({
    queryKey: ["professor-question-counts"],
    queryFn: async () => {
      // Buscar todos os professores
      const { data: professorRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "professor");

      if (rolesError) throw rolesError;
      
      const professorIds = professorRoles?.map(r => r.user_id) || [];
      
      if (professorIds.length === 0) return [];

      // Buscar questões criadas por professores
      const { data: questions, error: questionsError } = await supabase
        .from("questions")
        .select("created_by")
        .in("created_by", professorIds);

      if (questionsError) throw questionsError;

      // Contar questões por professor
      const countMap = new Map<string, number>();
      questions?.forEach(q => {
        const count = countMap.get(q.created_by) || 0;
        countMap.set(q.created_by, count + 1);
      });

      // Buscar nomes dos professores
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", professorIds);

      if (profilesError) throw profilesError;

      // Montar lista ordenada
      const result = professorIds.map(id => {
        const profile = profiles?.find(p => p.id === id);
        return {
          userId: id,
          name: profile?.full_name || "Sem nome",
          questionCount: countMap.get(id) || 0,
        };
      }).sort((a, b) => b.questionCount - a.questionCount);

      return result;
    },
    enabled: !!users,
  });

  // Atualizar role do usuário
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: string }) => {
      const { error: deleteError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);

      if (deleteError) throw deleteError;

      const { error: insertError } = await supabase
        .from("user_roles")
        .insert([{ user_id: userId, role: newRole as any }]);

      if (insertError) throw insertError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-admin"] });
      toast.success("Role atualizada com sucesso!");
      setUpdatingUserId(null);
    },
    onError: (error) => {
      toast.error("Erro ao atualizar role: " + error.message);
      setUpdatingUserId(null);
    },
  });

  // Deletar usuário via Edge Function (secure server-side deletion)
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Não autenticado");

      const response = await supabase.functions.invoke("delete-user", {
        body: { userId },
      });

      if (response.error) {
        throw new Error(response.error.message || "Erro ao excluir usuário");
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-admin"] });
      toast.success("Usuário excluído com sucesso!");
      setDeletingUserId(null);
    },
    onError: (error) => {
      toast.error("Erro ao excluir usuário: " + error.message);
      setDeletingUserId(null);
    },
  });

  const handleRoleChange = (userId: string, newRole: string) => {
    setUpdatingUserId(userId);
    updateRoleMutation.mutate({ userId, newRole });
  };

  const handleDeleteUser = (userId: string) => {
    setDeletingUserId(userId);
    deleteUserMutation.mutate(userId);
  };

  // Criar funcionário via Edge Function
  const createEmployeeMutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Não autenticado");

      const response = await supabase.functions.invoke("create-employee", {
        body: { 
          email: newEmployeeEmail, 
          password: newEmployeePassword,
          full_name: newEmployeeName,
          role: newEmployeeRole
        },
      });

      if (response.error) {
        throw new Error(response.error.message || "Erro ao criar funcionário");
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-admin"] });
      toast.success("Funcionário criado com sucesso! Compartilhe o email e senha com ele.");
      setIsCreateDialogOpen(false);
      setNewEmployeeEmail("");
      setNewEmployeePassword("");
      setNewEmployeeName("");
      setNewEmployeeRole("professor");
    },
    onError: (error) => {
      toast.error("Erro ao criar funcionário: " + error.message);
    },
  });

  const handleCreateEmployee = () => {
    if (!newEmployeeEmail || !newEmployeePassword) {
      toast.error("Email e senha são obrigatórios");
      return;
    }
    if (newEmployeePassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    createEmployeeMutation.mutate();
  };

  // Alterar senha via Edge Function
  const updatePasswordMutation = useMutation({
    mutationFn: async () => {
      if (!selectedUserForPassword) throw new Error("Nenhum usuário selecionado");
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Não autenticado");

      const response = await supabase.functions.invoke("update-user-password", {
        body: { 
          userId: selectedUserForPassword.id, 
          newPassword: newUserPassword 
        },
      });

      if (response.error) {
        throw new Error(response.error.message || "Erro ao alterar senha");
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      return response.data;
    },
    onSuccess: () => {
      toast.success("Senha alterada com sucesso!");
      setIsPasswordDialogOpen(false);
      setSelectedUserForPassword(null);
      setNewUserPassword("");
      setShowNewPassword(false);
    },
    onError: (error) => {
      toast.error("Erro ao alterar senha: " + error.message);
    },
  });

  const handleOpenPasswordDialog = (user: UserWithDetails) => {
    setSelectedUserForPassword(user);
    setNewUserPassword("");
    setShowNewPassword(false);
    setIsPasswordDialogOpen(true);
  };

  const handleUpdatePassword = () => {
    if (!newUserPassword) {
      toast.error("Digite a nova senha");
      return;
    }
    if (newUserPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    updatePasswordMutation.mutate();
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "professor":
        return "default";
      case "aluno":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "professor":
        return "Professor";
      case "aluno":
        return "Aluno";
      default:
        return role;
    }
  };

  const getSubscriptionBadge = (user: UserWithDetails) => {
    if (user.subscription?.status === "active") {
      return (
        <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
          <CheckCircle className="h-3 w-3 mr-1" />
          Assinante
        </Badge>
      );
    }
    if (user.isInTrial) {
      return (
        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
          <Clock className="h-3 w-3 mr-1" />
          Trial ({user.trialDaysRemaining}d)
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-muted-foreground">
        <XCircle className="h-3 w-3 mr-1" />
        Sem acesso
      </Badge>
    );
  };

  // Filtrar usuários
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    if (!searchTerm.trim()) return users;

    const term = searchTerm.toLowerCase();
    return users.filter((user) =>
      user.full_name?.toLowerCase().includes(term) ||
      user.cpf?.includes(term) ||
      user.whatsapp?.includes(term)
    );
  }, [users, searchTerm]);

  // Estatísticas
  const stats = useMemo(() => {
    if (!users) return { total: 0, admins: 0, professors: 0, alunos: 0, subscribers: 0, trial: 0 };

    return {
      total: users.length,
      admins: users.filter(u => u.roles.includes("admin")).length,
      professors: users.filter(u => u.roles.includes("professor")).length,
      alunos: users.filter(u => u.roles.includes("aluno")).length,
      subscribers: users.filter(u => u.subscription?.status === "active").length,
      trial: users.filter(u => u.isInTrial && u.subscription?.status !== "active").length,
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
              Visualize e gerencie as permissões de todos os usuários da plataforma
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Criar Funcionário
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Funcionário</DialogTitle>
                  <DialogDescription>
                    Crie uma conta para um novo funcionário. Compartilhe o email e senha com ele após a criação.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="employee-name">Nome completo</Label>
                    <Input
                      id="employee-name"
                      placeholder="Nome do funcionário"
                      value={newEmployeeName}
                      onChange={(e) => setNewEmployeeName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employee-email">Email *</Label>
                    <Input
                      id="employee-email"
                      type="email"
                      placeholder="email@exemplo.com"
                      value={newEmployeeEmail}
                      onChange={(e) => setNewEmployeeEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employee-password">Senha *</Label>
                    <div className="relative">
                      <Input
                        id="employee-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mínimo 6 caracteres"
                        value={newEmployeePassword}
                        onChange={(e) => setNewEmployeePassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employee-role">Função</Label>
                    <Select value={newEmployeeRole} onValueChange={(v) => setNewEmployeeRole(v as "professor" | "admin")}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professor">Professor (apenas adicionar questões)</SelectItem>
                        <SelectItem value="admin">Administrador (acesso total)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleCreateEmployee} 
                    disabled={createEmployeeMutation.isPending}
                  >
                    {createEmployeeMutation.isPending ? "Criando..." : "Criar Funcionário"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Modal Alterar Senha */}
            <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Alterar Senha</DialogTitle>
                  <DialogDescription>
                    Alterar a senha do usuário <strong>{selectedUserForPassword?.full_name || "Sem nome"}</strong>
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova senha *</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Mínimo 6 caracteres"
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleUpdatePassword} 
                    disabled={updatePasswordMutation.isPending}
                  >
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

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Total de Usuários</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-red-500">{stats.admins}</div>
              <p className="text-xs text-muted-foreground">Administradores</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-blue-500">{stats.professors}</div>
              <p className="text-xs text-muted-foreground">Professores</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-slate-500">{stats.alunos}</div>
              <p className="text-xs text-muted-foreground">Alunos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-500">{stats.subscribers}</div>
              <p className="text-xs text-muted-foreground">Assinantes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-amber-500">{stats.trial}</div>
              <p className="text-xs text-muted-foreground">Em Trial</p>
            </CardContent>
          </Card>
        </div>

        {/* Card de Questões por Professor */}
        {professorQuestionCounts && professorQuestionCounts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Questões Adicionadas por Professor
              </CardTitle>
              <CardDescription>
                Ranking de professores por quantidade de questões cadastradas no banco
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {professorQuestionCounts.map((prof, index) => (
                  <div
                    key={prof.userId}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      index === 0 ? "bg-amber-500/10 border-amber-500/30" :
                      index === 1 ? "bg-slate-500/10 border-slate-500/30" :
                      index === 2 ? "bg-orange-500/10 border-orange-500/30" :
                      "bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center h-8 w-8 rounded-full font-bold text-sm ${
                        index === 0 ? "bg-amber-500 text-white" :
                        index === 1 ? "bg-slate-400 text-white" :
                        index === 2 ? "bg-orange-400 text-white" :
                        "bg-muted-foreground/20 text-muted-foreground"
                      }`}>
                        {index + 1}
                      </div>
                      <span className="font-medium truncate max-w-[150px]">{prof.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-primary font-semibold">
                      <BookOpen className="h-4 w-4" />
                      {prof.questionCount}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-muted-foreground">
                <span>Total de professores: {professorQuestionCounts.length}</span>
                <span>Total de questões: {professorQuestionCounts.reduce((acc, p) => acc + p.questionCount, 0)}</span>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Usuários Cadastrados</CardTitle>
                <CardDescription>
                  Lista completa de usuários com suas informações e permissões
                </CardDescription>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, CPF ou WhatsApp..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-2" />
                <p className="text-muted-foreground">Carregando usuários...</p>
              </div>
            ) : !filteredUsers || filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  {searchTerm ? "Nenhum usuário encontrado para a busca" : "Nenhum usuário encontrado"}
                </p>
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Assinatura</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Alterar Role</TableHead>
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
                              {user.cpf && (
                                <p className="text-xs text-muted-foreground">CPF: {user.cpf}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            {user.whatsapp && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                {user.whatsapp}
                              </div>
                            )}
                            {user.endereco && (
                              <div className="flex items-center gap-1 text-muted-foreground truncate max-w-[150px]" title={user.endereco}>
                                <MapPin className="h-3 w-3 shrink-0" />
                                <span className="truncate">{user.endereco}</span>
                              </div>
                            )}
                            {!user.whatsapp && !user.endereco && (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {getSubscriptionBadge(user)}
                            {user.subscription?.expires_at && (
                              <p className="text-xs text-muted-foreground">
                                Até {new Date(user.subscription.expires_at).toLocaleDateString("pt-BR")}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {user.roles.map((role) => (
                              <Badge key={role} variant={getRoleBadgeVariant(role)}>
                                {getRoleLabel(role)}
                              </Badge>
                            ))}
                            {user.roles.length === 0 && (
                              <Badge variant="outline">Sem role</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={user.roles[0] || ""}
                            onValueChange={(value) => handleRoleChange(user.id, value)}
                            disabled={updatingUserId === user.id}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Administrador</SelectItem>
                              <SelectItem value="professor">Professor</SelectItem>
                              <SelectItem value="aluno">Aluno</SelectItem>
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
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenPasswordDialog(user)}
                              title="Alterar senha"
                            >
                              <Key className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  disabled={deletingUserId === user.id}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Excluir usuário?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta ação não pode ser desfeita. Isso excluirá permanentemente o usuário
                                    <strong> {user.full_name || "Sem nome"}</strong> e todos os seus dados
                                    (respostas, desempenho, sessões de estudo, etc).
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
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
