'use client'

import { 
  CheckCircle, 
  ArrowRight, 
  Home, 
  Settings, 
  BarChart3, 
  Crown,
  Sparkles,
  Rocket
} from 'lucide-react'
import { useDarkMode } from '@/contexts/DarkModeContext'

interface QuickAction {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  color: string
}

interface ModernPaymentSuccessProps {
  planType?: string
  onNavigate: (href: string) => void
}

const quickActions: QuickAction[] = [
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

export default function ModernPaymentSuccess({ 
  planType = 'Pro', 
  onNavigate 
}: ModernPaymentSuccessProps) {
  const { darkMode } = useDarkMode()

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className={`max-w-2xl w-full rounded-3xl p-8 md:p-12 shadow-2xl ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
          : 'bg-gradient-to-br from-white to-blue-50 border border-slate-200'
      }`}>
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
            <div className="relative bg-emerald-500 rounded-full p-5">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Payment Successful! 🎉
          </h1>
          
          <p className={`text-lg mb-6 ${
            darkMode ? 'text-gray-300' : 'text-slate-600'
          }`}>
            Congratulations! Your subscription has been activated successfully. 
            You now have access to all premium features.
          </p>

          {/* Plan Details */}
          <div className={`inline-flex items-center px-6 py-3 rounded-xl ${
            darkMode ? 'bg-blue-600/20 border border-blue-500/30' : 'bg-blue-100 border border-blue-200'
          }`}>
            <Crown className={`w-5 h-5 mr-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={`font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
              {planType?.replace('_', ' ').toUpperCase()} Plan Active
            </span>
          </div>

          {/* Trial Information */}
          <div className={`mt-6 p-5 rounded-xl ${
            darkMode ? 'bg-purple-600/20 border border-purple-500/30' : 'bg-purple-100 border border-purple-200'
          }`}>
            <div className="flex items-center justify-center mb-2">
              <Sparkles className={`w-5 h-5 mr-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>
                7-Day Free Trial Started
              </h3>
            </div>
            <p className={`text-sm ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
              You won't be charged until your trial period ends. Cancel anytime during the trial at no cost.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className={`text-xl font-bold text-center mb-6 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            What would you like to do next?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <button
                  key={index}
                  onClick={() => onNavigate(action.href)}
                  className={`p-5 rounded-2xl text-left transition-all duration-200 ${
                    darkMode 
                      ? 'bg-gray-700/50 hover:bg-gray-700 border border-gray-600' 
                      : 'bg-white hover:bg-slate-50 border border-slate-200 shadow-md hover:shadow-lg'
                  }`}
                >
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${
                    action.color === 'blue'
                      ? darkMode ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                      : action.color === 'green'
                        ? darkMode ? 'bg-green-600/20 text-green-400' : 'bg-green-100 text-green-600'
                        : darkMode ? 'bg-gray-600/20 text-gray-400' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <h3 className={`font-semibold mb-1 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {action.title}
                  </h3>
                  
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-slate-600'
                  }`}>
                    {action.description}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Get Started Button */}
        <div className="text-center">
          <button
            onClick={() => onNavigate('/model-comparison')}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
          >
            Get Started Now
            <Rocket className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  )
}