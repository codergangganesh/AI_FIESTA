'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/utils/supabase/client'

export default function TestPasswordPage() {
  const { user } = useAuth()
  const supabase = createClient()
  const [message, setMessage] = useState('')
  const [isTesting, setIsTesting] = useState(false)

  const testPasswordStorage = async () => {
    setIsTesting(true)
    setMessage('')
    
    try {
      // Test storing password data in profiles table
      const testData = {
        password_hash: 'test_hash_value',
        salt: 'test_salt_value',
        created_at: new Date().toISOString()
      }
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          oauth_password_data: JSON.stringify(testData)
        })
        .eq('id', user?.id)
      
      if (updateError) {
        throw new Error(`Failed to store test data: ${updateError.message}`)
      }
      
      // Test retrieving password data from profiles table
      const { data: profileData, error: selectError } = await supabase
        .from('profiles')
        .select('oauth_password_data')
        .eq('id', user?.id)
        .single()
      
      if (selectError) {
        throw new Error(`Failed to retrieve test data: ${selectError.message}`)
      }
      
      // Parse and verify the stored data
      let parsedData;
      try {
        parsedData = JSON.parse(profileData.oauth_password_data);
      } catch (parseError) {
        throw new Error('Failed to parse stored password data')
      }
      
      // Clean up - remove test data
      await supabase
        .from('profiles')
        .update({
          oauth_password_data: null
        })
        .eq('id', user?.id)
      
      setMessage(`Success! Test data stored and retrieved correctly: ${JSON.stringify(parsedData)}`)
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setIsTesting(false)
    }
  }

  if (!user) {
    return <div className="p-8">Please sign in to test password storage.</div>
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">OAuth Password Storage Test</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Profile Access</h2>
        <p className="mb-4">User ID: {user.id}</p>
        <p className="mb-4">Email: {user.email}</p>
        
        <button
          onClick={testPasswordStorage}
          disabled={isTesting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isTesting ? 'Testing...' : 'Test Password Storage'}
        </button>
      </div>
      
      {message && (
        <div className={`p-4 rounded-md ${message.startsWith('Success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}
      
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800 mb-2">Implementation Notes</h3>
        <p className="text-yellow-700">
          This test verifies that we can store and retrieve password data in the profiles table,
          which is our solution to the schema cache issue with the oauth_user_passwords table.
        </p>
      </div>
    </div>
  )
}