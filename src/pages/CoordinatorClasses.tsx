import { Layout } from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { SchoolClassesTab } from "@/components/schools/SchoolClassesTab";

export default function CoordinatorClasses() {
  const { user } = useAuth();

  const { data: coordLink, isLoading } = useQuery({
    queryKey: ["coordinator-school", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("school_coordinators")
        .select("school_id, schools(name)")
        .eq("user_id", user!.id)
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const schoolId = coordLink?.school_id;
  const schoolName = (coordLink as any)?.schools?.name || "Minha Escola";

  if (isLoading || !schoolId) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Turmas</h1>
          <p className="text-muted-foreground">Gerencie as turmas de {schoolName}</p>
        </div>
        <SchoolClassesTab schoolId={schoolId} schoolName={schoolName} />
      </div>
    </Layout>
  );
}
