'use client'

import { useState } from 'react'
import { X, CreditCard, Shield, Check, Star, Zap, Crown, Sparkles } from 'lucide-react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { stripePromise, PLANS } from '@/lib/stripe'
import { subscriptionService } from '@/lib/subscription'

interface PaymentPopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function PaymentPopup({ isOpen, onClose }: PaymentPopupProps) {
  const { darkMode } = useDarkMode()
  const { user } = useAuth()
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [isProcessing, setIsProcessing] = useState(false)

  if (!isOpen) return null

  const plans = [
    {
      id: 'free',
      name: PLANS.FREE.name,
      price: `$${PLANS.FREE.price}`,
      period: 'forever',
      description: 'Perfect for getting started',
      features: PLANS.FREE.features,
      icon: Star,
      color: 'from-gray-400 to-gray-600',
      popular: false
    },
    {
      id: 'pro',
      name: PLANS.PRO.name,
      price: `$${PLANS.PRO.price}`,
      period: 'month',
      description: 'For power users and professionals',
      features: PLANS.PRO.features,
      icon: Zap,
      color: 'from-blue-500 to-purple-600',
      popular: true
    },
    {
      id: 'enterprise',
      name: PLANS.ENTERPRISE.name,
      price: `$${PLANS.ENTERPRISE.price}`,
      period: 'month',
      description: 'For teams and organizations',
      features: PLANS.ENTERPRISE.features,
      icon: Crown,
      color: 'from-purple-600 to-pink-600',
      popular: false
    }
  ]

  const handlePlanSelect = async (planId: string) => {
    if (planId === 'free') {
      // Redirect to compare page for free users
      if (user) {
        router.push('/compare')
      } else {
        router.push('/auth')
      }
      onClose()
      return
    }

    if (!user) {
      router.push('/auth')
      onClose()
      return
    }

    setIsProcessing(true)
    
    try {
      const plan = PLANS[planId.toUpperCase() as keyof typeof PLANS]
      
      if (!plan || !plan.priceId) {
        throw new Error('Invalid plan selected')
      }

      // Create Stripe checkout session
      const sessionId = await subscriptionService.createCheckoutSession(
        plan.priceId,
        user.id,
        user.email
      )

      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: sessionId,
        })

        if (error) {
          throw new Error(error.message)
        }
      }
    } catch (error) {
      console.error('Payment failed:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl ${
        darkMode 
          ? 'bg-gray-900/95 border-gray-700' 
          : 'bg-white/95 border-gray-200'
      }`}>
        {/* Header */}
        <div className={`sticky top-0 p-6 border-b backdrop-blur-md ${
          darkMode ? 'border-gray-700 bg-gray-900/80' : 'border-gray-200 bg-white/80'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Choose Your Plan
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Unlock the full potential of AI Fiesta
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors ${
                darkMode 
                  ? 'hover:bg-gray-800 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan) => {
              const Icon = plan.icon
              const isSelected = selectedPlan === plan.id
              
              return (
                <div
                  key={plan.id}
                  className={`relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? darkMode
                        ? 'border-blue-500 bg-blue-500/10 shadow-lg scale-105'
                        : 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                      : darkMode
                        ? 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold">
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {plan.name}
                    </h3>
                    
                    <div className="mb-4">
                      <span className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {plan.price}
                      </span>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        /{plan.period}
                      </span>
                    </div>
                    
                    <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {plan.description}
                    </p>
                    
                    <ul className="space-y-3 text-left">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <Check className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Payment Section */}
          <div className={`p-6 rounded-2xl border ${
            darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Secure Payment
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Powered by Stripe - Your payment information is secure
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                <span className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  SSL Secured
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-white'} border ${
                  darkMode ? 'border-gray-600' : 'border-gray-200'
                }`}>
                  <CreditCard className={`w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                </div>
                <div>
                  <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {plans.find(p => p.id === selectedPlan)?.name} Plan
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {plans.find(p => p.id === selectedPlan)?.price}/{plans.find(p => p.id === selectedPlan)?.period}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => handlePlanSelect(selectedPlan)}
                disabled={isProcessing}
                className={`px-8 py-3 rounded-xl font-bold text-white transition-all duration-300 ${
                  isProcessing
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  selectedPlan === 'free' ? 'Get Started Free' : 'Subscribe Now'
                )}
              </button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-6 text-center">
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              🔒 Your payment is processed securely by Stripe. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
