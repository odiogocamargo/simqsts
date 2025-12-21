import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Crown, 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  ExternalLink,
  User,
  Mail,
  Shield
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useUserRole } from "@/hooks/useUserRole";

const MyAccount = () => {
  const { user, subscription, subscriptionLoading, createCheckout, openCustomerPortal } = useAuth();
  const { role } = useUserRole();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  const handleCheckout = async () => {
    setIsCheckoutLoading(true);
    try {
      await createCheckout();
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const handlePortal = async () => {
    setIsPortalLoading(true);
    try {
      await openCustomerPortal();
    } finally {
      setIsPortalLoading(false);
    }
  };

  const getRoleName = (role: string | null) => {
    switch (role) {
      case "admin": return "Administrador";
      case "professor": return "Professor";
      case "aluno": return "Aluno";
      default: return "Usuário";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Minha Conta</h2>
          <p className="text-muted-foreground">Gerencie suas informações e assinatura</p>
        </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="subscription" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Assinatura
          </TabsTrigger>
        </TabsList>

        {/* Tab Perfil */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Informações do Perfil
              </CardTitle>
              <CardDescription>
                Seus dados cadastrados na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">E-mail</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de conta</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{getRoleName(role)}</p>
                    <Badge variant="outline" className="text-xs">
                      {role === "admin" ? "Acesso total" : "Padrão"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Membro desde</p>
                  <p className="font-medium">
                    {user?.created_at 
                      ? format(new Date(user.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                      : "Data não disponível"
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Assinatura */}
        <TabsContent value="subscription" className="space-y-6">
          {subscriptionLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </CardContent>
            </Card>
          ) : subscription.subscribed ? (
            <>
              {/* Status Card */}
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <Crown className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Plano Premium</CardTitle>
                        <CardDescription>Acesso completo a todas as funcionalidades</CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Ativo
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {subscription.subscriptionEnd && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Próxima renovação:</span>
                      <span className="font-medium">
                        {format(new Date(subscription.subscriptionEnd), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Benefits Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Seus benefícios</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      "Acesso ilimitado a todas as questões",
                      "Relatórios detalhados de desempenho",
                      "Histórico completo de respostas",
                      "Simulados personalizados",
                      "Suporte prioritário"
                    ].map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Actions Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Gerenciar assinatura</CardTitle>
                  <CardDescription>
                    Altere seu método de pagamento, veja faturas ou cancele sua assinatura
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={handlePortal} 
                    disabled={isPortalLoading}
                    className="gap-2"
                  >
                    {isPortalLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ExternalLink className="h-4 w-4" />
                    )}
                    Abrir Portal de Assinatura
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Você será redirecionado para o portal seguro do Stripe
                  </p>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {/* Not Subscribed Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                      <XCircle className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Sem assinatura ativa</CardTitle>
                      <CardDescription>Assine para desbloquear todos os recursos</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Premium Plan Card */}
              <Card className="border-primary/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-gradient-to-l from-primary to-secondary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
                  Recomendado
                </div>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Crown className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle className="text-2xl">Plano Premium</CardTitle>
                      <CardDescription>Acesso completo à plataforma</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">R$ 29,90</span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                  
                  <ul className="space-y-3">
                    {[
                      "Acesso ilimitado a todas as questões",
                      "Relatórios detalhados de desempenho",
                      "Histórico completo de respostas",
                      "Simulados personalizados",
                      "Suporte prioritário"
                    ].map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={handleCheckout} 
                    disabled={isCheckoutLoading}
                    className="w-full gap-2"
                    size="lg"
                  >
                    {isCheckoutLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CreditCard className="h-4 w-4" />
                    )}
                    Assinar Agora
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground">
                    Pagamento seguro via Stripe. Cancele quando quiser.
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
      </div>
    </Layout>
  );
};

export default MyAccount;
