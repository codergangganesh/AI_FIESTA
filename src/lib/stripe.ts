import { loadStripe } from '@stripe/stripe-js'
import { PlanType } from '@/contexts/PlanContext'

// Initialize Stripe
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// Plan pricing in INR (paise)
export const STRIPE_PLAN_PRICES = {
  pro: {
    monthly: 69900, // ₹699.00 in paise
    yearly: 699000, // ₹6,990.00 (10 months price - ~16.67% discount)
  },
  pro_plus: {
    monthly: 129900, // ₹1,299.00 in paise  
    yearly: 1299000, // ₹12,990.00 (10 months price - ~16.67% discount)
  }
}

export interface StripePaymentData {
  planType: PlanType
  billingCycle: 'monthly' | 'yearly'
  amount: number
  currency: string
  userEmail: string
  userName: string
  trialDays?: number
}

export interface StripeCheckoutResponse {
  sessionId: string
  url: string
}

export const createStripeCheckout = async (paymentData: StripePaymentData): Promise<StripeCheckoutResponse> => {
  try {
    const response = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to create checkout session')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating Stripe checkout:', error)
    throw error
  }
}

export const formatStripePrice = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount / 100)
}

export const calculateYearlyDiscount = (monthlyPrice: number, yearlyPrice: number): number => {
  const monthlyCost = monthlyPrice * 12
  const discount = ((monthlyCost - yearlyPrice) / monthlyCost) * 100
  return Math.round(discount)
}

// Get formatted pricing with proper calculations
export const getFormattedPricing = () => {
  return {
    pro: {
      monthly: {
        price: formatStripePrice(STRIPE_PLAN_PRICES.pro.monthly),
        amount: STRIPE_PLAN_PRICES.pro.monthly
      },
      yearly: {
        price: formatStripePrice(STRIPE_PLAN_PRICES.pro.yearly),
        amount: STRIPE_PLAN_PRICES.pro.yearly,
        monthlyEquivalent: formatStripePrice(STRIPE_PLAN_PRICES.pro.yearly / 12),
        discount: calculateYearlyDiscount(STRIPE_PLAN_PRICES.pro.monthly, STRIPE_PLAN_PRICES.pro.yearly)
      }
    },
    pro_plus: {
      monthly: {
        price: formatStripePrice(STRIPE_PLAN_PRICES.pro_plus.monthly),
        amount: STRIPE_PLAN_PRICES.pro_plus.monthly
      },
      yearly: {
        price: formatStripePrice(STRIPE_PLAN_PRICES.pro_plus.yearly),
        amount: STRIPE_PLAN_PRICES.pro_plus.yearly,
        monthlyEquivalent: formatStripePrice(STRIPE_PLAN_PRICES.pro_plus.yearly / 12),
        discount: calculateYearlyDiscount(STRIPE_PLAN_PRICES.pro_plus.monthly, STRIPE_PLAN_PRICES.pro_plus.yearly)
      }
    }
  }
}

export const redirectToCheckout = async (sessionId: string) => {
  const stripe = await stripePromise
  if (!stripe) {
    throw new Error('Stripe failed to load')
  }

  const { error } = await stripe.redirectToCheckout({ sessionId })
  if (error) {
    throw new Error(error.message)
  }
}