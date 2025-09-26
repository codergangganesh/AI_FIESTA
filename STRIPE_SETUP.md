# Stripe Payment Integration Setup

## Environment Variables Required

Add these environment variables to your `.env.local` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Stripe Price IDs (get these from your Stripe dashboard)
STRIPE_PRO_MONTHLY_PRICE_ID=price_your_pro_monthly_price_id
STRIPE_ENTERPRISE_MONTHLY_PRICE_ID=price_your_enterprise_monthly_price_id

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Stripe Dashboard Setup

1. **Create Products and Prices:**
   - Go to your Stripe Dashboard → Products
   - Create a "Pro Plan" product with a $19/month recurring price
   - Create an "Enterprise Plan" product with a $99/month recurring price
   - Copy the price IDs and add them to your environment variables

2. **Set up Webhooks:**
   - Go to Stripe Dashboard → Webhooks
   - Add endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Copy the webhook secret and add it to your environment variables

3. **Configure Customer Portal:**
   - Go to Stripe Dashboard → Settings → Billing → Customer Portal
   - Enable the customer portal
   - Configure allowed features (subscription management, payment methods, etc.)

## Supabase Setup

Run the SQL from `supabase_subscriptions.sql` in your Supabase SQL editor to create the user subscriptions table.

## Testing

1. Use Stripe test cards for testing:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - 3D Secure: `4000 0025 0000 3155`

2. Test the complete flow:
   - Click "Pricing" button
   - Select a paid plan
   - Complete payment with test card
   - Verify subscription is created in Supabase
   - Test subscription management via customer portal

## Production Deployment

1. Replace test keys with live keys
2. Update webhook URL to production domain
3. Test with real payment methods
4. Monitor webhook events in Stripe dashboard
