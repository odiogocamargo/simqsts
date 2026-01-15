import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type UserRole = "admin" | "professor" | "aluno" | null;

export const useUserRole = () => {
  const { user } = useAuth();

  const { data: role, isLoading } = useQuery<UserRole>({
    queryKey: ["user-role", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // user_roles pode ter 0 linhas (usuário sem role) ou mais de 1 (caso a regra mude no futuro).
      // Então evitamos .single() para não cair em erro e acabarmos assumindo permissões indevidas.
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching user role:", error);
        return null;
      }

      const roles = (data ?? []).map((r) => r.role) as Exclude<UserRole, null>[];

      // Hierarquia de permissões (mais forte primeiro)
      if (roles.includes("admin")) return "admin";
      if (roles.includes("professor")) return "professor";
      if (roles.includes("aluno")) return "aluno";

      return null;
    },
    enabled: !!user?.id,
  });

  return {
    role,
    isLoading,
    isAdmin: role === "admin",
    isProfessor: role === "professor",
    isAluno: role === "aluno",
  };
};
