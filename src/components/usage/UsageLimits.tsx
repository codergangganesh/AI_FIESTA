'use client'

import { useUsage } from '@/contexts/UsageContext'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { Zap, Lock, CheckCircle, AlertCircle } from 'lucide-react'

export default function UsageLimits() {
  const { darkMode } = useDarkMode()
  const { plan } = useSubscription()
  const { usage, remainingUsage, canMakeComparison, canMakeApiCall, isLoading } = useUsage()

  if (isLoading) {
    return (
      <div className={`p-4 rounded-xl border ${
        darkMode ? 'bg-gray-800/60 border-gray-700' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  const isFreePlan = plan === 'free'
  const isUnlimited = !isFreePlan

  return (
    <div className={`p-4 rounded-xl border ${
      darkMode ? 'bg-gray-800/60 border-gray-700' : 'bg-white/80 border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Usage Limits
        </h3>
        <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
          isFreePlan 
            ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            : 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
        }`}>
          {isFreePlan ? 'Free Plan' : `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`}
        </div>
      </div>

      <div className="space-y-3">
        {/* Comparisons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {canMakeComparison ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <Lock className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Comparisons
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {isUnlimited ? (
                <span className="flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-green-500" />
                  <span>Unlimited</span>
                </span>
              ) : (
                `${usage.comparisons}/10`
              )}
            </span>
            {!canMakeComparison && (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
        </div>

        {/* API Calls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {canMakeApiCall ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <Lock className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              API Calls
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {isUnlimited ? (
                <span className="flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-green-500" />
                  <span>Unlimited</span>
                </span>
              ) : (
                `${usage.apiCalls}/100`
              )}
            </span>
            {!canMakeApiCall && (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
        </div>

        {/* Progress Bars for Free Plan */}
        {isFreePlan && (
          <div className="space-y-2 pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
            <div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Comparisons</span>
                <span>{Math.round((usage.comparisons / 10) * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    usage.comparisons >= 10 
                      ? 'bg-red-500' 
                      : usage.comparisons >= 8 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(100, (usage.comparisons / 10) * 100)}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>API Calls</span>
                <span>{Math.round((usage.apiCalls / 100) * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    usage.apiCalls >= 100 
                      ? 'bg-red-500' 
                      : usage.apiCalls >= 80 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(100, (usage.apiCalls / 100) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
