-- Add trigger to user_settings table
-- This migration adds the trigger to update the updated_at column for user_settings table
-- The update_updated_at_column function is already defined in the feedback migration

-- Create trigger to automatically update updated_at column
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();