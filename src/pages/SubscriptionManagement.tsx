import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Crown, 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  ExternalLink,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const SubscriptionManagement = () => {
  const navigate = useNavigate();
  const { 
    subscription, 
    subscriptionLoading, 
    openCustomerPortal,
    createCheckout 
  } = useAuth();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return "—";
    }
  };

  const getStatusBadge = () => {
    if (subscription.subscribed) {
      return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Ativo</Badge>;
    }
    if (subscription.isInTrial) {
      return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Em Trial</Badge>;
    }
    return <Badge variant="secondary" className="bg-muted/50">Inativo</Badge>;
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Minha Assinatura</h1>
            <p className="text-muted-foreground">Gerencie seu plano e informações de pagamento</p>
          </div>
        </div>

        {subscriptionLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6">
            {/* Status Card */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Crown className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Status da Assinatura</CardTitle>
                      <CardDescription>Seu plano atual e benefícios</CardDescription>
                    </div>
                  </div>
                  {getStatusBadge()}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {subscription.subscribed ? (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Próxima renovação
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {formatDate(subscription.subscriptionEnd)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Acesso
                        </p>
                        <p className="text-lg font-semibold text-emerald-400">
                          Completo
                        </p>
                      </div>
                    </div>

                    <Separator className="bg-border/50" />

                    <div className="space-y-3">
                      <p className="text-sm font-medium text-foreground">Benefícios inclusos:</p>
                      <ul className="grid gap-2 sm:grid-cols-2">
                        {[
                          "Acesso a todas as questões",
                          "Relatórios de desempenho",
                          "Filtros avançados",
                          "Suporte prioritário"
                        ].map((benefit) => (
                          <li key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : subscription.isInTrial ? (
                  <>
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <div className="flex items-start gap-3">
                        <Sparkles className="h-5 w-5 text-amber-400 mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">
                            Período de teste ativo
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Você tem <span className="font-semibold text-amber-400">{subscription.trialDaysRemaining} dias</span> restantes 
                            do seu período de teste gratuito.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Trial termina em
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {formatDate(subscription.trialEndDate)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Acesso
                        </p>
                        <p className="text-lg font-semibold text-amber-400">
                          Trial
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                    <div className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">
                          Sem assinatura ativa
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Assine agora para ter acesso completo a todas as questões e funcionalidades.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Ações
                </CardTitle>
                <CardDescription>
                  Gerencie sua assinatura e método de pagamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {subscription.subscribed ? (
                  <>
                    <Button
                      onClick={openCustomerPortal}
                      className="w-full sm:w-auto gap-2"
                      disabled={subscriptionLoading}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Abrir Portal do Cliente
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      No portal do cliente você pode atualizar seu método de pagamento, 
                      ver histórico de faturas e cancelar sua assinatura.
                    </p>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={createCheckout}
                      className="w-full sm:w-auto gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                      disabled={subscriptionLoading}
                    >
                      <Crown className="h-4 w-4" />
                      Assinar Agora
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Clique para iniciar o processo de assinatura. 
                      Você será redirecionado para uma página segura de pagamento.
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* FAQ/Help */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Perguntas Frequentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="font-medium text-foreground text-sm">Como cancelo minha assinatura?</p>
                  <p className="text-sm text-muted-foreground">
                    Você pode cancelar a qualquer momento através do Portal do Cliente. 
                    Seu acesso continuará até o fim do período já pago.
                  </p>
                </div>
                <Separator className="bg-border/50" />
                <div className="space-y-2">
                  <p className="font-medium text-foreground text-sm">Posso alterar meu plano?</p>
                  <p className="text-sm text-muted-foreground">
                    Sim, no Portal do Cliente você pode fazer upgrade ou downgrade do seu plano.
                  </p>
                </div>
                <Separator className="bg-border/50" />
                <div className="space-y-2">
                  <p className="font-medium text-foreground text-sm">Como atualizo meu cartão?</p>
                  <p className="text-sm text-muted-foreground">
                    Acesse o Portal do Cliente e clique em "Métodos de Pagamento" para 
                    adicionar ou atualizar seu cartão.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SubscriptionManagement;
