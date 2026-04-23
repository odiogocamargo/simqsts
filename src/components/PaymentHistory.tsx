import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CreditCard,
  Receipt,
  RefreshCw,
  ExternalLink,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

interface PaymentRecord {
  id: string;
  asaas_payment_id: string | null;
  amount: number;
  status: string;
  billing_type: string | null;
  description: string | null;
  due_date: string | null;
  payment_date: string | null;
  invoice_url: string | null;
  invoice_number: string | null;
  transaction_receipt_url: string | null;
  bank_slip_url: string | null;
  created_at: string;
}

const STATUS_LABEL: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: any; className?: string }> = {
  CONFIRMED: { label: "Confirmado", variant: "default", icon: CheckCircle2, className: "bg-green-500/10 text-green-600 border-green-500/30" },
  RECEIVED: { label: "Recebido", variant: "default", icon: CheckCircle2, className: "bg-green-500/10 text-green-600 border-green-500/30" },
  RECEIVED_IN_CASH: { label: "Recebido em dinheiro", variant: "default", icon: CheckCircle2, className: "bg-green-500/10 text-green-600 border-green-500/30" },
  PENDING: { label: "Pendente", variant: "outline", icon: Clock, className: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
  AWAITING_RISK_ANALYSIS: { label: "Em análise", variant: "outline", icon: Clock, className: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
  OVERDUE: { label: "Atrasado", variant: "destructive", icon: AlertTriangle },
  REFUNDED: { label: "Estornado", variant: "secondary", icon: RefreshCw },
  REFUND_REQUESTED: { label: "Estorno solicitado", variant: "secondary", icon: RefreshCw },
  CHARGEBACK_REQUESTED: { label: "Chargeback", variant: "destructive", icon: AlertTriangle },
  CHARGEBACK_DISPUTE: { label: "Disputa", variant: "destructive", icon: AlertTriangle },
  AWAITING_CHARGEBACK_REVERSAL: { label: "Aguardando reversão", variant: "secondary", icon: Clock },
  DUNNING_REQUESTED: { label: "Cobrança jurídica", variant: "destructive", icon: AlertTriangle },
  DUNNING_RECEIVED: { label: "Recuperado", variant: "default", icon: CheckCircle2 },
  DELETED: { label: "Removido", variant: "secondary", icon: XCircle },
};

const BILLING_LABEL: Record<string, string> = {
  CREDIT_CARD: "Cartão de crédito",
  BOLETO: "Boleto",
  PIX: "PIX",
  UNDEFINED: "—",
};

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n || 0);

const formatDate = (d: string | null) =>
  d ? format(new Date(d), "dd/MM/yyyy", { locale: ptBR }) : "—";

export const PaymentHistory = () => {
  const { user, session } = useAuth();
  const queryClient = useQueryClient();
  const [syncing, setSyncing] = useState(false);

  const { data: payments, isLoading } = useQuery({
    queryKey: ["payment-history", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_history")
        .select("*")
        .order("due_date", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as PaymentRecord[];
    },
    enabled: !!user?.id,
  });

  // Auto-sync once when component mounts (best-effort)
  useEffect(() => {
    if (!session?.access_token || !user?.id) return;
    void handleSync(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleSync = async (silent = false) => {
    if (!session?.access_token) return;
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke("sync-asaas-payments", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (error) {
        if (!silent) toast.error("Não foi possível sincronizar pagamentos");
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["payment-history", user?.id] });
      if (!silent) toast.success(`${data?.synced ?? 0} pagamento(s) sincronizado(s)`);
    } catch (e) {
      if (!silent) toast.error("Erro ao sincronizar");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              Histórico de pagamentos
            </CardTitle>
            <CardDescription>Datas, status e recibos das suas cobranças</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleSync(false)} disabled={syncing} className="gap-2 flex-shrink-0">
            {syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !payments || payments.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto">
              <CreditCard className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">Nenhum pagamento ainda</p>
              <p className="text-sm text-muted-foreground">
                Seus pagamentos e recibos aparecerão aqui após a primeira cobrança.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Pago em</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Recibo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => {
                  const meta = STATUS_LABEL[p.status] ?? {
                    label: p.status,
                    variant: "outline" as const,
                    icon: Clock,
                  };
                  const Icon = meta.icon;
                  const receiptUrl = p.transaction_receipt_url || p.invoice_url || p.bank_slip_url;
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="whitespace-nowrap">{formatDate(p.due_date)}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatDate(p.payment_date)}</TableCell>
                      <TableCell className="font-medium whitespace-nowrap">{formatCurrency(p.amount)}</TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {BILLING_LABEL[p.billing_type ?? "UNDEFINED"] ?? p.billing_type ?? "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={meta.variant} className={`gap-1 ${meta.className ?? ""}`}>
                          <Icon className="h-3 w-3" />
                          {meta.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {receiptUrl ? (
                          <Button asChild variant="ghost" size="sm" className="gap-1 h-8">
                            <a href={receiptUrl} target="_blank" rel="noopener noreferrer">
                              Ver
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
