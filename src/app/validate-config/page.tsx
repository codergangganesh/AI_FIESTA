'use client'

import { useEffect, useState } from 'react'
import { validateSupabaseConfig } from '@/utils/supabase/validate-config'

export default function ValidateConfigPage() {
  const [validationResult, setValidationResult] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const validate = async () => {
      try {
        const result = validateSupabaseConfig()
        setValidationResult(result)
      } catch (error: any) {
        setValidationResult({
          isValid: false,
          errors: [error.message || 'Unknown error during validation']
        })
      } finally {
        setLoading(false)
      }
    }

    validate()
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Supabase Configuration Validation</h1>
      
      {loading ? (
        <p>Validating configuration...</p>
      ) : (
        <div>
          <h2>Validation Results:</h2>
          <div style={{
            padding: '15px',
            borderRadius: '4px',
            backgroundColor: validationResult?.isValid ? '#e8f5e9' : '#ffebee',
            color: validationResult?.isValid ? '#2e7d32' : '#c62828'
          }}>
            <p><strong>Status:</strong> {validationResult?.isValid ? 'VALID' : 'INVALID'}</p>
            
            {validationResult?.errors && validationResult.errors.length > 0 && (
              <div>
                <p><strong>Errors found:</strong></p>
                <ul>
                  {validationResult.errors.map((error: string, index: number) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {validationResult?.isValid && (
              <p>All configuration values appear to be set correctly.</p>
            )}
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <h3>Configuration Values:</h3>
            <div style={{ 
              padding: '10px', 
              backgroundColor: '#f5f5f5', 
              borderRadius: '4px',
              fontFamily: 'monospace'
            }}>
              <p>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET'}</p>
              <p>NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'}</p>
              <p>SUPABASE_SERVICE_ROLE_KEY: {process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}