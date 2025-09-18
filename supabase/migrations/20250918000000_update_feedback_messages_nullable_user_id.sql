-- Update feedback_messages table to allow NULL user_id for public feedback
ALTER TABLE feedback_messages 
ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS policy to allow public read access to feedback
DROP POLICY IF EXISTS "Users can access their own feedback" ON feedback_messages;
CREATE POLICY "Public can view feedback" ON feedback_messages FOR SELECT USING (true);
CREATE POLICY "Users can insert their own feedback" ON feedback_messages FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "Users can update their own feedback" ON feedback_messages FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own feedback" ON feedback_messages FOR DELETE USING (user_id = auth.uid());