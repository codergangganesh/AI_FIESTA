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
    // First check if profiles table exists
    const { data, error } = await supabase.from('information_schema.tables').select('table_name').eq('table_schema', 'public')
    
    if (error) {
      console.error('Error checking tables:', error)
      return 'free'
    }

    // Add null check for data
    if (!data || !Array.isArray(data) || !data.some((table: any) => table.table_name === 'profiles')) {
      console.error('Profiles table does not exist in Supabase')
      return 'free'
    }

    // Check if the user exists in profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', userId)
      .single()

    if (profileError) {
      console.error('Error fetching plan:', profileError)
      return 'free'
    }

    return (profileData?.plan as PlanType) || 'free'
  } catch (error) {
    console.error('Unexpected error fetching plan:', error)
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
      } catch (error) {
        console.error('Error in fetchPlan:', error)
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
              setPlan(payload.new.plan)
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
      const newPlan = await getPlanFromSupabase(user.id, supabase)
      setPlan(newPlan)
    },
  }

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>
}