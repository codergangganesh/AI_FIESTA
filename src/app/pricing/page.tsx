'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { usePlan } from '@/contexts/PlanContext'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/NotificationContext'
import { usePopup } from '@/contexts/PopupContext'
import AdvancedSidebar from '@/components/layout/AdvancedSidebar'
import { createStripeCheckout, getFormattedPricing, redirectToCheckout } from '@/lib/stripe'
import { 
  Star, 
  Crown, 
  Zap, 
  ArrowRight, 
  Shield, 
  Headphones, 
  Globe, 
  BarChart3, 
  Database, 
  GitCompare, 
  Loader2, 
  Check,
  Sparkles,
  CheckCircle,
  Clock,
  TrendingUp,
  Rocket,
  Award,
  CreditCard
} from 'lucide-react'

interface PricingPlan {
  id: string
  name: string
  tagline: string
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
  const router = useRouter()
  const { darkMode } = useDarkMode()
  const { plan: currentPlan, refreshPlan } = usePlan()
  const { user } = useAuth()
  const { success, error } = useToast()
  const { openPaymentPopup } = usePopup()
  
  console.log('PricingPage component rendered', { currentPlan, user })
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual')
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const [pricing, setPricing] = useState<any>(null)
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)

  useEffect(() => {
    try {
      const formattedPricing = getFormattedPricing()
      setPricing(formattedPricing)
    } catch (error) {
      console.error('PricingPage: Error getting formatted pricing', error)
      // Set fallback pricing data
      setPricing({
        pro: {
          monthly: { price: '₹699', amount: 69900 },
          yearly: { price: '₹6,990', amount: 699000, monthlyEquivalent: '₹582.50', discount: 16 }
        },
        pro_plus: {
          monthly: { price: '₹1,299', amount: 129900 },
          yearly: { price: '₹12,990', amount: 1299000, monthlyEquivalent: '₹1,082.50', discount: 16 }
        }
      })
    }
  }, [])

  const handlePlanUpgrade = async (planType: 'pro' | 'pro_plus') => {
    if (!user) {
      error('Authentication Required', 'Please log in to upgrade your plan')
      return
    }

    if (currentPlan === planType) {
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
    // Handle the plan ID mapping
    if (planType === 'pro-plus') {
      return currentPlan === 'pro_plus'
    }
    return currentPlan === planType
  }

  const getCurrentPlanName = () => {
    if (!currentPlan) return null
    switch (currentPlan) {
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
      name: 'Starter',
      tagline: 'Perfect for getting started',
      price: '₹0',
      period: 'Forever',
      description: 'Begin your AI journey with essential tools',
      icon: Star,
      features: [
        'Access to 3 AI models',
        '10 comparisons per month',
        'Basic metrics & analytics',
        'Export results (CSV)',
        'Community support'
      ],
      limitations: [
        'Limited to basic models',
        'No advanced analytics',
        'No priority support'
      ],
      buttonText: 'Get Started',
      buttonStyle: 'border'
    },
    {
      id: 'pro',
      name: 'Professional',
      tagline: 'For serious AI practitioners',
      price: billingCycle === 'monthly' 
        ? pricing.pro.monthly.price
        : pricing.pro.yearly.price,
      originalPrice: billingCycle === 'annual' 
        ? pricing.pro.monthly.price.replace('₹', '₹') 
        : undefined,
      period: billingCycle === 'monthly' ? 'per month' : 'per year',
      description: 'Advanced tools for professionals and teams',
      icon: Crown,
      popular: true,
      features: [
        'Access to 6 premium models',
        '500 comparisons per month',
        'Advanced comparison metrics',
        'Export reports (PDF/Excel)',
        'API access (5,000 calls/month)'
      ],
      buttonText: isPlanActive('pro') ? 'Current Plan' : 'Choose Plan',
      buttonStyle: 'primary'
    },
    {
      id: 'pro_plus',
      name: 'Enterprise',
      tagline: 'Complete AI platform solution',
      price: billingCycle === 'monthly' 
        ? pricing.pro_plus.monthly.price
        : pricing.pro_plus.yearly.price,
      originalPrice: billingCycle === 'annual' 
        ? pricing.pro_plus.monthly.price.replace('₹', '₹') 
        : undefined,
      period: billingCycle === 'monthly' ? 'per month' : 'per year',
      description: 'Enterprise-grade features for organizations',
      icon: Zap,
      features: [
        'Access to ALL AI models (9+)',
        'Unlimited comparisons',
        'Advanced AutoML capabilities',
        'Priority support (24/7)',
        'Dedicated account manager',
        'API access (50,000 calls/month)',
      ],
      buttonText: isPlanActive('pro_plus') ? 'Current Plan' : 'Choose Plan',
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

  const getButtonClasses = (style: string, isPopular: boolean = false) => {
    const baseClasses = "w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center"
    
    switch (style) {
      case 'primary':
        return `${baseClasses} ${
          isPopular 
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1' 
            : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-1'
        }`
      case 'premium':
        return `${baseClasses} bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1`
      case 'border':
      default:
        return `${baseClasses} ${
          darkMode 
            ? 'border-2 border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white hover:bg-gray-700/50 transform hover:-translate-y-1'
            : 'border-2 border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 hover:bg-slate-50 transform hover:-translate-y-1'
        }`
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      <style jsx>{`
        @keyframes borderAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .pricing-card {
          position: relative;
          background: ${darkMode ? 'linear-gradient(135deg, #1f2937, #111827)' : 'linear-gradient(135deg, #ffffff, #f8fafc)'};
          border-radius: 1.5rem;
          height: 100%;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          overflow: hidden;
          border: 1px solid ${darkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(226, 232, 240, 0.8)'};
        }
        
        .pricing-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -6px rgba(0, 0, 0, 0.1);
        }
        
        .popular-card {
          position: relative;
          background: linear-gradient(45deg, #000000, #1a1a1a, #000000);
          background-size: 300% 300%;
          animation: borderAnimation 3s ease infinite;
          border-radius: 1.5rem;
          padding: 2px;
          transform: scale(1.05);
        }
        
        .popular-card-content {
          background: ${darkMode ? 'linear-gradient(135deg, #1e3a8a, #312e81)' : 'linear-gradient(135deg, #dbeafe, #e0e7ff)'};
          border-radius: 1.4rem;
          height: 100%;
        }
        
        .feature-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        
        .feature-icon {
          flex-shrink: 0;
          margin-right: 0.75rem;
          margin-top: 0.125rem;
        }
        
        .testimonial-card {
          background: ${darkMode ? 'linear-gradient(135deg, #1f2937, #111827)' : 'linear-gradient(135deg, #ffffff, #f8fafc)'};
          border-radius: 1.5rem;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid ${darkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(226, 232, 240, 0.8)'};
        }
        
        .faq-card {
          background: ${darkMode ? 'linear-gradient(135deg, #1f2937, #111827)' : 'linear-gradient(135deg, #ffffff, #f8fafc)'};
          border-radius: 1.5rem;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid ${darkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(226, 232, 240, 0.8)'};
        }
      `}</style>
      
      <AdvancedSidebar />
      
      <div className="ml-16 lg:ml-72 transition-all duration-300">
        {/* Header */}
        <div className={`backdrop-blur-sm border-b transition-colors duration-200 ${
          darkMode 
            ? 'bg-gray-800/40 border-gray-700/20' 
            : 'bg-white/50 border-slate-200/20'
        }`}>
          <div className="px-6 py-12">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold mb-6">
                <TrendingUp className="w-4 h-4 mr-2" />
                Most Trusted AI Platform in India
              </div>
              
              <h1 className={`text-4xl md:text-6xl font-bold mb-6 transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Simple, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Transparent</span> Pricing
              </h1>
              
              <p className={`text-xl max-w-2xl mx-auto transition-colors duration-200 ${
                darkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>
                Choose the perfect plan for your AI needs. All plans include a 7-day free trial with no credit card required.
              </p>
              
              {currentPlan && (
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mt-8 ${
                  darkMode 
                    ? 'bg-blue-900/30 text-blue-400 border border-blue-700/30' 
                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                }`}>
                  <Award className="w-4 h-4 mr-2" />
                  Current Plan: {getCurrentPlanName()}
                </div>
              )}
              
              {/* Button to open payment popup */}
              <button
                onClick={() => {
                  console.log('Upgrade Plan button clicked')
                  openPaymentPopup()
                }}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Upgrade Plan
              </button>
              
              {/* Billing Toggle */}
              <div className="mt-12 flex items-center justify-center">
                <div className={`p-1 rounded-2xl transition-colors duration-200 ${
                  darkMode ? 'bg-gray-800' : 'bg-slate-200'
                }`}>
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-8 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
                      billingCycle === 'monthly'
                        ? 'bg-white text-slate-900 shadow-md'
                        : darkMode
                          ? 'text-gray-400 hover:text-gray-200'
                          : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle('annual')}
                    className={`px-8 py-3 rounded-xl text-base font-semibold transition-all duration-200 relative ${
                      billingCycle === 'annual'
                        ? 'bg-white text-slate-900 shadow-md'
                        : darkMode
                          ? 'text-gray-400 hover:text-gray-200'
                          : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Annual
                    <span className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Save {pricing.pro.yearly.discount}%
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards - Redesigned */}
        <div className="px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {plans.map((plan) => {
                const Icon = plan.icon
                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-3xl transition-all duration-300 overflow-hidden flex flex-col h-full ${
                      plan.popular 
                        ? 'popular-card z-10' 
                        : 'pricing-card'
                    }`}
                    onMouseEnter={() => setHoveredPlan(plan.id)}
                    onMouseLeave={() => setHoveredPlan(null)}
                  >
                    {!plan.popular ? (
                      <div className="p-8 flex flex-col h-full">
                        {/* Plan Header */}
                        <div className="text-center mb-8">
                          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 mx-auto ${
                            darkMode
                              ? 'bg-gray-700'
                              : 'bg-slate-100'
                          }`}>
                            <Icon className={`w-8 h-8 ${
                              darkMode ? 'text-gray-300' : 'text-slate-600'
                            }`} />
                          </div>
                          
                          <h3 className={`text-2xl font-bold mb-2 transition-colors duration-200 ${
                            darkMode ? 'text-white' : 'text-slate-900'
                          }`}>
                            {plan.name}
                          </h3>
                          
                          <p className={`text-base font-medium transition-colors duration-200 ${
                            darkMode ? 'text-blue-400' : 'text-blue-600'
                          }`}>
                            {plan.tagline}
                          </p>
                          
                          <p className={`text-sm mt-3 transition-colors duration-200 ${
                            darkMode ? 'text-gray-400' : 'text-slate-600'
                          }`}>
                            {plan.description}
                          </p>
                        </div>

                        {/* Pricing */}
                        <div className="text-center mb-8">
                          <div className="flex items-baseline justify-center">
                            <span className={`text-5xl font-bold transition-colors duration-200 ${
                              darkMode ? 'text-white' : 'text-slate-900'
                            }`}>
                              {plan.price}
                            </span>
                            {plan.originalPrice && (
                              <span className={`ml-3 text-xl line-through transition-colors duration-200 ${
                                darkMode ? 'text-gray-500' : 'text-slate-400'
                              }`}>
                                {plan.originalPrice}
                              </span>
                            )}
                          </div>
                          <p className={`text-base mt-2 transition-colors duration-200 ${
                            darkMode ? 'text-gray-400' : 'text-slate-600'
                          }`}>
                            {plan.period}
                          </p>
                          
                          {/* Free Trial Badge */}
                          {plan.id !== 'free' && (
                            <div className={`inline-flex items-center mt-6 px-4 py-2 rounded-full text-sm font-semibold ${
                              darkMode
                                ? 'bg-blue-900/30 text-blue-400'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              <Shield className="w-4 h-4 mr-2" />
                              7-day free trial included
                            </div>
                          )}
                        </div>

                        {/* Features */}
                        <div className="flex-grow mb-8">
                          <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                            {plan.features.map((feature, index) => (
                              <div key={index} className="feature-item">
                                <div className={`feature-icon ${
                                  darkMode ? 'text-blue-400' : 'text-blue-500'
                                }`}>
                                  <CheckCircle className="w-5 h-5" />
                                </div>
                                <span className={`text-base transition-colors duration-200 ${
                                  darkMode ? 'text-gray-300' : 'text-slate-700'
                                }`}>
                                  {feature}
                                </span>
                              </div>
                            ))}
                            
                            {/* Limitations */}
                            {plan.limitations && plan.limitations.map((limitation, index) => (
                              <div key={index} className="feature-item opacity-60">
                                <div className="feature-icon w-5 h-5 flex-shrink-0 mt-0.5">
                                  <div className={`w-1 h-3 mx-auto rounded-full ${
                                    darkMode ? 'bg-gray-600' : 'bg-slate-400'
                                  }`}></div>
                                </div>
                                <span className={`text-base transition-colors duration-200 ${
                                  darkMode ? 'text-gray-500' : 'text-slate-500'
                                }`}>
                                  {limitation}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* CTA Button */}
                        <div className="mt-auto">
                          <button 
                            onClick={() => {
                              if (plan.id === 'free') {
                                // Free plan - redirect to dashboard or signup
                                if (user) {
                                  router.push('/dashboard');
                                } else {
                                  router.push('/auth/signup');
                                }
                                return;
                              } else if (plan.id === 'pro') {
                                handlePlanUpgrade('pro')
                              } else if (plan.id === 'pro_plus') {  // Changed from 'pro-plus' to 'pro_plus'
                                handlePlanUpgrade('pro_plus')
                              }
                            }}
                            disabled={isPlanActive(plan.id) || isProcessing === plan.id.replace('-', '_')}
                            className={`${getButtonClasses(plan.buttonStyle, plan.popular)} ${
                              isPlanActive(plan.id)
                                ? 'opacity-50 cursor-not-allowed'
                                : isProcessing === plan.id.replace('-', '_')
                                  ? 'opacity-75 cursor-wait'
                                  : ''
                            }`}
                          >
                            {isProcessing === plan.id.replace('-', '_') ? (
                              <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                {plan.buttonText}
                                <ArrowRight className="w-5 h-5 ml-2" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="popular-card-content">
                        {/* Popular Badge */}
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                          <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center">
                            <Sparkles className="w-4 h-4 mr-1" />
                            Most Popular
                          </div>
                        </div>

                        <div className="relative z-10 flex flex-col h-full p-8">
                          {/* Plan Header */}
                          <div className="text-center mb-8">
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 mx-auto ${
                              'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                            }`}>
                              <Icon className="w-8 h-8 text-white" />
                            </div>
                            
                            <h3 className={`text-2xl font-bold mb-2 transition-colors duration-200 ${
                              darkMode ? 'text-white' : 'text-slate-900'
                            }`}>
                              {plan.name}
                            </h3>
                            
                            <p className={`text-base font-medium transition-colors duration-200 ${
                              darkMode ? 'text-blue-300' : 'text-blue-600'
                            }`}>
                              {plan.tagline}
                            </p>
                            
                            <p className={`text-sm mt-3 transition-colors duration-200 ${
                              darkMode ? 'text-blue-200' : 'text-blue-700'
                            }`}>
                              {plan.description}
                            </p>
                          </div>

                          {/* Pricing */}
                          <div className="text-center mb-8">
                            <div className="flex items-baseline justify-center">
                              <span className={`text-5xl font-bold transition-colors duration-200 ${
                                darkMode ? 'text-white' : 'text-slate-900'
                              }`}>
                                {plan.price}
                              </span>
                              {plan.originalPrice && (
                                <span className={`ml-3 text-xl line-through transition-colors duration-200 ${
                                  darkMode ? 'text-blue-200' : 'text-blue-400'
                                }`}>
                                  {plan.originalPrice}
                                </span>
                              )}
                            </div>
                            <p className={`text-base mt-2 transition-colors duration-200 ${
                              darkMode ? 'text-blue-200' : 'text-blue-700'
                            }`}>
                              {plan.period}
                            </p>
                            
                            {/* Free Trial Badge */}
                            <div className="inline-flex items-center mt-6 px-4 py-2 rounded-full text-sm font-semibold bg-white/20 text-white">
                              <Shield className="w-4 h-4 mr-2" />
                              7-day free trial included
                            </div>
                          </div>

                          {/* Features */}
                          <div className="flex-grow mb-8">
                            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100 dark:scrollbar-thumb-blue-400 dark:scrollbar-track-blue-900/50">
                              {plan.features.map((feature, index) => (
                                <div key={index} className="feature-item">
                                  <div className="feature-icon text-white">
                                    <CheckCircle className="w-5 h-5" />
                                  </div>
                                  <span className={`text-base transition-colors duration-200 ${
                                    darkMode ? 'text-blue-100' : 'text-blue-900'
                                  }`}>
                                    {feature}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* CTA Button */}
                          <div className="mt-auto">
                            <button 
                              onClick={() => {
                                if (plan.id === 'pro') {
                                  handlePlanUpgrade('pro')
                                } else if (plan.id === 'pro_plus') {  // Changed from 'pro-plus' to 'pro_plus'
                                  handlePlanUpgrade('pro_plus')
                                }
                              }}
                              disabled={isPlanActive(plan.id) || isProcessing === plan.id.replace('-', '_')}
                              className={`${getButtonClasses(plan.buttonStyle, plan.popular)} ${
                                isPlanActive(plan.id)
                                  ? 'opacity-50 cursor-not-allowed'
                                  : isProcessing === plan.id.replace('-', '_')
                                    ? 'opacity-75 cursor-wait'
                                    : ''
                              }`}
                            >
                              {isProcessing === plan.id.replace('-', '_') ? (
                                <>
                                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  {plan.buttonText}
                                  <ArrowRight className="w-5 h-5 ml-2" />
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="px-6 py-16 border-t border-current border-opacity-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Everything you need to succeed
              </h2>
              <p className={`text-xl max-w-2xl mx-auto transition-colors duration-200 ${
                darkMode ? 'text-gray-400' : 'text-slate-600'
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
                    className="testimonial-card transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className={`w-14 h-14 mb-6 rounded-2xl flex items-center justify-center ${
                      darkMode ? 'bg-blue-600/10' : 'bg-blue-100'
                    }`}>
                      <Icon className={`w-7 h-7 ${
                        darkMode ? 'text-blue-400' : 'text-blue-600'
                      }`} />
                    </div>
                    
                    <h3 className={`text-xl font-bold mb-3 transition-colors duration-200 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {feature.title}
                    </h3>
                    
                    <p className={`text-base transition-colors duration-200 ${
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

        {/* Testimonials */}
        <div className={`px-6 py-16 ${
          darkMode ? 'bg-gray-800/30' : 'bg-slate-100/50'
        }`}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Trusted by AI professionals
              </h2>
              <p className={`text-xl transition-colors duration-200 ${
                darkMode ? 'text-gray-400' : 'text-slate-600'
              }`}>
                Join thousands of satisfied users
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Priya Sharma",
                  role: "Data Scientist",
                  company: "TechCorp India",
                  content: "AI Fiesta has transformed how we compare models. The Pro plan pays for itself with the time it saves us."
                },
                {
                  name: "Rahul Verma",
                  role: "ML Engineer",
                  company: "StartupX",
                  content: "The visualization tools are exceptional. The Enterprise plan gives us everything we need for our production models."
                },
                {
                  name: "Anjali Patel",
                  role: "AI Researcher",
                  company: "Research Institute",
                  content: "The explainability features in the Enterprise plan have been crucial for our research publications."
                }
              ].map((testimonial, index) => (
                <div 
                  key={index}
                  className="testimonial-card"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h4 className={`font-bold ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {testimonial.name}
                      </h4>
                      <p className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-slate-600'
                      }`}>
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                  <p className={`text-base italic ${
                    darkMode ? 'text-gray-300' : 'text-slate-700'
                  }`}>
                    "{testimonial.content}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="px-6 py-16 border-t border-current border-opacity-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Frequently Asked Questions
              </h2>
              <p className={`text-xl transition-colors duration-200 ${
                darkMode ? 'text-gray-400' : 'text-slate-600'
              }`}>
                Everything you need to know about our plans
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
                  answer: "Yes, we offer a 7-day free trial for both Pro and Enterprise plans. No credit card required to start."
                },
                {
                  question: "What happens if I exceed my API limits?",
                  answer: "Your service won't be interrupted. We'll notify you and you can upgrade your plan or purchase additional API calls."
                }
              ].map((faq, index) => (
                <div
                  key={index}
                  className="faq-card"
                >
                  <h3 className={`text-xl font-bold mb-4 transition-colors duration-200 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {faq.question}
                  </h3>
                  <p className={`text-base transition-colors duration-200 ${
                    darkMode ? 'text-gray-400' : 'text-slate-600'
                  }`}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            {/* Ask Your Own Question */}
            <div className={`p-12 rounded-3xl text-center ${
              darkMode 
                ? 'bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border border-blue-700/30' 
                : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200'
            }`}>
              <Rocket className={`w-12 h-12 mx-auto mb-6 ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <h3 className={`text-2xl md:text-3xl font-bold mb-4 transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Ready to get started?
              </h3>
              <p className={`text-xl mb-8 max-w-2xl mx-auto transition-colors duration-200 ${
                darkMode ? 'text-gray-300' : 'text-slate-600'
              }`}>
                Join thousands of AI professionals who trust AI Fiesta for their model comparison needs.
              </p>
              <button 
                onClick={() => {
                  // Scroll to pricing cards
                  document.querySelector('.grid.grid-cols-1')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl text-lg"
              >
                Choose Your Plan
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}