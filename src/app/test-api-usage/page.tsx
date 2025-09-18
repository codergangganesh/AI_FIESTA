'use client'

import { useEffect, useState } from 'react'
import { useApiUsage } from '@/hooks/useApiUsage'
import { databaseClientService } from '@/services/database.client'
import { createClient } from '@/lib/supabase/client'

export default function TestApiUsagePage() {
  const { apiUsage, loading } = useApiUsage()
  const [testResults, setTestResults] = useState<any>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const runTests = async () => {
      try {
        console.log('Starting API usage tests...')
        
        // Test Supabase connection
        const supabase = createClient()
        console.log('Supabase client created')
        
        // Test auth
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        console.log('Auth result:', { user, authError })
        
        if (authError) {
          throw new Error(`Auth error: ${authError.message}`)
        }
        
        if (!user) {
          throw new Error('No authenticated user')
        }
        
        // Test individual database methods
        console.log('Testing database methods...')
        const totalComparisons = await databaseClientService.getTotalComparisonsCount()
        console.log('Total comparisons:', totalComparisons)
        
        const modelsAnalyzed = await databaseClientService.getModelsAnalyzedCount()
        console.log('Models analyzed:', modelsAnalyzed)
        
        const accuracyScore = await databaseClientService.getAverageAccuracyScore()
        console.log('Accuracy score:', accuracyScore)
        
        const apiUsagePercentage = await databaseClientService.getApiUsagePercentage()
        console.log('API usage percentage:', apiUsagePercentage)
        
        setTestResults({
          user: user.email,
          totalComparisons,
          modelsAnalyzed,
          accuracyScore,
          apiUsagePercentage
        })
      } catch (err: any) {
        console.error('Test error:', err)
        setError(err.message || 'Unknown error')
      }
    }
    
    runTests()
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>API Usage Test Page</h1>
      
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
          <h2>API Usage Hook Data:</h2>
          <pre>{JSON.stringify(apiUsage, null, 2)}</pre>
          
          <h2>Test Results:</h2>
          <pre>{JSON.stringify(testResults, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}