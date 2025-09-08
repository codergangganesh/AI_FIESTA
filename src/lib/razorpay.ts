import { PlanType } from '@/contexts/PlanContext'

declare global {
  interface Window {
    Razorpay: {
      new (options: RazorpayOptions): {
        open(): void
      }
    }
  }
}

export interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayResponse) => void
  prefill: {
    name: string
    email: string
    contact?: string
  }
  theme: {
    color: string
  }
  modal: {
    ondismiss: () => void
  }
}

export interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

export interface PaymentData {
  planType: PlanType
  amount: number
  currency: string
  userEmail: string
  userName: string
  billingCycle: 'monthly' | 'yearly'
}

export const PLAN_PRICES = {
  pro: {
    monthly: 999, // ₹9.99
    yearly: 9999, // ₹99.99
  },
  pro_plus: {
    monthly: 1999, // ₹19.99
    yearly: 19999, // ₹199.99
  }
}

export const initializeRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export const createRazorpayOrder = async (paymentData: PaymentData) => {
  try {
    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    })

    if (!response.ok) {
      throw new Error('Failed to create order')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    throw error
  }
}

export const verifyPayment = async (response: RazorpayResponse) => {
  try {
    const verifyResponse = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response),
    })

    if (!verifyResponse.ok) {
      throw new Error('Payment verification failed')
    }

    return await verifyResponse.json()
  } catch (error) {
    console.error('Error verifying payment:', error)
    throw error
  }
}

export const processPayment = async (
  paymentData: PaymentData,
  onSuccess: (response: RazorpayResponse) => void,
  onError: (error: Error) => void
) => {
  try {
    // Check if we're in development mode
    const isDevelopmentMode = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID === 'rzp_test_your_key_id'
    
    // Create order
    const orderData = await createRazorpayOrder(paymentData)
    
    if (isDevelopmentMode) {
      // Development mode: Simulate payment flow
      console.log('🔧 Development mode: Simulating Razorpay payment flow')
      
      // Show a development mode alert
      const proceed = window.confirm(
        `🔧 DEVELOPMENT MODE\n\n` +
        `Plan: ${paymentData.planType.toUpperCase()}\n` +
        `Amount: ${formatPrice(paymentData.amount)}\n` +
        `Billing: ${paymentData.billingCycle}\n\n` +
        `This is a simulated payment. Click OK to proceed with mock payment.`
      )
      
      if (!proceed) {
        onError(new Error('Payment cancelled by user'))
        return
      }
      
      // Simulate successful payment response
      const mockResponse: RazorpayResponse = {
        razorpay_payment_id: `pay_mock_${Date.now()}`,
        razorpay_order_id: orderData.id,
        razorpay_signature: `mock_signature_${Date.now()}`
      }
      
      // Simulate API delay
      setTimeout(async () => {
        try {
          await verifyPayment(mockResponse)
          onSuccess(mockResponse)
        } catch (error) {
          onError(error instanceof Error ? error : new Error('Payment verification failed'))
        }
      }, 1000)
      
      return
    }
    
    // Production mode: Initialize Razorpay
    const isRazorpayLoaded = await initializeRazorpay()
    if (!isRazorpayLoaded) {
      throw new Error('Razorpay SDK failed to load')
    }

    // Configure Razorpay options
    const options: RazorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'AI Fiesta',
      description: `${paymentData.planType.toUpperCase()} Plan Subscription`,
      order_id: orderData.id,
      handler: async (response: RazorpayResponse) => {
        try {
          await verifyPayment(response)
          onSuccess(response)
        } catch (error) {
          onError(error instanceof Error ? error : new Error('Payment verification failed'))
        }
      },
      prefill: {
        name: paymentData.userName,
        email: paymentData.userEmail,
      },
      theme: {
        color: '#3B82F6',
      },
      modal: {
        ondismiss: () => {
          onError(new Error('Payment cancelled by user'))
        },
      },
    }

    // Open Razorpay checkout
    const rzp = new window.Razorpay(options)
    rzp.open()
  } catch (error) {
    onError(error instanceof Error ? error : new Error('Payment processing failed'))
  }
}

export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount / 100)
}

export const calculateDiscount = (monthlyPrice: number, yearlyPrice: number): number => {
  const monthlyCost = monthlyPrice * 12
  const discount = ((monthlyCost - yearlyPrice) / monthlyCost) * 100
  return Math.round(discount)
}