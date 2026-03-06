
DO $$
DECLARE
  uid uuid := 'e65aa29e-e44f-4b2e-ba4d-b9a6b79fdcaa';
BEGIN

-- USER PERFORMANCE (sem accuracy_percentage - é gerada)
INSERT INTO user_performance (user_id, subject_id, total_questions, correct_answers, wrong_answers, last_practice_at) VALUES
(uid, 'it', 18, 12, 6, now() - interval '1 day'),
(uid, 'hi', 12, 9, 3, now() - interval '2 days'),
(uid, 'fi', 10, 8, 2, now() - interval '3 days'),
(uid, 'ma', 12, 10, 2, now() - interval '1 day'),
(uid, 'ge', 6, 5, 1, now() - interval '5 days'),
(uid, 'bi', 5, 4, 1, now() - interval '7 days'),
(uid, 'qu', 3, 2, 1, now() - interval '9 days'),
(uid, 'li', 5, 4, 1, now() - interval '4 days'),
(uid, 'in', 3, 1, 2, now() - interval '2 days'),
(uid, 'gr', 3, 1, 2, now() - interval '6 days');

-- SIMULATIONS (4 completed)
INSERT INTO simulations (id, user_id, title, question_count, status, subject_ids, exam_ids, difficulty_levels, time_limit_minutes, started_at, completed_at, total_answered, total_correct, score_percentage, total_time_seconds, created_at) VALUES
('a1000001-0000-0000-0000-000000000001', uid, 'Simulado ENEM - Ciências Humanas', 10, 'completed', ARRAY['hi','ge','fl','so'], ARRAY['enem'], ARRAY['facil','medio'], 60, now() - interval '30 days', now() - interval '30 days' + interval '42 minutes', 10, 7, 70.0, 2520, now() - interval '30 days'),
('a1000001-0000-0000-0000-000000000002', uid, 'Simulado PAES - Exatas', 10, 'completed', ARRAY['ma','fi','qu'], ARRAY['paes-uema'], ARRAY['facil','medio'], 60, now() - interval '20 days', now() - interval '20 days' + interval '48 minutes', 10, 8, 80.0, 2880, now() - interval '20 days'),
('a1000001-0000-0000-0000-000000000003', uid, 'Simulado Linguagens', 10, 'completed', ARRAY['it','li','gr','in'], ARRAY['enem','paes-uema'], ARRAY['medio'], 45, now() - interval '10 days', now() - interval '10 days' + interval '35 minutes', 10, 6, 60.0, 2100, now() - interval '10 days'),
('a1000001-0000-0000-0000-000000000004', uid, 'Simulado Geral', 15, 'completed', ARRAY['ma','fi','hi','ge','bi'], ARRAY['enem'], ARRAY['facil','medio','dificil'], 90, now() - interval '2 days', now() - interval '2 days' + interval '72 minutes', 15, 12, 80.0, 4320, now() - interval '2 days');

-- SIMULATION QUESTIONS for Sim 1 (10 questions, 7 correct)
INSERT INTO simulation_questions (simulation_id, question_id, question_order, selected_answer, is_correct, answered_at, time_spent_seconds) VALUES
('a1000001-0000-0000-0000-000000000001', '94523040-2576-44a4-9174-61fb89baf48f', 1, 'c', true, now() - interval '30 days' + interval '4 minutes', 240),
('a1000001-0000-0000-0000-000000000001', '2c4d1d3d-9bb8-40f6-8d42-93b50a66f9f4', 2, 'd', true, now() - interval '30 days' + interval '8 minutes', 240),
('a1000001-0000-0000-0000-000000000001', '7ab8a7d3-520d-4b02-877c-85dddb53ff88', 3, 'c', true, now() - interval '30 days' + interval '12 minutes', 240),
('a1000001-0000-0000-0000-000000000001', 'd1c396aa-a9f9-40c6-898f-ba45839bec83', 4, 'e', true, now() - interval '30 days' + interval '16 minutes', 240),
('a1000001-0000-0000-0000-000000000001', '1d4d2d2d-8b26-49a4-83ca-40ccc10ec692', 5, 'a', true, now() - interval '30 days' + interval '20 minutes', 240),
('a1000001-0000-0000-0000-000000000001', 'cad502fa-3b09-4ef4-8de5-d3a39584328d', 6, 'd', true, now() - interval '30 days' + interval '24 minutes', 240),
('a1000001-0000-0000-0000-000000000001', 'eb3720fc-c4ad-4b78-949a-5d17c2ca2767', 7, 'e', true, now() - interval '30 days' + interval '28 minutes', 240),
('a1000001-0000-0000-0000-000000000001', '53b35ecb-4fa0-48b5-bd6d-001682ad7ad3', 8, 'a', false, now() - interval '30 days' + interval '32 minutes', 240),
('a1000001-0000-0000-0000-000000000001', '5fc98682-060b-4199-b0ad-7948f5c251d1', 9, 'a', false, now() - interval '30 days' + interval '36 minutes', 240),
('a1000001-0000-0000-0000-000000000001', '13c241bd-7d55-49c1-b21f-a8355dc6c58f', 10, 'a', false, now() - interval '30 days' + interval '40 minutes', 240);

