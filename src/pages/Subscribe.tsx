import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Crown, ShieldCheck, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { AsaasCheckoutForm } from "@/components/AsaasCheckoutForm";
import { useAuth } from "@/hooks/useAuth";

const benefits = [
  "Acesso ilimitado a todas as questões",
  "Análise detalhada de desempenho",
  "Identificação de pontos fracos",
  "Questões de 15+ vestibulares (ENEM, FUVEST, UECE...)",
  "Simulados personalizados",
  "Cancele quando quiser",
];

const Subscribe = () => {
  const navigate = useNavigate();
  const { subscription } = useAuth();

  // If user already has access, redirect to student area
  useEffect(() => {
    if (subscription.subscribed) {
      navigate("/student", { replace: true });
    }
  }, [subscription.subscribed, navigate]);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            <Sparkles className="h-3 w-3" />
            Plano Premium
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Assine e desbloqueie todo o conteúdo
          </h1>
          <p className="text-muted-foreground">
            Pagamento mensal de R$ 19,99. Cancele a qualquer momento.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-start">
          {/* Benefits column */}
          <div className="space-y-4 lg:sticky lg:top-6">
            <Card>
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Crown className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">SIM Questões Premium</p>
                    <p className="text-sm text-muted-foreground">R$ 19,99 / mês</p>
                  </div>
                </div>

                <ul className="space-y-3">
                  {benefits.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm text-foreground">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Pagamento processado com segurança pelo Asaas
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout form column */}
          <div>
            <AsaasCheckoutForm onSuccess={() => navigate("/student", { replace: true })} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Subscribe;
