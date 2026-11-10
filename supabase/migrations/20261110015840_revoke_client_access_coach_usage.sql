/*
# Remove client access to coach_usage

1. Modified Tables
- `coach_usage`: the database's default privileges had granted full access to the `anon` and `authenticated` roles. This migration revokes them.
2. Security
- Only `service_role` (used by the AI Coach server function) can read and write usage rows.
- RLS remains enabled with no client policies, so browsers cannot read or change usage counts.
*/

REVOKE ALL ON coach_usage FROM anon;
REVOKE ALL ON coach_usage FROM authenticated;
GRANT SELECT, INSERT ON coach_usage TO service_role;
