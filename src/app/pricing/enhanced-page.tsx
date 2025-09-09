'use client'

import { useState } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { usePlan } from '@/contexts/PlanContext'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/NotificationContext'
import AdvancedSidebar from '@/components/layout/AdvancedSidebar'
import { processPayment, formatPrice, calculateDiscount, PLAN_PRICES } from '@/lib/razorpay'
import {
  Check,
  X,
  Zap,
  Crown,
  Star,
  ArrowRight,
  CreditCard,
  Smartphone,
  Building,
  Loader2
} from 'lucide-react'

type BillingCycle = 'monthly' | 'yearly'

const planFeatures = [
  { name: 'Model Comparisons', free: '10/month', pro: '500/month', pro_plus: 'Unlimited' },
  { name: 'AI Models Access', free: '2 models', pro: '4 models', pro_plus: '6+ models' },
  { name: 'Storage', free: '1 GB', pro: '10 GB', pro_plus: '100 GB' },
  { name: 'API Calls', free: '100/month', pro: '5,000/month', pro_plus: '50,000/month' },
  { name: 'Export Options', free: false, pro: true, pro_plus: true },
  { name: 'Advanced Charts', free: false, pro: true, pro_plus: true },
  { name: 'Hyperparameter Tuning', free: false, pro: true, pro_plus: true },
  { name: 'Model Explainability', free: false, pro: false, pro_plus: true },
  { name: 'Custom Models', free: false, pro: false, pro_plus: true },
  { name: 'Priority Support', free: 'Community', pro: 'Email', pro_plus: '24/7 Priority' }
]

const paymentMethods = [
  { name: 'Credit/Debit Cards', icon: CreditCard },
  { name: 'UPI', icon: Smartphone },
  { name: 'Net Banking', icon: Building },
  { name: 'Wallets', icon: CreditCard }
]

