-- Add trigger to oauth_user_passwords table
-- This migration adds the trigger to update the updated_at column for oauth_user_passwords table
-- The update_updated_at_column function is already defined in the feedback migration

-- Create trigger to automatically update updated_at column
CREATE TRIGGER update_oauth_user_passwords_updated_at 
  BEFORE UPDATE ON oauth_user_passwords 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();