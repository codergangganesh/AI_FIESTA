-- Migration to remove hyperparameter_jobs table
-- This migration drops the hyperparameter_jobs table and all related database objects

-- Drop indexes related to hyperparameter_jobs
DROP INDEX IF EXISTS idx_hyperparameter_jobs_user_id;
DROP INDEX IF EXISTS idx_hyperparameter_jobs_status;

-- Drop RLS policy for hyperparameter_jobs
DROP POLICY IF EXISTS "Users can access their own tuning jobs" ON hyperparameter_jobs;

-- Disable RLS on hyperparameter_jobs (if enabled)
ALTER TABLE hyperparameter_jobs DISABLE ROW LEVEL SECURITY;

-- Drop trigger for hyperparameter_jobs
DROP TRIGGER IF EXISTS update_hyperparameter_jobs_updated_at ON hyperparameter_jobs;

-- Finally, drop the hyperparameter_jobs table
DROP TABLE IF EXISTS hyperparameter_jobs;

-- Remove any references to hyperparameter_jobs in functions
-- (No specific functions found that directly reference hyperparameter_jobs)