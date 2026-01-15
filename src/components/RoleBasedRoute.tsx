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

  // Se o usuário está logado mas não tem role definida, não deixamos "cair" em permissões de admin.
  if (!role) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles.includes(role)) {
    return <>{children}</>;
  }

  const redirectTo = role === "aluno" ? "/student" : "/dashboard";
  return <Navigate to={redirectTo} replace />;
};

