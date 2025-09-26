import { createClient } from '@/utils/supabase/client'

export interface UserSubscription {
  id: string
  user_id: string
  stripe_customer_id?: string
  stripe_subscription_id?: string
  status: 'active' | 'cancelled' | 'past_due' | 'inactive'
  plan: 'free' | 'pro' | 'enterprise'
  created_at: string
  updated_at: string
}

export class SubscriptionService {
  private supabase = createClient()

  async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      const { data, error, status } = await this.supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single()

      // If no row found (PostgREST returns 406/0 rows) create default free row
      if (status === 406 || (error && (error.code === 'PGRST116' || error.message?.toLowerCase?.().includes('result must be a single row')))) {
        return await this.createDefaultFreeSubscription(userId)
      }

      if (error) {
        console.error('Error fetching user subscription:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Failed to get user subscription:', error)
      return null
    }
  }

  async createDefaultFreeSubscription(userId: string): Promise<UserSubscription> {
    try {
      // First check if table exists by trying to select from it
      const { error: tableCheckError } = await this.supabase
        .from('user_subscriptions')
        .select('id')
        .limit(1)

      if (tableCheckError) {
        console.warn('user_subscriptions table may not exist or user lacks permissions:', tableCheckError)
        // Return a default free subscription object without trying to insert
        return {
          id: 'default',
          user_id: userId,
          status: 'active',
          plan: 'free',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      }

      const { data, error } = await this.supabase
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          status: 'active',
          plan: 'free',
        })
        .select()
        .single()

      if (error) {
        // Surface detailed supabase error to logs
        console.error('Supabase insert error (user_subscriptions):', {
          error,
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw new Error(`Failed to create default subscription: ${error.message || 'Unknown error'}`)
      }

      return data
    } catch (error) {
      console.error('Failed to create default subscription:', error)
      // Return a default free subscription object
      return {
        id: 'default',
        user_id: userId,
        status: 'active',
        plan: 'free',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    }
  }

  async createCheckoutSession(priceId: string, userId: string, userEmail?: string) {
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
          userEmail,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { sessionId } = await response.json()
      return sessionId
    } catch (error) {
      console.error('Error creating checkout session:', error)
      throw error
    }
  }

  async createPortalSession(userId: string) {
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error('Failed to create portal session')
      }

      const { url } = await response.json()
      return url
    } catch (error) {
      console.error('Error creating portal session:', error)
      throw error
    }
  }

  async hasActiveSubscription(userId: string): Promise<boolean> {
    const subscription = await this.getUserSubscription(userId)
    return subscription?.status === 'active'
  }

  async getPlan(userId: string): Promise<'free' | 'pro' | 'enterprise'> {
    const subscription = await this.getUserSubscription(userId)
    return subscription?.plan || 'free'
  }
}

export const subscriptionService = new SubscriptionService()