export default function PricingPage() {
  const { darkMode } = useDarkMode()
  const { currentPlan, upgradePlan } = usePlan()
  const { user } = useAuth()
  const { success, error } = useToast()
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly')
  const [isProcessing, setIsProcessing] = useState<string | null>(null)

  const handlePlanUpgrade = async (planType: 'pro' | 'pro_plus') => {
    if (!user) {
      error('Authentication Required', 'Please log in to upgrade your plan')
      return
    }

    if (currentPlan?.type === planType) {
      success('Already Subscribed', `You're already on the ${planType.toUpperCase()} plan`)
      return
    }

    setIsProcessing(planType)

    const amount = billingCycle === 'yearly' 
      ? PLAN_PRICES[planType].yearly 
      : PLAN_PRICES[planType].monthly

    try {
      await processPayment(
        {
          planType,
          amount,
          currency: 'INR',
          billingCycle,
          userEmail: user.email || '',
          userName: user.user_metadata?.full_name || user.email?.split('@')[0] || ''
        },
        async (response) => {
          const upgradeSuccess = await upgradePlan(planType, response.razorpay_payment_id)
          if (upgradeSuccess) {
            success(
              'Payment Successful!', 
              `Welcome to ${planType.toUpperCase()}! Your plan has been upgraded.`
            )
          } else {
            error('Upgrade Failed', 'Payment was successful but plan upgrade failed. Please contact support.')
          }
          setIsProcessing(null)
        },
        (err) => {
          error(
            'Payment Failed', 
            err.message || 'Payment could not be processed. Please try again.'
          )
          setIsProcessing(null)
        }
      )
    } catch (err: any) {
      error('Payment Error', err.message || 'An unexpected error occurred')
      setIsProcessing(null)
    }
  }

  const renderFeature = (feature: any, planType: 'free' | 'pro' | 'pro_plus') => {
    const value = feature[planType]
    
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <X className="w-4 h-4 text-gray-400" />
      )
    }
    
    return (
      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
        {value}
      </span>
    )
  }

  const isPlanActive = (planType: string) => {
    return currentPlan?.type === planType
  }

  const discount = calculateDiscount(PLAN_PRICES.pro.monthly, PLAN_PRICES.pro.yearly)

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      <AdvancedSidebar />
      
      <div className="ml-16 lg:ml-72 transition-all duration-300">
        {/* Header */}
        <div className={`backdrop-blur-sm border-b transition-colors duration-200 ${
          darkMode 
            ? 'bg-gray-800/60 border-gray-700/30' 
            : 'bg-white/60 border-slate-200/30'
        }`}>
          <div className="px-6 py-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className={`text-4xl font-bold mb-4 transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Choose Your AI Platform Plan
              </h1>
              <p className={`text-lg mb-6 transition-colors duration-200 ${
                darkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>
                Unlock powerful AI model comparison tools with flexible pricing designed for the Indian market
              </p>
              
              {currentPlan && (
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                  darkMode 
                    ? 'bg-blue-900/30 text-blue-400 border border-blue-700/30'
                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                }`}>
                  <Crown className="w-4 h-4 mr-2" />
                  Current Plan: {currentPlan.type === 'free' ? 'Free Plan' : currentPlan.type === 'pro' ? 'Pro Plan' : 'Pro Plus Plan'}
                </div>
              )}
              
              {/* Billing Toggle */}
              <div className="flex items-center justify-center">
                <div className={`p-1 rounded-xl transition-colors duration-200 ${
                  darkMode ? 'bg-gray-700' : 'bg-slate-200'
                }`}>
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      billingCycle === 'monthly'
                        ? 'bg-blue-600 text-white shadow-md'
                        : darkMode
                          ? 'text-gray-300 hover:text-white'
                          : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      billingCycle === 'yearly'
                        ? 'bg-blue-600 text-white shadow-md'
                        : darkMode
                          ? 'text-gray-300 hover:text-white'
                          : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Yearly
                    <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                      Save {discount}%
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Free Plan */}
            <div className={`rounded-2xl p-8 transition-all duration-300 ${
              isPlanActive('free')
                ? darkMode
                  ? 'bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-2 border-green-500'
                  : 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-500'
                : darkMode
                  ? 'bg-gray-800/60 border border-gray-700/50 hover:scale-105'
                  : 'bg-white/80 border border-slate-200/50 hover:scale-105'
            }`}>
              {isPlanActive('free') && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Current Plan
                  </div>
                </div>
              )}
              
              <div className="text-center mb-8">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                  darkMode ? 'bg-gray-700' : 'bg-slate-100'
                }`}>
                  <Star className={`w-8 h-8 ${
                    darkMode ? 'text-gray-300' : 'text-slate-600'
                  }`} />
                </div>
                
                <h3 className={`text-2xl font-bold mb-2 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Free Plan
                </h3>
                
                <div className="mb-4">
                  <span className={`text-4xl font-bold ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    ₹0
                  </span>
                  <span className={`text-sm ml-2 ${
                    darkMode ? 'text-gray-400' : 'text-slate-600'
                  }`}>
                    Forever
                  </span>
                </div>
                
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-slate-600'
                }`}>
                  Perfect for getting started
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {planFeatures.slice(0, 6).map((feature, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-slate-600'
                    }`}>
                      {feature.name}
                    </span>
                    {renderFeature(feature, 'free')}
                  </div>
                ))}
              </div>

              <button 
                disabled={isPlanActive('free')}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                  isPlanActive('free')
                    ? 'bg-green-500 text-white cursor-not-allowed'
                    : darkMode
                      ? 'border-2 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white hover:bg-gray-700/50'
                      : 'border-2 border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {isPlanActive('free') ? 'Current Plan' : 'Get Started Free'}
              </button>
            </div>

            {/* Pro Plan */}
            <div className={`relative rounded-2xl p-8 transition-all duration-300 hover:scale-105 ${
              darkMode
                ? 'bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-2 border-blue-500 shadow-2xl'
                : 'bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-500 shadow-2xl'
            }`}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${
                  isPlanActive('pro')
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                }`}>
                  {isPlanActive('pro') ? 'Current Plan' : 'Most Popular'}
                </div>
              </div>
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                
                <h3 className={`text-2xl font-bold mb-2 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Pro Plan
                </h3>
                
                <div className="mb-4">
                  <span className={`text-4xl font-bold ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {formatPrice(billingCycle === 'yearly' ? PLAN_PRICES.pro.yearly : PLAN_PRICES.pro.monthly)}
                  </span>
                  {billingCycle === 'yearly' && (
                    <div className={`text-sm line-through ${
                      darkMode ? 'text-gray-500' : 'text-slate-400'
                    }`}>
                      {formatPrice(PLAN_PRICES.pro.monthly * 12)}
                    </div>
                  )}
                  <span className={`text-sm ml-2 ${
                    darkMode ? 'text-gray-400' : 'text-slate-600'
                  }`}>
                    per {billingCycle === 'yearly' ? 'year' : 'month'}
                  </span>
                </div>
                
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-slate-600'
                }`}>
                  Advanced features for professionals
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {planFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-slate-600'
                    }`}>
                      {feature.name}
                    </span>
                    {renderFeature(feature, 'pro')}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handlePlanUpgrade('pro')}
                disabled={isPlanActive('pro') || isProcessing === 'pro'}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
                  isPlanActive('pro')
                    ? 'bg-green-500 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {isProcessing === 'pro' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isPlanActive('pro') ? (
                  'Current Plan'
                ) : (
                  <>Upgrade to Pro <ArrowRight className="w-4 h-4 ml-2" /></>
                )}
              </button>
            </div>

            {/* Pro Plus Plan */}
            <div className={`rounded-2xl p-8 transition-all duration-300 hover:scale-105 ${
              isPlanActive('pro_plus')
                ? darkMode
                  ? 'bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border-2 border-yellow-500'
                  : 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-500'
                : darkMode
                  ? 'bg-gray-800/60 border border-gray-700/50'
                  : 'bg-white/80 border border-slate-200/50'
            }`}>
              {isPlanActive('pro_plus') && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Current Plan
                  </div>
                </div>
              )}
              
              <div className="text-center mb-8">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                  isPlanActive('pro_plus')
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                    : darkMode
                      ? 'bg-gray-700'
                      : 'bg-slate-100'
                }`}>
                  <Zap className={`w-8 h-8 ${
                    isPlanActive('pro_plus') ? 'text-white' : darkMode ? 'text-gray-300' : 'text-slate-600'
                  }`} />
                </div>
                
                <h3 className={`text-2xl font-bold mb-2 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Pro Plus Plan
                </h3>
                
                <div className="mb-4">
                  <span className={`text-4xl font-bold ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {formatPrice(billingCycle === 'yearly' ? PLAN_PRICES.pro_plus.yearly : PLAN_PRICES.pro_plus.monthly)}
                  </span>
                  {billingCycle === 'yearly' && (
                    <div className={`text-sm line-through ${
                      darkMode ? 'text-gray-500' : 'text-slate-400'
                    }`}>
                      {formatPrice(PLAN_PRICES.pro_plus.monthly * 12)}
                    </div>
                  )}
                  <span className={`text-sm ml-2 ${
                    darkMode ? 'text-gray-400' : 'text-slate-600'
                  }`}>
                    per {billingCycle === 'yearly' ? 'year' : 'month'}
                  </span>
                </div>
                
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-slate-600'
                }`}>
                  Complete AI platform solution
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {planFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-slate-600'
                    }`}>
                      {feature.name}
                    </span>
                    {renderFeature(feature, 'pro_plus')}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handlePlanUpgrade('pro_plus')}
                disabled={isPlanActive('pro_plus') || isProcessing === 'pro_plus'}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center ${
                  isPlanActive('pro_plus')
                    ? 'bg-green-500 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {isProcessing === 'pro_plus' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isPlanActive('pro_plus') ? (
                  'Current Plan'
                ) : (
                  <>Upgrade to Pro Plus <ArrowRight className="w-4 h-4 ml-2" /></>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="px-6 py-12 border-t border-current border-opacity-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className={`text-2xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Secure Payment Methods
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {paymentMethods.map((method, index) => {
                const Icon = method.icon
                return (
                  <div key={index} className={`p-4 rounded-xl border transition-colors duration-200 ${
                    darkMode 
                      ? 'bg-gray-800/60 border-gray-700/50' 
                      : 'bg-white/80 border-slate-200/50'
                  }`}>
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${
                      darkMode ? 'text-gray-400' : 'text-slate-600'
                    }`} />
                    <p className={`text-sm font-medium ${
                      darkMode ? 'text-gray-300' : 'text-slate-700'
                    }`}>
                      {method.name}
                    </p>
                  </div>
                )
              })}
            </div>
            
            <p className={`text-sm mt-6 ${
              darkMode ? 'text-gray-400' : 'text-slate-600'
            }`}>
              🔒 Payments are secured by Razorpay with 256-bit SSL encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}