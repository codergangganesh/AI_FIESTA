'use client'

import { useState, useEffect } from 'react'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { usePlan } from '@/contexts/PlanContext'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/NotificationContext'
import AdvancedSidebar from '@/components/layout/AdvancedSidebar'
import { createStripeCheckout, getFormattedPricing, redirectToCheckout } from '@/lib/stripe'
import { Star, Crown, Zap, ArrowRight, Shield, Headphones, Globe, Users, BarChart3, Database, GitCompare, Loader2, Check } from 'lucide-react'

interface PricingPlan {
  id: string
  name: string
  price: string
  originalPrice?: string
  period: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  features: string[]
  limitations?: string[]
  popular?: boolean
  buttonText: string
  buttonStyle: string
}

export default function PricingPage() {
  const { darkMode } = useDarkMode()
  const { currentPlan, upgradePlan } = usePlan()
  const { user } = useAuth()
  const { success, error } = useToast()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual')
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const [pricing, setPricing] = useState<any>(null)

  useEffect(() => {
    const formattedPricing = getFormattedPricing()
    setPricing(formattedPricing)
  }, [])

  const handlePlanUpgrade = async (planType: 'pro' | 'pro_plus') => {
    if (!user) {
      error('Authentication Required', 'Please log in to upgrade your plan')
      return
    }

    if (currentPlan?.type === planType) {
      success('Already Subscribed', `You're already on the ${planType.toUpperCase()} plan`)
      return
    }

    if (!pricing) {
      error('Pricing Error', 'Pricing information is not loaded yet. Please try again.')
      return
    }

    setIsProcessing(planType)

    try {
      const checkoutData = await createStripeCheckout({
        planType,
        billingCycle: billingCycle === 'annual' ? 'yearly' : 'monthly',
        amount: pricing[planType][billingCycle === 'annual' ? 'yearly' : 'monthly'].amount,
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
      setIsProcessing(null)
    }
  }

  const isPlanActive = (planType: string) => {
    return currentPlan?.type === planType
  }

  const getCurrentPlanName = () => {
    if (!currentPlan) return null
    switch (currentPlan.type) {
      case 'free': return 'Free Plan'
      case 'pro': return 'Pro Plan'
      case 'pro_plus': return 'Pro Plus Plan'
      default: return null
    }
  }

  // Wait for pricing data to load
  if (!pricing) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
          : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
      }`}>
        <AdvancedSidebar />
        <div className="ml-16 lg:ml-72 transition-all duration-300 flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  const plans: PricingPlan[] = [
    {
      id: 'free',
      name: 'Free Plan',
      price: '₹0',
      period: 'Forever',
      description: 'Perfect for getting started with AI model comparison',
      icon: Star,
      features: [
        'Access to 2 AI models',
        '10 comparisons per month',
        'Basic metrics & analytics',
        'Export results (CSV)',
        'Community support',
        'Basic visualization charts'
      ],
      limitations: [
        'Limited to GPT-3.5 and Claude-2',
        'No advanced analytics',
        'No priority support'
      ],
      buttonText: 'Get Started Free',
      buttonStyle: 'border'
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: billingCycle === 'monthly' 
        ? pricing.pro.monthly.price
        : pricing.pro.yearly.price,
      originalPrice: billingCycle === 'annual' 
        ? pricing.pro.monthly.price.replace('₹', '₹') 
        : undefined,
      period: billingCycle === 'monthly' ? 'per month' : 'per year',
      description: 'Advanced features for serious AI researchers and developers',
      icon: Crown,
      popular: true,
      features: [
        'Access to 4 premium models',
        '500 comparisons per month',
        'Advanced comparison metrics',
        'Hyperparameter tuning tools',
        'Dataset analysis & EDA',
        'Priority customer support',
        'Advanced visualizations',
        'Export reports (PDF/Excel)',
        'API access (5,000 calls/month)'
      ],
      buttonText: isPlanActive('pro') ? 'Current Plan' : 'Upgrade to Pro',
      buttonStyle: 'primary'
    },
    {
      id: 'pro-plus',
      name: 'Pro Plus Plan',
      price: billingCycle === 'monthly' 
        ? pricing.pro_plus.monthly.price
        : pricing.pro_plus.yearly.price,
      originalPrice: billingCycle === 'annual' 
        ? pricing.pro_plus.monthly.price.replace('₹', '₹') 
        : undefined,
      period: billingCycle === 'monthly' ? 'per month' : 'per year',
      description: 'Complete AI platform with enterprise-grade features',
      icon: Zap,
      features: [
        'Access to ALL AI models (6+)',
        'Unlimited comparisons & analytics',
        'Advanced AutoML capabilities',
        'SHAP/LIME explainability',
        'Custom model integration',
        'Priority support (24/7)',
        'Dedicated account manager',
        'API access (50,000 calls/month)',
        'Team collaboration',
        'Custom integrations & webhooks'
      ],
      buttonText: isPlanActive('pro_plus') ? 'Current Plan' : 'Upgrade to Pro Plus',
      buttonStyle: 'premium'
    }
  ]

  const features = [
    {
      icon: GitCompare,
      title: 'Model Comparison',
      description: 'Compare multiple AI models side-by-side with detailed metrics'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Deep insights with confusion matrices, ROC curves, and more'
    },
    {
      icon: Database,
      title: 'Dataset Analysis',
      description: 'Automatic EDA with correlation analysis and feature importance'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'SOC 2 compliant with end-to-end encryption'
    },
    {
      icon: Globe,
      title: 'Global API',
      description: 'Fast, reliable API with 99.9% uptime guarantee'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Expert support team available around the clock'
    }
  ]

  const getButtonClasses = (style: string) => {
    switch (style) {
      case 'primary':
        return 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
      case 'premium':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl'
      case 'border':
      default:
        return darkMode 
          ? 'border-2 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white hover:bg-gray-700/50'
          : 'border-2 border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 hover:bg-slate-50'
    }
  }

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
            <div className="text-center max-w-3xl mx-auto">
              <h1 className={`text-4xl font-bold mb-4 transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Choose Your AI Platform Plan
              </h1>
              <p className={`text-lg transition-colors duration-200 ${
                darkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>
                Unlock powerful AI model comparison tools with flexible pricing designed for Indian market
              </p>
              
              {currentPlan && (
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mt-4 mb-2 ${
                  darkMode 
                    ? 'bg-blue-900/30 text-blue-400 border border-blue-700/30'
                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                }`}>
                  <Crown className="w-4 h-4 mr-2" />
                  Current Plan: {getCurrentPlanName()}
                </div>
              )}
              
              {/* Billing Toggle */}
              <div className="mt-8 flex items-center justify-center">
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
                    onClick={() => setBillingCycle('annual')}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      billingCycle === 'annual'
                        ? 'bg-blue-600 text-white shadow-md'
                        : darkMode
                          ? 'text-gray-300 hover:text-white'
                          : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Annual
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
        <div className="px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan) => {
              const Icon = plan.icon
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl p-8 transition-all duration-300 hover:scale-105 ${
                    plan.popular
                      ? darkMode
                        ? 'bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-2 border-blue-500 shadow-2xl'
                        : 'bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-500 shadow-2xl'
                      : darkMode
                        ? 'bg-gray-800/60 border border-gray-700/50'
                        : 'bg-white/80 border border-slate-200/50'
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                        Most Popular
                      </div>
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                        : darkMode
                          ? 'bg-gray-700'
                          : 'bg-slate-100'
                    }`}>
                      <Icon className={`w-8 h-8 ${
                        plan.popular ? 'text-white' : darkMode ? 'text-gray-300' : 'text-slate-600'
                      }`} />
                    </div>
                    
                    <h3 className={`text-2xl font-bold mb-2 transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {plan.name}
                    </h3>
                    
                    <p className={`text-sm transition-colors duration-200 ${
                      darkMode ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      {plan.description}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center">
                      <span className={`text-4xl font-bold transition-colors duration-200 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {plan.price}
                      </span>
                      {plan.originalPrice && (
                        <span className={`ml-2 text-lg line-through transition-colors duration-200 ${
                          darkMode ? 'text-gray-500' : 'text-slate-400'
                        }`}>
                          {plan.originalPrice}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm mt-1 transition-colors duration-200 ${
                      darkMode ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      {plan.period}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className={`text-sm transition-colors duration-200 ${
                          darkMode ? 'text-gray-300' : 'text-slate-600'
                        }`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                    
                    {/* Limitations */}
                    {plan.limitations && plan.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-start space-x-3 opacity-60">
                        <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                          <div className={`w-1 h-3 mx-auto rounded-full ${
                            darkMode ? 'bg-gray-500' : 'bg-slate-400'
                          }`} />
                        </div>
                        <span className={`text-sm transition-colors duration-200 ${
                          darkMode ? 'text-gray-500' : 'text-slate-500'
                        }`}>
                          {limitation}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button 
                    onClick={() => {
                      if (plan.id === 'free') {
                        // Free plan - redirect to dashboard or signup
                        return
                      } else if (plan.id === 'pro') {
                        handlePlanUpgrade('pro')
                      } else if (plan.id === 'pro-plus') {
                        handlePlanUpgrade('pro_plus')
                      }
                    }}
                    disabled={isPlanActive(plan.id) || isProcessing === plan.id.replace('-', '_')}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center ${
                      isPlanActive(plan.id)
                        ? 'opacity-50 cursor-not-allowed'
                        : isProcessing === plan.id.replace('-', '_')
                          ? 'opacity-75 cursor-wait'
                          : ''
                    } ${getButtonClasses(plan.buttonStyle)}`}
                  >
                    {isProcessing === plan.id.replace('-', '_') ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {plan.buttonText}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Features Section */}
        <div className="px-6 py-12 border-t border-current border-opacity-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className={`text-3xl font-bold mb-4 transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Why Choose AI Fiesta?
              </h2>
              <p className={`text-lg transition-colors duration-200 ${
                darkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>
                Powerful features designed for Indian AI developers and researchers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={index}
                    className={`p-6 rounded-2xl transition-colors duration-200 ${
                      darkMode 
                        ? 'bg-gray-800/60 border border-gray-700/50' 
                        : 'bg-white/80 border border-slate-200/50'
                    }`}
                  >
                    <div className={`w-12 h-12 mb-4 rounded-xl flex items-center justify-center ${
                      darkMode ? 'bg-blue-600' : 'bg-blue-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        darkMode ? 'text-white' : 'text-blue-600'
                      }`} />
                    </div>
                    
                    <h3 className={`text-lg font-semibold mb-2 transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {feature.title}
                    </h3>
                    
                    <p className={`text-sm transition-colors duration-200 ${
                      darkMode ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      {feature.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="px-6 py-12 border-t border-current border-opacity-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className={`text-3xl font-bold mb-4 transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Frequently Asked Questions
              </h2>
              <p className={`text-lg transition-colors duration-200 ${
                darkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>
                Everything you need to know about AI Fiesta
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {[
                {
                  question: "Can I switch between plans?",
                  answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges."
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards, UPI, net banking, and digital wallets popular in India through Stripe."
                },
                {
                  question: "Is there a free trial for paid plans?",
                  answer: "Yes, we offer a 7-day free trial for both Pro and Pro Plus plans. No credit card required to start."
                },
                {
                  question: "What happens if I exceed my API limits?",
                  answer: "Your service won't be interrupted. We'll notify you and you can upgrade your plan or purchase additional API calls."
                },
                {
                  question: "How secure is my data?",
                  answer: "We use industry-standard encryption and security practices to protect your data. All communications are encrypted in transit and at rest."
                },
                {
                  question: "Can I cancel my subscription anytime?",
                  answer: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
                },
                {
                  question: "Do you offer refunds?",
                  answer: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with our service. Contact our support team for assistance."
                },
                {
                  question: "How many AI models can I compare at once?",
                  answer: "The Free plan allows you to compare up to 2 models, Pro allows 4 models, and Pro Plus gives you access to all 9+ models simultaneously."
                },
                {
                  question: "Is there a mobile app?",
                  answer: "AI Fiesta is a web-based platform that works perfectly on mobile browsers. We're also working on dedicated mobile apps for iOS and Android."
                },
                {
                  question: "How often are new models added?",
                  answer: "We add new AI models regularly as they become available. Our team actively monitors the AI landscape for the latest advancements."
                },
                {
                  question: "Can I export my comparison results?",
                  answer: "Yes, all plans include export functionality. You can export your results in various formats including PDF, CSV, and JSON."
                },
                {
                  question: "Do you offer enterprise plans?",
                  answer: "Yes, we offer custom enterprise plans with additional features like team collaboration, custom integrations, and dedicated support. Contact our sales team for more information."
                }
              ].map((faq, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                    darkMode 
                      ? 'bg-gray-800/60 border border-gray-700/50 hover:border-blue-500/30 hover:shadow-xl' 
                      : 'bg-white/80 border border-slate-200/50 hover:border-blue-300/50 hover:shadow-xl'
                  }`}
                >
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

            {/* Ask Your Own Question */}
            <div className={`p-8 rounded-2xl text-center ${
              darkMode 
                ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-700/30' 
                : 'bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200'
            }`}>
              <h3 className={`text-2xl font-bold mb-4 transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Have More Questions?
              </h3>
              <p className={`text-lg mb-6 transition-colors duration-200 ${
                darkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>
                Can't find what you're looking for? Ask us anything!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <input
                  type="text"
                  placeholder="Type your question here..."
                  className={`px-6 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 w-full sm:w-96 max-w-full ${
                    darkMode
                      ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-500'
                  }`}
                />
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg">
                  Ask Question
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}