'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestSupabasePage() {
  const [testResults, setTestResults] = useState<any>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const runTests = async () => {
      try {
        console.log('Testing Supabase configuration...')
        
        // Check environment variables
        console.log('Environment variables:')
        console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
        console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET')
        
        // Test Supabase connection
        const supabase = createClient()
        console.log('Supabase client created successfully')
        
        // Test auth
        console.log('Testing authentication...')
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        console.log('Auth result:', { user: user ? 'USER_PRESENT' : 'NO_USER', authError })
        
        if (authError) {
          console.error('Auth error details:', authError)
          throw new Error(`Auth error: ${authError.message}`)
        }
        
        // Test database connection by querying a simple table
        console.log('Testing database connection...')
        const { data, error } = await supabase
          .from('user_plans')
          .select('count', { count: 'exact', head: true })
        
        console.log('Database test result:', { data, error })
        
        setTestResults({
          envVars: {
            url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
            key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'
          },
          auth: {
            user: user ? 'AUTHENTICATED' : 'NOT_AUTHENTICATED',
            error: authError?.message || null
          },
          database: {
            success: !error,
            error: error?.message || null
          }
        })
      } catch (err: any) {
        console.error('Test error:', err)
        setError(err.message || 'Unknown error')
        setTestResults({
          error: err.message || 'Unknown error',
          stack: err.stack
        })
      } finally {
        setLoading(false)
      }
    }
    
    runTests()
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Supabase Connection Test</h1>
      
      {error && (
        <div style={{ backgroundColor: '#fee', color: '#c33', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>
          <h2>Error:</h2>
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>Test Results:</h2>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
            {JSON.stringify(testResults, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}