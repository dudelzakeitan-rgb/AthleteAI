/*
# Scope daily_meal_plans to their owner

1. Modified Tables
- `daily_meal_plans`
  - New column `user_id` (uuid, defaults to the signed-in user, cascades on account deletion).
  - Replaces the table-wide uniqueness on `date` with a unique index on (user_id, date), so each
    athlete has their own plan per day instead of one plan per day shared by everyone.
  - Existing rows keep a null owner and are hidden from everyone. No data is deleted.
2. Security
- Replaces select/insert/update policies that used `USING (true)` / `WITH CHECK (true)`, which let
  any signed-in user read and overwrite another athlete's meal plan, with owner-scoped policies.
- Revokes all privileges from `anon`.
- Grants SELECT, INSERT, UPDATE to `authenticated` only.

# Notes
1. The old global uniqueness constraint was itself the sharing problem: it forced all users onto
   one row per date. Dropping that constraint does not remove any column or row.
2. Ownership is enforced in the database and cannot be bypassed from the browser.
*/

ALTER TABLE daily_meal_plans ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE daily_meal_plans DROP CONSTRAINT IF EXISTS daily_meal_plans_date_key;

CREATE UNIQUE INDEX IF NOT EXISTS daily_meal_plans_user_date_key ON daily_meal_plans (user_id, date);

REVOKE ALL ON daily_meal_plans FROM anon;
REVOKE ALL ON daily_meal_plans FROM authenticated;
GRANT SELECT, INSERT, UPDATE ON daily_meal_plans TO authenticated;

DROP POLICY IF EXISTS select_meal_plans ON daily_meal_plans;
DROP POLICY IF EXISTS insert_meal_plans ON daily_meal_plans;
DROP POLICY IF EXISTS update_meal_plans ON daily_meal_plans;

CREATE POLICY "select_own_meal_plans" ON daily_meal_plans FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "insert_own_meal_plans" ON daily_meal_plans FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_meal_plans" ON daily_meal_plans FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
