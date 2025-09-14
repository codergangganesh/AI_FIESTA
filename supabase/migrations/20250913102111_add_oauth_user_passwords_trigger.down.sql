-- Remove trigger from oauth_user_passwords table
DROP TRIGGER IF EXISTS update_oauth_user_passwords_updated_at ON oauth_user_passwords;