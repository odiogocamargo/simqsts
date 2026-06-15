import { useUserRole, UserRole } from "@/hooks/useUserRole";

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: Exclude<UserRole, null>[];
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

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center space-y-3 max-w-md">
          <h2 className="text-xl font-semibold">Acesso pendente</h2>
          <p className="text-muted-foreground">
            Sua conta ainda não tem um perfil de acesso configurado.
          </p>
          <p className="text-sm text-muted-foreground">
            Entre em contato com um administrador para liberar o seu acesso.
          </p>
        </div>
      </div>
    );
  }

  if (allowedRoles.includes(role)) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="text-center space-y-3 max-w-md">
        <h2 className="text-xl font-semibold">Sem permissão</h2>
        <p className="text-muted-foreground">
          Sua conta não tem permissão para acessar esta página.
        </p>
      </div>
    </div>
  );
};
