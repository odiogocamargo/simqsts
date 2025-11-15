import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserRole, UserRole } from '@/hooks/useUserRole';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const RoleBasedRoute = ({ children, allowedRoles }: RoleBasedRouteProps) => {
  const { role, isLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && role) {
      if (!allowedRoles.includes(role)) {
        // Redireciona baseado na role do usuário
        if (role === "aluno") {
          navigate('/student');
        } else if (role === "admin" || role === "professor") {
          navigate('/dashboard');
        }
      }
    }
  }, [role, isLoading, allowedRoles, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!role || !allowedRoles.includes(role)) {
    return null;
  }

  return <>{children}</>;
};
