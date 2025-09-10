'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, AlertTriangle, Trash2, Shield, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { createClient } from '@/utils/supabase/client'

export default function DeleteAccountPage() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { darkMode } = useDarkMode()
  const supabase = createClient()
  
  const [step, setStep] = useState(1)
  const [confirmText, setConfirmText] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  
  const CONFIRM_TEXT = 'DELETE MY ACCOUNT'

  const handleDeleteAccount = async () => {
    if (confirmText !== CONFIRM_TEXT) {
      setError('Please type the confirmation text exactly as shown.')
      return
    }
    
    if (!password) {
      setError('Please enter your password to confirm.')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      // First, verify the password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password,
      })
      
      if (signInError) {
        setError('Incorrect password. Please try again.')
        setIsLoading(false)
        return
      }
      
      // Password is correct, now delete the account
      const response = await fetch('/api/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = `API error! status: ${response.status}`
        try {
          const errorData = JSON.parse(errorText)
          errorMessage += `, message: ${errorData.error || errorText}`
        } catch (parseError) {
          errorMessage += `, message: ${errorText}`
        }
        throw new Error(errorMessage)
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete account')
      }
      
      // Sign out the user
      await signOut()
      
      // Show success popup
      setShowSuccessPopup(true)
    } catch (error: any) {
      console.error('Error deleting account:', error)
      setError(error.message || 'Failed to delete account. Please try again.')
      setIsLoading(false)
    }
  }

  // Handle success popup and redirect
  useEffect(() => {
    if (showSuccessPopup) {
      const timer = setTimeout(() => {
        router.push('/?deleted=true&message=Your%20account%20has%20been%20successfully%20deleted.')
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [showSuccessPopup, router])

  const consequences = [
    {
      icon: Trash2,
      title: 'All data will be permanently deleted',
      description: 'Your conversation history, preferences, and account data will be completely removed.'
    },
    {
      icon: Shield,
      title: 'Cannot be recovered',
      description: 'Once deleted, your account and all associated data cannot be restored.'
    },
    {
      icon: Lock,
      title: 'Immediate effect',
      description: 'Account deletion takes effect immediately and you will be signed out.'
    }
  ]

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-red-900 to-gray-900' 
        : 'bg-gradient-to-br from-slate-50 via-red-50 to-slate-50'
    }`}>
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div className={`relative rounded-2xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 scale-100 ${
            darkMode 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white border border-slate-200'
          }`}>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className={`text-2xl font-bold mb-2 transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Account Deleted!
              </h3>
              <p className={`mb-6 transition-colors duration-200 ${
                darkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>
                Your account has been successfully deleted. You will be redirected shortly.
              </p>
              <div className="flex justify-center">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={`backdrop-blur-sm border-b transition-colors duration-200 ${
        darkMode 
          ? 'bg-gray-800/60 border-gray-700/30' 
          : 'bg-white/60 border-slate-200/30'
      }`}>
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className={`p-2 rounded-xl transition-all duration-200 ${
                darkMode 
                  ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white' 
                  : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className={`text-2xl font-bold transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Delete Account
              </h1>
              <p className={`transition-colors duration-200 ${
                darkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>
                Permanently remove your account and all data
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        {step === 1 && (
          <div className={`rounded-2xl overflow-hidden transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-800/60 border border-gray-700/50' 
              : 'bg-white/80 border border-slate-200/50'
          }`}>
            <div className="p-8">
              {/* Warning Header */}
              <div className="text-center mb-8">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  darkMode 
                    ? 'bg-red-900/30 text-red-400' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  <AlertTriangle className="w-10 h-10" />
                </div>
                <h2 className={`text-2xl font-bold mb-2 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Are you sure you want to delete your account?
                </h2>
                <p className={`transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  This action will have the following consequences:
                </p>
              </div>

              {/* Consequences List */}
              <div className="space-y-4 mb-8">
                {consequences.map((consequence, index) => {
                  const Icon = consequence.icon
                  return (
                    <div key={index} className={`flex items-start space-x-4 p-4 rounded-xl transition-colors duration-200 ${
                      darkMode ? 'bg-gray-700/30' : 'bg-slate-50'
                    }`}>
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        darkMode 
                          ? 'bg-red-900/30 text-red-400' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className={`font-semibold mb-1 transition-colors duration-200 ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {consequence.title}
                        </h3>
                        <p className={`text-sm transition-colors duration-200 ${
                          darkMode ? 'text-gray-400' : 'text-slate-600'
                        }`}>
                          {consequence.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* User Info */}
              <div className={`p-4 rounded-xl mb-8 transition-colors duration-200 ${
                darkMode 
                  ? 'bg-yellow-900/20 border border-yellow-700/50' 
                  : 'bg-yellow-50 border border-yellow-200'
              }`}>
                <h3 className={`font-semibold mb-2 transition-colors duration-200 ${
                  darkMode ? 'text-yellow-400' : 'text-yellow-700'
                }`}>
                  Account to be deleted:
                </h3>
                <p className={`transition-colors duration-200 ${
                  darkMode ? 'text-yellow-300' : 'text-yellow-600'
                }`}>
                  {user?.email}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.back()}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg"
                >
                  Continue to Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={`rounded-2xl overflow-hidden transition-colors duration-200 ${
            darkMode 
              ? 'bg-gray-800/60 border border-gray-700/50' 
              : 'bg-white/80 border border-slate-200/50'
          }`}>
            <div className="p-8">
              {/* Confirmation Header */}
              <div className="text-center mb-8">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  darkMode 
                    ? 'bg-red-900/30 text-red-400' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  <Trash2 className="w-10 h-10" />
                </div>
                <h2 className={`text-2xl font-bold mb-2 transition-colors duration-200 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Final Confirmation
                </h2>
                <p className={`transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  To confirm account deletion, please complete the following steps:
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className={`mb-6 p-4 rounded-xl ${
                  darkMode 
                    ? 'bg-red-900/30 border border-red-700/50 text-red-400' 
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  {error}
                </div>
              )}

              {/* Confirmation Steps */}
              <div className="space-y-6 mb-8">
                <div>
                  <label className={`block text-sm font-medium mb-3 transition-colors duration-200 ${
                    darkMode ? 'text-gray-300' : 'text-slate-700'
                  }`}>
                    1. Type "<span className="font-bold text-red-500">{CONFIRM_TEXT}</span>" to confirm:
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                      darkMode
                        ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500'
                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-red-500'
                    } focus:outline-none focus:ring-2 focus:ring-red-500/20`}
                    placeholder={CONFIRM_TEXT}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-3 transition-colors duration-200 ${
                    darkMode ? 'text-gray-300' : 'text-slate-700'
                  }`}>
                    2. Enter your password to confirm:
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                      darkMode
                        ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500'
                        : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500 focus:border-red-500'
                    } focus:outline-none focus:ring-2 focus:ring-red-500/20`}
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {/* Final Warning */}
              <div className={`p-4 rounded-xl mb-8 transition-colors duration-200 ${
                darkMode 
                  ? 'bg-red-900/20 border border-red-700/50' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <p className={`text-sm font-medium transition-colors duration-200 ${
                  darkMode ? 'text-red-400' : 'text-red-700'
                }`}>
                  ⚠️ Last chance: This action cannot be undone. Your account and all data will be permanently deleted.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}
                >
                  Go Back
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isLoading || confirmText !== CONFIRM_TEXT || !password}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-50"
                >
                  {isLoading ? 'Deleting Account...' : 'DELETE MY ACCOUNT'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}