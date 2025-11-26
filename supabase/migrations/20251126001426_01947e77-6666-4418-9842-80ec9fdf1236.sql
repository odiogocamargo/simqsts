-- Adicionar novas bancas de vestibulares
INSERT INTO exams (id, name) VALUES 
('uece', 'UECE'),
('unb', 'UNB'),
('fuvest', 'FUVEST'),
('ita', 'ITA'),
('fgv', 'FGV'),
('ime', 'IME'),
('puc-sp', 'PUC-SP'),
('puc-rj', 'PUC-RJ'),
('puc-campinas', 'PUC-Campinas'),
('puc-go', 'PUC-GO'),
('puc-pr', 'PUC-PR'),
('puc-mg', 'PUC-MG'),
('puc-rs', 'PUC-RS'),
('uerj', 'UERJ')
ON CONFLICT (id) DO NOTHING;