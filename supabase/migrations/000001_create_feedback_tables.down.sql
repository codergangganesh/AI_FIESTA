-- Reverse the changes in the up migration
DROP TABLE IF EXISTS contact_messages;
DROP TABLE IF EXISTS feedback_messages;

-- Remove triggers
DROP TRIGGER IF EXISTS update_feedback_messages_updated_at ON feedback_messages;
DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON contact_messages;