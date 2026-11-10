/*
# Scope progress_entries to their owner

1. Modified Tables
- `progress_entries`
  - New column `user_id` (uuid, defaults to the signed-in user, cascades on account deletion).
  - Existing rows keep a null owner and are therefore hidden from everyone. No data is deleted.
  - New index on (user_id, date) for loading a user's own history.
2. Security
- Replaces four policies that used `USING (true)` / `WITH CHECK (true)`, which let any signed-in
  user read, change and delete every athlete's workout history, with owner-scoped policies.
- Revokes all privileges from `anon`; the app requires sign-in for this data.
- Grants SELECT, INSERT, UPDATE, DELETE to `authenticated` only.

# Notes
1. Ownership is enforced in the database, so it cannot be bypassed from the browser.
2. Rows created before this change have no owner and are not visible to any user.
*/

ALTER TABLE progress_entries ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS progress_entries_user_date_idx ON progress_entries (user_id, date DESC);

REVOKE ALL ON progress_entries FROM anon;
REVOKE ALL ON progress_entries FROM authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON progress_entries TO authenticated;

DROP POLICY IF EXISTS select_progress_entries ON progress_entries;
DROP POLICY IF EXISTS insert_progress_entries ON progress_entries;
DROP POLICY IF EXISTS update_progress_entries ON progress_entries;
DROP POLICY IF EXISTS delete_progress_entries ON progress_entries;

CREATE POLICY "select_own_progress_entries" ON progress_entries FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "insert_own_progress_entries" ON progress_entries FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_progress_entries" ON progress_entries FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete_own_progress_entries" ON progress_entries FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
