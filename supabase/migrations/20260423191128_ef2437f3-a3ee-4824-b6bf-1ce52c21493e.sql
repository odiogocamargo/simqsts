-- 1. Limpar duplicados antes da constraint (mantém o mais recente por user_id)
DELETE FROM public.subscriptions a
USING public.subscriptions b
WHERE a.user_id IS NOT NULL
  AND a.user_id = b.user_id
  AND a.updated_at < b.updated_at;

-- 2. Constraint UNIQUE para suportar upsert por user_id
ALTER TABLE public.subscriptions
ADD CONSTRAINT subscriptions_user_id_unique UNIQUE (user_id);

-- 3. Atualizar registro do usuário com a assinatura Asaas já criada
UPDATE public.subscriptions
SET 
  status = 'active',
  asaas_subscription_id = 'sub_yciggiz7a3z2dc02',
  plan_name = 'SIM Questões Premium',
  payment_method = 'CREDIT_CARD',
  started_at = now(),
  next_due_date = '2026-04-24',
  expires_at = now() + interval '31 days',
  canceled_at = NULL,
  updated_at = now()
WHERE user_id = 'e65aa29e-e44f-4b2e-ba4d-b9a6b79fdcaa';