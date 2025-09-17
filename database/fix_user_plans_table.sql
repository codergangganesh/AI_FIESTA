-- Fix user_plans table structure
-- This script should be run in the Supabase SQL editor

-- Add missing columns if they don't exist
ALTER TABLE user_plans 
ADD COLUMN IF NOT EXISTS user_email VARCHAR(255);

ALTER TABLE user_plans 
ADD COLUMN IF NOT EXISTS billing_cycle VARCHAR(20) DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly'));

ALTER TABLE user_plans 
ADD COLUMN IF NOT EXISTS subscription_id VARCHAR(255) UNIQUE;

ALTER TABLE user_plans 
ADD COLUMN IF NOT EXISTS customer_id VARCHAR(255);

ALTER TABLE user_plans 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing'));

ALTER TABLE user_plans 
ADD COLUMN IF NOT EXISTS current_period_start TIMESTAMPTZ;

ALTER TABLE user_plans 
ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ;

ALTER TABLE user_plans 
ADD COLUMN IF NOT EXISTS trial_end TIMESTAMPTZ;

ALTER TABLE user_plans 
ADD COLUMN IF NOT EXISTS payment_id VARCHAR(255);

ALTER TABLE user_plans 
ADD COLUMN IF NOT EXISTS subscription_end TIMESTAMPTZ;

ALTER TABLE user_plans 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add constraints if they don't exist
ALTER TABLE user_plans 
ADD CONSTRAINT IF NOT EXISTS user_plans_plan_type_check 
CHECK (plan_type IN ('free', 'pro', 'pro_plus'));

ALTER TABLE user_plans 
ADD CONSTRAINT IF NOT EXISTS user_plans_billing_cycle_check 
CHECK (billing_cycle IN ('monthly', 'yearly'));

ALTER TABLE user_plans 
ADD CONSTRAINT IF NOT EXISTS user_plans_status_check 
CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing'));

-- Add unique constraints if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_plans_user_id_key'
  ) THEN
    ALTER TABLE user_plans ADD CONSTRAINT user_plans_user_id_key UNIQUE (user_id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_plans_user_email_key'
  ) THEN
    ALTER TABLE user_plans ADD CONSTRAINT user_plans_user_email_key UNIQUE (user_email);
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_user_plans_user_id ON user_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_user_plans_user_email ON user_plans(user_email);
CREATE INDEX IF NOT EXISTS idx_user_plans_subscription_id ON user_plans(subscription_id);

-- Update existing records to ensure user_email is populated
UPDATE user_plans 
SET user_email = (
  SELECT email 
  FROM auth.users 
  WHERE auth.users.id = user_plans.user_id
)
WHERE user_email IS NULL OR user_email = '';

-- Create or replace the timestamp update function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create or replace the timestamp update trigger
DROP TRIGGER IF EXISTS update_user_plans_updated_at ON user_plans;
CREATE TRIGGER update_user_plans_updated_at 
  BEFORE UPDATE ON user_plans 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically update user_email from user_id
CREATE OR REPLACE FUNCTION update_user_email_from_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NOT NULL AND (NEW.user_email IS NULL OR NEW.user_email = '') THEN
    SELECT email INTO NEW.user_email FROM auth.users WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically populate user_email from user_id
DROP TRIGGER IF EXISTS update_user_email_trigger ON user_plans;
CREATE TRIGGER update_user_email_trigger
  BEFORE INSERT OR UPDATE ON user_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_user_email_from_user_id();