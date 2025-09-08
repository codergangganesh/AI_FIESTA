import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer'],
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Extract session details
    const sessionDetails = {
      sessionId: session.id,
      paymentStatus: session.payment_status,
      customerEmail: session.customer_email,
      planType: session.metadata?.planType,
      billingCycle: session.metadata?.billingCycle,
      subscriptionId: session.subscription,
      customerId: session.customer,
      amountTotal: session.amount_total,
      currency: session.currency,
    }

    return NextResponse.json(sessionDetails)
  } catch (error) {
    console.error('Error verifying Stripe session:', error)
    return NextResponse.json(
      { error: 'Failed to verify session' },
      { status: 500 }
    )
  }
}