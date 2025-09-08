'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { createClient } from '@/lib/supabase/client'

export type PlanType = 'free' | 'pro' | 'pro_plus'

export interface PlanLimits {
  comparisons: number
  storage: number // in GB
  apiCalls: number
  models: string[]
  features: string[]
  support: string
}

export interface UserPlan {
  type: PlanType
  limits: PlanLimits
  usage: {
    comparisons: number
    storage: number
    apiCalls: number
  }
  subscriptionEnd?: Date
  paymentId?: string
  subscriptionId?: string
  status?: string
  trialEnd?: Date
}

interface PlanContextType {
  currentPlan: UserPlan | null
  isLoading: boolean
  canAccessFeature: (feature: string) => boolean
  getRemainingQuota: (type: 'comparisons' | 'storage' | 'apiCalls') => number
  updateUsage: (type: 'comparisons' | 'storage' | 'apiCalls', amount: number) => Promise<void>
  upgradePlan: (planType: PlanType, paymentId: string) => Promise<boolean>
  refreshPlan: () => Promise<void>
}

const planConfigs: Record<PlanType, PlanLimits> = {
  free: {
    comparisons: 10,
    storage: 1,
    apiCalls: 100,
    models: ['gpt-3.5-turbo', 'claude-3-haiku'],
    features: ['basic_comparison', 'basic_charts'],
    support: 'community'
  },
  pro: {
    comparisons: 500,
    storage: 10,
    apiCalls: 5000,
    models: ['gpt-3.5-turbo', 'gpt-4', 'claude-3-haiku', 'claude-3-sonnet'],
    features: ['basic_comparison', 'advanced_charts', 'export_pdf', 'hyperparameter_tuning'],
    support: 'email'
  },
  pro_plus: {
    comparisons: -1, // unlimited
    storage: 100,
    apiCalls: 50000,
    models: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'claude-3-haiku', 'claude-3-sonnet', 'claude-3-opus'],
    features: ['basic_comparison', 'advanced_charts', 'export_pdf', 'hyperparameter_tuning', 'explainability', 'priority_support', 'custom_models'],
    support: 'priority'
  }
}

