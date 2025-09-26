'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { subscriptionService, UserSubscription } from '@/lib/subscription'

interface SubscriptionContextValue {
  subscription: UserSubscription | null
  isLoading: boolean
  hasActiveSubscription: boolean
  plan: 'free' | 'pro' | 'enterprise'
  refreshSubscription: () => Promise<void>
}

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshSubscription = async () => {
    if (!user) {
      setSubscription(null)
      setIsLoading(false)
      return
    }

    try {
      const userSubscription = await subscriptionService.getUserSubscription(user.id)
      setSubscription(userSubscription)
    } catch (error) {
      console.error('Failed to fetch subscription:', error)
      setSubscription(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshSubscription()
  }, [user])

  const hasActiveSubscription = subscription?.status === 'active'
  const plan = subscription?.plan || 'free'

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        isLoading,
        hasActiveSubscription,
        plan,
        refreshSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext)
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider')
  return ctx
}
