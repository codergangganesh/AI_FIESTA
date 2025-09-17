import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ApiUsage {
  apiCalls: number
  comparisons: number
  storage: number
}

export const useApiUsage = () => {
  const [apiUsage, setApiUsage] = useState<ApiUsage>({ apiCalls: 0, comparisons: 0, storage: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let channel: any = null
    let isMounted = true
    
    const initializeUserPlan = async (userId: string) => {
      const supabase = createClient()
      try {
        // Check if user plan exists
        const { data, error } = await supabase
          .from('user_plans')
          .select('usage')
          .eq('user_id', userId)
          .single()
        
        // If not found, create default entry
        if (error && (error.code === 'PGRST116' || error.message.includes('Results contain 0 rows'))) {
          console.log('Creating default user plan for user:', userId)
          const defaultUsage = {
            apiCalls: 0,
            comparisons: 0,
            storage: 0
          }
          
          const { error: insertError } = await supabase
            .from('user_plans')
            .insert({
              user_id: userId,
              usage: defaultUsage,
              plan_type: 'free'
            })
          
          if (insertError) {
            console.error('Error creating initial user plan entry:', insertError.message)
          } else {
            console.log('Default user plan created successfully')
          }
        }
      } catch (error: any) {
        console.error('Error initializing user plan:', error.message || error)
      }
    }
    
    const fetchApiUsage = async () => {
      try {
        const supabase = createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (!isMounted) return
        
        if (authError) {
          console.error('Authentication error in useApiUsage:', authError.message)
          if (isMounted) setLoading(false)
          return
        }
        
        if (!user) {
          console.error('No user found in useApiUsage')
          if (isMounted) setLoading(false)
          return
        }
        
        // Initialize user plan if it doesn't exist
        await initializeUserPlan(user.id)

        // Get API usage from user_plans table
        const { data, error } = await supabase
          .from('user_plans')
          .select('usage')
          .eq('user_id', user.id)
          .single()

        if (!isMounted) return

        if (error) {
          console.error('Error fetching API usage in useApiUsage:', error.message)
          if (isMounted) setLoading(false)
          return
        }

        if (isMounted && data && data.usage) {
          const usage = data.usage as Record<string, number>
          setApiUsage({
            apiCalls: usage.apiCalls || 0,
            comparisons: usage.comparisons || 0,
            storage: usage.storage || 0
          })
        } else if (isMounted) {
          // Set default values if no data
          setApiUsage({ apiCalls: 0, comparisons: 0, storage: 0 })
        }
        
        // Set up real-time subscription
        if (isMounted) {
          channel = supabase
            .channel('api-usage-changes')
            .on(
              'postgres_changes',
              {
                event: 'UPDATE',
                schema: 'public',
                table: 'user_plans',
                filter: `user_id=eq.${user.id}`
              },
              (payload) => {
                try {
                  if (payload.new && payload.new.usage) {
                    const usage = payload.new.usage as Record<string, number>
                    if (isMounted) {
                      setApiUsage({
                        apiCalls: usage.apiCalls || 0,
                        comparisons: usage.comparisons || 0,
                        storage: usage.storage || 0
                      })
                    }
                  }
                } catch (error: any) {
                  console.error('Error processing real-time update:', error.message || error)
                }
              }
            )
            .subscribe((status) => {
              if (status === 'SUBSCRIBED') {
                console.log('Successfully subscribed to API usage changes')
              } else if (status === 'CHANNEL_ERROR') {
                console.error('Error subscribing to API usage changes')
              }
            })
        }
      } catch (error: any) {
        console.error('Error fetching API usage:', error.message || error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchApiUsage()
    
    return () => {
      isMounted = false
      if (channel) {
        const supabase = createClient()
        supabase.removeChannel(channel)
      }
    }
  }, [])

  return { apiUsage, loading }
}