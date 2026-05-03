-- Rename Kiwify-specific columns to generic names; drop unused kiwify_subscription_id
ALTER TABLE public.subscriptions RENAME COLUMN kiwify_customer_email TO customer_email;
ALTER TABLE public.subscriptions RENAME COLUMN kiwify_customer_cpf TO customer_cpf;
ALTER TABLE public.subscriptions DROP COLUMN IF EXISTS kiwify_subscription_id;