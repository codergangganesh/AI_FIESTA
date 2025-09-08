-- Database Schema for AI Fiesta Enhanced Features
-- Run these SQL commands in your Supabase SQL editor

-- User Plans Table
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
  UNIQUE(user_email)
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_id VARCHAR(255) NOT NULL UNIQUE,
  order_id VARCHAR(255) NOT NULL,
  signature VARCHAR(255) NOT NULL,
  amount INTEGER NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  plan_type VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Model Comparisons Table (Enhanced)
CREATE TABLE IF NOT EXISTS model_comparisons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  models JSONB NOT NULL, -- Array of model names used
  prompt TEXT NOT NULL,
  responses JSONB NOT NULL, -- Responses from each model
  metrics JSONB, -- Performance metrics (accuracy, speed, cost, etc.)
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  execution_time_ms INTEGER,
  total_tokens INTEGER,
  cost_usd DECIMAL(10, 4),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hyperparameter Tuning Jobs Table
CREATE TABLE IF NOT EXISTS hyperparameter_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  model_name VARCHAR(100) NOT NULL,
  parameters JSONB NOT NULL, -- Parameter configuration
  search_strategy VARCHAR(50) DEFAULT 'grid_search' CHECK (search_strategy IN ('grid_search', 'random_search', 'bayesian')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  best_score DECIMAL(5, 4),
  best_parameters JSONB,
  total_trials INTEGER DEFAULT 0,
  completed_trials INTEGER DEFAULT 0,
  results JSONB, -- Trial results and metrics
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Model Explainability Results Table
CREATE TABLE IF NOT EXISTS explainability_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  comparison_id UUID REFERENCES model_comparisons(id) ON DELETE CASCADE,
  model_name VARCHAR(100) NOT NULL,
  method VARCHAR(50) NOT NULL CHECK (method IN ('shap', 'lime', 'integrated_gradients')),
  feature_importance JSONB, -- Feature importance scores
  local_explanations JSONB, -- Local explanations for predictions
  global_explanations JSONB, -- Global model behavior
  visualizations JSONB, -- Chart data and configs
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dataset Analysis Table
CREATE TABLE IF NOT EXISTS dataset_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  summary_stats JSONB, -- Basic statistics
  eda_results JSONB, -- Exploratory data analysis results
  insights JSONB, -- Generated insights and recommendations
  visualizations JSONB, -- Chart configurations
  quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Settings Table (Enhanced)
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_picture_url TEXT,
  display_name VARCHAR(255),
  preferences JSONB DEFAULT '{"theme": "dark", "notifications": true, "email_updates": true}',
  api_keys JSONB, -- Encrypted API keys for external services
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('success', 'error', 'warning', 'info')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  action_label VARCHAR(100),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Usage Tracking Table
CREATE TABLE IF NOT EXISTS api_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL,
  status_code INTEGER,
  response_time_ms INTEGER,
  tokens_used INTEGER,
  cost_usd DECIMAL(10, 4),
  request_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Model Performance Cache Table
CREATE TABLE IF NOT EXISTS model_performance_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  model_name VARCHAR(100) NOT NULL,
  prompt_hash VARCHAR(64) NOT NULL, -- SHA-256 hash of the prompt
  response TEXT NOT NULL,
  metrics JSONB NOT NULL, -- Performance metrics
  tokens_used INTEGER,
  response_time_ms INTEGER,
  cost_usd DECIMAL(10, 4),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(model_name, prompt_hash)
);

-- Billing History Table
CREATE TABLE IF NOT EXISTS billing_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  amount INTEGER NOT NULL, -- Amount in paise/cents
  currency VARCHAR(10) DEFAULT 'INR',
  plan_type VARCHAR(20) NOT NULL,
  billing_period_start TIMESTAMPTZ NOT NULL,
  billing_period_end TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) DEFAULT 'paid' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  invoice_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment History Table for Stripe events
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id VARCHAR(255) NOT NULL,
  subscription_id VARCHAR(255),
  customer_id VARCHAR(255) NOT NULL,
  amount INTEGER NOT NULL,
  currency VARCHAR(10) DEFAULT 'inr',
  status VARCHAR(20) NOT NULL CHECK (status IN ('succeeded', 'failed', 'pending')),
  payment_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_user_plans_user_id ON user_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_user_plans_user_email ON user_plans(user_email);
