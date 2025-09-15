-- Migration script to remove dataset analysis and explainability tables
-- This should be run after removing the features from the application

-- Drop the tables that are no longer needed
DROP TABLE IF EXISTS explainability_results;
DROP TABLE IF EXISTS dataset_analyses;

-- Remove indexes related to these tables
DROP INDEX IF EXISTS idx_explainability_results_user_id;
DROP INDEX IF EXISTS idx_dataset_analyses_user_id;

-- Remove RLS policies
DROP POLICY IF EXISTS "Users can access their own explainability results" ON explainability_results;
DROP POLICY IF EXISTS "Users can access their own dataset analyses" ON dataset_analyses;