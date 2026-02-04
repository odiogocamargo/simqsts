import { Crown, Lock, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

interface PaywallProps {
  title?: string;
  description?: string;
}

export const Paywall = ({ 
  title = "Acesso Bloqueado", 
  description = "Seu período de teste expirou. Assine para continuar praticando questões e acompanhando seu desempenho." 
}: PaywallProps) => {
  const { subscription, subscriptionLoading, createCheckout } = useAuth();

  if (subscriptionLoading) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-16">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // If user has access (subscription or trial), don't show paywall
  if (subscription.hasAccess) {
    return null;
  }

  return (
    <Card className="border-amber-500/50 bg-card">
      <CardContent className="py-12">
        <div className="max-w-md mx-auto text-center space-y-6">
          {/* Icon */}
          <div className="h-20 w-20 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto">
            <Lock className="h-10 w-10 text-amber-500" />
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-foreground">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>

          {/* Benefits */}
          <div className="bg-card border border-border rounded-xl p-4 text-left space-y-3">
            <p className="font-medium text-sm text-foreground">Com a assinatura você tem:</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-primary flex-shrink-0" />
                Acesso ilimitado a todas as questões
              </li>
              <li className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-primary flex-shrink-0" />
                Análise detalhada de desempenho
              </li>
              <li className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-primary flex-shrink-0" />
                Identificação de pontos fracos
              </li>
              <li className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-primary flex-shrink-0" />
                Questões de 15+ vestibulares
              </li>
            </ul>
          </div>

          {/* CTA */}
          <Button 
            onClick={createCheckout} 
            disabled={subscriptionLoading}
            size="lg"
            className="w-full gap-2"
          >
            <Crown className="h-5 w-5" />
            Assinar por R$ 37,90/mês
          </Button>

          <p className="text-xs text-muted-foreground">
            Cancele quando quiser. Sem compromisso.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

interface TrialBannerProps {
  className?: string;
}

export const TrialBanner = ({ className }: TrialBannerProps) => {
  const { subscription, subscriptionLoading, createCheckout } = useAuth();

  if (subscriptionLoading || subscription.subscribed || !subscription.isInTrial) {
    return null;
  }

  return (
    <div className={`bg-amber-500/5 border border-amber-500/30 rounded-lg p-4 ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <Clock className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <p className="font-medium text-foreground">
              {subscription.trialDaysRemaining === 1 
                ? "Último dia de teste gratuito!" 
                : `${subscription.trialDaysRemaining} dias restantes de teste`}
            </p>
            <p className="text-sm text-muted-foreground">
              Assine agora e não perca seu progresso
            </p>
          </div>
        </div>
        <Button onClick={createCheckout} variant="default" size="sm" className="gap-2 flex-shrink-0">
          <Crown className="h-4 w-4" />
          Assinar Agora
        </Button>
      </div>
    </div>
  );
};
