-- Inserir roles para os usuários específicos
-- Primeiro limpar roles existentes desses usuários para evitar duplicatas
DELETE FROM public.user_roles WHERE user_id IN (
  'e65aa29e-e44f-4b2e-ba4d-b9a6b79fdcaa',
  '72388fda-04e8-47b5-b4c3-cc6a106dd199'
);

-- Inserir role de aluno
INSERT INTO public.user_roles (user_id, role)
VALUES ('e65aa29e-e44f-4b2e-ba4d-b9a6b79fdcaa', 'aluno');

-- Inserir role de admin
INSERT INTO public.user_roles (user_id, role)
VALUES ('72388fda-04e8-47b5-b4c3-cc6a106dd199', 'admin');