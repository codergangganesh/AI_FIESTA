'use client'

import { 
  XCircle, 
  RefreshCw, 
  Home,
  CreditCard,
  HelpCircle,
  Mail,
  X
} from 'lucide-react'
import { useDarkMode } from '@/contexts/DarkModeContext'

interface ActionOption {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  action: () => void
  color: string
}

interface PaymentCancelPopupProps {
  isOpen: boolean
  onClose: () => void
  onRetry: () => void
  onGoHome: () => void
  onContactSupport: () => void
}

export default function PaymentCancelPopup({
  isOpen,
  onClose,
  onRetry,
  onGoHome,
  onContactSupport
}: PaymentCancelPopupProps) {
  const { darkMode } = useDarkMode()

  const primaryOptions: ActionOption[] = [
    {
      title: 'Try Again',
      description: 'Retry payment',
      icon: RefreshCw,
      action: onRetry,
      color: 'blue'
    },
    {
      title: 'Home',
      description: 'Return to home',
      icon: Home,
      action: onGoHome,
      color: 'green'
    },
    {
      title: 'Support',
      description: 'Contact support',
      icon: HelpCircle,
      action: onContactSupport,
      color: 'purple'
    }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className={`relative max-w-md w-full rounded-2xl p-6 shadow-2xl transition-all duration-300 transform scale-100 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
          : 'bg-gradient-to-br from-white to-red-50 border border-slate-200'
      }`}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        >
          <X className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-slate-600'}`} />
        </button>

        {/* Cancel Icon */}
        <div className="flex justify-center mb-5">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
            <div className="relative bg-red-500 rounded-full p-4">
              <XCircle className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Cancel Message */}
        <div className="text-center mb-6">
          <h2 className={`text-xl font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Payment Cancelled
          </h2>
          
          <p className={`text-sm mb-4 ${
            darkMode ? 'text-gray-300' : 'text-slate-600'
          }`}>
            Your payment was not completed. No charges were made.
          </p>
        </div>

        {/* Primary Options */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {primaryOptions.map((option, index) => {
            const Icon = option.icon
            return (
              <button
                key={index}
                onClick={option.action}
                className={`p-3 rounded-xl transition-all duration-200 text-center hover:scale-[1.02] ${
                  darkMode 
                    ? 'bg-gray-700/50 hover:bg-gray-700 border border-gray-600' 
                    : 'bg-white hover:bg-slate-50 border border-slate-200 shadow-sm hover:shadow'
                }`}
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-2 ${
                  option.color === 'blue' 
                    ? (darkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-600')
                    : option.color === 'green'
                    ? (darkMode ? 'bg-green-600/20 text-green-400' : 'bg-green-100 text-green-600')
                    : (darkMode ? 'bg-purple-600/20 text-purple-400' : 'bg-purple-100 text-purple-600')
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <h3 className={`text-xs font-semibold mb-1 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {option.title}
                </h3>
                
                <p className={`text-[10px] ${
                  darkMode ? 'text-gray-400' : 'text-slate-600'
                }`}>
                  {option.description}
                </p>
              </button>
            )
          })}
        </div>

        {/* Support Section */}
        <div className={`p-4 rounded-xl text-center ${
          darkMode ? 'bg-gray-700/30' : 'bg-slate-100'
        }`}>
          <h3 className={`text-sm font-semibold mb-2 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Need Help?
          </h3>
          <p className={`text-xs mb-3 ${
            darkMode ? 'text-gray-300' : 'text-slate-600'
          }`}>
            Our support team is here to help.
          </p>
          <button
            onClick={onContactSupport}
            className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 text-xs"
          >
            <Mail className="w-3 h-3 mr-1" />
            Contact Support
          </button>
        </div>
      </div>
    </div>
  )
}