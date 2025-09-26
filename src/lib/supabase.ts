import { createClient } from '@/utils/supabase/client'

export interface ModelResponse {
  modelId: string
  content: string
  success: boolean
  error?: string
  wordCount?: number
  latency?: number
  cost?: number
}

export interface ComparisonData {
  prompt: string
  selectedModels: string[]
  responses: ModelResponse[]
  bestResponseId?: string
}

export class ComparisonService {
  private supabase = createClient()

  async saveComparison(data: ComparisonData) {
    try {
      const { data: result, error } = await this.supabase
        .from('model_comparisons')
        .insert([
          {
            prompt: data.prompt,
            selected_models: data.selectedModels,
            responses: data.responses,
            best_response_id: data.bestResponseId
          }
        ])
        .select()
        .single()

      if (error) {
        console.error('Error saving comparison:', error)
        throw error
      }

      return result
    } catch (error) {
      console.error('Failed to save comparison:', error)
      throw error
    }
  }

  async getComparisons(userId?: string) {
    try {
      let query = this.supabase
        .from('model_comparisons')
        .select('*')
        .order('created_at', { ascending: false })

      if (userId) {
        query = query.eq('user_id', userId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching comparisons:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Failed to fetch comparisons:', error)
      throw error
    }
  }

  async deleteComparison(id: string) {
    try {
      const { error } = await this.supabase
        .from('model_comparisons')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting comparison:', error)
        throw error
      }

      return true
    } catch (error) {
      console.error('Failed to delete comparison:', error)
      throw error
    }
  }

  async updateBestResponse(comparisonId: string, bestResponseId: string) {
    try {
      const { error } = await this.supabase
        .from('model_comparisons')
        .update({ best_response_id: bestResponseId })
        .eq('id', comparisonId)

      if (error) {
        console.error('Error updating best response:', error)
        throw error
      }

      return true
    } catch (error) {
      console.error('Failed to update best response:', error)
      throw error
    }
  }
}

export const comparisonService = new ComparisonService()
