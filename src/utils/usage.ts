import { createClient } from '@/lib/supabase/client'

export interface UsageData {
  apiCalls: number
  comparisons: number
  storage: number
  responseTime?: number
}

/**
 * Update usage data for a user
 * @param userId The user ID
 * @param incrementData The data to increment
 * @returns Promise<boolean> indicating success
 */
export async function updateUsage(userId: string, incrementData: Partial<UsageData>): Promise<boolean> {
  try {
    const supabase = createClient()
    
    // First, get the current usage data
    const { data: userData, error: fetchError } = await supabase
      .from('user_plans')
      .select('usage')
      .eq('user_id', userId)
      .single()

    if (fetchError) {
      console.error('Error fetching user data:', fetchError)
      return false
    }

    // Merge the current usage with the increment data
    const currentUsage = userData.usage || {}
    const newUsage = {
      apiCalls: (currentUsage.apiCalls || 0) + (incrementData.apiCalls || 0),
      comparisons: (currentUsage.comparisons || 0) + (incrementData.comparisons || 0),
      storage: parseFloat(((currentUsage.storage || 0) + (incrementData.storage || 0)).toFixed(3)),
      ...(incrementData.responseTime !== undefined && { responseTime: incrementData.responseTime })
    }

    // Update the usage data
    const { error: updateError } = await supabase
      .from('user_plans')
      .update({ usage: newUsage })
      .eq('user_id', userId)

    if (updateError) {
      console.error('Error updating usage data:', updateError)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in updateUsage:', error)
    return false
  }
}

/**
 * Record a model comparison event
 * @param userId The user ID
 * @param responseTime The time taken for the comparison in seconds
 * @returns Promise<boolean> indicating success
 */
export async function recordModelComparison(userId: string, responseTime: number): Promise<boolean> {
  return updateUsage(userId, {
    apiCalls: 1,
    comparisons: 1,
    storage: 0.025,
    responseTime: responseTime
  })
}