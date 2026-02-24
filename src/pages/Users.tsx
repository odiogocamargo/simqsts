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
import { Users as UsersIcon, Mail, Shield, Calendar, Trash2, Search, Crown, Clock, XCircle, CheckCircle, RefreshCw, Phone, MapPin, UserPlus, Eye, EyeOff, Key, BookOpen, Trophy, CalendarDays, TrendingUp } from "lucide-react";
import { useState, useMemo } from "react";
import { format, subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, subMonths } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
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
  
  // Estado para filtro de período de questões
  const [questionsPeriod, setQuestionsPeriod] = useState<string>("all");
  const [questionsDateRange, setQuestionsDateRange] = useState<DateRange | undefined>();
  const [evolutionPeriod, setEvolutionPeriod] = useState<string>("30days");
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

  // Calcular datas para filtro de questões
  const getQuestionsPeriodDates = useMemo(() => {
    const now = new Date();
    switch (questionsPeriod) {
      case "today":
        return { start: startOfDay(now), end: endOfDay(now) };
      case "yesterday":
        const yesterday = subDays(now, 1);
        return { start: startOfDay(yesterday), end: endOfDay(yesterday) };
      case "week":
        return { start: startOfWeek(now, { locale: ptBR }), end: endOfWeek(now, { locale: ptBR }) };
      case "month":
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case "custom":
        if (questionsDateRange?.from) {
          return { 
            start: startOfDay(questionsDateRange.from), 
            end: questionsDateRange.to ? endOfDay(questionsDateRange.to) : endOfDay(questionsDateRange.from)
          };
        }
        return null;
      default:
        return null; // "all" - sem filtro de data
    }
  }, [questionsPeriod, questionsDateRange]);

  // Buscar contagem de questões por professor e admin
  const { data: professorQuestionCounts } = useQuery({
    queryKey: ["professor-question-counts", questionsPeriod, questionsDateRange?.from?.toISOString(), questionsDateRange?.to?.toISOString()],
    queryFn: async () => {
      // Buscar todos os professores e admins
      const { data: staffRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role")
        .in("role", ["professor", "admin"]);

      if (rolesError) throw rolesError;
      
      const staffIds = staffRoles?.map(r => r.user_id) || [];
      const roleMap = new Map(staffRoles?.map(r => [r.user_id, r.role]) || []);
      
      if (staffIds.length === 0) return { data: [], periodLabel: "" };

      // Buscar questões criadas por professores e admins com filtro de data
      let query = supabase
        .from("questions")
        .select("created_by, created_at")
        .in("created_by", staffIds);

      const periodDates = getQuestionsPeriodDates;
      if (periodDates) {
        query = query
          .gte("created_at", periodDates.start.toISOString())
          .lte("created_at", periodDates.end.toISOString());
      }

      const { data: questions, error: questionsError } = await query;

      if (questionsError) throw questionsError;

      // Contar questões por usuário
      const countMap = new Map<string, number>();
      questions?.forEach(q => {
        const count = countMap.get(q.created_by) || 0;
        countMap.set(q.created_by, count + 1);
      });

      // Buscar nomes dos usuários
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", staffIds);

      if (profilesError) throw profilesError;

      // Montar lista ordenada
      const result = staffIds.map(id => {
        const profile = profiles?.find(p => p.id === id);
        return {
          userId: id,
          name: profile?.full_name || "Sem nome",
          role: roleMap.get(id) || "professor",
          questionCount: countMap.get(id) || 0,
        };
      }).sort((a, b) => b.questionCount - a.questionCount);

      // Label do período
      let periodLabel = "Todo o período";
      if (periodDates) {
        if (questionsPeriod === "today") periodLabel = "Hoje";
        else if (questionsPeriod === "yesterday") periodLabel = "Ontem";
        else if (questionsPeriod === "week") periodLabel = "Esta semana";
        else if (questionsPeriod === "month") periodLabel = "Este mês";
        else if (questionsPeriod === "custom") {
          periodLabel = questionsDateRange?.to 
            ? `${format(periodDates.start, "dd/MM/yyyy")} - ${format(periodDates.end, "dd/MM/yyyy")}`
            : format(periodDates.start, "dd/MM/yyyy");
        }
      }

      return { data: result, periodLabel };
    },
    enabled: !!users,
  });

  // Buscar evolução de questões ao longo do tempo
  const { data: questionsEvolution } = useQuery({
    queryKey: ["questions-evolution", evolutionPeriod],
    queryFn: async () => {
      const now = new Date();
      let startDate: Date;
      let granularity: "day" | "week" | "month";

      switch (evolutionPeriod) {
        case "7days":
          startDate = subDays(now, 7);
          granularity = "day";
          break;
        case "30days":
          startDate = subDays(now, 30);
          granularity = "day";
          break;
        case "3months":
          startDate = subMonths(now, 3);
          granularity = "week";
          break;
        case "6months":
          startDate = subMonths(now, 6);
          granularity = "month";
          break;
        case "12months":
          startDate = subMonths(now, 12);
          granularity = "month";
          break;
        default:
          startDate = subDays(now, 30);
          granularity = "day";
      }

      const rangeStart = startOfDay(startDate).toISOString();
      const rangeEnd = endOfDay(now).toISOString();

      // Buscar todas as questões no período com paginação para evitar limite de 1000
      let allQuestions: { created_at: string }[] = [];
      let from = 0;
      const pageSize = 1000;
      let hasMore = true;

      while (hasMore) {
        const { data: batch, error } = await supabase
          .from("questions")
          .select("created_at")
          .gte("created_at", rangeStart)
          .lte("created_at", rangeEnd)
          .order("created_at", { ascending: true })
          .range(from, from + pageSize - 1);

        if (error) throw error;

        if (batch && batch.length > 0) {
          allQuestions = allQuestions.concat(batch);
          from += pageSize;
          hasMore = batch.length === pageSize;
        } else {
          hasMore = false;
        }
      }

      // Gerar intervalos baseado na granularidade
      let intervals: Date[];
      const intervalStart = startOfDay(startDate);
      if (granularity === "day") {
        intervals = eachDayOfInterval({ start: intervalStart, end: now });
      } else if (granularity === "week") {
        intervals = eachWeekOfInterval({ start: intervalStart, end: now }, { locale: ptBR });
      } else {
        intervals = eachMonthOfInterval({ start: intervalStart, end: now });
      }

      // Pré-processar questões em buckets para performance
      const buckets = new Map<string, number>();
      allQuestions.forEach(q => {
        const qDate = new Date(q.created_at);
        let key: string;
        if (granularity === "day") {
          key = format(qDate, "yyyy-MM-dd");
        } else if (granularity === "week") {
          // Encontrar o início da semana para agrupar
          const weekStart = startOfWeek(qDate, { locale: ptBR });
          key = format(weekStart, "yyyy-MM-dd");
        } else {
          key = format(qDate, "yyyy-MM");
        }
        buckets.set(key, (buckets.get(key) || 0) + 1);
      });

      // Montar dados do gráfico
      const chartData = intervals.map(date => {
        let key: string;
        if (granularity === "day") {
          key = format(date, "yyyy-MM-dd");
        } else if (granularity === "week") {
          const weekStart = startOfWeek(date, { locale: ptBR });
          key = format(weekStart, "yyyy-MM-dd");
        } else {
          key = format(date, "yyyy-MM");
        }

        const count = buckets.get(key) || 0;

        let label: string;
        if (granularity === "day") {
          label = format(date, "dd/MM", { locale: ptBR });
        } else if (granularity === "week") {
          label = `Sem ${format(date, "dd/MM", { locale: ptBR })}`;
        } else {
          label = format(date, "MMM/yy", { locale: ptBR });
        }

        return {
          date: label,
          questoes: count,
        };
      });

      return chartData;
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
        {professorQuestionCounts && professorQuestionCounts.data && professorQuestionCounts.data.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Questões Adicionadas por Equipe
                  </CardTitle>
                  <CardDescription>
                    Ranking de professores e administradores por quantidade de questões cadastradas
                    {professorQuestionCounts.periodLabel && professorQuestionCounts.periodLabel !== "Todo o período" && (
                      <span className="ml-1 font-medium text-primary">({professorQuestionCounts.periodLabel})</span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Select value={questionsPeriod} onValueChange={setQuestionsPeriod}>
                    <SelectTrigger className="w-[140px]">
                      <CalendarDays className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todo período</SelectItem>
                      <SelectItem value="today">Hoje</SelectItem>
                      <SelectItem value="yesterday">Ontem</SelectItem>
                      <SelectItem value="week">Esta semana</SelectItem>
                      <SelectItem value="month">Este mês</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                  {questionsPeriod === "custom" && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          <Calendar className="h-4 w-4" />
                          {questionsDateRange?.from ? (
                            questionsDateRange.to ? (
                              `${format(questionsDateRange.from, "dd/MM")} - ${format(questionsDateRange.to, "dd/MM")}`
                            ) : (
                              format(questionsDateRange.from, "dd/MM/yyyy")
                            )
                          ) : (
                            "Selecionar datas"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <CalendarComponent
                          initialFocus
                          mode="range"
                          defaultMonth={questionsDateRange?.from}
                          selected={questionsDateRange}
                          onSelect={setQuestionsDateRange}
                          numberOfMonths={2}
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {professorQuestionCounts.data.map((prof, index) => (
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
                      <div className="flex flex-col">
                        <span className="font-medium truncate max-w-[150px]">{prof.name}</span>
                        <span className={`text-xs ${prof.role === "admin" ? "text-red-500" : "text-blue-500"}`}>
                          {prof.role === "admin" ? "Admin" : "Professor"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-primary font-semibold">
                      <BookOpen className="h-4 w-4" />
                      {prof.questionCount}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-muted-foreground">
                <span>Total de membros: {professorQuestionCounts.data.length}</span>
                <span>Total de questões: {professorQuestionCounts.data.reduce((acc, p) => acc + p.questionCount, 0)}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Card de Evolução de Questões */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Evolução de Questões Adicionadas
                </CardTitle>
                <CardDescription>
                  Acompanhe a quantidade de questões cadastradas ao longo do tempo
                </CardDescription>
              </div>
              <Select value={evolutionPeriod} onValueChange={setEvolutionPeriod}>
                <SelectTrigger className="w-[160px]">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Últimos 7 dias</SelectItem>
                  <SelectItem value="30days">Últimos 30 dias</SelectItem>
                  <SelectItem value="3months">Últimos 3 meses</SelectItem>
                  <SelectItem value="6months">Últimos 6 meses</SelectItem>
                  <SelectItem value="12months">Últimos 12 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {questionsEvolution && questionsEvolution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={questionsEvolution}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--background))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                    formatter={(value) => [`${value} questões`, "Questões"]}
                  />
                  <Bar 
                    dataKey="questoes" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                    name="Questões"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Nenhuma questão encontrada no período
              </div>
            )}
            {questionsEvolution && questionsEvolution.length > 0 && (
              <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-muted-foreground">
                <span>Período: {evolutionPeriod === "7days" ? "Últimos 7 dias" : evolutionPeriod === "30days" ? "Últimos 30 dias" : evolutionPeriod === "3months" ? "Últimos 3 meses" : evolutionPeriod === "6months" ? "Últimos 6 meses" : "Últimos 12 meses"}</span>
                <span>Total no período: {questionsEvolution.reduce((acc, d) => acc + d.questoes, 0)} questões</span>
              </div>
            )}
          </CardContent>
        </Card>

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
