-- Remove job anterior se existir
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'dispatch-external-webhooks') THEN
    PERFORM cron.unschedule('dispatch-external-webhooks');
  END IF;
END $$;

SELECT cron.schedule(
  'dispatch-external-webhooks',
  '* * * * *',
  $$
  SELECT net.http_post(
    url := 'https://ovpvsysssqnvqwkqeybh.supabase.co/functions/v1/dispatch-webhooks',
    headers := '{"Content-Type":"application/json","apikey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92cHZzeXNzc3FudnF3a3FleWJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTUwOTAsImV4cCI6MjA3ODI5MTA5MH0.wBd2oTp57GyeQuA9JaxepKQh1I9_bGaFP3il0aSX7fE"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);