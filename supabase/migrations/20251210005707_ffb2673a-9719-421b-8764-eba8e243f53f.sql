-- Criar trigger para atribuir role 'aluno' automaticamente a novos usuários
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();