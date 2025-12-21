import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { CheckCircle, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { checkSubscription, session, subscription, subscriptionLoading } = useAuth();
  const { role } = useUserRole();
  const [countdown, setCountdown] = useState(7);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);
  const [checkAttempts, setCheckAttempts] = useState(0);

  // Retry checking subscription until it's confirmed or max attempts reached
  const verifySubscription = useCallback(async () => {
    if (!session?.access_token) return;
    
    setIsCheckingSubscription(true);
    await checkSubscription(session);
    setCheckAttempts(prev => prev + 1);
    setIsCheckingSubscription(false);
  }, [session, checkSubscription]);

  // Initial check and retry logic
  useEffect(() => {
    if (!session?.access_token) return;

    // Check immediately
    verifySubscription();

    // Retry every 2 seconds if not subscribed yet (Stripe webhook might take time)
    const retryInterval = setInterval(() => {
      if (!subscription.subscribed && checkAttempts < 5) {
        verifySubscription();
      }
    }, 2000);

    return () => clearInterval(retryInterval);
  }, [session?.access_token, subscription.subscribed, checkAttempts, verifySubscription]);

  // Countdown and redirect
  useEffect(() => {
    // Only start countdown after subscription is confirmed or max attempts reached
    if (isCheckingSubscription && checkAttempts < 3) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Redirect based on role
          if (role === 'aluno') {
            navigate('/student');
          } else {
            navigate('/dashboard');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, role, isCheckingSubscription, checkAttempts]);

  const handleContinue = () => {
    if (role === 'aluno') {
      navigate('/student');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Success Icon */}
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto animate-pulse">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
          <Sparkles className="h-6 w-6 text-amber-500 absolute top-0 right-1/3 animate-bounce" />
          <Sparkles className="h-4 w-4 text-primary absolute bottom-2 left-1/3 animate-bounce delay-150" />
        </div>

        {/* Success Message */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground">
            Pagamento Confirmado!
          </h1>
          <p className="text-xl text-muted-foreground">
            Bem-vindo ao SIM Questões
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <p className="text-sm font-medium text-foreground">
            Agora você tem acesso completo a:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground text-left">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
              Banco completo de questões
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
              Análise de desempenho detalhada
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
              Identificação de pontos fracos
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
              Questões de 15+ vestibulares
            </li>
          </ul>
        </div>

        {/* Status & Redirect Info */}
        <div className="space-y-4">
          {(isCheckingSubscription || subscriptionLoading) && checkAttempts < 3 ? (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Confirmando sua assinatura...
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Redirecionando em <span className="font-bold text-primary">{countdown}</span> segundos...
            </p>
          )}
          <Button onClick={handleContinue} className="w-full gap-2">
            Continuar agora
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
