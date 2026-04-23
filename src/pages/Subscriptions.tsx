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
import { Search, Users, CreditCard, AlertCircle, CheckCircle, XCircle, Clock, RefreshCw, Edit, Plus, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type SubscriptionStatus = "active" | "canceled" | "late" | "refunded" | "pending";

interface Subscription {
  id: string;
  user_id: string | null;
  kiwify_customer_email: string | null;
  kiwify_customer_cpf: string | null;
  status: SubscriptionStatus;
  plan_name: string | null;
  payment_method: string | null;
  asaas_customer_id: string | null;
  asaas_subscription_id: string | null;
  asaas_last_payment_id: string | null;
  next_due_date: string | null;
  started_at: string | null;
  expires_at: string | null;
  canceled_at: string | null;
  created_at: string;
}

const statusConfig: Record<SubscriptionStatus, { label: string; color: string; icon: typeof CheckCircle }> = {
  active: { label: "Ativo", color: "bg-green-500/10 text-green-600 border-green-500/20", icon: CheckCircle },
  canceled: { label: "Cancelado", color: "bg-red-500/10 text-red-600 border-red-500/20", icon: XCircle },
  late: { label: "Atrasado", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20", icon: AlertCircle },
  refunded: { label: "Reembolsado", color: "bg-gray-500/10 text-gray-600 border-gray-500/20", icon: RefreshCw },
  pending: { label: "Pendente", color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: Clock },
};

interface EditForm {
  status: SubscriptionStatus;
  plan_name: string;
  payment_method: string;
  asaas_customer_id: string;
  asaas_subscription_id: string;
  asaas_last_payment_id: string;
  next_due_date: string;
  expires_at: string;
  started_at: string;
  kiwify_customer_email: string;
  kiwify_customer_cpf: string;
}

const emptyForm: EditForm = {
  status: "active",
  plan_name: "",
  payment_method: "",
  asaas_customer_id: "",
  asaas_subscription_id: "",
  asaas_last_payment_id: "",
  next_due_date: "",
  expires_at: "",
  started_at: "",
  kiwify_customer_email: "",
  kiwify_customer_cpf: "",
};

const toDateInput = (iso: string | null) =>
  iso ? new Date(iso).toISOString().slice(0, 10) : "";

const fromDateInput = (val: string) =>
  val ? new Date(val + "T00:00:00").toISOString() : null;

export default function Subscriptions() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(emptyForm);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSubscription, setNewSubscription] = useState({
    email: "",
    cpf: "",
    plan_name: "Premium",
    status: "active" as SubscriptionStatus,
  });

  const { data: subscriptions, isLoading, refetch } = useQuery({
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

  const updateSubscription = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Subscription> }) => {
      const { error } = await supabase.from("subscriptions").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success("Assinatura atualizada");
      setEditingSubscription(null);
    },
    onError: (e) => toast.error("Erro: " + e.message),
  });

  const addSubscription = useMutation({
    mutationFn: async (data: typeof newSubscription) => {
      const { error } = await supabase.from("subscriptions").insert({
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
      toast.success("Assinatura adicionada");
      setIsAddDialogOpen(false);
      setNewSubscription({ email: "", cpf: "", plan_name: "Premium", status: "active" });
    },
    onError: (e) => toast.error("Erro: " + e.message),
  });

  const openEdit = (sub: Subscription) => {
    setEditingSubscription(sub);
    setEditForm({
      status: sub.status,
      plan_name: sub.plan_name ?? "",
      payment_method: sub.payment_method ?? "",
      asaas_customer_id: sub.asaas_customer_id ?? "",
      asaas_subscription_id: sub.asaas_subscription_id ?? "",
      asaas_last_payment_id: sub.asaas_last_payment_id ?? "",
      next_due_date: toDateInput(sub.next_due_date),
      expires_at: toDateInput(sub.expires_at),
      started_at: toDateInput(sub.started_at),
      kiwify_customer_email: sub.kiwify_customer_email ?? "",
      kiwify_customer_cpf: sub.kiwify_customer_cpf ?? "",
    });
  };

  const submitEdit = () => {
    if (!editingSubscription) return;
    updateSubscription.mutate({
      id: editingSubscription.id,
      patch: {
        status: editForm.status,
        plan_name: editForm.plan_name || null,
        payment_method: editForm.payment_method || null,
        asaas_customer_id: editForm.asaas_customer_id || null,
        asaas_subscription_id: editForm.asaas_subscription_id || null,
        asaas_last_payment_id: editForm.asaas_last_payment_id || null,
        next_due_date: fromDateInput(editForm.next_due_date),
        expires_at: fromDateInput(editForm.expires_at),
        started_at: fromDateInput(editForm.started_at),
        kiwify_customer_email: editForm.kiwify_customer_email || null,
        kiwify_customer_cpf: editForm.kiwify_customer_cpf || null,
        canceled_at: editForm.status === "canceled" ? new Date().toISOString() : null,
      },
    });
  };

  const filteredSubscriptions = subscriptions?.filter((sub) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (sub.kiwify_customer_email?.toLowerCase().includes(term) ?? false) ||
      (sub.kiwify_customer_cpf?.includes(searchTerm) ?? false) ||
      (sub.asaas_customer_id?.toLowerCase().includes(term) ?? false) ||
      (sub.asaas_subscription_id?.toLowerCase().includes(term) ?? false);
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    return (searchTerm === "" || matchesSearch) && matchesStatus;
  });

  const stats = {
    total: subscriptions?.length ?? 0,
    active: subscriptions?.filter((s) => s.status === "active").length ?? 0,
    canceled: subscriptions?.filter((s) => s.status === "canceled").length ?? 0,
    pending: subscriptions?.filter((s) => s.status === "pending").length ?? 0,
    late: subscriptions?.filter((s) => s.status === "late").length ?? 0,
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Assinaturas</h1>
            <p className="text-muted-foreground">Revise e corrija assinaturas (Asaas)</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Nova
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          {[
            { label: "Total", value: stats.total, icon: Users, color: "" },
            { label: "Ativos", value: stats.active, icon: CheckCircle, color: "text-green-600" },
            { label: "Pendentes", value: stats.pending, icon: Clock, color: "text-blue-600" },
            { label: "Atrasados", value: stats.late, icon: AlertCircle, color: "text-yellow-600" },
            { label: "Cancelados", value: stats.canceled, icon: XCircle, color: "text-red-600" },
          ].map((s) => (
            <Card key={s.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
                <s.icon className={`h-4 w-4 ${s.color || "text-muted-foreground"}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por email, CPF, ID Asaas (cliente/assinatura)..."
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
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="late">Atrasados</SelectItem>
                  <SelectItem value="canceled">Cancelados</SelectItem>
                  <SelectItem value="refunded">Reembolsados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Lista de Assinaturas
            </CardTitle>
            <CardDescription>
              {filteredSubscriptions?.length ?? 0} encontrada(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email / User</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Pgto.</TableHead>
                      <TableHead>Asaas Sub ID</TableHead>
                      <TableHead>Asaas Cust ID</TableHead>
                      <TableHead>Próx. venc.</TableHead>
                      <TableHead>Expira</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscriptions?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          Nenhuma assinatura encontrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSubscriptions?.map((sub) => {
                        const StatusIcon = statusConfig[sub.status].icon;
                        return (
                          <TableRow key={sub.id}>
                            <TableCell className="font-medium">
                              <div className="text-sm">{sub.kiwify_customer_email || "-"}</div>
                              <div className="text-xs text-muted-foreground font-mono">
                                {sub.user_id ? sub.user_id.slice(0, 8) : "sem user"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={statusConfig[sub.status].color}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusConfig[sub.status].label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs">{sub.payment_method || "-"}</TableCell>
                            <TableCell className="font-mono text-xs">
                              {sub.asaas_subscription_id || <span className="text-muted-foreground">-</span>}
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {sub.asaas_customer_id || <span className="text-muted-foreground">-</span>}
                            </TableCell>
                            <TableCell className="text-xs">
                              {sub.next_due_date
                                ? format(new Date(sub.next_due_date), "dd/MM/yyyy", { locale: ptBR })
                                : "-"}
                            </TableCell>
                            <TableCell className="text-xs">
                              {sub.expires_at
                                ? format(new Date(sub.expires_at), "dd/MM/yyyy", { locale: ptBR })
                                : "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                {sub.asaas_subscription_id && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                    title="Abrir no Asaas"
                                  >
                                    <a
                                      href={`https://www.asaas.com/subscriptions/show/${sub.asaas_subscription_id}`}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                    </a>
                                  </Button>
                                )}
                                <Button variant="ghost" size="sm" onClick={() => openEdit(sub)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Assinatura</DialogTitle>
              <DialogDescription>
                Corrija dados manualmente. Use com cuidado — alterações são imediatas no banco.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(v) => setEditForm({ ...editForm, status: v as SubscriptionStatus })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="late">Atrasado</SelectItem>
                    <SelectItem value="canceled">Cancelado</SelectItem>
                    <SelectItem value="refunded">Reembolsado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Plano</Label>
                <Input
                  value={editForm.plan_name}
                  onChange={(e) => setEditForm({ ...editForm, plan_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Método de pagamento</Label>
                <Input
                  placeholder="CREDIT_CARD"
                  value={editForm.payment_method}
                  onChange={(e) => setEditForm({ ...editForm, payment_method: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={editForm.kiwify_customer_email}
                  onChange={(e) => setEditForm({ ...editForm, kiwify_customer_email: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Asaas Customer ID</Label>
                <Input
                  className="font-mono text-xs"
                  placeholder="cus_000000000000"
                  value={editForm.asaas_customer_id}
                  onChange={(e) => setEditForm({ ...editForm, asaas_customer_id: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Asaas Subscription ID</Label>
                <Input
                  className="font-mono text-xs"
                  placeholder="sub_000000000000"
                  value={editForm.asaas_subscription_id}
                  onChange={(e) => setEditForm({ ...editForm, asaas_subscription_id: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Último Payment ID</Label>
                <Input
                  className="font-mono text-xs"
                  placeholder="pay_000000000000"
                  value={editForm.asaas_last_payment_id}
                  onChange={(e) => setEditForm({ ...editForm, asaas_last_payment_id: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Início</Label>
                <Input
                  type="date"
                  value={editForm.started_at}
                  onChange={(e) => setEditForm({ ...editForm, started_at: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Próximo vencimento</Label>
                <Input
                  type="date"
                  value={editForm.next_due_date}
                  onChange={(e) => setEditForm({ ...editForm, next_due_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Expira em</Label>
                <Input
                  type="date"
                  value={editForm.expires_at}
                  onChange={(e) => setEditForm({ ...editForm, expires_at: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>CPF</Label>
                <Input
                  value={editForm.kiwify_customer_cpf}
                  onChange={(e) => setEditForm({ ...editForm, kiwify_customer_cpf: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingSubscription(null)}>Cancelar</Button>
              <Button onClick={submitEdit} disabled={updateSubscription.isPending}>
                {updateSubscription.isPending ? "Salvando..." : "Salvar alterações"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Assinatura</DialogTitle>
              <DialogDescription>Adicione uma assinatura manualmente</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={newSubscription.email}
                  onChange={(e) => setNewSubscription({ ...newSubscription, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>CPF</Label>
                <Input
                  value={newSubscription.cpf}
                  onChange={(e) => setNewSubscription({ ...newSubscription, cpf: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Plano</Label>
                <Input
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
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
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
