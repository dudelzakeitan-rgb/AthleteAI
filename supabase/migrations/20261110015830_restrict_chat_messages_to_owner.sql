/*
# Restrict chat_messages to their owner

1. Modified Tables
- `chat_messages`
  - New column `user_id` (uuid, references the user who sent the message, cascades on account deletion). It defaults to the signed-in user, so new messages are assigned automatically.
  - Existing rows are kept. They have no known owner, so they stay hidden from every user. Nothing is deleted.
  - New index on (user_id, timestamp) for loading a user's history.
2. Security
- Revoke all privileges from the `anon` role. Signed-out visitors can no longer read or write chat messages.
- Grant SELECT and INSERT to `authenticated` only. The app does not update or delete messages.
- Replace the old policies, which allowed every signed-in user to read all rows, with two owner-scoped policies:
  - "select_own_chat_messages": users can read only rows where user_id matches their session.
  - "insert_own_chat_messages": users can insert only rows where user_id matches their session.

# Notes
1. Ownership is enforced in the database itself, so it cannot be bypassed from the browser.
2. Rows with no owner (created before this change) are not visible to any user.
*/

ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS chat_messages_user_timestamp_idx ON chat_messages (user_id, timestamp);

REVOKE ALL ON chat_messages FROM anon;
REVOKE ALL ON chat_messages FROM authenticated;
GRANT SELECT, INSERT ON chat_messages TO authenticated;

DROP POLICY IF EXISTS insert_chat_messages ON chat_messages;
DROP POLICY IF EXISTS select_chat_messages ON chat_messages;
DROP POLICY IF EXISTS select_own_chat_messages ON chat_messages;
DROP POLICY IF EXISTS insert_own_chat_messages ON chat_messages;

CREATE POLICY "select_own_chat_messages" ON chat_messages FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "insert_own_chat_messages" ON chat_messages FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
