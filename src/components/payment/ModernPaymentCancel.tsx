'use client'

import { 
  XCircle, 
  RefreshCw, 
  Home,
  CreditCard,
  HelpCircle,
  Mail
} from 'lucide-react'
import { useDarkMode } from '@/contexts/DarkModeContext'

interface ActionOption {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  action: () => void
  color: string
}

interface ModernPaymentCancelProps {
  onRetry: () => void
  onGoHome: () => void
  onContactSupport: () => void
}

export default function ModernPaymentCancel({
  onRetry,
  onGoHome,
  onContactSupport
}: ModernPaymentCancelProps) {
  const { darkMode } = useDarkMode()

  const primaryOptions: ActionOption[] = [
    {
      title: 'Try Payment Again',
      description: 'Retry with the same payment method',
      icon: RefreshCw,
      action: onRetry,
      color: 'blue'
    },
    {
      title: 'Back to Dashboard',
      description: 'Continue using the free plan for now',
      icon: Home,
      action: onGoHome,
      color: 'green'
    },
    {
      title: 'Contact Support',
      description: 'Get help with your payment issue',
      icon: HelpCircle,
      action: onContactSupport,
      color: 'purple'
    }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className={`max-w-3xl w-full rounded-3xl p-8 md:p-12 shadow-2xl ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
          : 'bg-gradient-to-br from-white to-red-50 border border-slate-200'
      }`}>
        {/* Cancel Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
            <div className="relative bg-red-500 rounded-full p-5">
              <XCircle className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>

        {/* Cancel Message */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Payment Cancelled
          </h1>
          
          <p className={`text-lg mb-6 ${
            darkMode ? 'text-gray-300' : 'text-slate-600'
          }`}>
            Your payment was not completed. No charges were made to your account.
            Please choose one of the options below.
          </p>
        </div>

        {/* Primary Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {primaryOptions.map((option, index) => {
            const Icon = option.icon
            return (
              <button
                key={index}
                onClick={option.action}
                className={`p-6 rounded-2xl transition-all duration-200 text-left ${
                  darkMode 
                    ? 'bg-gray-700/50 hover:bg-gray-700 border border-gray-600' 
                    : 'bg-white hover:bg-slate-50 border border-slate-200 shadow-md hover:shadow-lg'
                }`}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                  option.color === 'blue' 
                    ? (darkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-600')
                    : option.color === 'green'
                    ? (darkMode ? 'bg-green-600/20 text-green-400' : 'bg-green-100 text-green-600')
                    : (darkMode ? 'bg-purple-600/20 text-purple-400' : 'bg-purple-100 text-purple-600')
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <h3 className={`text-lg font-semibold mb-2 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {option.title}
                </h3>
                
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-slate-600'
                }`}>
                  {option.description}
                </p>
              </button>
            )
          })}
        </div>

        {/* Support Section */}
        <div className={`p-6 rounded-2xl ${
          darkMode ? 'bg-gray-700/30' : 'bg-slate-100'
        }`}>
          <div className="text-center">
            <h3 className={`text-xl font-semibold mb-3 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Need Help?
            </h3>
            <p className={`mb-4 ${
              darkMode ? 'text-gray-300' : 'text-slate-600'
            }`}>
              Our support team is here to help you resolve payment issues.
            </p>
            <button
              onClick={onContactSupport}
              className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}