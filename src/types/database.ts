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