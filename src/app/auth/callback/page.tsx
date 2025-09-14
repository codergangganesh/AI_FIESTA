'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function AuthCallback() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    // Wait for auth state to be determined
    if (!loading) {
      // If user is authenticated, redirect to chat
      if (user) {
        router.push('/chat')
      } else {
        // If not authenticated, redirect to auth page
        router.push('/auth')
      }
    }
  }, [user, loading, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Completing Authentication</h2>
        <p className="text-gray-600">Please wait while we complete your sign in...</p>
      </div>
    </div>
  )
}