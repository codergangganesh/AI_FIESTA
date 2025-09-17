export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          created_at?: string
          updated_at?: string
        }
      }
      ai_responses: {
        Row: {
          id: string
          conversation_id: string
          model_name: string
          response: string
          is_best_response: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          model_name: string
          response: string
          is_best_response?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          model_name?: string
          response?: string
          is_best_response?: boolean
          created_at?: string
        }
      }
      user_plans: {
        Row: {
          id: string
          user_id: string
          plan_type: string
          usage: Record<string, number> | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_type?: string
          usage?: Record<string, number> | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_type?: string
          usage?: Record<string, number> | null
          created_at?: string
          updated_at?: string
        }
      }
      model_comparisons: {
        Row: {
          id: string
          user_id: string
          name: string
          models: string[]
          prompt: string
          responses: Record<string, any>[] | null
          metrics: Record<string, any> | null
          status: string
          execution_time_ms: number | null
          total_tokens: number | null
          cost_usd: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          models: string[]
          prompt: string
          responses?: Record<string, any>[] | null
          metrics?: Record<string, any> | null
          status?: string
          execution_time_ms?: number | null
          total_tokens?: number | null
          cost_usd?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          models?: string[]
          prompt?: string
          responses?: Record<string, any>[] | null
          metrics?: Record<string, any> | null
          status?: string
          execution_time_ms?: number | null
          total_tokens?: number | null
          cost_usd?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}