import { createClient } from '@/utils/supabase/client'

export interface UsageLimits {
  comparisons: number
  apiCalls: number
  models: number
}

export interface UserUsage {
  comparisons: number
  apiCalls: number
  lastReset: string
}

export const USAGE_LIMITS = {
  FREE: {
    comparisons: 10,
    apiCalls: 100,
    models: 3,
  },
  PRO: {
    comparisons: -1, // unlimited
    apiCalls: -1, // unlimited
    models: -1, // unlimited
  },
  ENTERPRISE: {
    comparisons: -1, // unlimited
    apiCalls: -1, // unlimited
    models: -1, // unlimited
  },
} as const

export class UsageService {
  private supabase = createClient()

  async getUserUsage(userId: string): Promise<UserUsage> {
    try {
      const { data, error } = await this.supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        // If no usage record exists, create a default one
        if (error.code === 'PGRST116') {
          return await this.createDefaultUsage(userId)
        }
        console.error('Error fetching user usage:', error)
        return { comparisons: 0, apiCalls: 0, lastReset: new Date().toISOString() }
      }

      return {
        comparisons: data.comparisons || 0,
        apiCalls: data.api_calls || 0,
        lastReset: data.last_reset || new Date().toISOString(),
      }
    } catch (error) {
      console.error('Failed to get user usage:', error)
      return { comparisons: 0, apiCalls: 0, lastReset: new Date().toISOString() }
    }
  }

  async createDefaultUsage(userId: string): Promise<UserUsage> {
    try {
      const { data, error } = await this.supabase
        .from('user_usage')
        .insert({
          user_id: userId,
          comparisons: 0,
          api_calls: 0,
          last_reset: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        throw new Error('Failed to create default usage record')
      }

      return {
        comparisons: data.comparisons || 0,
        apiCalls: data.api_calls || 0,
        lastReset: data.last_reset || new Date().toISOString(),
      }
    } catch (error) {
      console.error('Failed to create default usage record:', error)
      return { comparisons: 0, apiCalls: 0, lastReset: new Date().toISOString() }
    }
  }

  async incrementUsage(userId: string, type: 'comparisons' | 'apiCalls'): Promise<boolean> {
    try {
      const currentUsage = await this.getUserUsage(userId)
      const newValue = currentUsage[type] + 1

      const { error } = await this.supabase
        .from('user_usage')
        .update({
          [type === 'comparisons' ? 'comparisons' : 'api_calls']: newValue,
        })
        .eq('user_id', userId)

      if (error) {
        console.error('Error updating usage:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Failed to increment usage:', error)
      return false
    }
  }

  async canMakeComparison(userId: string, plan: 'free' | 'pro' | 'enterprise'): Promise<boolean> {
    const limits = USAGE_LIMITS[plan.toUpperCase() as keyof typeof USAGE_LIMITS]
    
    if (limits.comparisons === -1) {
      return true // unlimited
    }

    const usage = await this.getUserUsage(userId)
    return usage.comparisons < limits.comparisons
  }

  async canMakeApiCall(userId: string, plan: 'free' | 'pro' | 'enterprise'): Promise<boolean> {
    const limits = USAGE_LIMITS[plan.toUpperCase() as keyof typeof USAGE_LIMITS]
    
    if (limits.apiCalls === -1) {
      return true // unlimited
    }

    const usage = await this.getUserUsage(userId)
    return usage.apiCalls < limits.apiCalls
  }

  async getRemainingUsage(userId: string, plan: 'free' | 'pro' | 'enterprise'): Promise<{
    comparisons: number
    apiCalls: number
  }> {
    const limits = USAGE_LIMITS[plan.toUpperCase() as keyof typeof USAGE_LIMITS]
    const usage = await this.getUserUsage(userId)

    return {
      comparisons: limits.comparisons === -1 ? -1 : Math.max(0, limits.comparisons - usage.comparisons),
      apiCalls: limits.apiCalls === -1 ? -1 : Math.max(0, limits.apiCalls - usage.apiCalls),
    }
  }
}

export const usageService = new UsageService()
