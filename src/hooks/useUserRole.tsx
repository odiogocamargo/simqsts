import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type UserRole = "admin" | "professor" | null;

export const useUserRole = () => {
  const { user } = useAuth();

  const { data: role, isLoading } = useQuery<UserRole>({
    queryKey: ["user-role", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching user role:", error);
        return null;
      }

      const roles = (data ?? []).map((r) => r.role as string);

      if (roles.includes("admin")) return "admin";
      if (roles.includes("professor")) return "professor";

      return null;
    },
    enabled: !!user?.id,
  });

  return {
    role,
    isLoading,
    isAdmin: role === "admin",
    isProfessor: role === "professor",
  };
};
