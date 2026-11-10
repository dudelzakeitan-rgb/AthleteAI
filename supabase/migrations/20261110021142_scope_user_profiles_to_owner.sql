/*
# Scope user_profiles to their owner

1. Modified Tables
- `user_profiles`
  - New column `user_id` (uuid, defaults to the signed-in user, cascades on account deletion).
  - Backfilled from the existing text `id` where that id is already a valid user identifier,
    so profiles saved with the user's own id keep working. No data is deleted.
  - New unique index on `user_id` so each account has a single profile.
2. Security
- Replaces select/insert/update policies that used `USING (true)` / `WITH CHECK (true)`, which let
  any signed-in user read and edit every athlete's name, age, weight, height and goals, with
  owner-scoped policies.
- Revokes all privileges from `anon`.
- Grants SELECT, INSERT, UPDATE to `authenticated` only (profiles are never deleted by the app).

# Notes
1. Ownership is enforced in the database and cannot be bypassed from the browser.
2. Profiles whose owner could not be determined stay in the table but are not visible to anyone.
*/

ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;

UPDATE user_profiles p
SET user_id = u.id
FROM auth.users u
WHERE p.user_id IS NULL
  AND p.id ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
  AND u.id = p.id::uuid;

CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_user_id_key ON user_profiles (user_id);

REVOKE ALL ON user_profiles FROM anon;
REVOKE ALL ON user_profiles FROM authenticated;
GRANT SELECT, INSERT, UPDATE ON user_profiles TO authenticated;

DROP POLICY IF EXISTS select_user_profiles ON user_profiles;
DROP POLICY IF EXISTS insert_user_profiles ON user_profiles;
DROP POLICY IF EXISTS update_user_profiles ON user_profiles;

CREATE POLICY "select_own_user_profile" ON user_profiles FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "insert_own_user_profile" ON user_profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_user_profile" ON user_profiles FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
