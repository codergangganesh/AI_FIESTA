import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    // Only verify webhook signature in production
    if (endpointSecret && endpointSecret !== 'whsec_your_webhook_secret_here') {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
    } else {
      // In development or when webhook secret is not set, parse the event directly
      console.log('⚠️  Development mode: Skipping webhook signature verification')
      event = JSON.parse(body)
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  const supabase = createClient()

  try {
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription, supabase)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription, supabase)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, supabase)
        break

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice, supabase)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice, supabase)
        break

      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event.data.object as Stripe.Subscription, supabase)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    )
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription, supabase: any) {
  console.log('Subscription created:', subscription.id)
  
  // Get customer details
  const customer = await stripe.customers.retrieve(subscription.customer as string)
  
  if ('email' in customer && customer.email) {
    // Update user's plan in database
    const planType = subscription.metadata?.planType || 'pro'
    const billingCycle = subscription.metadata?.billingCycle || 'monthly'
    
    const { error } = await supabase
      .from('user_plans')
      .upsert({
        user_email: customer.email,
        plan_type: planType,
        billing_cycle: billingCycle,
        subscription_id: subscription.id,
        status: subscription.status,
        current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
        current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
        trial_end: (subscription as any).trial_end ? new Date((subscription as any).trial_end * 1000).toISOString() : null,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_email'
      })

    if (error) {
      console.error('Error updating user plan:', error)
    } else {
      console.log('User plan updated successfully for:', customer.email)
    }
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription, supabase: any) {
  console.log('Subscription updated:', subscription.id)
  
  // Update subscription status in database
  const { error } = await supabase
    .from('user_plans')
    .update({
      status: subscription.status,
      current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
      current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
      trial_end: (subscription as any).trial_end ? new Date((subscription as any).trial_end * 1000).toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('subscription_id', subscription.id)

  if (error) {
    console.error('Error updating subscription:', error)
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription, supabase: any) {
  console.log('Subscription deleted:', subscription.id)
  
  // Reset user to free plan
  const { error } = await supabase
    .from('user_plans')
    .update({
      plan_type: 'free',
      status: 'canceled',
      subscription_id: null,
      updated_at: new Date().toISOString(),
    })
    .eq('subscription_id', subscription.id)

  if (error) {
    console.error('Error updating plan to free:', error)
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice, supabase: any) {
  console.log('Payment succeeded for invoice:', invoice.id)
  
  // Log successful payment
  const { error } = await supabase
    .from('payment_history')
    .insert({
      invoice_id: invoice.id,
      subscription_id: (invoice as any).subscription,
      customer_id: (invoice as any).customer,
      amount: (invoice as any).amount_paid,
      currency: invoice.currency,
      status: 'succeeded',
      payment_date: new Date((invoice as any).status_transitions.paid_at! * 1000).toISOString(),
      created_at: new Date().toISOString(),
    })

  if (error) {
    console.error('Error logging payment:', error)
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice, supabase: any) {
  console.log('Payment failed for invoice:', invoice.id)
  
  // Log failed payment
  const { error } = await supabase
    .from('payment_history')
    .insert({
      invoice_id: invoice.id,
      subscription_id: (invoice as any).subscription,
      customer_id: (invoice as any).customer,
      amount: (invoice as any).amount_due,
      currency: invoice.currency,
      status: 'failed',
      payment_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
    })

  if (error) {
    console.error('Error logging failed payment:', error)
  }

  // TODO: Send notification to user about failed payment
}

async function handleTrialWillEnd(subscription: Stripe.Subscription, supabase: any) {
  console.log('Trial will end for subscription:', subscription.id)
  
  // TODO: Send notification to user about trial ending
  // You can implement email notifications here
}