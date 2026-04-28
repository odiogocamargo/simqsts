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
  User,
  Mail,
  Shield,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useUserRole } from "@/hooks/useUserRole";
import { AsaasCheckoutForm } from "@/components/AsaasCheckoutForm";
import { PaymentHistory } from "@/components/PaymentHistory";

const MyAccount = () => {
  const { user, subscription, subscriptionLoading, cancelSubscription } = useAuth();
  const { role } = useUserRole();
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  const handleCancel = async () => {
    if (!confirm("Tem certeza que deseja cancelar sua assinatura?")) return;
    setIsPortalLoading(true);
    try {
      await cancelSubscription();
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

              {subscription.productId !== 'school_access' && subscription.productId !== 'admin_access' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Cancelar assinatura</CardTitle>
                    <CardDescription>
                      Você pode cancelar a qualquer momento. O acesso permanece até o fim do período pago.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={handleCancel}
                      disabled={isPortalLoading}
                      variant="destructive"
                      className="gap-2"
                    >
                      {isPortalLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                      Cancelar assinatura
                    </Button>
                  </CardContent>
                </Card>
              )}

              <PaymentHistory />
            </>
          ) : (
            <>
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

              <AsaasCheckoutForm />
            </>
          )}
        </TabsContent>
      </Tabs>
      </div>
    </Layout>
  );
};

export default MyAccount;
