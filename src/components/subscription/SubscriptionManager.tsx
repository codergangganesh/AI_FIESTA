'use client'

import { useState } from 'react'
import { CreditCard, Crown, Zap, Star, Settings, ExternalLink } from 'lucide-react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { subscriptionService } from '@/lib/subscription'
import { useRouter } from 'next/navigation'

export default function SubscriptionManager() {
  const { darkMode } = useDarkMode()
  const { subscription, hasActiveSubscription, plan, refreshSubscription } = useSubscription()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleManageSubscription = async () => {
    if (!subscription?.user_id) return

    setIsLoading(true)
    try {
      const portalUrl = await subscriptionService.createPortalSession(subscription.user_id)
      window.open(portalUrl, '_blank')
    } catch (error) {
      console.error('Failed to open customer portal:', error)
      alert('Failed to open subscription management. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case 'pro':
        return <Zap className="w-6 h-6 text-blue-500" />
      case 'enterprise':
        return <Crown className="w-6 h-6 text-purple-500" />
      default:
        return <Star className="w-6 h-6 text-gray-500" />
    }
  }

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'pro':
        return 'from-blue-500 to-blue-600'
      case 'enterprise':
        return 'from-purple-500 to-purple-600'
      default:
        return 'from-gray-400 to-gray-600'
    }
  }

  return (
    <div className={`p-6 rounded-2xl border backdrop-blur-md ${
      darkMode ? 'bg-gray-800/60 border-gray-700' : 'bg-white/80 border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getPlanColor(plan)} flex items-center justify-center shadow-lg`}>
            {getPlanIcon(plan)}
          </div>
          <div>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {hasActiveSubscription ? 'Active subscription' : 'Free plan'}
            </p>
          </div>
        </div>
        
        {hasActiveSubscription && (
          <button
            onClick={handleManageSubscription}
            disabled={isLoading}
            className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 ${
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>{isLoading ? 'Loading...' : 'Manage'}</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className={`p-4 rounded-xl ${
          darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Status
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              hasActiveSubscription
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {hasActiveSubscription ? 'Active' : 'Free'}
            </span>
          </div>
        </div>

        {subscription && (
          <div className={`p-4 rounded-xl ${
            darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Next billing date
              </span>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {hasActiveSubscription ? 'Monthly' : 'N/A'}
              </span>
            </div>
          </div>
        )}

        <div className={`p-4 rounded-xl ${
          darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Plan features
            </span>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {plan === 'free' ? 'Limited' : plan === 'pro' ? 'Unlimited' : 'Enterprise'}
            </span>
          </div>
        </div>
      </div>

      {!hasActiveSubscription && (
        <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
          <p className={`text-sm text-center mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Upgrade to unlock unlimited comparisons and premium features
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <CreditCard className="w-5 h-5" />
            <span>Upgrade Plan</span>
          </button>
        </div>
      )}
    </div>
  )
}
