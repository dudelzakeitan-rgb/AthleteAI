/*
# Scope hydration_entries and user_achievements to their owner

1. Modified Tables
- `hydration_entries`
  - New column `user_id` (uuid, defaults to the signed-in user, cascades on account deletion).
  - New index on (user_id, date).
- `user_achievements`
  - New column `user_id` (uuid, defaults to the signed-in user, cascades on account deletion).
  - New unique index on (user_id, id) so achievement progress is tracked per account instead of
    one shared row per achievement.
  - Existing rows keep a null owner and are hidden from everyone. No data is deleted.
2. Security
- Replaces policies that used `USING (true)` / `WITH CHECK (true)` on both tables. Previously any
  signed-in user could read everyone's hydration log, and could change any achievement's progress
  and earned date, awarding or removing badges for other athletes.
- Revokes all privileges from `anon` on both tables.
- `hydration_entries`: grants SELECT, INSERT to `authenticated`.
- `user_achievements`: grants SELECT, INSERT, UPDATE to `authenticated`.

# Notes
1. `progress` and `earned_at` carry value, so they are now writable only on the caller's own row.
2. Ownership is enforced in the database and cannot be bypassed from the browser.
*/

ALTER TABLE hydration_entries ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS hydration_entries_user_date_idx ON hydration_entries (user_id, date DESC);

REVOKE ALL ON hydration_entries FROM anon;
REVOKE ALL ON hydration_entries FROM authenticated;
GRANT SELECT, INSERT ON hydration_entries TO authenticated;

DROP POLICY IF EXISTS select_hydration ON hydration_entries;
DROP POLICY IF EXISTS insert_hydration ON hydration_entries;

CREATE POLICY "select_own_hydration" ON hydration_entries FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "insert_own_hydration" ON hydration_entries FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

ALTER TABLE user_achievements ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE UNIQUE INDEX IF NOT EXISTS user_achievements_user_id_achievement_key ON user_achievements (user_id, id);

REVOKE ALL ON user_achievements FROM anon;
REVOKE ALL ON user_achievements FROM authenticated;
GRANT SELECT, INSERT, UPDATE ON user_achievements TO authenticated;

DROP POLICY IF EXISTS select_achievements ON user_achievements;
DROP POLICY IF EXISTS insert_achievements ON user_achievements;
DROP POLICY IF EXISTS update_achievements ON user_achievements;

CREATE POLICY "select_own_achievements" ON user_achievements FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "insert_own_achievements" ON user_achievements FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_achievements" ON user_achievements FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