const PlanContext = createContext<PlanContextType | undefined>(undefined)

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [currentPlan, setCurrentPlan] = useState<UserPlan | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const loadUserPlan = async () => {
    if (!user) {
      setCurrentPlan(null)
      setIsLoading(false)
      return
    }

    try {
      // Try to load by user_id first, then by email
      let { data: planData, error } = await supabase
        .from('user_plans')
        .select('*')
        .eq('user_id', user.id)
        .single()

      // If not found by user_id, try by email
      if (error && error.code === 'PGRST116' && user.email) {
        const { data: emailPlanData, error: emailError } = await supabase
          .from('user_plans')
          .select('*')
          .eq('user_email', user.email)
          .single()
        
        if (!emailError && emailPlanData) {
          planData = emailPlanData
          error = null
          
          // Update the record to include user_id
          await supabase
            .from('user_plans')
            .update({ user_id: user.id })
            .eq('user_email', user.email)
        }
      }

      if (error) {
        // If table doesn't exist or no plan found, create default free plan
        if (error.code === 'PGRST116' || error.message?.includes('relation "user_plans" does not exist')) {
          console.log('No user plan found or table does not exist, creating default free plan')
          setCurrentPlan({
            type: 'free',
            limits: planConfigs.free,
            usage: { comparisons: 0, storage: 0, apiCalls: 0 }
          })
          setIsLoading(false)
          return
        } else {
          console.warn('Error loading user plan:', error)
        }
      }

      let planType: PlanType = 'free'
      let usage = { comparisons: 0, storage: 0, apiCalls: 0 }
      let subscriptionEnd: Date | undefined
      let paymentId: string | undefined
      let subscriptionId: string | undefined
      let status = 'active'
      let trialEnd: Date | undefined

      if (planData) {
        planType = planData.plan_type as PlanType
        usage = planData.usage || usage
        subscriptionEnd = planData.subscription_end ? new Date(planData.subscription_end) : 
                          planData.current_period_end ? new Date(planData.current_period_end) : undefined
        paymentId = planData.payment_id
        subscriptionId = planData.subscription_id
        status = planData.status || 'active'
        trialEnd = planData.trial_end ? new Date(planData.trial_end) : undefined
      }

      setCurrentPlan({
        type: planType,
        limits: planConfigs[planType],
        usage,
        subscriptionEnd,
        paymentId,
        subscriptionId,
        status,
        trialEnd
      })
    } catch (error) {
      console.warn('Error in loadUserPlan:', error)
      // Default to free plan on any error
      setCurrentPlan({
        type: 'free',
        limits: planConfigs.free,
        usage: { comparisons: 0, storage: 0, apiCalls: 0 }
      })
    } finally {
      setIsLoading(false)
    }
  }

  const canAccessFeature = (feature: string): boolean => {
    return currentPlan?.limits.features.includes(feature) || false
  }

  const getRemainingQuota = (type: 'comparisons' | 'storage' | 'apiCalls'): number => {
    if (!currentPlan) return 0
    
    const limit = currentPlan.limits[type]
    const used = currentPlan.usage[type]
    
    if (limit === -1) return Infinity // unlimited
    return Math.max(0, limit - used)
  }

  const updateUsage = async (type: 'comparisons' | 'storage' | 'apiCalls', amount: number): Promise<void> => {
    if (!user || !currentPlan) return

    const newUsage = {
      ...currentPlan.usage,
      [type]: currentPlan.usage[type] + amount
    }

    try {
      const { error } = await supabase
        .from('user_plans')
        .update({ usage: newUsage })
        .eq('user_id', user.id)

      if (error) {
        console.warn('Error updating usage:', error)
        // If table doesn't exist, just update local state
        if (error.message?.includes('relation "user_plans" does not exist')) {
          setCurrentPlan(prev => prev ? { ...prev, usage: newUsage } : null)
          return
        }
        throw error
      }

      setCurrentPlan(prev => prev ? { ...prev, usage: newUsage } : null)
    } catch (error) {
      console.warn('Error updating usage:', error)
      // Still update local state for better UX
      setCurrentPlan(prev => prev ? { ...prev, usage: newUsage } : null)
    }
  }

  const upgradePlan = async (planType: PlanType, paymentId: string): Promise<boolean> => {
    if (!user) return false

    try {
      const subscriptionEnd = new Date()
      subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1) // 1 year subscription

      const { error } = await supabase
        .from('user_plans')
        .upsert({
          user_id: user.id,
          user_email: user.email || '',
          plan_type: planType,
          payment_id: paymentId,
          subscription_end: subscriptionEnd.toISOString(),
          status: 'active',
          updated_at: new Date().toISOString()
        })

      if (error) {
        console.warn('Error upgrading plan:', error)
        // If table doesn't exist, just update local state
        if (error.message?.includes('relation "user_plans" does not exist')) {
          setCurrentPlan({
            type: planType,
            limits: planConfigs[planType],
            usage: { comparisons: 0, storage: 0, apiCalls: 0 },
            subscriptionEnd,
            paymentId
          })
          return true
        }
        return false
      }

      await refreshPlan()
      return true
    } catch (error) {
      console.warn('Error upgrading plan:', error)
      return false
    }
  }

  const refreshPlan = async () => {
    setIsLoading(true)
    await loadUserPlan()
  }

  useEffect(() => {
    loadUserPlan()
  }, [user])

  return (
    <PlanContext.Provider value={{
      currentPlan,
      isLoading,
      canAccessFeature,
      getRemainingQuota,
      updateUsage,
      upgradePlan,
      refreshPlan
    }}>
      {children}
    </PlanContext.Provider>
  )
}

export const usePlan = () => {
  const context = useContext(PlanContext)
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider')
  }
  return context
}