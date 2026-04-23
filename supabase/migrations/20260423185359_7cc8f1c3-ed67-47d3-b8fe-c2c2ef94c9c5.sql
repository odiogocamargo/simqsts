-- Tabela de histórico de pagamentos
CREATE TABLE IF NOT EXISTS public.payment_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  asaas_payment_id TEXT UNIQUE,
  asaas_subscription_id TEXT,
  asaas_customer_id TEXT,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  net_value NUMERIC(10,2),
  status TEXT NOT NULL DEFAULT 'PENDING',
  billing_type TEXT,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  payment_date TIMESTAMP WITH TIME ZONE,
  invoice_url TEXT,
  invoice_number TEXT,
  transaction_receipt_url TEXT,
  bank_slip_url TEXT,
  raw_event JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON public.payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_subscription_id ON public.payment_history(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_asaas_payment_id ON public.payment_history(asaas_payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_status ON public.payment_history(status);

ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus próprios pagamentos"
  ON public.payment_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todos os pagamentos"
  ON public.payment_history FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins podem gerenciar pagamentos"
  ON public.payment_history FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role pode gerenciar pagamentos"
  ON public.payment_history FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE TRIGGER update_payment_history_updated_at
  BEFORE UPDATE ON public.payment_history
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();