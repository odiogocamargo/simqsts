-- Enum para status da assinatura
CREATE TYPE public.subscription_status AS ENUM (
  'active',
  'canceled', 
  'late',
  'refunded',
  'pending'
);

-- Tabela de assinaturas
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  kiwify_subscription_id TEXT UNIQUE,
  kiwify_customer_email TEXT NOT NULL,
  kiwify_customer_cpf TEXT,
  plan_name TEXT,
  status subscription_status NOT NULL DEFAULT 'pending',
  started_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Usuários podem ver suas próprias assinaturas"
ON public.subscriptions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todas as assinaturas"
ON public.subscriptions
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Policy para inserção via service role (webhook)
CREATE POLICY "Service role pode gerenciar assinaturas"
ON public.subscriptions
FOR ALL
USING (true)
WITH CHECK (true);

-- Trigger para updated_at
CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Índices
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_email ON public.subscriptions(kiwify_customer_email);
CREATE INDEX idx_subscriptions_cpf ON public.subscriptions(kiwify_customer_cpf);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);