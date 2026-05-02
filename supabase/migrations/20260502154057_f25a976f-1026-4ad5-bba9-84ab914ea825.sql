-- Triggers que enfileiram eventos na webhook_outbox para todas as 8 entidades.
-- A função enqueue_outbox_event() já existe e recebe o entity_type via TG_ARGV[0].

-- Limpa triggers anteriores (idempotente)
DROP TRIGGER IF EXISTS outbox_areas ON public.areas;
DROP TRIGGER IF EXISTS outbox_subjects ON public.subjects;
DROP TRIGGER IF EXISTS outbox_contents ON public.contents;
DROP TRIGGER IF EXISTS outbox_topics ON public.topics;
DROP TRIGGER IF EXISTS outbox_exams ON public.exams;
DROP TRIGGER IF EXISTS outbox_questions ON public.questions;
DROP TRIGGER IF EXISTS outbox_question_topics ON public.question_topics;
DROP TRIGGER IF EXISTS outbox_question_images ON public.question_images;

CREATE TRIGGER outbox_areas
AFTER INSERT OR UPDATE OR DELETE ON public.areas
FOR EACH ROW EXECUTE FUNCTION public.enqueue_outbox_event('area');

CREATE TRIGGER outbox_subjects
AFTER INSERT OR UPDATE OR DELETE ON public.subjects
FOR EACH ROW EXECUTE FUNCTION public.enqueue_outbox_event('subject');

CREATE TRIGGER outbox_contents
AFTER INSERT OR UPDATE OR DELETE ON public.contents
FOR EACH ROW EXECUTE FUNCTION public.enqueue_outbox_event('content');

CREATE TRIGGER outbox_topics
AFTER INSERT OR UPDATE OR DELETE ON public.topics
FOR EACH ROW EXECUTE FUNCTION public.enqueue_outbox_event('topic');

CREATE TRIGGER outbox_exams
AFTER INSERT OR UPDATE OR DELETE ON public.exams
FOR EACH ROW EXECUTE FUNCTION public.enqueue_outbox_event('exam');

CREATE TRIGGER outbox_questions
AFTER INSERT OR UPDATE OR DELETE ON public.questions
FOR EACH ROW EXECUTE FUNCTION public.enqueue_outbox_event('question');

CREATE TRIGGER outbox_question_topics
AFTER INSERT OR UPDATE OR DELETE ON public.question_topics
FOR EACH ROW EXECUTE FUNCTION public.enqueue_outbox_event('question_topic');

CREATE TRIGGER outbox_question_images
AFTER INSERT OR UPDATE OR DELETE ON public.question_images
FOR EACH ROW EXECUTE FUNCTION public.enqueue_outbox_event('question_image');