CREATE INDEX IF NOT EXISTS idx_user_plans_subscription_id ON user_plans(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payment_history_subscription_id ON payment_history(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_customer_id ON payment_history(customer_id);
CREATE INDEX IF NOT EXISTS idx_model_comparisons_user_id ON model_comparisons(user_id);
CREATE INDEX IF NOT EXISTS idx_model_comparisons_status ON model_comparisons(status);
CREATE INDEX IF NOT EXISTS idx_hyperparameter_jobs_user_id ON hyperparameter_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_hyperparameter_jobs_status ON hyperparameter_jobs(status);
CREATE INDEX IF NOT EXISTS idx_explainability_results_user_id ON explainability_results(user_id);
CREATE INDEX IF NOT EXISTS idx_dataset_analyses_user_id ON dataset_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_api_usage_user_id ON api_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_created_at ON api_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_model_performance_cache_model_name ON model_performance_cache(model_name);
CREATE INDEX IF NOT EXISTS idx_billing_history_user_id ON billing_history(user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE hyperparameter_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE explainability_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE dataset_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can only access their own data
CREATE POLICY "Users can access their own plan" ON user_plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access their own payments" ON payments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access their own comparisons" ON model_comparisons FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access their own tuning jobs" ON hyperparameter_jobs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access their own explainability results" ON explainability_results FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access their own dataset analyses" ON dataset_analyses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access their own settings" ON user_settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access their own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access their own API usage" ON api_usage FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access their own billing history" ON billing_history FOR ALL USING (auth.uid() = user_id);

-- Model performance cache is readable by all authenticated users (for performance)
CREATE POLICY "Authenticated users can read model cache" ON model_performance_cache FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert model cache" ON model_performance_cache FOR INSERT TO authenticated WITH CHECK (true);

-- Functions for common operations
-- Function to update user plan usage
CREATE OR REPLACE FUNCTION update_user_usage(
  p_user_id UUID,
  p_type VARCHAR(20),
  p_amount INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  current_usage JSONB;
  new_usage JSONB;
BEGIN
  SELECT usage INTO current_usage 
  FROM user_plans 
  WHERE user_id = p_user_id;
  
  IF current_usage IS NULL THEN
    current_usage := '{"comparisons": 0, "storage": 0, "apiCalls": 0}';
  END IF;
  
  new_usage := jsonb_set(
    current_usage, 
    ARRAY[p_type], 
    to_jsonb((current_usage->p_type)::INTEGER + p_amount)
  );
  
  UPDATE user_plans 
  SET usage = new_usage, updated_at = NOW()
  WHERE user_id = p_user_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can perform action based on plan limits
CREATE OR REPLACE FUNCTION check_user_limit(
  p_user_id UUID,
  p_type VARCHAR(20),
  p_amount INTEGER DEFAULT 1
)
RETURNS BOOLEAN AS $$
DECLARE
  user_plan_type VARCHAR(20);
  current_usage INTEGER;
  plan_limit INTEGER;
BEGIN
  SELECT plan_type, (usage->p_type)::INTEGER 
  INTO user_plan_type, current_usage
  FROM user_plans 
  WHERE user_id = p_user_id;
  
  -- Define limits based on plan type
  CASE user_plan_type
    WHEN 'free' THEN
      CASE p_type
        WHEN 'comparisons' THEN plan_limit := 10;
        WHEN 'storage' THEN plan_limit := 1;
        WHEN 'apiCalls' THEN plan_limit := 100;
        ELSE plan_limit := 0;
      END CASE;
    WHEN 'pro' THEN
      CASE p_type
        WHEN 'comparisons' THEN plan_limit := 500;
        WHEN 'storage' THEN plan_limit := 10;
        WHEN 'apiCalls' THEN plan_limit := 5000;
        ELSE plan_limit := 0;
      END CASE;
    WHEN 'pro_plus' THEN
      CASE p_type
        WHEN 'comparisons' THEN plan_limit := -1; -- unlimited
        WHEN 'storage' THEN plan_limit := 100;
        WHEN 'apiCalls' THEN plan_limit := 50000;
        ELSE plan_limit := 0;
      END CASE;
    ELSE
      plan_limit := 0;
  END CASE;
  
  -- Check if within limits (-1 means unlimited)
  RETURN plan_limit = -1 OR (current_usage + p_amount) <= plan_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for tables with updated_at columns
CREATE TRIGGER update_user_plans_updated_at BEFORE UPDATE ON user_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_model_comparisons_updated_at BEFORE UPDATE ON model_comparisons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hyperparameter_jobs_updated_at BEFORE UPDATE ON hyperparameter_jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dataset_analyses_updated_at BEFORE UPDATE ON dataset_analyses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();