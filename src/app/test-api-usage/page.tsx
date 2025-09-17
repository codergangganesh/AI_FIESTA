'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useApiUsage } from '@/hooks/useApiUsage'

export default function TestApiUsagePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { apiUsage, loading: usageLoading } = useApiUsage()
  const [testCount, setTestCount] = useState(0)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  const incrementApiUsage = async () => {
    if (!user) return

    try {
      const supabase = createClient()
      const { error } = await supabase.rpc('update_user_usage', {
        p_user_id: user.id,
        p_type: 'apiCalls',
        p_amount: 1
      })

      if (error) {
        console.error('Error updating API usage:', error)
      } else {
        setTestCount(prev => prev + 1)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-400 rounded-full animate-spin animate-reverse"></div>
          </div>
          <p className="mt-4 text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">API Usage Test</h1>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Current API Usage</h2>
          
          {usageLoading ? (
            <p className="text-slate-600">Loading usage data...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-blue-700 font-medium">API Calls</p>
                <p className="text-2xl font-bold text-slate-900">{apiUsage.apiCalls}</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <p className="text-sm text-purple-700 font-medium">Comparisons</p>
                <p className="text-2xl font-bold text-slate-900">{apiUsage.comparisons}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-sm text-green-700 font-medium">Storage</p>
                <p className="text-2xl font-bold text-slate-900">{apiUsage.storage}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Test API Usage Increment</h2>
          <p className="text-slate-600 mb-6">
            Click the button below to increment your API usage counter by 1. 
            The sidebar should update in real-time to reflect the new count.
          </p>
          
          <button
            onClick={incrementApiUsage}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 hover:shadow-lg"
          >
            Increment API Usage (+1)
          </button>
          
          <p className="mt-4 text-slate-600">
            Button clicked: <span className="font-semibold">{testCount} times</span>
          </p>
        </div>
      </div>
    </div>
  )
}