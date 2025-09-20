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
        // Add more detailed error logging
        if (authError && typeof authError === 'object') {
          console.error('Auth error details:', {
            message: authError.message,
            stack: authError.stack,
            name: authError.name
          })
        }
        // Handle network errors specifically
        if (authError?.message?.includes('Failed to fetch') || authError?.message?.includes('NetworkError')) {
          console.error('Network connectivity issue detected in getTotalComparisonsCount authentication.')
        }
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
        // Add more detailed error logging
        if (error && typeof error === 'object') {
          console.error('Database error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
          })
        }
        // Handle network errors specifically
        if (error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError')) {
          console.error('Network connectivity issue detected while fetching total comparisons count.')
        }
        return 0
      }

      return count || 0
    } catch (error: any) {
      console.error('Error in getTotalComparisonsCount:', error.message || error)
      // Add more detailed error logging
      if (error && typeof error === 'object') {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        })
      }
      // Handle network errors specifically
      if (error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError')) {
        console.error('Network connectivity issue detected in getTotalComparisonsCount.')
      }
      return 0
    }
  }

  async getModelsAnalyzedCount(): Promise<number> {
    try {
      const supabase = createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error('Authentication error in getModelsAnalyzedCount:', authError.message || authError)
        // Add more detailed error logging
        if (authError && typeof authError === 'object') {
          console.error('Auth error details:', {
            message: authError.message,
            stack: authError.stack,
            name: authError.name
          })
        }
        // Handle network errors specifically
        if (authError?.message?.includes('Failed to fetch') || authError?.message?.includes('NetworkError')) {
          console.error('Network connectivity issue detected in getModelsAnalyzedCount authentication.')
        }
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
        // Add more detailed error logging
        if (error && typeof error === 'object') {
          console.error('Database error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
          })
        }
        // Handle network errors specifically
        if (error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError')) {
          console.error('Network connectivity issue detected while fetching models analyzed.')
        }
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
      // Add more detailed error logging
      if (error && typeof error === 'object') {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        })
      }
      // Handle network errors specifically
      if (error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError')) {
        console.error('Network connectivity issue detected in getModelsAnalyzedCount.')
      }
      return 0
    }
  }

  async getAverageAccuracyScore(): Promise<number> {
    try {
      const supabase = createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error('Authentication error in getAverageAccuracyScore:', authError.message || authError)
        // Add more detailed error logging
        if (authError && typeof authError === 'object') {
          console.error('Auth error details:', {
            message: authError.message,
            stack: authError.stack,
            name: authError.name
          })
        }
        // Handle network errors specifically
        if (authError?.message?.includes('Failed to fetch') || authError?.message?.includes('NetworkError')) {
          console.error('Network connectivity issue detected in getAverageAccuracyScore authentication.')
        }
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
        // Add more detailed error logging
        if (error && typeof error === 'object') {
          console.error('Database error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
          })
        }
        // Handle network errors specifically
        if (error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError')) {
          console.error('Network connectivity issue detected while fetching accuracy scores.')
        }
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
      // Add more detailed error logging
      if (error && typeof error === 'object') {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        })
      }
      // Handle network errors specifically
      if (error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError')) {
        console.error('Network connectivity issue detected in getAverageAccuracyScore.')
      }
      return 0
    }
  }

  async getApiUsagePercentage(): Promise<number> {
    try {
      const supabase = createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error('Authentication error in getApiUsagePercentage:', authError.message || authError)
        // Add more detailed error logging
        if (authError && typeof authError === 'object') {
          console.error('Auth error details:', {
            message: authError.message,
            stack: authError.stack,
            name: authError.name
          })
        }
        // Handle network errors specifically
        if (authError?.message?.includes('Failed to fetch') || authError?.message?.includes('NetworkError')) {
          console.error('Network connectivity issue detected in getApiUsagePercentage authentication.')
        }
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
        // Add more detailed error logging
        if (error && typeof error === 'object') {
          console.error('Database error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
          })
        }
        // Handle network errors specifically
        if (error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError')) {
          console.error('Network connectivity issue detected while fetching API usage from user_plans.')
        }
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
            // Add more detailed error logging
            if (insertError && typeof insertError === 'object') {
              console.error('Insert error details:', {
                message: insertError.message,
                stack: insertError.stack,
                name: insertError.name
              })
            }
            // Handle network errors specifically
            if (insertError?.message?.includes('Failed to fetch') || insertError?.message?.includes('NetworkError')) {
              console.error('Network connectivity issue detected while creating initial user plan entry.')
            }
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
      // Add more detailed error logging
      if (error && typeof error === 'object') {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        })
      }
      // Handle network errors specifically
      if (error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError')) {
        console.error('Network connectivity issue detected in getApiUsagePercentage.')
      }
      return 0
    }
  }

  /**
   * Fetch detailed model comparison data for dashboard metrics
   */
  async getModelComparisonData(): Promise<any[]> {
    try {
      const supabase = createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error('Authentication error in getModelComparisonData:', authError.message || authError)
        return []
      }
      
      if (!user) {
        console.error('No user found in getModelComparisonData')
        return []
      }

      // Get all model comparisons for the user
      const { data, error } = await supabase
        .from('model_comparisons')
        .select('models, responses, metrics, execution_time_ms')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching model comparison data:', error.message || error)
        return []
      }

      // Process the data to extract metrics for each model
      const modelDataMap: Record<string, any> = {}
      
      data.forEach(comparison => {
        // Extract models from the comparison
        if (comparison.models && Array.isArray(comparison.models)) {
          comparison.models.forEach((modelName: string) => {
            if (!modelDataMap[modelName]) {
              modelDataMap[modelName] = {
                modelName,
                responseTimes: [],
                messagesTyped: 0,
                dataProcessingTimes: [],
                totalComparisons: 0
              }
            }
            
            // Increment comparison count
            modelDataMap[modelName].totalComparisons++
            
            // Extract response time from metrics (individual model response times)
            if (comparison.metrics && typeof comparison.metrics === 'object') {
              const metrics = comparison.metrics as Record<string, any>
              if (metrics.modelResponseTimes && metrics.modelResponseTimes[modelName]) {
                modelDataMap[modelName].responseTimes.push(metrics.modelResponseTimes[modelName])
              } else if (comparison.execution_time_ms) {
                // Fallback to overall execution time if individual times not available
                modelDataMap[modelName].responseTimes.push(comparison.execution_time_ms / 1000) // Convert to seconds
              }
            } else if (comparison.execution_time_ms) {
              // Fallback to overall execution time if metrics not available
              modelDataMap[modelName].responseTimes.push(comparison.execution_time_ms / 1000) // Convert to seconds
            }
            
            // Extract data processing time from metrics
            if (comparison.metrics && typeof comparison.metrics === 'object') {
              const metrics = comparison.metrics as Record<string, any>
              if (metrics.responseTime) {
                modelDataMap[modelName].dataProcessingTimes.push(metrics.responseTime)
              }
            }
            
            // Count messages (responses) for this model
            if (comparison.responses && Array.isArray(comparison.responses)) {
              const modelResponse = comparison.responses.find((r: any) => r.model === modelName)
              if (modelResponse) {
                modelDataMap[modelName].messagesTyped++
              }
            }
          })
        }
      })

      // Convert map to array and calculate averages
      const result = Object.values(modelDataMap).map((modelData: any) => {
        const avgResponseTime = modelData.responseTimes.length > 0 
          ? modelData.responseTimes.reduce((a: number, b: number) => a + b, 0) / modelData.responseTimes.length
          : 0
          
        const avgDataProcessingTime = modelData.dataProcessingTimes.length > 0
          ? modelData.dataProcessingTimes.reduce((a: number, b: number) => a + b, 0) / modelData.dataProcessingTimes.length
          : 0
          
        return {
          modelName: modelData.modelName,
          responseTime: parseFloat(avgResponseTime.toFixed(2)),
          messagesTyped: modelData.messagesTyped,
          modelDataTime: parseFloat(avgDataProcessingTime.toFixed(2)),
          responseTimeDistribution: modelData.responseTimes.map((t: number) => parseFloat(t.toFixed(2)))
        }
      })

      return result
    } catch (error: any) {
      console.error('Error in getModelComparisonData:', error.message || error)
      return []
    }
  }

  /**
   * Fetch response time trends over time
   */
  async getResponseTimeTrends(): Promise<any[]> {
    try {
      const supabase = createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.error('Authentication error in getResponseTimeTrends:', authError.message || authError)
        return []
      }
      
      if (!user) {
        console.error('No user found in getResponseTimeTrends')
        return []
      }

      // Get model comparisons grouped by week
      const { data, error } = await supabase
        .from('model_comparisons')
        .select('created_at, metrics, execution_time_ms')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching response time trends:', error.message || error)
        return []
      }

      // Group data by week and calculate averages
      const weeklyData: Record<string, { count: number; totalResponseTime: number; totalMessages: number; totalProcessingTime: number }> = {}
      
      data.forEach(item => {
        // Get week number (simplified approach)
        const date = new Date(item.created_at)
        const week = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`
        
        if (!weeklyData[week]) {
          weeklyData[week] = {
            count: 0,
            totalResponseTime: 0,
            totalMessages: 0,
            totalProcessingTime: 0
          }
        }
        
        weeklyData[week].count++
        if (item.execution_time_ms) {
          weeklyData[week].totalResponseTime += item.execution_time_ms / 1000 // Convert to seconds
        }
        
        if (item.metrics && typeof item.metrics === 'object') {
          const metrics = item.metrics as Record<string, any>
          weeklyData[week].totalMessages += 1 // Simplified - one message per comparison
          if (metrics.responseTime) {
            weeklyData[week].totalProcessingTime += metrics.responseTime
          }
        }
      })

      // Convert to array format
      const result = Object.entries(weeklyData).map(([period, data]) => ({
        period,
        responseTime: data.count > 0 ? parseFloat((data.totalResponseTime / data.count).toFixed(2)) : 0,
        messagesTyped: data.totalMessages,
        modelDataTime: data.count > 0 ? parseFloat((data.totalProcessingTime / data.count).toFixed(2)) : 0
      }))

      return result
    } catch (error: any) {
      console.error('Error in getResponseTimeTrends:', error.message || error)
      return []
    }
  }
}

export const databaseClientService = new DatabaseClientService()