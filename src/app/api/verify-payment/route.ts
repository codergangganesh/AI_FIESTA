import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/client'

// Check if we're in development mode with placeholder credentials
const isDevelopmentMode = process.env.RAZORPAY_KEY_SECRET === 'your_razorpay_secret_key'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = body

    if (isDevelopmentMode) {
      // Development mode: Skip signature verification
      console.log('🔧 Development mode: Skipping payment signature verification')
    } else {
      // Production mode: Verify the payment signature
      const sign = razorpay_order_id + '|' + razorpay_payment_id
      const expectedSign = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(sign.toString())
        .digest('hex')

      if (razorpay_signature !== expectedSign) {
        return NextResponse.json(
          { error: 'Payment verification failed' },
          { status: 400 }
        )
      }
    }

    // Store payment information in database
    const supabase = createClient()
    const { error } = await supabase
      .from('payments')
      .insert({
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        signature: razorpay_signature,
        status: 'success',
        created_at: new Date().toISOString(),
      })

    if (error) {
      console.error('Error storing payment:', error)
    }

    return NextResponse.json({
      success: true,
      payment_id: razorpay_payment_id,
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    )
  }
}