-- SIMULATION QUESTIONS for Sim 2 (10 questions, 8 correct)
INSERT INTO simulation_questions (simulation_id, question_id, question_order, selected_answer, is_correct, answered_at, time_spent_seconds) VALUES
('a1000001-0000-0000-0000-000000000002', '410f56ff-1e6d-420c-b484-634c7e73d7c1', 1, 'b', true, now() - interval '20 days' + interval '5 minutes', 300),
('a1000001-0000-0000-0000-000000000002', '725dad1e-0e7b-4f7e-970e-881d4abb7f76', 2, 'd', true, now() - interval '20 days' + interval '10 minutes', 300),
('a1000001-0000-0000-0000-000000000002', '9978960a-0d02-459f-b755-dc5d80d4d848', 3, 'd', true, now() - interval '20 days' + interval '15 minutes', 300),
('a1000001-0000-0000-0000-000000000002', 'fe14d5cb-9498-4c1d-9845-dcac71c17dd0', 4, 'a', true, now() - interval '20 days' + interval '20 minutes', 300),
('a1000001-0000-0000-0000-000000000002', '01b46ef7-0778-4839-b78a-21f24e6529f2', 5, 'a', true, now() - interval '20 days' + interval '25 minutes', 300),
('a1000001-0000-0000-0000-000000000002', 'b67a4ec0-d334-480c-ad16-8a76598733ff', 6, 'b', true, now() - interval '20 days' + interval '30 minutes', 300),
('a1000001-0000-0000-0000-000000000002', '74ebac64-8adf-458d-8ffd-9b9bcdb3cf06', 7, 'b', true, now() - interval '20 days' + interval '35 minutes', 300),
('a1000001-0000-0000-0000-000000000002', 'cb039da5-16a5-4229-bc02-e7a9649ccad5', 8, 'a', true, now() - interval '20 days' + interval '40 minutes', 300),
('a1000001-0000-0000-0000-000000000002', 'c44cfc54-56a3-4d9e-ad9f-f93f188cf9de', 9, 'a', false, now() - interval '20 days' + interval '44 minutes', 240),
('a1000001-0000-0000-0000-000000000002', '70014557-bee7-462f-ab7c-6eb7f0fc11e0', 10, 'a', false, now() - interval '20 days' + interval '48 minutes', 240);

-- SIMULATION QUESTIONS for Sim 3 (10 questions, 6 correct)
INSERT INTO simulation_questions (simulation_id, question_id, question_order, selected_answer, is_correct, answered_at, time_spent_seconds) VALUES
('a1000001-0000-0000-0000-000000000003', '0294a887-3778-452d-b901-01937d993ce9', 1, 'a', true, now() - interval '10 days' + interval '3 minutes', 180),
('a1000001-0000-0000-0000-000000000003', '1f7904ea-aab8-425b-8ea9-16aa225ca626', 2, 'd', true, now() - interval '10 days' + interval '7 minutes', 240),
('a1000001-0000-0000-0000-000000000003', 'efa71822-9a4a-4a8f-9e0d-4084e3bdfa2c', 3, 'c', true, now() - interval '10 days' + interval '10 minutes', 180),
('a1000001-0000-0000-0000-000000000003', 'b5e29f7e-47f2-4452-8504-f5e03bd0b64b', 4, 'a', true, now() - interval '10 days' + interval '14 minutes', 240),
('a1000001-0000-0000-0000-000000000003', '525563e5-c1ef-4df1-9a8e-5f9190d0ab41', 5, 'e', true, now() - interval '10 days' + interval '17 minutes', 180),
('a1000001-0000-0000-0000-000000000003', 'f8f5149a-1533-4a2f-8a8b-0c3960bb523b', 6, 'c', true, now() - interval '10 days' + interval '20 minutes', 180),
('a1000001-0000-0000-0000-000000000003', '97a8a1db-9a7b-4aa9-ac68-a901320759bd', 7, 'c', false, now() - interval '10 days' + interval '24 minutes', 240),
('a1000001-0000-0000-0000-000000000003', '85822557-2da1-41a0-aa2d-285c6609baef', 8, 'a', false, now() - interval '10 days' + interval '27 minutes', 180),
('a1000001-0000-0000-0000-000000000003', '775f24e1-65ac-47c7-a625-6290b13d0f01', 9, 'a', false, now() - interval '10 days' + interval '31 minutes', 240),
('a1000001-0000-0000-0000-000000000003', 'ac9a8183-6a38-4c13-bcc0-8d8f10174a5c', 10, 'c', false, now() - interval '10 days' + interval '35 minutes', 240);

