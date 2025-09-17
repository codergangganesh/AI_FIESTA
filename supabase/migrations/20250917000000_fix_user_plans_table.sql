-- Fix user_plans table structure and add missing columns
CREATE TABLE IF NOT EXISTS user_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email VARCHAR(255) NOT NULL,
  plan_type VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'pro_plus')),
  billing_cycle VARCHAR(20) DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  subscription_id VARCHAR(255) UNIQUE,
  customer_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  payment_id VARCHAR(255),
  subscription_end TIMESTAMPTZ,
  usage JSONB DEFAULT '{"comparisons": 0, "storage": 0, "apiCalls": 0}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id),
  UNIQUE(user_email)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_plans_user_id ON user_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_user_plans_user_email ON user_plans(user_email);
CREATE INDEX IF NOT EXISTS idx_user_plans_subscription_id ON user_plans(subscription_id);

-- Enable RLS
ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can only access their own data
CREATE POLICY "Users can access their own plan" ON user_plans FOR ALL USING (auth.uid() = user_id);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update timestamps
DROP TRIGGER IF EXISTS update_user_plans_updated_at ON user_plans;
CREATE TRIGGER update_user_plans_updated_at 
  BEFORE UPDATE ON user_plans 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically update user_email when user_id is set
CREATE OR REPLACE FUNCTION update_user_email_from_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NOT NULL AND (NEW.user_email IS NULL OR NEW.user_email = '') THEN
    SELECT email INTO NEW.user_email FROM auth.users WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically populate user_email from user_id
DROP TRIGGER IF EXISTS update_user_email_trigger ON user_plans;
CREATE TRIGGER update_user_email_trigger
  BEFORE INSERT OR UPDATE ON user_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_user_email_from_user_id();