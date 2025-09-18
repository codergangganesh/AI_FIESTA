'use client'

import { useState } from 'react'
import { 
  Check, 
  ArrowRight, 
  Star, 
  Crown, 
  Zap, 
  Shield, 
  Clock,
  Sparkles,
  CheckCircle
} from 'lucide-react'
import { useDarkMode } from '@/contexts/DarkModeContext'

interface ModernPaymentCardProps {
  plan: {
    id: 'pro' | 'pro_plus'
    name: string
    tagline: string
    popular?: boolean
    features: Array<{ text: string; icon?: React.ComponentType<{ className?: string }> }>
    limitations?: string[]
  }
  pricing: any
  billingCycle: 'monthly' | 'yearly'
  isProcessing: boolean
  isPlanActive: boolean
  onSubscribe: (planType: 'pro' | 'pro_plus') => void
}

export default function ModernPaymentCard({
  plan,
  pricing,
  billingCycle,
  isProcessing,
  isPlanActive,
  onSubscribe
}: ModernPaymentCardProps) {
  const { darkMode } = useDarkMode()
  const [isHovered, setIsHovered] = useState(false)
  
  // Add error handling for pricing data access
  let planPricing = { price: 'N/A', monthlyEquivalent: 'N/A', discount: 0 }
  try {
    planPricing = pricing[plan.id][billingCycle]
  } catch (error) {
    console.error('ModernPaymentCard: Error accessing pricing data', { plan, billingCycle, pricing, error })
  }

  return (
    <div
      className={`relative rounded-2xl p-5 transition-all duration-300 overflow-hidden transform hover:scale-[1.02] ${
        plan.popular
          ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg border-0'
          : darkMode
            ? 'bg-gray-800/60 border border-gray-700/50 hover:border-gray-600/50'
            : 'bg-white border border-slate-200 hover:border-slate-300 shadow-md hover:shadow-lg'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background for popular plan */}
      {plan.popular && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%]">
            <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-purple-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-blue-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          </div>
        </div>
      )}

      {/* Popular badge */}
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow flex items-center">
            <Sparkles className="w-3 h-3 mr-1" />
            Popular
          </div>
        </div>
      )}

      <div className="relative z-10">
        {/* Plan Header */}
        <div className="text-center mb-5 pt-6">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 ${
            plan.popular 
              ? 'bg-white/20' 
              : darkMode
                ? 'bg-gray-700'
                : 'bg-slate-100'
          }`}>
            {plan.id === 'pro' ? (
              <Crown className={`w-6 h-6 ${
                plan.popular ? 'text-white' : darkMode ? 'text-gray-300' : 'text-slate-600'
              }`} />
            ) : (
              <Zap className={`w-6 h-6 ${
                plan.popular ? 'text-white' : darkMode ? 'text-gray-300' : 'text-slate-600'
              }`} />
            )}
          </div>
          
          <h3 className={`text-lg font-bold mb-1 transition-colors duration-200 ${
            plan.popular ? 'text-white' : darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            {plan.name}
          </h3>
          
          <p className={`text-xs transition-colors duration-200 ${
            plan.popular ? 'text-white/80' : darkMode ? 'text-gray-400' : 'text-slate-600'
          }`}>
            {plan.tagline}
          </p>
        </div>

        {/* Pricing */}
        <div className="text-center mb-5">
          <div className="flex items-baseline justify-center">
            <span className={`text-2xl font-bold transition-colors duration-200 ${
              plan.popular ? 'text-white' : darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {billingCycle === 'yearly' ? (planPricing.monthlyEquivalent || 'N/A') : (planPricing.price || 'N/A')}
            </span>
            <span className={`ml-1 text-sm transition-colors duration-200 ${
              plan.popular ? 'text-white/80' : darkMode ? 'text-gray-400' : 'text-slate-600'
            }`}>
              /month
            </span>
          </div>
          
          {billingCycle === 'yearly' && planPricing.price && (
            <div className="mt-1">
              <p className={`text-xs transition-colors duration-200 ${
                plan.popular ? 'text-white/80' : darkMode ? 'text-gray-400' : 'text-slate-600'
              }`}>
                {planPricing.price} billed annually
              </p>
              <div className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500 text-white">
                <Clock className="w-2.5 h-2.5 mr-1" />
                Save {planPricing.discount || 0}%
              </div>
            </div>
          )}

          {/* Free Trial Badge */}
          <div className={`inline-flex items-center mt-3 px-2.5 py-1 rounded-full text-xs font-semibold ${
            plan.popular 
              ? 'bg-white/20 text-white' 
              : darkMode
                ? 'bg-blue-600/20 text-blue-400'
                : 'bg-blue-100 text-blue-700'
          }`}>
            <Shield className="w-3 h-3 mr-1" />
            7-day trial
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2.5 mb-5 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
          {plan.features.map((feature, index) => {
            const Icon = feature.icon || Check
            return (
              <div 
                key={index} 
                className="flex items-start space-x-2"
              >
                <div className={`flex-shrink-0 mt-0.5 ${
                  plan.popular ? 'text-emerald-300' : 'text-emerald-500'
                }`}>
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className={`text-xs transition-colors duration-200 ${
                  plan.popular ? 'text-white/90' : darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>
                  {feature.text}
                </span>
              </div>
            )
          })}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onSubscribe(plan.id)}
          disabled={isProcessing || isPlanActive}
          className={`w-full py-2.5 px-4 rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center transform hover:scale-[1.03] ${
            isPlanActive
              ? 'bg-emerald-500 text-white cursor-not-allowed'
              : plan.popular
                ? 'bg-white text-indigo-600 hover:bg-gray-100 shadow hover:shadow-md'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow hover:shadow-md'
          }`}
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : isPlanActive ? (
            <>
              <Check className="w-4 h-4 mr-1" />
              Current Plan
            </>
          ) : (
            <>
              Start Trial
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}