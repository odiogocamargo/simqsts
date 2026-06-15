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
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      contents: {
        Row: {
          created_at: string
          id: string
          name: string
          subject_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          subject_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          subject_id?: string
          updated_at?: string
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
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      external_consumers: {
        Row: {
          active: boolean
          api_key_hash: string
          api_key_prefix: string
          created_at: string
          events_failed: number
          events_sent: number
          id: string
          last_ping_at: string | null
          name: string
          updated_at: string
          webhook_secret: string | null
          webhook_url: string | null
        }
        Insert: {
          active?: boolean
          api_key_hash: string
          api_key_prefix: string
          created_at?: string
          events_failed?: number
          events_sent?: number
          id?: string
          last_ping_at?: string | null
          name: string
          updated_at?: string
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Update: {
          active?: boolean
          api_key_hash?: string
          api_key_prefix?: string
          created_at?: string
          events_failed?: number
          events_sent?: number
          id?: string
          last_ping_at?: string | null
          name?: string
          updated_at?: string
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Relationships: []
      }
      finance_clients: {
        Row: {
          active: boolean
          created_at: string
          due_day: number
          id: string
          monthly_value: number
          name: string
          notes: string | null
          start_month: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          due_day?: number
          id?: string
          monthly_value?: number
          name: string
          notes?: string | null
          start_month: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          due_day?: number
          id?: string
          monthly_value?: number
          name?: string
          notes?: string | null
          start_month?: string
          updated_at?: string
        }
        Relationships: []
      }
      finance_expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string
          id: string
          notes: string | null
          updated_at: string
        }
        Insert: {
          amount?: number
          category: string
          created_at?: string
          date: string
          description: string
          id?: string
          notes?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      finance_fixed_costs: {
        Row: {
          active: boolean
          amount: number
          category: string
          created_at: string
          id: string
          name: string
          notes: string | null
          start_month: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          amount?: number
          category: string
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          start_month: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          amount?: number
          category?: string
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          start_month?: string
          updated_at?: string
        }
        Relationships: []
      }
      finance_payments: {
        Row: {
          amount: number
          client_id: string
          created_at: string
          id: string
          method: string | null
          month: string
          paid_at: string
          updated_at: string
        }
        Insert: {
          amount?: number
          client_id: string
          created_at?: string
          id?: string
          method?: string | null
          month: string
          paid_at?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          client_id?: string
          created_at?: string
          id?: string
          method?: string | null
          month?: string
          paid_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "finance_payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "finance_clients"
            referencedColumns: ["id"]
          },
        ]
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
      subjects: {
        Row: {
          area_id: string | null
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          area_id?: string | null
          created_at?: string
          id: string
          name: string
          updated_at?: string
        }
        Update: {
          area_id?: string | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
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
      topics: {
        Row: {
          content_id: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          content_id: string
          created_at?: string
          id: string
          name: string
          updated_at?: string
        }
        Update: {
          content_id?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
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
      webhook_outbox: {
        Row: {
          attempts: number
          created_at: string
          delivered_at: string | null
          entity_id: string
          entity_type: string
          id: number
          last_error: string | null
          next_attempt_at: string
          operation: string
          payload: Json | null
        }
        Insert: {
          attempts?: number
          created_at?: string
          delivered_at?: string | null
          entity_id: string
          entity_type: string
          id?: number
          last_error?: string | null
          next_attempt_at?: string
          operation: string
          payload?: Json | null
        }
        Update: {
          attempts?: number
          created_at?: string
          delivered_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: number
          last_error?: string | null
          next_attempt_at?: string
          operation?: string
          payload?: Json | null
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
      app_role: "admin" | "professor" | "aluno" | "coordenador"
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
      app_role: ["admin", "professor", "aluno", "coordenador"],
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
