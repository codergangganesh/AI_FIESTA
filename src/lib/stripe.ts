import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe with your publishable key
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// Stripe price IDs - replace with your actual price IDs from Stripe dashboard
export const STRIPE_PRICE_IDS = {
  PRO_MONTHLY: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || 'price_pro_monthly',
  ENTERPRISE_MONTHLY: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID || 'price_enterprise_monthly',
} as const

// Plan configurations
export const PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      '5 comparisons per day',
      'Basic AI models',
      'Standard support',
      'Community access'
    ]
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 19,
    priceId: STRIPE_PRICE_IDS.PRO_MONTHLY,
    features: [
      'Unlimited comparisons',
      'All premium AI models',
      'Priority support',
      'Advanced analytics',
      'API access',
      'Custom integrations'
    ]
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    priceId: STRIPE_PRICE_IDS.ENTERPRISE_MONTHLY,
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Custom model training',
      'Dedicated support',
      'SLA guarantee',
      'On-premise deployment'
    ]
  }
} as const

export type PlanId = keyof typeof PLANS
