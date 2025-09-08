'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { useToast } from '@/contexts/NotificationContext'
import AdvancedSidebar from '@/components/layout/AdvancedSidebar'
import { 
  XCircle, 
  ArrowLeft, 
  RefreshCw, 
  CreditCard, 
  HelpCircle,
  Home
} from 'lucide-react'

export default function PaymentCancelPage() {
  const { darkMode } = useDarkMode()
  const { error } = useToast()
  const router = useRouter()

  useEffect(() => {
    error('Payment Cancelled', 'Your payment was cancelled. No charges were made to your account.')
  }, [error])

  const suggestions = [
    {
      title: 'Payment Method Issues',
      description: 'Try using a different payment method or card',
      icon: CreditCard,
      action: () => router.push('/payment'),
      actionText: 'Try Again'
    },
    {
      title: 'Need Help?',
      description: 'Contact our support team for assistance',
      icon: HelpCircle,
      action: () => router.push('/contact'),
      actionText: 'Get Help'
    },
    {
      title: 'Explore Features',
      description: 'Continue with the free plan for now',
      icon: Home,
      action: () => router.push('/dashboard'),
      actionText: 'Go to Dashboard'
    }
  ]

  return (
    <div className="flex h-screen">
      <AdvancedSidebar />
      
      <div className={`flex-1 transition-colors duration-200 overflow-auto ${
        darkMode ? 'bg-gray-900' : 'bg-slate-50'
      }`}>
        {/* Cancel Hero Section */}
        <div className="relative overflow-hidden">
          <div className={`absolute inset-0 ${
            darkMode 
              ? 'bg-gradient-to-br from-red-900/20 via-gray-900 to-black' 
              : 'bg-gradient-to-br from-red-50 via-white to-orange-50'
          }`} />
          
          <div className="relative px-6 py-20">
            <div className="max-w-4xl mx-auto text-center">
              {/* Cancel Icon */}
              <div className="flex items-center justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500 rounded-full animate-pulse opacity-75"></div>
                  <div className="relative bg-red-500 rounded-full p-4">
                    <XCircle className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
              
              <h1 className={`text-4xl md:text-5xl font-bold mb-6 transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Payment Cancelled
              </h1>
              
              <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-8 transition-colors duration-200 ${
                darkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>
                Your payment was cancelled and no charges were made to your account. 
                You can try again anytime or continue with the free plan.
              </p>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/payment')}
                  className="flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Try Payment Again
                </button>
                
                <button
                  onClick={() => router.push('/dashboard')}
                  className={`flex items-center justify-center px-8 py-4 font-semibold rounded-xl transition-all duration-200 ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions Section */}
        <div className="px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-2xl font-bold text-center mb-12 transition-colors duration-200 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Common Solutions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {suggestions.map((suggestion, index) => {
                const Icon = suggestion.icon
                return (
                  <div
                    key={index}
                    className={`p-6 rounded-xl transition-all duration-200 hover:scale-105 ${
                      darkMode 
                        ? 'bg-gray-800/60 border border-gray-700/50 hover:border-gray-600/50' 
                        : 'bg-white border border-slate-200 hover:border-slate-300 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                      darkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <h3 className={`text-lg font-semibold mb-2 transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {suggestion.title}
                    </h3>
                    
                    <p className={`text-sm mb-6 transition-colors duration-200 ${
                      darkMode ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      {suggestion.description}
                    </p>

                    <button
                      onClick={suggestion.action}
                      className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200"
                    >
                      {suggestion.actionText}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Free Plan Reminder */}
        <div className="px-6 py-16 border-t border-current border-opacity-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`p-8 rounded-xl ${
              darkMode ? 'bg-green-600/20 border border-green-500/30' : 'bg-green-100 border border-green-200'
            }`}>
              <h2 className={`text-2xl font-bold mb-4 transition-colors duration-200 ${
                darkMode ? 'text-green-400' : 'text-green-700'
              }`}>
                Continue with Free Plan
              </h2>
              
              <p className={`text-lg mb-6 transition-colors duration-200 ${
                darkMode ? 'text-green-300' : 'text-green-600'
              }`}>
                You can still enjoy AI model comparison with our free plan features:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[
                  'Access to 2 AI models',
                  '10 comparisons per month',
                  'Basic metrics & analytics',
                  'Export results (CSV)'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center justify-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${
                      darkMode ? 'bg-green-400' : 'bg-green-600'
                    }`} />
                    <span className={`text-sm ${
                      darkMode ? 'text-green-300' : 'text-green-600'
                    }`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => router.push('/model-comparison')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  darkMode 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                } shadow-lg hover:shadow-xl`}
              >
                Start Comparing Models
              </button>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="px-6 py-16 border-t border-current border-opacity-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className={`text-2xl font-bold mb-6 transition-colors duration-200 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Still Having Issues?
            </h2>
            
            <p className={`text-lg mb-8 transition-colors duration-200 ${
              darkMode ? 'text-gray-300' : 'text-slate-600'
            }`}>
              Our support team is here to help resolve any payment or technical issues.
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
                onClick={() => window.open('mailto:support@aifiesta.com', '_blank')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                }`}
              >
                Email Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}