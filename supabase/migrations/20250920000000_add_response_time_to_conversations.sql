-- Add response_time column to conversations table
ALTER TABLE public.conversations 
ADD COLUMN IF NOT EXISTS response_time DECIMAL(10, 4) DEFAULT 0.0000;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_conversations_response_time ON public.conversations(response_time);