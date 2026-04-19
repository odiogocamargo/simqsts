-- Restrict the overly permissive subscriptions service role policy to only the service_role
DROP POLICY IF EXISTS "Service role pode gerenciar assinaturas" ON public.subscriptions;

CREATE POLICY "Service role can manage subscriptions"
  ON public.subscriptions
  AS PERMISSIVE
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);