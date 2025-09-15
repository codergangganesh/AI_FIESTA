'use client'

import { useState, useEffect } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/NotificationContext'
import { usePlan } from '@/contexts/PlanContext'
import AdvancedSidebar from '@/components/layout/AdvancedSidebar'
import { createStripeCheckout, getFormattedPricing, redirectToCheckout } from '@/lib/stripe'
import { 
  Star, 
  Crown, 
  Zap, 
  Check, 
  ArrowRight, 
  Shield, 
  Clock, 
  CreditCard, 
  Smartphone, 
  Building, 
  Loader2,
  Sparkles,
  TrendingUp,
  Users,
  BarChart3,
  Database,
  GitCompare,
  Globe,
  Headphones
} from 'lucide-react'

interface PlanFeature {
  text: string
  icon?: React.ComponentType<{ className?: string }>
}

interface PricingPlan {
  id: 'pro' | 'pro_plus'
  name: string
  tagline: string
  popular?: boolean
  features: PlanFeature[]
  limitations?: string[]
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Perfect for professionals and small teams',
    features: [
      { text: 'Access to 4 AI models', icon: Users },
      { text: '500 comparisons per month', icon: BarChart3 },
      { text: '10 GB storage', icon: Database },
      { text: '5,000 API calls per month', icon: Globe },
      { text: 'Advanced metrics & analytics', icon: TrendingUp },
      { text: 'Export results (CSV, JSON)', icon: GitCompare },
      { text: 'Email support', icon: Headphones },
    ]
  },
  {
    id: 'pro_plus',
    name: 'Pro Plus',
    tagline: 'For enterprises and power users',
    popular: true,
    features: [
      { text: 'Access to 6+ AI models', icon: Users },
      { text: 'Unlimited comparisons', icon: BarChart3 },
      { text: '100 GB storage', icon: Database },
      { text: '50,000 API calls per month', icon: Globe },
      { text: 'Advanced metrics & analytics', icon: TrendingUp },
      { text: 'Export results (All formats)', icon: GitCompare },
      { text: 'Model explainability', icon: Zap },
      { text: 'Custom models', icon: Crown },
      { text: '24/7 priority support', icon: Headphones },
    ]
  }
]

const paymentMethods = [
  { name: 'Credit/Debit Cards', icon: CreditCard },
  { name: 'UPI', icon: Smartphone },
  { name: 'Net Banking', icon: Building },
  { name: 'Digital Wallets', icon: CreditCard }
]

