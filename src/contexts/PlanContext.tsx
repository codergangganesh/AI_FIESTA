'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { createClient } from '@/utils/supabase/client'

export type PlanType = 'free' | 'pro' | 'pro_plus'

interface PlanContextType {
  plan: PlanType
  loading: boolean
  isPro: boolean
  isProPlus: boolean
  refreshPlan: () => Promise<void>
}

export const PlanContext = createContext<PlanContextType>({
  plan: 'free',
  loading: true,
  isPro: false,
  isProPlus: false,
  refreshPlan: async () => {},
})

export function usePlan() {
  return useContext(PlanContext)
}

async function getPlanFromSupabase(userId: string, supabase: any): Promise<PlanType> {
  try {
    // Directly check if the user exists in profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', userId)
      .single()

    // If there's an error fetching the plan, default to free
    if (profileError) {
      console.warn('Error fetching user plan, defaulting to free plan:', profileError.message || 'Unknown error')
      return 'free'
    }

    // If plan column exists but is null, default to free
    return (profileData?.plan as PlanType) || 'free'
  } catch (error: any) {
    console.error('Unexpected error fetching plan:', error.message || error)
    return 'free'
  }
}

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [plan, setPlan] = useState<PlanType>('free')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchPlan = async () => {
      if (!user?.id) {
        setPlan('free')
        setLoading(false)
        return
      }

      try {
        const currentPlan = await getPlanFromSupabase(user.id, supabase)
        setPlan(currentPlan)
      } catch (error: any) {
        console.error('Error in fetchPlan:', error.message || error)
        setPlan('free')
      } finally {
        setLoading(authLoading)
      }
    }

    fetchPlan()

    // Subscribe to plan changes
    if (user?.id) {
      const channel = supabase.channel(`plan-changes-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`,
          },
          (payload: any) => {
            if (payload.new?.plan && payload.new.plan !== plan) {
              setPlan(payload.new.plan as PlanType)
            }
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [user?.id, authLoading])

  const value = {
    plan,
    loading,
    isPro: plan === 'pro' || plan === 'pro_plus',
    isProPlus: plan === 'pro_plus',
    refreshPlan: async () => {
      if (!user?.id) return
      try {
        const newPlan = await getPlanFromSupabase(user.id, supabase)
        setPlan(newPlan)
      } catch (error: any) {
        console.error('Error in refreshPlan:', error.message || error)
      }
    },
  }

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>
}