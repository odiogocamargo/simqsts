-- ============================================
-- Extensions necessárias
-- ============================================
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- ============================================
-- Adicionar updated_at nas tabelas de taxonomia
-- ============================================
ALTER TABLE public.areas    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE public.exams    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE public.contents ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE public.topics   ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Triggers para manter updated_at
DROP TRIGGER IF EXISTS set_updated_at_areas    ON public.areas;
DROP TRIGGER IF EXISTS set_updated_at_exams    ON public.exams;
DROP TRIGGER IF EXISTS set_updated_at_subjects ON public.subjects;
DROP TRIGGER IF EXISTS set_updated_at_contents ON public.contents;
DROP TRIGGER IF EXISTS set_updated_at_topics   ON public.topics;

CREATE TRIGGER set_updated_at_areas    BEFORE UPDATE ON public.areas    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_exams    BEFORE UPDATE ON public.exams    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_subjects BEFORE UPDATE ON public.subjects FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_contents BEFORE UPDATE ON public.contents FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at_topics   BEFORE UPDATE ON public.topics   FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Garantir trigger em questions também (pode já existir)
DROP TRIGGER IF EXISTS set_updated_at_questions ON public.questions;
CREATE TRIGGER set_updated_at_questions BEFORE UPDATE ON public.questions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- Tabela: external_consumers
-- ============================================
CREATE TABLE IF NOT EXISTS public.external_consumers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  api_key_hash    TEXT NOT NULL UNIQUE,
  api_key_prefix  TEXT NOT NULL, -- primeiros 8 chars para identificação visual
  webhook_url     TEXT,
  webhook_secret  TEXT, -- assinatura HMAC dos webhooks
  active          BOOLEAN NOT NULL DEFAULT true,
  last_ping_at    TIMESTAMPTZ,
  events_sent     BIGINT NOT NULL DEFAULT 0,
  events_failed   BIGINT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_external_consumers_active ON public.external_consumers(active);

ALTER TABLE public.external_consumers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins gerenciam consumidores externos"
ON public.external_consumers FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role acesso total consumidores"
ON public.external_consumers FOR ALL TO service_role
USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS set_updated_at_external_consumers ON public.external_consumers;
CREATE TRIGGER set_updated_at_external_consumers
BEFORE UPDATE ON public.external_consumers
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- Tabela: webhook_outbox (fila de eventos)
-- ============================================
CREATE TABLE IF NOT EXISTS public.webhook_outbox (
  id              BIGSERIAL PRIMARY KEY,
  entity_type     TEXT NOT NULL,  -- question, subject, content, topic, area, exam, question_image, question_topic
  entity_id       TEXT NOT NULL,  -- uuid ou id textual
  operation       TEXT NOT NULL,  -- insert | update | delete
  payload         JSONB,          -- snapshot da row (NULL em delete pesado)
  attempts        INT NOT NULL DEFAULT 0,
  next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  delivered_at    TIMESTAMPTZ,
  last_error      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_outbox_pending
  ON public.webhook_outbox(next_attempt_at)
  WHERE delivered_at IS NULL;

ALTER TABLE public.webhook_outbox ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins veem outbox"
ON public.webhook_outbox FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role acesso total outbox"
ON public.webhook_outbox FOR ALL TO service_role
USING (true) WITH CHECK (true);

-- ============================================
-- Função genérica que enfileira eventos
-- ============================================
CREATE OR REPLACE FUNCTION public.enqueue_outbox_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_entity_type TEXT := TG_ARGV[0];
  v_entity_id   TEXT;
  v_operation   TEXT;
  v_payload     JSONB;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_operation := 'delete';
    v_entity_id := COALESCE((to_jsonb(OLD)->>'id'), '');
    v_payload   := to_jsonb(OLD);
  ELSIF TG_OP = 'INSERT' THEN
    v_operation := 'insert';
    v_entity_id := COALESCE((to_jsonb(NEW)->>'id'), '');
    v_payload   := to_jsonb(NEW);
  ELSE
    v_operation := 'update';
    v_entity_id := COALESCE((to_jsonb(NEW)->>'id'), '');
    v_payload   := to_jsonb(NEW);
  END IF;

  INSERT INTO public.webhook_outbox(entity_type, entity_id, operation, payload)
  VALUES (v_entity_type, v_entity_id, v_operation, v_payload);

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- ============================================
-- Triggers de captura nas tabelas espelhadas
-- ============================================
DROP TRIGGER IF EXISTS outbox_questions        ON public.questions;
DROP TRIGGER IF EXISTS outbox_question_images  ON public.question_images;
DROP TRIGGER IF EXISTS outbox_question_topics  ON public.question_topics;
DROP TRIGGER IF EXISTS outbox_subjects         ON public.subjects;
DROP TRIGGER IF EXISTS outbox_contents         ON public.contents;
DROP TRIGGER IF EXISTS outbox_topics           ON public.topics;
DROP TRIGGER IF EXISTS outbox_areas            ON public.areas;
DROP TRIGGER IF EXISTS outbox_exams            ON public.exams;

CREATE TRIGGER outbox_questions       AFTER INSERT OR UPDATE OR DELETE ON public.questions       FOR EACH ROW EXECUTE FUNCTION public.enqueue_outbox_event('question');
CREATE TRIGGER outbox_question_images AFTER INSERT OR UPDATE OR DELETE ON public.question_images FOR EACH ROW EXECUTE FUNCTION public.enqueue_outbox_event('question_image');
CREATE TRIGGER outbox_question_topics AFTER INSERT OR UPDATE OR DELETE ON public.question_topics FOR EACH ROW EXECUTE FUNCTION public.enqueue_outbox_event('question_topic');
CREATE TRIGGER outbox_subjects        AFTER INSERT OR UPDATE OR DELETE ON public.subjects       FOR EACH ROW EXECUTE FUNCTION public.enqueue_outbox_event('subject');
CREATE TRIGGER outbox_contents        AFTER INSERT OR UPDATE OR DELETE ON public.contents       FOR EACH ROW EXECUTE FUNCTION public.enqueue_outbox_event('content');
CREATE TRIGGER outbox_topics          AFTER INSERT OR UPDATE OR DELETE ON public.topics         FOR EACH ROW EXECUTE FUNCTION public.enqueue_outbox_event('topic');
CREATE TRIGGER outbox_areas           AFTER INSERT OR UPDATE OR DELETE ON public.areas          FOR EACH ROW EXECUTE FUNCTION public.enqueue_outbox_event('area');
CREATE TRIGGER outbox_exams           AFTER INSERT OR UPDATE OR DELETE ON public.exams          FOR EACH ROW EXECUTE FUNCTION public.enqueue_outbox_event('exam');