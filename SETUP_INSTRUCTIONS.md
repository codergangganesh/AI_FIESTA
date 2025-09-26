# Setup Instructions

## 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
STRIPE_PRO_MONTHLY_PRICE_ID=your_pro_price_id_here
STRIPE_ENTERPRISE_MONTHLY_PRICE_ID=your_enterprise_price_id_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 2. Supabase Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the following SQL scripts in order:

### First, run `supabase_subscriptions.sql`:
```sql
-- User Subscriptions Table
-- Run this SQL in your Supabase SQL editor to create the subscriptions table

CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'inactive', -- active, cancelled, past_due, etc.
  plan TEXT NOT NULL DEFAULT 'free', -- free, pro, enterprise
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_customer_id ON user_subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_subscription_id ON user_subscriptions(stripe_subscription_id);

-- Ensure only one subscription row per user
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'uniq_user_subscriptions_user_id'
  ) THEN
    EXECUTE 'CREATE UNIQUE INDEX uniq_user_subscriptions_user_id ON public.user_subscriptions(user_id)';
  END IF;
END $$;

-- Enable Row Level Security (RLS)
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own subscriptions" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to create their own subscription row (default free)
CREATE POLICY "Users can insert their own subscriptions" ON user_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_subscription_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_subscriptions_updated_at 
  BEFORE UPDATE ON user_subscriptions 
  FOR EACH ROW 
  EXECUTE FUNCTION update_subscription_updated_at_column();
```

### Then, run `supabase_usage.sql`:
```sql
-- User Usage Table
-- Run this SQL in your Supabase SQL editor to create the usage tracking table

CREATE TABLE IF NOT EXISTS user_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  comparisons_count INT DEFAULT 0 NOT NULL,
  api_calls_count INT DEFAULT 0 NOT NULL,
  last_reset_month INT NOT NULL, -- 0-11 for Jan-Dec
  last_reset_year INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_usage_user_id ON user_usage(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own usage" ON user_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage" ON user_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage" ON user_usage
  FOR UPDATE USING (auth.uid() = user_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_usage_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_usage_updated_at 
  BEFORE UPDATE ON user_usage 
  FOR EACH ROW 
  EXECUTE FUNCTION update_usage_updated_at_column();
```

## 3. Test the Setup

After setting up the environment variables and running the SQL scripts, restart your development server:

```bash
npm run dev
```

The improved error handling should now provide more detailed error messages if there are still issues.

## 4. Troubleshooting

If you still see errors:

1. **Check Supabase Project Status**: Make sure your Supabase project is active and not paused
2. **Verify RLS Policies**: Ensure the RLS policies allow authenticated users to INSERT
3. **Check Environment Variables**: Make sure all required environment variables are set correctly
4. **Check Console Logs**: The improved error handling will now show detailed error information

The app will now gracefully handle missing tables by returning default free subscription data instead of crashing.
