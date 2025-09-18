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
  const [realtimeFailed, setRealtimeFailed] = useState(false)

  useEffect(() => {
    let channel: any = null
    let isMounted = true
    let pollingInterval: NodeJS.Timeout | null = null
    
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
        if (error && (error.code === 'PGRST116' || error.message?.includes('Results contain 0 rows') || error.message?.includes('relation') || error.message?.includes('not found'))) {
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
              user_email: '', // Will be updated by the database trigger
              usage: defaultUsage,
              plan_type: 'free'
            })
          
          if (insertError) {
            console.error('Error creating initial user plan entry:', insertError.message || insertError)
          } else {
            console.log('Default user plan created successfully')
          }
        }
      } catch (error: any) {
        console.error('Error initializing user plan:', error.message || error)
        // Handle network errors specifically
        if (error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError')) {
          console.error('Network connectivity issue detected during user plan initialization.')
        }
      }
    }
    
    const fetchApiUsage = async () => {
      try {
        const supabase = createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (!isMounted) return
        
        // Handle case where there's no authenticated user
        if (authError || !user) {
          // If there's an auth error or no user, we still want to complete the loading state
          if (isMounted) setLoading(false)
          // Log more detailed error information
          if (authError) {
            console.error('Authentication error in useApiUsage:', authError.message || authError)
            // Handle network errors specifically
            if (authError?.message?.includes('Failed to fetch') || authError?.message?.includes('NetworkError')) {
              console.error('Network connectivity issue detected during authentication.')
            }
          }
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
          console.error('Error fetching API usage in useApiUsage:', error.message || error)
          // Handle network errors specifically
          if (error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError')) {
            console.error('Network connectivity issue detected while fetching API usage.')
          }
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
        
        // Set up real-time subscription with better error handling
        if (isMounted && !realtimeFailed) {
          try {
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
                    // Handle network errors specifically
                    if (error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError')) {
                      console.error('Network connectivity issue detected during real-time update processing.')
                    }
                  }
                }
              )
              .subscribe((status, err) => {
                console.log('Real-time subscription status update:', { status, err });
                if (status === 'SUBSCRIBED') {
                  console.log('Successfully subscribed to API usage changes')
                } else if (status === 'CHANNEL_ERROR') {
                  console.error('Error subscribing to API usage changes:', err?.message || 'Unknown error')
                  // Add more detailed error logging
                  if (err) {
                    console.error('Subscription error details:', {
                      message: err.message,
                      stack: err.stack,
                      name: err.name
                    })
                    // Handle network errors specifically
                    if (err?.message?.includes('Failed to fetch') || err?.message?.includes('NetworkError')) {
                      console.error('Network connectivity issue detected during subscription.')
                    }
                    // Handle WebSocket connection errors specifically
                    if (err?.message?.includes('websocket')) {
                      console.error('WebSocket connection issue detected. This may be due to network restrictions or Supabase real-time service issues.')
                    }
                  }
                  // Set realtimeFailed to true and start polling as fallback
                  if (isMounted) {
                    setRealtimeFailed(true)
                    setupPolling(supabase, user.id)
                  }
                } else if (status === 'CLOSED') {
                  console.log('API usage subscription closed')
                  // Log additional information when the channel is closed
                  if (err) {
                    console.error('Channel closed with error:', err.message || err);
                    // Handle connection close errors specifically
                    if (err?.message?.includes('Failed to fetch') || err?.message?.includes('NetworkError')) {
                      console.error('Network connectivity issue detected when channel was closed.')
                    }
                  }
                  // Set realtimeFailed to true and start polling as fallback
                  if (isMounted) {
                    setRealtimeFailed(true)
                    setupPolling(supabase, user.id)
                  }
                } else if (status === 'TIMED_OUT') {
                  console.error('API usage subscription timed out')
                  console.error('Real-time subscription timed out. This may be due to network latency or Supabase service issues.')
                  // Set realtimeFailed to true and start polling as fallback
                  if (isMounted) {
                    setRealtimeFailed(true)
                    setupPolling(supabase, user.id)
                  }
                } else if (status === 'CHANNEL_CLOSED') {
                  console.log('API usage channel closed')
                } else {
                  console.log('API usage subscription status:', status)
                }
              })
          } catch (subscriptionError: any) {
            console.error('Failed to set up real-time subscription:', subscriptionError.message || subscriptionError)
            // Add more detailed error logging
            console.error('Subscription error stack:', subscriptionError)
            // Handle network errors specifically
            if (subscriptionError?.message?.includes('Failed to fetch') || subscriptionError?.message?.includes('NetworkError')) {
              console.error('Network connectivity issue detected while setting up real-time subscription.')
            }
            // Set realtimeFailed to true and start polling as fallback
            if (isMounted) {
              setRealtimeFailed(true)
              setupPolling(supabase, user.id)
            }
          }
        } else if (isMounted && realtimeFailed) {
          // If realtime already failed, set up polling
          setupPolling(supabase, user.id)
        }
      } catch (error: any) {
        console.error('Error fetching API usage:', error.message || error)
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
          console.error('Network connectivity issue detected during API usage fetch.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    
    const setupPolling = (supabase: any, userId: string) => {
      // Clear any existing polling interval
      if (pollingInterval) {
        clearInterval(pollingInterval)
        pollingInterval = null
      }
      
      console.log('Setting up polling as fallback for real-time updates')
      
      // Set up polling every 30 seconds
      pollingInterval = setInterval(async () => {
        try {
          const { data, error } = await supabase
            .from('user_plans')
            .select('usage')
            .eq('user_id', userId)
            .single()
          
          if (error) {
            console.error('Error fetching API usage in polling:', error.message || error)
            return
          }
          
          if (data && data.usage) {
            const usage = data.usage as Record<string, number>
            if (isMounted) {
              setApiUsage({
                apiCalls: usage.apiCalls || 0,
                comparisons: usage.comparisons || 0,
                storage: usage.storage || 0
              })
            }
          }
        } catch (error: any) {
          console.error('Error in polling:', error.message || error)
        }
      }, 30000) // Poll every 30 seconds
    }

    fetchApiUsage()
    
    return () => {
      isMounted = false
      if (channel) {
        try {
          const supabase = createClient()
          supabase.removeChannel(channel)
        } catch (error: any) {
          console.error('Error removing channel:', error.message || error)
          // Handle network errors specifically
          if (error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError')) {
            console.error('Network connectivity issue detected while removing channel.')
          }
        }
      }
      // Clear polling interval
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }
    }
  }, [realtimeFailed])

  return { apiUsage, loading }
}