export default function PaymentPage() {
  const { darkMode } = useDarkMode()
  const { user } = useAuth()
  const { success, error } = useToast()
  const { currentPlan } = usePlan()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly')
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const [pricing, setPricing] = useState<any>(null)

  useEffect(() => {
    const formattedPricing = getFormattedPricing()
    setPricing(formattedPricing)
  }, [])

  const handleSubscribe = async (planType: 'pro' | 'pro_plus') => {
    if (!user) {
      error('Authentication Required', 'Please log in to subscribe to a plan')
      return
    }

    if (currentPlan?.type === planType) {
      success('Already Subscribed', `You're already on the ${planType.toUpperCase()} plan`)
      return
    }

    setIsProcessing(planType)

    try {
      const checkoutData = await createStripeCheckout({
        planType,
        billingCycle,
        amount: pricing[planType][billingCycle].amount,
        currency: 'INR',
        userEmail: user.email || '',
        userName: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
        trialDays: 7
      })

      // Redirect to Stripe checkout
      await redirectToCheckout(checkoutData.sessionId)
    } catch (err) {
      console.error('Payment error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Payment failed. Please try again.'
      error('Payment Error', errorMessage)
    } finally {
      setIsProcessing(null)
    }
  }

  const isPlanActive = (planType: string) => {
    return currentPlan?.type === planType
  }

  if (!pricing) {
    return (
      <div className="flex h-screen">
        <AdvancedSidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
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
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className={`absolute inset-0 ${
            darkMode 
              ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black' 
              : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
          }`} />
          
          <div className="relative px-6 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center mb-6">
                <div className={`p-3 rounded-2xl ${
                  darkMode ? 'bg-blue-600/20' : 'bg-blue-100'
                }`}>
                  <Sparkles className={`w-8 h-8 ${
                    darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                </div>
              </div>
              
              <h1 className={`text-4xl md:text-5xl font-bold mb-6 transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Choose Your Perfect Plan
              </h1>
              
              <p className={`text-lg md:text-xl max-w-2xl mx-auto transition-colors duration-200 ${
                darkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>
                Unlock the full potential of AI model comparison with our professional plans. 
                Start with a 7-day free trial and experience the difference.
              </p>

              {/* Billing Toggle */}
              <div className="mt-12 flex items-center justify-center">
                <div className={`p-1 rounded-xl transition-colors duration-200 ${
                  darkMode ? 'bg-gray-700' : 'bg-slate-200'
                }`}>
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      billingCycle === 'monthly'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : darkMode
                          ? 'text-gray-300 hover:text-white'
                          : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      billingCycle === 'yearly'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : darkMode
                          ? 'text-gray-300 hover:text-white'
                          : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Yearly
                    <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                      Save {pricing.pro.yearly.discount}%
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => {
              const planPricing = pricing[plan.id][billingCycle]
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl p-8 transition-all duration-300 hover:scale-105 ${
                    plan.popular
                      ? darkMode
                        ? 'bg-gradient-to-br from-blue-600 to-purple-700 text-white shadow-2xl'
                        : 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl'
                      : darkMode
                        ? 'bg-gray-800/60 border border-gray-700/50 hover:border-gray-600/50'
                        : 'bg-white border border-slate-200 hover:border-slate-300 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                        🔥 Most Popular
                      </div>
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                      plan.popular 
                        ? 'bg-white/20' 
                        : darkMode
                          ? 'bg-gray-700'
                          : 'bg-slate-100'
                    }`}>
                      {plan.id === 'pro' ? (
                        <Crown className={`w-8 h-8 ${
                          plan.popular ? 'text-white' : darkMode ? 'text-gray-300' : 'text-slate-600'
                        }`} />
                      ) : (
                        <Zap className={`w-8 h-8 ${
                          plan.popular ? 'text-white' : darkMode ? 'text-gray-300' : 'text-slate-600'
                        }`} />
                      )}
                    </div>
                    
                    <h3 className={`text-3xl font-bold mb-2 transition-colors duration-200 ${
                      plan.popular ? 'text-white' : darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {plan.name}
                    </h3>
                    
                    <p className={`text-sm transition-colors duration-200 ${
                      plan.popular ? 'text-white/80' : darkMode ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center">
                      <span className={`text-5xl font-bold transition-colors duration-200 ${
                        plan.popular ? 'text-white' : darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {billingCycle === 'yearly' ? planPricing.monthlyEquivalent : planPricing.price}
                      </span>
                      <span className={`ml-2 text-lg transition-colors duration-200 ${
                        plan.popular ? 'text-white/80' : darkMode ? 'text-gray-400' : 'text-slate-600'
                      }`}>
                        /month
                      </span>
                    </div>
                    
                    {billingCycle === 'yearly' && (
                      <div className="mt-2">
                        <p className={`text-sm transition-colors duration-200 ${
                          plan.popular ? 'text-white/80' : darkMode ? 'text-gray-400' : 'text-slate-600'
                        }`}>
                          {planPricing.price} billed annually
                        </p>
                        <div className="inline-flex items-center mt-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white">
                          <Clock className="w-3 h-3 mr-1" />
                          Save {planPricing.discount}% yearly
                        </div>
                      </div>
                    )}

                    {/* Free Trial Badge */}
                    <div className={`inline-flex items-center mt-4 px-4 py-2 rounded-full text-sm font-semibold ${
                      plan.popular 
                        ? 'bg-white/20 text-white' 
                        : darkMode
                          ? 'bg-blue-600/20 text-blue-400'
                          : 'bg-blue-100 text-blue-700'
                    }`}>
                      <Shield className="w-4 h-4 mr-2" />
                      7-day free trial included
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => {
                      const Icon = feature.icon || Check
                      return (
                        <div key={index} className="flex items-start space-x-3">
                          <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                            plan.popular ? 'text-white' : 'text-green-500'
                          }`} />
                          <span className={`text-sm transition-colors duration-200 ${
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
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isProcessing === plan.id || isPlanActive(plan.id)}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center ${
                      isPlanActive(plan.id)
                        ? 'bg-green-500 text-white cursor-not-allowed'
                        : plan.popular
                          ? 'bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isProcessing === plan.id ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : isPlanActive(plan.id) ? (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Current Plan
                      </>
                    ) : (
                      <>
                        Start Free Trial
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="px-6 py-16 border-t border-current border-opacity-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className={`text-3xl font-bold mb-8 transition-colors duration-200 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Secure Payment Methods
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {paymentMethods.map((method, index) => {
                const Icon = method.icon
                return (
                  <div key={index} className={`p-6 rounded-xl border transition-all duration-200 hover:scale-105 ${
                    darkMode 
                      ? 'bg-gray-800/60 border-gray-700/50 hover:border-gray-600/50' 
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-lg hover:shadow-xl'
                  }`}>
                    <Icon className={`w-10 h-10 mx-auto mb-3 ${
                      darkMode ? 'text-gray-400' : 'text-slate-600'
                    }`} />
                    <p className={`text-sm font-semibold ${
                      darkMode ? 'text-gray-300' : 'text-slate-700'
                    }`}>
                      {method.name}
                    </p>
                  </div>
                )
              })}
            </div>
            
            <div className={`mt-12 p-6 rounded-xl ${
              darkMode ? 'bg-gray-800/60' : 'bg-slate-100'
            }`}>
              <div className="flex items-center justify-center mb-4">
                <Shield className={`w-6 h-6 mr-2 ${
                  darkMode ? 'text-green-400' : 'text-green-600'
                }`} />
                <h3 className={`text-lg font-semibold ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Secure & Trusted
                </h3>
              </div>
              <p className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-slate-600'
              }`}>
                🔒 All payments are secured by Stripe with 256-bit SSL encryption. 
                Your payment information is never stored on our servers.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="px-6 py-16 border-t border-current border-opacity-10">
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-3xl font-bold text-center mb-12 transition-colors duration-200 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              {[
                {
                  question: "How does the 7-day free trial work?",
                  answer: "Start using any paid plan immediately with full access to all features. You won't be charged until the trial period ends. Cancel anytime during the trial at no cost."
                },
                {
                  question: "Can I switch between plans?",
                  answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges accordingly."
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards, UPI, net banking, and popular digital wallets in India through our secure Stripe integration."
                },
                {
                  question: "Can I cancel my subscription anytime?",
                  answer: "Absolutely! You can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your billing period."
                },
                {
                  question: "Do you offer refunds?",
                  answer: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with our service. Contact our support team for assistance."
                }
              ].map((faq, index) => (
                <div key={index} className={`p-6 rounded-xl transition-colors duration-200 ${
                  darkMode ? 'bg-gray-800/60' : 'bg-white border border-slate-200'
                }`}>
                  <h3 className={`text-lg font-semibold mb-3 transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {faq.question}
                  </h3>
                  <p className={`transition-colors duration-200 ${
                    darkMode ? 'text-gray-300' : 'text-slate-600'
                  }`}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}