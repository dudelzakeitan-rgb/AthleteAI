/*
# Scope video_analyses to their owner and stop owner forgery

1. Modified Tables
- `video_analyses`
  - New column `owner_id` (uuid, defaults to the signed-in user, cascades on account deletion).
    The owner now comes from the session rather than from the request.
  - The existing free-text `user_id` column is left in place so no data is lost, but clients can no
    longer write to it (see security below). It is kept for reference only.
  - New index on (owner_id, created_at).
2. Security
- Replaces select/insert policies that used `USING (true)` / `WITH CHECK (true)`, which let any
  signed-in user read every athlete's video links and analysis results, with owner-scoped policies.
- Previously the owner was a free-text column the browser filled in, so a caller could file a row
  under another person's identifier. Column-level grants now exclude it, and access is decided by
  the session-derived `owner_id` instead.
- Revokes all privileges from `anon`.
- Grants SELECT on the table and INSERT on only the columns a client may set.

# Notes
1. Because INSERT is granted per column, a client cannot set `user_id` or `owner_id` directly;
   `owner_id` is filled from the session by its default.
2. Rows created before this change have no owner and are not visible to any user.
*/

ALTER TABLE video_analyses ADD COLUMN IF NOT EXISTS owner_id uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS video_analyses_owner_created_idx ON video_analyses (owner_id, created_at DESC);

REVOKE ALL ON video_analyses FROM anon;
REVOKE ALL ON video_analyses FROM authenticated;
GRANT SELECT ON video_analyses TO authenticated;
GRANT INSERT (id, video_url, sport, status, results, created_at) ON video_analyses TO authenticated;

DROP POLICY IF EXISTS select_video_analyses ON video_analyses;
DROP POLICY IF EXISTS insert_video_analyses ON video_analyses;

CREATE POLICY "select_own_video_analyses" ON video_analyses FOR SELECT
  TO authenticated USING (auth.uid() = owner_id);

CREATE POLICY "insert_own_video_analyses" ON video_analyses FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = owner_id);
