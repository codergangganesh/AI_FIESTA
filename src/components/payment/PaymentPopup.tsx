'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { usePopup } from '@/contexts/PopupContext'
import { usePlan } from '@/contexts/PlanContext'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/NotificationContext'
import ModernPaymentCard from '@/components/payment/ModernPaymentCard'
import PaymentCancelPopup from '@/components/payment/PaymentCancelPopup'
import { createStripeCheckout, getFormattedPricing, redirectToCheckout } from '@/lib/stripe'
import { 
  CreditCard, 
  Smartphone, 
  Building, 
  Wallet,
  Sparkles,
  ShieldCheck,
  X
} from 'lucide-react'

interface PricingPlan {
  id: 'pro' | 'pro_plus'
  name: string
  tagline: string
  popular?: boolean
  features: Array<{ text: string; icon?: React.ComponentType<{ className?: string }> }>
  limitations?: string[]
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Perfect for professionals',
    features: [
      { text: 'Access to 4 AI models' },
      { text: '500 comparisons per month' },
      { text: '10 GB storage' },
      { text: '5,000 API calls' },
      { text: 'Advanced analytics' },
      { text: 'Email support' },
    ]
  },
  {
    id: 'pro_plus',
    name: 'Pro Plus',
    tagline: 'For power users',
    popular: true,
    features: [
      { text: 'Access to 6+ AI models' },
      { text: 'Unlimited comparisons' },
      { text: '100 GB storage' },
      { text: '50,000 API calls' },
      { text: 'Model explainability' },
      { text: '24/7 priority support' },
    ]
  }
]

const paymentMethods = [
  { name: 'Cards', icon: CreditCard },
  { name: 'UPI', icon: Smartphone },
  { name: 'Net Banking', icon: Building },
  { name: 'Wallets', icon: Wallet }
]

export default function PaymentPopup() {
  const { darkMode } = useDarkMode()
  const { isPaymentPopupOpen, closePaymentPopup } = usePopup()
  const { user } = useAuth()
  const { success, error } = useToast()
  const { plan } = usePlan()
  const router = useRouter()
  
  console.log('PaymentPopup component rendered', { isPaymentPopupOpen, plan })
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly')
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const [pricing, setPricing] = useState<any>(null)
  const [showCancelPopup, setShowCancelPopup] = useState(false)
  const [paymentStarted, setPaymentStarted] = useState(false) // Track if payment process was initiated

  useEffect(() => {
    try {
      const formattedPricing = getFormattedPricing()
      console.log('PaymentPopup: formattedPricing', formattedPricing)
      setPricing(formattedPricing)
    } catch (error) {
      console.error('PaymentPopup: Error getting formatted pricing', error)
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

  // Handle browser back button - only show cancel popup if payment was started
  useEffect(() => {
    const handlePopState = () => {
      if (paymentStarted) {
        setShowCancelPopup(true)
      } else {
        // If no payment was started, just close the popup
        closePaymentPopup()
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [paymentStarted, closePaymentPopup])

  const handleSubscribe = async (planType: 'pro' | 'pro_plus') => {
    if (!user) {
      error('Authentication Required', 'Please log in to subscribe to a plan')
      return
    }

    if (plan === planType) {
      success('Already Subscribed', `You're already on the ${planType.toUpperCase()} plan`)
      return
    }

    setIsProcessing(planType)
    setPaymentStarted(true) // Mark that payment process has started

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

  const handleCancelPayment = () => {
    // Show the popup directly instead of redirecting
    setShowCancelPopup(true)
  }

  const handleRetryPayment = () => {
    setShowCancelPopup(false)
    setPaymentStarted(true) // Reset payment started flag when retrying
  }

  const handleGoHome = () => {
    setShowCancelPopup(false)
    setPaymentStarted(false) // Reset payment started flag
    router.push('/') // Redirect to landing page directly
  }

  const handleContactSupport = () => {
    setShowCancelPopup(false)
    setPaymentStarted(false) // Reset payment started flag
    router.push('/contact')
  }

  const handleClosePopup = () => {
    closePaymentPopup()
    setPaymentStarted(false) // Reset payment started flag when closing popup
  }

  const isPlanActive = (planType: string) => {
    return plan === planType
  }

  if (!isPaymentPopupOpen) {
    console.log('PaymentPopup: not showing - popup not open')
    return null
  }
  
  if (!pricing) {
    console.log('PaymentPopup: not showing - pricing data not loaded')
    return null
  }
  
  console.log('PaymentPopup: showing popup')

  return (
    <>
      {/* Payment Popup Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
        <div className={`relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl transition-all duration-300 ${
          darkMode 
            ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
            : 'bg-gradient-to-br from-white to-slate-50 border border-slate-200'
        }`}>
          {/* Close button */}
          <button
            onClick={handleClosePopup}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors z-10"
          >
            <X className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-slate-600'}`} />
          </button>

          <div className="p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className={`p-3 rounded-xl ${
                  darkMode ? 'bg-blue-600/20' : 'bg-blue-100'
                }`}>
                  <Sparkles className={`w-8 h-8 ${
                    darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                </div>
              </div>
              
              <h2 className={`text-2xl font-bold mb-2 transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Choose Your Plan
              </h2>
              
              <p className={`text-sm transition-colors duration-200 ${
                darkMode ? 'text-gray-400' : 'text-slate-600'
              }`}>
                Start with a 7-day free trial
              </p>
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-8">
              <div className={`p-1 rounded-lg transition-colors duration-200 ${
                darkMode ? 'bg-gray-700' : 'bg-slate-200'
              }`}>
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-2 rounded-md text-xs font-semibold transition-all duration-200 ${
                    billingCycle === 'monthly'
                      ? 'bg-blue-600 text-white shadow'
                      : darkMode
                        ? 'text-gray-300 hover:text-white'
                        : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 py-2 rounded-md text-xs font-semibold transition-all duration-200 relative ${
                    billingCycle === 'yearly'
                      ? 'bg-blue-600 text-white shadow'
                      : darkMode
                        ? 'text-gray-300 hover:text-white'
                        : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Yearly
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    Save {pricing?.pro?.yearly?.discount || 20}%
                  </span>
                </button>
              </div>
            </div>

            {/* Pricing Cards - More compact design */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {pricingPlans.map((plan) => (
                <div key={plan.id} className="flex flex-col">
                  <ModernPaymentCard
                    plan={plan}
                    pricing={pricing || {}} // Add fallback to prevent errors
                    billingCycle={billingCycle}
                    isProcessing={isProcessing === plan.id}
                    isPlanActive={isPlanActive(plan.id)}
                    onSubscribe={handleSubscribe}
                  />
                </div>
              ))}
            </div>

            {/* Payment Methods */}
           
          </div>
        </div>
      </div>

      {/* Payment Cancel Popup */}
      <PaymentCancelPopup
        isOpen={showCancelPopup}
        onClose={() => setShowCancelPopup(false)}
        onRetry={handleRetryPayment}
        onGoHome={handleGoHome}
        onContactSupport={handleContactSupport}
      />
    </>
  )
}