-- SIMULATION QUESTIONS for Sim 4 (15 questions, 12 correct)
INSERT INTO simulation_questions (simulation_id, question_id, question_order, selected_answer, is_correct, answered_at, time_spent_seconds) VALUES
('a1000001-0000-0000-0000-000000000004', '50f0d565-17d1-40fd-8d95-7e563346d03a', 1, 'a', true, now() - interval '2 days' + interval '5 minutes', 300),
('a1000001-0000-0000-0000-000000000004', 'd74e022c-2e5f-49e8-9ea4-65bf7fa81172', 2, 'c', true, now() - interval '2 days' + interval '10 minutes', 300),
('a1000001-0000-0000-0000-000000000004', '851afbb7-d1b0-42df-841b-3ffaaf1fac39', 3, 'b', true, now() - interval '2 days' + interval '14 minutes', 240),
('a1000001-0000-0000-0000-000000000004', '07c15781-b1bd-4f73-819f-f152a18b94b8', 4, 'a', true, now() - interval '2 days' + interval '18 minutes', 240),
('a1000001-0000-0000-0000-000000000004', '7e7b1e4c-47d3-4b17-8dcd-55ed7876b57c', 5, 'b', true, now() - interval '2 days' + interval '22 minutes', 240),
('a1000001-0000-0000-0000-000000000004', '93b96de9-caa4-4c73-a228-429d1da95411', 6, 'a', true, now() - interval '2 days' + interval '27 minutes', 300),
('a1000001-0000-0000-0000-000000000004', 'e15b7229-b0ca-41f8-b2cc-2ae4ed912761', 7, 'a', true, now() - interval '2 days' + interval '32 minutes', 300),
('a1000001-0000-0000-0000-000000000004', '3f0f04df-eb8d-4191-88f4-02ce057d5a3c', 8, 'b', true, now() - interval '2 days' + interval '36 minutes', 240),
('a1000001-0000-0000-0000-000000000004', '7bf69fd8-ba0a-40c6-bcb8-2fb6f39c666d', 9, 'e', true, now() - interval '2 days' + interval '40 minutes', 240),
('a1000001-0000-0000-0000-000000000004', '72e59d22-a429-48f2-b6a0-15c8ffd88349', 10, 'd', true, now() - interval '2 days' + interval '44 minutes', 240),
('a1000001-0000-0000-0000-000000000004', 'b43a4d90-fb72-4986-8678-c89a61cc2c24', 11, 'd', true, now() - interval '2 days' + interval '50 minutes', 360),
('a1000001-0000-0000-0000-000000000004', '0cfcfd95-7963-4c8f-a9c1-2bd2dc0be9e4', 12, 'd', true, now() - interval '2 days' + interval '55 minutes', 300),
('a1000001-0000-0000-0000-000000000004', 'fd3b8879-55f0-4aa2-b511-4c6e5a841ed1', 13, 'a', false, now() - interval '2 days' + interval '60 minutes', 300),
('a1000001-0000-0000-0000-000000000004', 'bca1e99d-8963-4471-a156-0653f39b9b4b', 14, 'b', false, now() - interval '2 days' + interval '65 minutes', 300),
('a1000001-0000-0000-0000-000000000004', '718e9282-dee3-4dec-a75b-59052aafce25', 15, 'a', false, now() - interval '2 days' + interval '70 minutes', 300);

END $$;
