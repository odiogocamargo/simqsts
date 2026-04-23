-- Extensões necessárias para agendamento e chamadas HTTP
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Remover job anterior se existir (idempotente)
DO $$
BEGIN
  PERFORM cron.unschedule('sync-asaas-every-10-min');
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Agendar job a cada 10 minutos
SELECT cron.schedule(
  'sync-asaas-every-10-min',
  '*/10 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://ovpvsysssqnvqwkqeybh.supabase.co/functions/v1/sync-asaas-all',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92cHZzeXNzc3FudnF3a3FleWJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTUwOTAsImV4cCI6MjA3ODI5MTA5MH0.wBd2oTp57GyeQuA9JaxepKQh1I9_bGaFP3il0aSX7fE"}'::jsonb,
    body := jsonb_build_object('triggered_at', now())
  ) AS request_id;
  $$
);