import { useUserRole, UserRole } from "@/hooks/useUserRole";
import { Navigate } from "react-router-dom";

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const RoleBasedRoute = ({ children, allowedRoles }: RoleBasedRouteProps) => {
  const { role, isLoading } = useUserRole();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se o usuário está logado mas não tem role definida, mostra mensagem ao invés de redirecionar
  // (redirecionar para /auth causaria loop infinito pois Auth redireciona usuários logados de volta)
  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Sua conta ainda não possui um perfil de acesso configurado.</p>
          <p className="text-sm text-muted-foreground">Entre em contato com o administrador.</p>
        </div>
      </div>
    );
  }

  if (allowedRoles.includes(role)) {
    return <>{children}</>;
  }

  const redirectTo = role === "aluno" ? "/student" : "/dashboard";
  return <Navigate to={redirectTo} replace />;
};

