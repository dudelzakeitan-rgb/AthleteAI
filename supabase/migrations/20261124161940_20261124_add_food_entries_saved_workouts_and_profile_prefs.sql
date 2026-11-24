/*
# Food log, saved workouts, and profile training preferences

1. New Tables
- `food_entries`: one row per logged food item.
  - `id` (uuid, primary key)
  - `user_id` (uuid, not null, defaults to the authenticated user, FK to auth.users with cascade delete)
  - `entry_date` (date, not null) — the day the food was eaten
  - `meal_type` (text, not null) — one of breakfast / lunch / dinner / snacks
  - `name` (text, not null) — what was eaten
  - `calories` (integer, not null, default 0)
  - `is_estimate` (boolean, default false) — true when calories came from an AI estimate
  - `created_at` (timestamp)
- `saved_workouts`: one row per completed workout, with a unique key for safe retries.
  - `id` (uuid, primary key)
  - `client_key` (text, unique, not null) — generated once per workout session so retrying a save cannot create duplicates
  - `user_id` (uuid, not null, defaults to the authenticated user, FK to auth.users with cascade delete)
  - `sport` (text, not null)
  - `workout_type` (text, not null)
  - `duration` (integer, not null)
  - `calories_burned` (integer)
  - `intensity` (text)
  - `notes` (text)
  - `completed_at` (timestamp, defaults to now)
- `user_preferences`: one row per user holding onboarding answers used by workout generation and the AI coach.
  - `id` (uuid, primary key)
  - `user_id` (uuid, not null, unique, defaults to the authenticated user, FK to auth.users with cascade delete)
  - `goals` (text array) — training goals
  - `sports` (text array) — preferred sports
  - `skill_level` (text) — experience level
  - `equipment` (text array) — available equipment
  - `sessions_per_week` (integer)
  - `session_minutes` (integer)
  - `updated_at` (timestamp)

2. Modified Tables
- `user_profiles`: added `full_name` (text) so sign-up can store the user's displayed name. Existing rows keep working (nullable).

3. Security
- RLS enabled on all three new tables.
- Owner-scoped CRUD granted to authenticated only: users can read and modify only their own rows via `auth.uid() = user_id` policies (4 policies per table: select, insert, update, delete).
- `user_id` defaults to `auth.uid()` so client inserts that omit it still satisfy the insert policy.
- `user_profiles` already has owner-scoped RLS; `full_name` inherits it.

4. Important Notes
- `client_key` unique index makes Finish Workout retries idempotent: an "upsert on conflict do nothing" cannot record the same workout twice.
- No existing tables or columns are dropped or altered in type; this is additive only.
*/

CREATE TABLE IF NOT EXISTS food_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snacks')),
  name text NOT NULL,
  calories integer NOT NULL DEFAULT 0,
  is_estimate boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS saved_workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_key text NOT NULL UNIQUE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  sport text NOT NULL,
  workout_type text NOT NULL,
  duration integer NOT NULL,
  calories_burned integer,
  intensity text,
  notes text,
  completed_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  goals text[] NOT NULL DEFAULT '{}',
  sports text[] NOT NULL DEFAULT '{}',
  skill_level text,
  equipment text[] NOT NULL DEFAULT '{}',
  sessions_per_week integer,
  session_minutes integer,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE food_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN full_name text;
  END IF;
END $$;

GRANT SELECT, INSERT, UPDATE, DELETE ON food_entries TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON saved_workouts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_preferences TO authenticated;

DROP POLICY IF EXISTS "Users can view own food entries" ON food_entries;
CREATE POLICY "Users can view own food entries" ON food_entries FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own food entries" ON food_entries;
CREATE POLICY "Users can insert own food entries" ON food_entries FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own food entries" ON food_entries;
CREATE POLICY "Users can update own food entries" ON food_entries FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own food entries" ON food_entries;
CREATE POLICY "Users can delete own food entries" ON food_entries FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own saved workouts" ON saved_workouts;
CREATE POLICY "Users can view own saved workouts" ON saved_workouts FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own saved workouts" ON saved_workouts;
CREATE POLICY "Users can insert own saved workouts" ON saved_workouts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own saved workouts" ON saved_workouts;
CREATE POLICY "Users can update own saved workouts" ON saved_workouts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own saved workouts" ON saved_workouts;
CREATE POLICY "Users can delete own saved workouts" ON saved_workouts FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own preferences" ON user_preferences;
CREATE POLICY "Users can view own preferences" ON user_preferences FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own preferences" ON user_preferences;
CREATE POLICY "Users can insert own preferences" ON user_preferences FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own preferences" ON user_preferences;
CREATE POLICY "Users can update own preferences" ON user_preferences FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own preferences" ON user_preferences;
CREATE POLICY "Users can delete own preferences" ON user_preferences FOR DELETE TO authenticated USING (auth.uid() = user_id);
