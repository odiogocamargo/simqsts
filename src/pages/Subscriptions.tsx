import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Search, Users, CreditCard, AlertCircle, CheckCircle, XCircle, Clock, RefreshCw, Edit, Plus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type SubscriptionStatus = "active" | "canceled" | "late" | "refunded" | "pending";

interface Subscription {
  id: string;
  kiwify_customer_email: string;
  kiwify_customer_cpf: string | null;
  status: SubscriptionStatus;
  plan_name: string | null;
  started_at: string | null;
  expires_at: string | null;
  canceled_at: string | null;
  created_at: string;
  user_id: string | null;
}

const statusConfig: Record<SubscriptionStatus, { label: string; color: string; icon: typeof CheckCircle }> = {
  active: { label: "Ativo", color: "bg-green-500/10 text-green-600 border-green-500/20", icon: CheckCircle },
  canceled: { label: "Cancelado", color: "bg-red-500/10 text-red-600 border-red-500/20", icon: XCircle },
  late: { label: "Atrasado", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", icon: AlertCircle },
  refunded: { label: "Reembolsado", color: "bg-gray-500/10 text-gray-600 border-gray-500/20", icon: RefreshCw },
  pending: { label: "Pendente", color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: Clock },
};

export default function Subscriptions() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [newStatus, setNewStatus] = useState<SubscriptionStatus>("active");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSubscription, setNewSubscription] = useState({
    email: "",
    cpf: "",
    plan_name: "Premium",
    status: "active" as SubscriptionStatus,
  });

  // Fetch subscriptions
  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Subscription[];
    },
  });

  // Update subscription mutation
  const updateSubscription = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: SubscriptionStatus }) => {
      const { error } = await supabase
        .from("subscriptions")
        .update({ 
          status,
          canceled_at: status === "canceled" ? new Date().toISOString() : null,
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success("Assinatura atualizada com sucesso");
      setEditingSubscription(null);
    },
    onError: (error) => {
      toast.error("Erro ao atualizar assinatura: " + error.message);
    },
  });

  // Add subscription mutation
  const addSubscription = useMutation({
    mutationFn: async (data: typeof newSubscription) => {
      const { error } = await supabase
        .from("subscriptions")
        .insert({
          kiwify_customer_email: data.email,
          kiwify_customer_cpf: data.cpf || null,
          plan_name: data.plan_name,
          status: data.status,
          started_at: new Date().toISOString(),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success("Assinatura adicionada com sucesso");
      setIsAddDialogOpen(false);
      setNewSubscription({ email: "", cpf: "", plan_name: "Premium", status: "active" });
    },
    onError: (error) => {
      toast.error("Erro ao adicionar assinatura: " + error.message);
    },
  });

  // Filter subscriptions
  const filteredSubscriptions = subscriptions?.filter((sub) => {
    const matchesSearch = 
      sub.kiwify_customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sub.kiwify_customer_cpf?.includes(searchTerm) ?? false);
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: subscriptions?.length ?? 0,
    active: subscriptions?.filter((s) => s.status === "active").length ?? 0,
    canceled: subscriptions?.filter((s) => s.status === "canceled").length ?? 0,
    pending: subscriptions?.filter((s) => s.status === "pending").length ?? 0,
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Assinaturas</h1>
            <p className="text-muted-foreground">Gerencie as assinaturas dos alunos</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Assinatura
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ativos</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Cancelados</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.canceled}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por email ou CPF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="canceled">Cancelados</SelectItem>
                  <SelectItem value="late">Atrasados</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="refunded">Reembolsados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Lista de Assinaturas
            </CardTitle>
            <CardDescription>
              {filteredSubscriptions?.length ?? 0} assinatura(s) encontrada(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Início</TableHead>
                      <TableHead>Expira</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscriptions?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          Nenhuma assinatura encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSubscriptions?.map((sub) => {
                        const StatusIcon = statusConfig[sub.status].icon;
                        return (
                          <TableRow key={sub.id}>
                            <TableCell className="font-medium">{sub.kiwify_customer_email}</TableCell>
                            <TableCell>{sub.kiwify_customer_cpf || "-"}</TableCell>
                            <TableCell>{sub.plan_name || "Premium"}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={statusConfig[sub.status].color}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusConfig[sub.status].label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {sub.started_at
                                ? format(new Date(sub.started_at), "dd/MM/yyyy", { locale: ptBR })
                                : "-"}
                            </TableCell>
                            <TableCell>
                              {sub.expires_at
                                ? format(new Date(sub.expires_at), "dd/MM/yyyy", { locale: ptBR })
                                : "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingSubscription(sub);
                                  setNewStatus(sub.status);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={!!editingSubscription} onOpenChange={() => setEditingSubscription(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Assinatura</DialogTitle>
              <DialogDescription>
                Altere o status da assinatura de {editingSubscription?.kiwify_customer_email}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={newStatus} onValueChange={(v) => setNewStatus(v as SubscriptionStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="canceled">Cancelado</SelectItem>
                    <SelectItem value="late">Atrasado</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="refunded">Reembolsado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingSubscription(null)}>
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  if (editingSubscription) {
                    updateSubscription.mutate({ id: editingSubscription.id, status: newStatus });
                  }
                }}
                disabled={updateSubscription.isPending}
              >
                {updateSubscription.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Assinatura</DialogTitle>
              <DialogDescription>
                Adicione uma assinatura manualmente para um aluno
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Email do aluno *</Label>
                <Input
                  type="email"
                  placeholder="aluno@email.com"
                  value={newSubscription.email}
                  onChange={(e) => setNewSubscription({ ...newSubscription, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>CPF (opcional)</Label>
                <Input
                  placeholder="000.000.000-00"
                  value={newSubscription.cpf}
                  onChange={(e) => setNewSubscription({ ...newSubscription, cpf: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Plano</Label>
                <Input
                  placeholder="Premium"
                  value={newSubscription.plan_name}
                  onChange={(e) => setNewSubscription({ ...newSubscription, plan_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={newSubscription.status}
                  onValueChange={(v) => setNewSubscription({ ...newSubscription, status: v as SubscriptionStatus })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={() => addSubscription.mutate(newSubscription)}
                disabled={addSubscription.isPending || !newSubscription.email}
              >
                {addSubscription.isPending ? "Adicionando..." : "Adicionar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
