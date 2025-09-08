'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { useAuth } from '@/contexts/AuthContext'
import { usePlan } from '@/contexts/PlanContext'
import { useToast } from '@/contexts/NotificationContext'
import AdvancedSidebar from '@/components/layout/AdvancedSidebar'
import { 
  CheckCircle, 
  ArrowRight, 
  Home, 
  Settings, 
  BarChart3, 
  Crown,
  Loader2,
  Sparkles
} from 'lucide-react'

export default function PaymentSuccessPage() {
  const { darkMode } = useDarkMode()
  const { user } = useAuth()
  const { refreshPlan } = usePlan()
  const { success } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [sessionDetails, setSessionDetails] = useState<any>(null)

  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      if (!sessionId) {
        router.push('/payment')
        return
      }

      try {
        // Verify the session and get details
        const response = await fetch(`/api/stripe/verify-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        })

        if (response.ok) {
          const data = await response.json()
          setSessionDetails(data)
          
          // Refresh user's plan information
          await refreshPlan()
          
          // Show success message
          success(
            'Payment Successful!',
            `Welcome to ${data.planType?.toUpperCase()}! Your subscription is now active.`
          )
        } else {
          console.error('Failed to verify session')
        }
      } catch (error) {
        console.error('Error verifying payment:', error)
      } finally {
        setIsLoading(false)
      }
    }

    handlePaymentSuccess()
  }, [sessionId, router, refreshPlan, success])

  const quickActions = [
    {
      title: 'Start Comparing Models',
      description: 'Begin using your new features',
      icon: BarChart3,
      href: '/model-comparison',
      color: 'blue'
    },
    {
      title: 'Account Settings',
      description: 'Manage your subscription',
      icon: Settings,
      href: '/account-settings',
      color: 'gray'
    },
    {
      title: 'Dashboard',
      description: 'View your usage stats',
      icon: Home,
      href: '/dashboard',
      color: 'green'
    }
  ]

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <AdvancedSidebar />
        <div className={`flex-1 flex items-center justify-center transition-colors duration-200 ${
          darkMode ? 'bg-gray-900' : 'bg-slate-50'
        }`}>
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
              Verifying your payment...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <AdvancedSidebar />
      
      <div className={`flex-1 transition-colors duration-200 overflow-auto ${
        darkMode ? 'bg-gray-900' : 'bg-slate-50'
      }`}>
        {/* Success Hero Section */}
        <div className="relative overflow-hidden">
          <div className={`absolute inset-0 ${
            darkMode 
              ? 'bg-gradient-to-br from-green-900/20 via-gray-900 to-black' 
              : 'bg-gradient-to-br from-green-50 via-white to-blue-50'
          }`} />
          
          <div className="relative px-6 py-20">
            <div className="max-w-4xl mx-auto text-center">
              {/* Success Icon */}
              <div className="flex items-center justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                  <div className="relative bg-green-500 rounded-full p-4">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
              
              <h1 className={`text-4xl md:text-5xl font-bold mb-6 transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Payment Successful! 🎉
              </h1>
              
              <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-8 transition-colors duration-200 ${
                darkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>
                Congratulations! Your subscription has been activated successfully. 
                You now have access to all premium features.
              </p>

              {/* Plan Details */}
              {sessionDetails && (
                <div className={`inline-flex items-center px-6 py-3 rounded-xl ${
                  darkMode ? 'bg-blue-600/20 border border-blue-500/30' : 'bg-blue-100 border border-blue-200'
                }`}>
                  <Crown className={`w-5 h-5 mr-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <span className={`font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                    {sessionDetails.planType?.replace('_', ' ').toUpperCase()} Plan Active
                  </span>
                </div>
              )}

              {/* Trial Information */}
              <div className={`mt-8 p-6 rounded-xl ${
                darkMode ? 'bg-purple-600/20 border border-purple-500/30' : 'bg-purple-100 border border-purple-200'
              }`}>
                <div className="flex items-center justify-center mb-3">
                  <Sparkles className={`w-6 h-6 mr-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>
                    7-Day Free Trial Started
                  </h3>
                </div>
                <p className={`text-sm ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                  You won't be charged until your trial period ends. Cancel anytime during the trial at no cost.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-2xl font-bold text-center mb-12 transition-colors duration-200 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              What would you like to do next?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <button
                    key={index}
                    onClick={() => router.push(action.href)}
                    className={`p-6 rounded-xl text-left transition-all duration-200 hover:scale-105 ${
                      darkMode 
                        ? 'bg-gray-800/60 border border-gray-700/50 hover:border-gray-600/50' 
                        : 'bg-white border border-slate-200 hover:border-slate-300 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                      action.color === 'blue'
                        ? darkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                        : action.color === 'green'
                          ? darkMode ? 'bg-green-600/20 text-green-400' : 'bg-green-100 text-green-600'
                          : darkMode ? 'bg-gray-600/20 text-gray-400' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <h3 className={`text-lg font-semibold mb-2 transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {action.title}
                    </h3>
                    
                    <p className={`text-sm mb-4 transition-colors duration-200 ${
                      darkMode ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      {action.description}
                    </p>

                    <div className="flex items-center text-blue-600 text-sm font-semibold">
                      Get started
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="px-6 py-16 border-t border-current border-opacity-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className={`text-2xl font-bold mb-6 transition-colors duration-200 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Need Help Getting Started?
            </h2>
            
            <p className={`text-lg mb-8 transition-colors duration-200 ${
              darkMode ? 'text-gray-300' : 'text-slate-600'
            }`}>
              Our support team is here to help you make the most of your new plan.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/contact')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  darkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } shadow-lg hover:shadow-xl`}
              >
                Contact Support
              </button>
              
              <button
                onClick={() => router.push('/help')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                }`}
              >
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}