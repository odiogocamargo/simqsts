-- Inserir Áreas
INSERT INTO public.areas (id, name) VALUES
('ciencias-humanas', 'Ciências Humanas'),
('ciencias-da-natureza', 'Ciências da Natureza'),
('linguagens', 'Linguagens'),
('matematica', 'Matemática');

-- Inserir Subjects (Matérias)
INSERT INTO public.subjects (id, name, area_id) VALUES
('filosofia', 'Filosofia', 'ciencias-humanas'),
('geografia', 'Geografia', 'ciencias-humanas'),
('historia', 'História', 'ciencias-humanas'),
('sociologia', 'Sociologia', 'ciencias-humanas'),
('biologia', 'Biologia', 'ciencias-da-natureza'),
('fisica', 'Física', 'ciencias-da-natureza'),
('quimica', 'Química', 'ciencias-da-natureza'),
('espanhol', 'Espanhol', 'linguagens'),
('gramatica', 'Gramática', 'linguagens'),
('ingles', 'Inglês', 'linguagens'),
('interpretacao-textual', 'Interpretação Textual', 'linguagens'),
('literatura', 'Literatura', 'linguagens'),
('matematica', 'Matemática', 'matematica');