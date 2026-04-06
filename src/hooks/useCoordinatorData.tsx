import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface StudentProfile {
  id: string;
  full_name: string | null;
}

export interface AnswerRecord {
  user_id: string;
  is_correct: boolean;
  question_id: string;
  answered_at: string;
  time_spent_seconds: number | null;
  selected_answer: string;
}

export interface PerformanceRecord {
  user_id: string;
  subject_id: string;
  total_questions: number;
  correct_answers: number;
  accuracy_percentage: number | null;
}

export const useCoordinatorSchool = () => {
  const { user } = useAuth();

  const { data: coordLink, isLoading } = useQuery({
    queryKey: ["coordinator-school", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("school_coordinators")
        .select("school_id, schools(name, logo_url)")
        .eq("user_id", user!.id)
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return {
    schoolId: coordLink?.school_id,
    schoolName: (coordLink as any)?.schools?.name || "Minha Escola",
    schoolLogo: (coordLink as any)?.schools?.logo_url,
    isLoading,
  };
};

export const useCoordinatorStudents = (schoolId: string | undefined) => {
  return useQuery({
    queryKey: ["coord-students", schoolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("school_students")
        .select("user_id")
        .eq("school_id", schoolId!);
      if (error) throw error;

      const userIds = data.map(d => d.user_id);
      if (userIds.length === 0) return [];

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds);

      return (profiles || []) as StudentProfile[];
    },
    enabled: !!schoolId,
  });
};

export const useCoordinatorAnswers = (schoolId: string | undefined) => {
  return useQuery({
    queryKey: ["coord-answers", schoolId],
    queryFn: async () => {
      const { data: schoolStudents } = await supabase
        .from("school_students")
        .select("user_id")
        .eq("school_id", schoolId!);

      const userIds = schoolStudents?.map(s => s.user_id) || [];
      if (userIds.length === 0) return [];

      // Paginate to bypass 1000 row limit
      let allAnswers: AnswerRecord[] = [];
      const pageSize = 1000;
      for (let i = 0; i < userIds.length; i += 10) {
        const batch = userIds.slice(i, i + 10);
        let from = 0;
        while (true) {
          const { data } = await supabase
            .from("user_answers")
            .select("user_id, is_correct, question_id, answered_at, time_spent_seconds, selected_answer")
            .in("user_id", batch)
            .range(from, from + pageSize - 1)
            .order("answered_at", { ascending: false });

          if (!data || data.length === 0) break;
          allAnswers = allAnswers.concat(data as AnswerRecord[]);
          if (data.length < pageSize) break;
          from += pageSize;
        }
      }

      return allAnswers;
    },
    enabled: !!schoolId,
  });
};

export const useCoordinatorPerformance = (schoolId: string | undefined) => {
  return useQuery({
    queryKey: ["coord-performance-subjects", schoolId],
    queryFn: async () => {
      const { data: schoolStudents } = await supabase
        .from("school_students")
        .select("user_id")
        .eq("school_id", schoolId!);

      const userIds = schoolStudents?.map(s => s.user_id) || [];
      if (userIds.length === 0) return { performance: [], subjects: [] };

      const { data: performance } = await supabase
        .from("user_performance")
        .select("user_id, subject_id, total_questions, correct_answers, accuracy_percentage")
        .in("user_id", userIds);

      const { data: subjects } = await supabase
        .from("subjects")
        .select("id, name");

      return { performance: (performance || []) as PerformanceRecord[], subjects: subjects || [] };
    },
    enabled: !!schoolId,
  });
};

export const useCoordinatorClasses = (schoolId: string | undefined) => {
  return useQuery({
    queryKey: ["coord-classes", schoolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("school_classes")
        .select("id, name, year, shift")
        .eq("school_id", schoolId!)
        .eq("active", true)
        .order("name");
      if (error) throw error;
      return data || [];
    },
    enabled: !!schoolId,
  });
};

export const useClassStudents = (classId: string | undefined) => {
  return useQuery({
    queryKey: ["class-students-set", classId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("school_class_students")
        .select("student_id")
        .eq("class_id", classId!);
      if (error) throw error;
      return new Set((data || []).map(d => d.student_id));
    },
    enabled: !!classId,
  });
};
