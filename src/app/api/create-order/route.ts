import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { PLAN_PRICES } from '@/lib/razorpay'

// Check if we're in development mode with placeholder credentials
const isDevelopmentMode = process.env.RAZORPAY_KEY_ID === 'rzp_test_your_key_id' || 
                          process.env.RAZORPAY_KEY_SECRET === 'your_razorpay_secret_key'

let razorpay: Razorpay | null = null

if (!isDevelopmentMode) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { planType, amount, currency, userEmail, userName, billingCycle } = body

    // Validate the amount matches our pricing
    const expectedAmount = billingCycle === 'monthly'
      ? PLAN_PRICES[planType as keyof typeof PLAN_PRICES].monthly
      : PLAN_PRICES[planType as keyof typeof PLAN_PRICES].yearly

    if (amount !== expectedAmount) {
      return NextResponse.json({ 
        error: 'Invalid amount',
        expected: expectedAmount,
        received: amount 
      }, { status: 400 })
    }

    const options = {
      amount: amount, // amount in paise
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        planType,
        userEmail,
        userName,
        billingCycle: billingCycle || 'yearly',
      },
    }

    let order
    
    if (isDevelopmentMode) {
      // Development mode: Create a mock order
      console.log('🔧 Development mode: Creating mock Razorpay order')
      order = {
        id: `order_${Date.now()}`,
        amount: amount,
        currency: currency,
        status: 'created',
        receipt: options.receipt,
        notes: options.notes
      }
    } else {
      // Production mode: Create real Razorpay order
      order = await razorpay!.orders.create(options)
    }

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    })
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}