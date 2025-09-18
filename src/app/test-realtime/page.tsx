'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestRealtimePage() {
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('Not started')
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    let channel: any = null
    let isMounted = true

    const testRealtime = async () => {
      try {
        const supabase = createClient()
        
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) {
          if (isMounted) {
            setSubscriptionStatus('Authentication failed')
            setMessages(prev => [...prev, `Auth error: ${authError?.message || 'No user'}`])
          }
          return
        }
        
        if (isMounted) {
          setSubscriptionStatus('Setting up subscription')
          setMessages(prev => [...prev, `User ID: ${user.id}`])
        }
        
        // Set up real-time subscription
        channel = supabase
          .channel('test-channel')
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'user_plans',
              filter: `user_id=eq.${user.id}`
            },
            (payload) => {
              if (isMounted) {
                setMessages(prev => [...prev, `Real-time update received: ${JSON.stringify(payload)}`])
              }
            }
          )
          .subscribe((status, err) => {
            if (isMounted) {
              setMessages(prev => [...prev, `Subscription status: ${status}`])
              
              if (status === 'SUBSCRIBED') {
                setSubscriptionStatus('Subscribed successfully')
                setMessages(prev => [...prev, 'Successfully subscribed to real-time updates'])
              } else if (status === 'CHANNEL_ERROR') {
                setSubscriptionStatus('Subscription failed')
                setMessages(prev => [...prev, `Subscription error: ${err?.message || 'Unknown error'}`])
              } else if (status === 'CLOSED') {
                setSubscriptionStatus('Subscription closed')
                setMessages(prev => [...prev, 'Subscription closed'])
              } else if (status === 'TIMED_OUT') {
                setSubscriptionStatus('Subscription timed out')
                setMessages(prev => [...prev, 'Subscription timed out'])
              }
            }
          })
      } catch (error: any) {
        if (isMounted) {
          setSubscriptionStatus('Error occurred')
          setMessages(prev => [...prev, `Error: ${error.message || 'Unknown error'}`])
        }
      }
    }

    testRealtime()

    return () => {
      isMounted = false
      if (channel) {
        try {
          const supabase = createClient()
          supabase.removeChannel(channel)
        } catch (error: any) {
          console.error('Error removing channel:', error.message || error)
        }
      }
    }
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Real-time Subscription Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Status: {subscriptionStatus}</h2>
      </div>
      
      <div>
        <h3>Messages:</h3>
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          {messages.map((message, index) => (
            <div key={index} style={{ marginBottom: '5px', fontFamily: 'monospace' }}>
              {message}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}