/*
# Create coach_usage table for AI Coach rate limiting

1. New Tables
- `coach_usage`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references the signed-in user, cascades on account deletion)
  - `created_at` (timestamp, defaults to now)
2. Modified Tables
- None
3. Security
- Enable RLS on `coach_usage`.
- No policies for anon or authenticated users: clients cannot read or write usage rows directly.
- Grant SELECT and INSERT to `service_role` only, so the AI Coach server function can count and record requests per user.
4. Notes
- Each AI Coach request inserts one row; the server counts rows from the last hour to enforce the per-user limit.
*/

CREATE TABLE IF NOT EXISTS coach_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS coach_usage_user_created_idx ON coach_usage (user_id, created_at);

ALTER TABLE coach_usage ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON coach_usage TO service_role;
