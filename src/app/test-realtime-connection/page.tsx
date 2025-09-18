'use client'

import { useEffect, useState } from 'react'
import { testRealtimeConnection } from '@/utils/supabase/test-realtime'

export default function TestRealtimeConnectionPage() {
  const [testResults, setTestResults] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const runTest = async () => {
      try {
        const results = await testRealtimeConnection()
        setTestResults(results)
      } catch (error: any) {
        setTestResults({
          success: false,
          message: 'Test failed with exception',
          error: error.message
        })
      } finally {
        setLoading(false)
      }
    }

    runTest()
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Real-time Connection Test</h1>
      
      {loading ? (
        <p>Testing real-time connection...</p>
      ) : (
        <div>
          <h2>Test Results:</h2>
          <div style={{
            padding: '15px',
            borderRadius: '4px',
            backgroundColor: testResults?.success ? '#e8f5e9' : '#ffebee',
            color: testResults?.success ? '#2e7d32' : '#c62828'
          }}>
            <p><strong>Status:</strong> {testResults?.success ? 'SUCCESS' : 'FAILED'}</p>
            <p><strong>Message:</strong> {testResults?.message}</p>
            {testResults?.error && (
              <p><strong>Error:</strong> {testResults.error}</p>
            )}
            {testResults?.details && (
              <p><strong>Details:</strong> {testResults.details}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}