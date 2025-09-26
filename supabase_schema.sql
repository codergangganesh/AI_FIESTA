-- AI Fiesta Model Comparison History Table
-- Run this SQL in your Supabase SQL editor to create the table

CREATE TABLE IF NOT EXISTS model_comparisons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  selected_models TEXT[] NOT NULL,
  responses JSONB NOT NULL,
  best_response_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_model_comparisons_user_id ON model_comparisons(user_id);
CREATE INDEX IF NOT EXISTS idx_model_comparisons_created_at ON model_comparisons(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE model_comparisons ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own comparisons" ON model_comparisons
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own comparisons" ON model_comparisons
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comparisons" ON model_comparisons
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comparisons" ON model_comparisons
  FOR DELETE USING (auth.uid() = user_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_model_comparisons_updated_at 
  BEFORE UPDATE ON model_comparisons 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Sample data structure for responses JSONB field:
-- [
--   {
--     "modelId": "openai/gpt-4o",
--     "content": "Response content here...",
--     "success": true,
--     "error": null,
--     "wordCount": 150,
--     "latency": 1200,
--     "cost": 0.05
--   }
-- ]
