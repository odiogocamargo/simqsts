-- Criar bucket para imagens de questões
INSERT INTO storage.buckets (id, name, public)
VALUES ('question-images', 'question-images', true);

-- RLS Policies para o bucket de imagens de questões
CREATE POLICY "Imagens de questões são públicas"
ON storage.objects FOR SELECT
USING (bucket_id = 'question-images');

CREATE POLICY "Professores e admins podem fazer upload de imagens"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'question-images' 
  AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'professor'::app_role))
);

CREATE POLICY "Professores e admins podem atualizar imagens"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'question-images' 
  AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'professor'::app_role))
);

CREATE POLICY "Professores e admins podem deletar imagens"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'question-images' 
  AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'professor'::app_role))
);