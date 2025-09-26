'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { usageService, UserUsage } from '@/lib/usage'

interface UsageContextValue {
  usage: UserUsage
  isLoading: boolean
  remainingUsage: {
    comparisons: number
    apiCalls: number
  }
  canMakeComparison: boolean
  canMakeApiCall: boolean
  incrementUsage: (type: 'comparisons' | 'apiCalls') => Promise<boolean>
  refreshUsage: () => Promise<void>
}

const UsageContext = createContext<UsageContextValue | undefined>(undefined)

export function UsageProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const { plan } = useSubscription()
  const [usage, setUsage] = useState<UserUsage>({ comparisons: 0, apiCalls: 0, lastReset: new Date().toISOString() })
  const [isLoading, setIsLoading] = useState(true)
  const [remainingUsage, setRemainingUsage] = useState({ comparisons: 0, apiCalls: 0 })
  const [canMakeComparison, setCanMakeComparison] = useState(true)
  const [canMakeApiCall, setCanMakeApiCall] = useState(true)

  const refreshUsage = async () => {
    if (!user) {
      setUsage({ comparisons: 0, apiCalls: 0, lastReset: new Date().toISOString() })
      setIsLoading(false)
      return
    }

    try {
      const userUsage = await usageService.getUserUsage(user.id)
      setUsage(userUsage)

      const remaining = await usageService.getRemainingUsage(user.id, plan)
      setRemainingUsage(remaining)

      const canCompare = await usageService.canMakeComparison(user.id, plan)
      const canApiCall = await usageService.canMakeApiCall(user.id, plan)
      
      setCanMakeComparison(canCompare)
      setCanMakeApiCall(canApiCall)
    } catch (error) {
      console.error('Failed to fetch usage:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const incrementUsage = async (type: 'comparisons' | 'apiCalls'): Promise<boolean> => {
    if (!user) return false

    try {
      const success = await usageService.incrementUsage(user.id, type)
      if (success) {
        await refreshUsage()
      }
      return success
    } catch (error) {
      console.error('Failed to increment usage:', error)
      return false
    }
  }

  useEffect(() => {
    refreshUsage()
  }, [user, plan])

  return (
    <UsageContext.Provider
      value={{
        usage,
        isLoading,
        remainingUsage,
        canMakeComparison,
        canMakeApiCall,
        incrementUsage,
        refreshUsage,
      }}
    >
      {children}
    </UsageContext.Provider>
  )
}

export function useUsage() {
  const ctx = useContext(UsageContext)
  if (!ctx) throw new Error('useUsage must be used within UsageProvider')
  return ctx
}
