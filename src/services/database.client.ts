import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/database'
import { Conversation, AIResponse } from '@/types/app'

type Tables = Database['public']['Tables']

class DatabaseClientService {
  async getTotalComparisonsCount(): Promise<number> {
    try {
      const supabase = createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error('Authentication error in getTotalComparisonsCount:', authError.message || authError)
        return 0
      }
      
      if (!user) {
        console.error('No user found in getTotalComparisonsCount')
        return 0
      }

      const { count, error } = await supabase
        .from('model_comparisons')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      if (error) {
        console.error('Error fetching total comparisons count:', error.message || error)
        return 0
      }

      return count || 0
    } catch (error: any) {
      console.error('Error in getTotalComparisonsCount:', error.message || error)
      return 0
    }
  }

  async getModelsAnalyzedCount(): Promise<number> {
    try {
      const supabase = createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error('Authentication error in getModelsAnalyzedCount:', authError.message || authError)
        return 0
      }
      
      if (!user) {
        console.error('No user found in getModelsAnalyzedCount')
        return 0
      }

      // Get distinct models from model_comparisons table
      const { data, error } = await supabase
        .from('model_comparisons')
        .select('models')
        .eq('user_id', user.id)

      if (error) {
        console.error('Error fetching models analyzed:', error.message || error)
        return 0
      }

      // Extract unique models from all comparisons
      const uniqueModels = new Set<string>()
      data.forEach(comparison => {
        if (comparison.models && Array.isArray(comparison.models)) {
          comparison.models.forEach((model: string) => uniqueModels.add(model))
        }
      })

      return uniqueModels.size
    } catch (error: any) {
      console.error('Error in getModelsAnalyzedCount:', error.message || error)
      return 0
    }
  }

  async getAverageAccuracyScore(): Promise<number> {
    try {
      const supabase = createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error('Authentication error in getAverageAccuracyScore:', authError.message || authError)
        return 0
      }
      
      if (!user) {
        console.error('No user found in getAverageAccuracyScore')
        return 0
      }

      // Get average accuracy from model_comparisons metrics
      const { data, error } = await supabase
        .from('model_comparisons')
        .select('metrics')
        .eq('user_id', user.id)
        .not('metrics', 'is', null)

      if (error) {
        console.error('Error fetching accuracy scores:', error.message || error)
        return 0
      }

      if (data.length === 0) return 0

      // Calculate average accuracy from metrics
      let totalAccuracy = 0
      let validEntries = 0

      data.forEach(comparison => {
        if (comparison.metrics && typeof comparison.metrics === 'object') {
          // Look for accuracy-related fields in metrics
          const metrics = comparison.metrics as Record<string, any>
          if (metrics.accuracy !== undefined) {
            totalAccuracy += metrics.accuracy
            validEntries++
          } else if (metrics.averageAccuracy !== undefined) {
            totalAccuracy += metrics.averageAccuracy
            validEntries++
          }
        }
      })

      return validEntries > 0 ? Math.round((totalAccuracy / validEntries) * 100) / 100 : 0
    } catch (error: any) {
      console.error('Error in getAverageAccuracyScore:', error.message || error)
      return 0
    }
  }

  async getApiUsagePercentage(): Promise<number> {
    try {
      const supabase = createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error('Authentication error in getApiUsagePercentage:', authError.message || authError)
        return 0
      }
      
      if (!user) {
        console.error('No user found in getApiUsagePercentage')
        return 0
      }

      // Get API usage from user_plans table
      const { data, error } = await supabase
        .from('user_plans')
        .select('usage, plan_type')
        .eq('user_id', user.id)
        .single()

      if (error) {
        console.error('Error fetching API usage from user_plans:', error.message || error)
        // If the user_plans entry doesn't exist, create it
        if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('not found') || error.message?.includes('Results contain 0 rows')) {
          console.log('User plans entry not found, creating default entry')
          const defaultUsage = {
            apiCalls: 0,
            comparisons: 0,
            storage: 0
          }
          
          const { error: insertError } = await supabase
            .from('user_plans')
            .insert({
              user_id: user.id,
              user_email: user.email || '',
              usage: defaultUsage,
              plan_type: 'free'
            })
          
          if (insertError) {
            console.error('Error creating initial user plan entry:', insertError.message || insertError)
          }
        }
        return 0
      }

      if (!data) {
        console.error('No data returned from user_plans query for user:', user.id)
        return 0
      }

      if (!data.usage) {
        console.error('No usage data found in user_plans for user:', user.id)
        return 0
      }

      const usage = data.usage as Record<string, number>
      const apiCalls = usage.apiCalls || 0

      // Define limits based on plan type
      let planLimit = 0
      switch (data.plan_type) {
        case 'free':
          planLimit = 100
          break
        case 'pro':
          planLimit = 5000
          break
        case 'pro_plus':
          planLimit = 50000
          break
        default:
          planLimit = 100
      }

      // If pro_plus (unlimited), show a reasonable percentage
      if (data.plan_type === 'pro_plus') {
        return Math.min(100, Math.round((apiCalls / 10000) * 100))
      }

      return planLimit > 0 ? Math.round((apiCalls / planLimit) * 100) : 0
    } catch (error: any) {
      console.error('Error in getApiUsagePercentage:', error.message || error)
      return 0
    }
  }
}

export const databaseClientService = new DatabaseClientService()