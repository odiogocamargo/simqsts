-- Adicionar colunas para CPF, endereço e WhatsApp na tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN cpf TEXT,
ADD COLUMN endereco TEXT,
ADD COLUMN whatsapp TEXT;

-- Atualizar o trigger para incluir os novos campos
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, cpf, endereco, whatsapp)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'cpf',
    NEW.raw_user_meta_data->>'endereco',
    NEW.raw_user_meta_data->>'whatsapp'
  );
  
  -- Adicionar role padrão de aluno para novos usuários
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'aluno');
  
  RETURN NEW;
END;
$$;