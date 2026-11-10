/*
# Scope user_questionnaires to their owner

1. Modified Tables
- `user_questionnaires`
  - New column `user_id` (uuid, defaults to the signed-in user, cascades on account deletion).
  - Existing rows keep a null owner and are hidden from everyone. No data is deleted.
  - New index on (user_id, created_at).
2. Security
- Replaces select/insert policies that used `USING (true)` / `WITH CHECK (true)`, which let any
  signed-in user read every athlete's age, skill level, stated weaknesses and goals, with
  owner-scoped policies.
- Revokes all privileges from `anon`.
- Grants SELECT, INSERT to `authenticated` only.

# Notes
1. Ownership is enforced in the database and cannot be bypassed from the browser.
*/

ALTER TABLE user_questionnaires ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS user_questionnaires_user_created_idx ON user_questionnaires (user_id, created_at DESC);

REVOKE ALL ON user_questionnaires FROM anon;
REVOKE ALL ON user_questionnaires FROM authenticated;
GRANT SELECT, INSERT ON user_questionnaires TO authenticated;

DROP POLICY IF EXISTS select_questionnaires ON user_questionnaires;
DROP POLICY IF EXISTS insert_questionnaires ON user_questionnaires;

CREATE POLICY "select_own_questionnaires" ON user_questionnaires FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "insert_own_questionnaires" ON user_questionnaires FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
