export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      areas: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      contents: {
        Row: {
          created_at: string
          id: string
          name: string
          subject_id: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          subject_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contents_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cpf: string | null
          created_at: string
          endereco: string | null
          full_name: string | null
          id: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          avatar_url?: string | null
          cpf?: string | null
          created_at?: string
          endereco?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          avatar_url?: string | null
          cpf?: string | null
          created_at?: string
          endereco?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      question_images: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          image_type: string | null
          image_url: string
          question_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          image_type?: string | null
          image_url: string
          question_id: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          image_type?: string | null
          image_url?: string
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_images_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      question_topics: {
        Row: {
          created_at: string
          id: string
          question_id: string
          topic_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          topic_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_topics_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_topics_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          content_id: string
          correct_answer: string | null
          created_at: string
          created_by: string
          difficulty: string | null
          exam_id: string
          explanation: string | null
          id: string
          needs_review: boolean | null
          option_a: string | null
          option_b: string | null
          option_c: string | null
          option_d: string | null
          option_e: string | null
          question_number: string | null
          question_type: Database["public"]["Enums"]["question_type"]
          review_reason: string | null
          statement: string
          subject_id: string
          updated_at: string
          year: number
        }
        Insert: {
          content_id: string
          correct_answer?: string | null
          created_at?: string
          created_by: string
          difficulty?: string | null
          exam_id: string
          explanation?: string | null
          id?: string
          needs_review?: boolean | null
          option_a?: string | null
          option_b?: string | null
          option_c?: string | null
          option_d?: string | null
          option_e?: string | null
          question_number?: string | null
          question_type?: Database["public"]["Enums"]["question_type"]
          review_reason?: string | null
          statement: string
          subject_id: string
          updated_at?: string
          year: number
        }
        Update: {
          content_id?: string
          correct_answer?: string | null
          created_at?: string
          created_by?: string
          difficulty?: string | null
          exam_id?: string
          explanation?: string | null
          id?: string
          needs_review?: boolean | null
          option_a?: string | null
          option_b?: string | null
          option_c?: string | null
          option_d?: string | null
          option_e?: string | null
          question_number?: string | null
          question_type?: Database["public"]["Enums"]["question_type"]
          review_reason?: string | null
          statement?: string
          subject_id?: string
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "questions_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "contents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      school_students: {
        Row: {
          created_at: string
          id: string
          school_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          school_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          school_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "school_students_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          active: boolean
          address: string | null
          cnpj: string | null
          created_at: string
          email: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          address?: string | null
          cnpj?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          address?: string | null
          cnpj?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      simulation_questions: {
        Row: {
          answered_at: string | null
          created_at: string
          id: string
          is_correct: boolean | null
          question_id: string
          question_order: number
          selected_answer: string | null
          simulation_id: string
          time_spent_seconds: number | null
        }
        Insert: {
          answered_at?: string | null
          created_at?: string
          id?: string
          is_correct?: boolean | null
          question_id: string
          question_order: number
          selected_answer?: string | null
          simulation_id: string
          time_spent_seconds?: number | null
        }
        Update: {
          answered_at?: string | null
          created_at?: string
          id?: string
          is_correct?: boolean | null
          question_id?: string
          question_order?: number
          selected_answer?: string | null
          simulation_id?: string
          time_spent_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "simulation_questions_simulation_id_fkey"
            columns: ["simulation_id"]
            isOneToOne: false
            referencedRelation: "simulations"
            referencedColumns: ["id"]
          },
        ]
      }
      simulations: {
        Row: {
          completed_at: string | null
          content_ids: string[] | null
          created_at: string
          difficulty_levels: string[] | null
          exam_ids: string[] | null
          id: string
          question_count: number
          score_percentage: number | null
          started_at: string | null
          status: string
          subject_ids: string[] | null
          time_limit_minutes: number | null
          title: string | null
          total_answered: number | null
          total_correct: number | null
          total_time_seconds: number | null
          updated_at: string
          user_id: string
          years: number[] | null
        }
        Insert: {
          completed_at?: string | null
          content_ids?: string[] | null
          created_at?: string
          difficulty_levels?: string[] | null
          exam_ids?: string[] | null
          id?: string
          question_count: number
          score_percentage?: number | null
          started_at?: string | null
          status?: string
          subject_ids?: string[] | null
          time_limit_minutes?: number | null
          title?: string | null
          total_answered?: number | null
          total_correct?: number | null
          total_time_seconds?: number | null
          updated_at?: string
          user_id: string
          years?: number[] | null
        }
        Update: {
          completed_at?: string | null
          content_ids?: string[] | null
          created_at?: string
          difficulty_levels?: string[] | null
          exam_ids?: string[] | null
          id?: string
          question_count?: number
          score_percentage?: number | null
          started_at?: string | null
          status?: string
          subject_ids?: string[] | null
          time_limit_minutes?: number | null
          title?: string | null
          total_answered?: number | null
          total_correct?: number | null
          total_time_seconds?: number | null
          updated_at?: string
          user_id?: string
          years?: number[] | null
        }
        Relationships: []
      }
      study_sessions: {
        Row: {
          correct_answers: number
          duration_minutes: number | null
          ended_at: string | null
          exam_id: string | null
          id: string
          questions_answered: number
          started_at: string
          subject_id: string | null
          user_id: string
        }
        Insert: {
          correct_answers?: number
          duration_minutes?: number | null
          ended_at?: string | null
          exam_id?: string | null
          id?: string
          questions_answered?: number
          started_at?: string
          subject_id?: string | null
          user_id: string
        }
        Update: {
          correct_answers?: number
          duration_minutes?: number | null
          ended_at?: string | null
          exam_id?: string | null
          id?: string
          questions_answered?: number
          started_at?: string
          subject_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_sessions_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_sessions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          area_id: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          area_id?: string | null
          created_at?: string
          id: string
          name: string
        }
        Update: {
          area_id?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "subjects_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          canceled_at: string | null
          created_at: string
          expires_at: string | null
          id: string
          kiwify_customer_cpf: string | null
          kiwify_customer_email: string
          kiwify_subscription_id: string | null
          plan_name: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          canceled_at?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          kiwify_customer_cpf?: string | null
          kiwify_customer_email: string
          kiwify_subscription_id?: string | null
          plan_name?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          canceled_at?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          kiwify_customer_cpf?: string | null
          kiwify_customer_email?: string
          kiwify_subscription_id?: string | null
          plan_name?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      topics: {
        Row: {
          content_id: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          content_id: string
          created_at?: string
          id: string
          name: string
        }
        Update: {
          content_id?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "topics_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "contents"
            referencedColumns: ["id"]
          },
        ]
      }
      user_answers: {
        Row: {
          answered_at: string
          id: string
          is_correct: boolean
          question_id: string
          selected_answer: string
          time_spent_seconds: number | null
          user_id: string
        }
        Insert: {
          answered_at?: string
          id?: string
          is_correct: boolean
          question_id: string
          selected_answer: string
          time_spent_seconds?: number | null
          user_id: string
        }
        Update: {
          answered_at?: string
          id?: string
          is_correct?: boolean
          question_id?: string
          selected_answer?: string
          time_spent_seconds?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_performance: {
        Row: {
          accuracy_percentage: number | null
          correct_answers: number
          created_at: string
          id: string
          last_practice_at: string | null
          subject_id: string
          total_questions: number
          updated_at: string
          user_id: string
          wrong_answers: number
        }
        Insert: {
          accuracy_percentage?: number | null
          correct_answers?: number
          created_at?: string
          id?: string
          last_practice_at?: string | null
          subject_id: string
          total_questions?: number
          updated_at?: string
          user_id: string
          wrong_answers?: number
        }
        Update: {
          accuracy_percentage?: number | null
          correct_answers?: number
          created_at?: string
          id?: string
          last_practice_at?: string | null
          subject_id?: string
          total_questions?: number
          updated_at?: string
          user_id?: string
          wrong_answers?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_performance_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "professor" | "aluno"
      question_type: "multipla_escolha" | "discursiva" | "verdadeiro_falso"
      subscription_status:
        | "active"
        | "canceled"
        | "late"
        | "refunded"
        | "pending"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "professor", "aluno"],
      question_type: ["multipla_escolha", "discursiva", "verdadeiro_falso"],
      subscription_status: [
        "active",
        "canceled",
        "late",
        "refunded",
        "pending",
      ],
    },
  },
} as const
