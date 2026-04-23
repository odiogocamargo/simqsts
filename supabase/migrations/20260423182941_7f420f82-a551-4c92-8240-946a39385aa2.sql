-- Tornar kiwify_customer_email opcional (legado)
ALTER TABLE public.subscriptions 
  ALTER COLUMN kiwify_customer_email DROP NOT NULL;

-- Adicionar colunas do Asaas
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS asaas_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS asaas_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS asaas_last_payment_id TEXT,
  ADD COLUMN IF NOT EXISTS payment_method TEXT,
  ADD COLUMN IF NOT EXISTS next_due_date TIMESTAMP WITH TIME ZONE;

-- Índices para webhook lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_asaas_subscription_id 
  ON public.subscriptions(asaas_subscription_id) 
  WHERE asaas_subscription_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_subscriptions_asaas_customer_id 
  ON public.subscriptions(asaas_customer_id) 
  WHERE asaas_customer_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id 
  ON public.subscriptions(user_id) 
  WHERE user_id IS NOT NULL;