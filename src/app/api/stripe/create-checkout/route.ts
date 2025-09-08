import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { STRIPE_PLAN_PRICES } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { planType, billingCycle, userEmail, userName, trialDays = 7 } = body

    // Validate required fields
    if (!planType || !billingCycle || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: planType, billingCycle, userEmail' },
        { status: 400 }
      )
    }

    // Validate plan type
    if (!['pro', 'pro_plus'].includes(planType)) {
      return NextResponse.json(
        { error: 'Invalid plan type. Must be pro or pro_plus' },
        { status: 400 }
      )
    }

    // Validate billing cycle
    if (!['monthly', 'yearly'].includes(billingCycle)) {
      return NextResponse.json(
        { error: 'Invalid billing cycle. Must be monthly or yearly' },
        { status: 400 }
      )
    }

    // Get the price based on plan and billing cycle
    const amount = billingCycle === 'monthly' 
      ? STRIPE_PLAN_PRICES[planType as keyof typeof STRIPE_PLAN_PRICES].monthly
      : STRIPE_PLAN_PRICES[planType as keyof typeof STRIPE_PLAN_PRICES].yearly

    // Create customer first (to handle user data properly)
    let customer
    try {
      customer = await stripe.customers.create({
        email: userEmail,
        name: userName,
        metadata: {
          planType,
          billingCycle,
        },
      })
    } catch (customerError) {
      console.error('Error creating Stripe customer:', customerError)
      return NextResponse.json(
        { error: 'Failed to create customer' },
        { status: 500 }
      )
    }

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer: customer.id,
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `AI Fiesta ${planType.replace('_', ' ').toUpperCase()} Plan`,
              description: `${planType.replace('_', ' ').toUpperCase()} plan with ${billingCycle} billing. Includes 7-day free trial.`,
              images: [], // We'll add logo later
            },
            unit_amount: amount,
            recurring: {
              interval: billingCycle === 'monthly' ? 'month' : 'year',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: {
        trial_period_days: trialDays,
        metadata: {
          planType,
          billingCycle,
          userName,
          userEmail,
        },
      },
      success_url: `${request.headers.get('origin') || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin') || 'http://localhost:3000'}/payment/cancel`,
      metadata: {
        planType,
        billingCycle,
        userName,
        userEmail,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    })

    // Log the checkout session creation for debugging
    console.log('Stripe checkout session created:', {
      sessionId: session.id,
      planType,
      billingCycle,
      amount: amount / 100, // Convert to rupees for logging
      userEmail,
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      customerId: customer.id,
    })
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error)
    
    // Return more specific error messages
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to create checkout session'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}