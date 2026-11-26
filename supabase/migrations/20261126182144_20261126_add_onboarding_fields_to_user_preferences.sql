/*
# Extend user_preferences with full onboarding answers

1. Plain-English summary
   The onboarding questionnaire now collects more than goals and sports: body basics,
   available training days, injuries, the athlete's existing schedule, and dietary
   notes. These columns store those answers so both the web app and the mobile app
   can reuse them for AI Coach and workout generation without asking again.

2. Modified tables
   - `user_preferences`: new nullable columns
     - `age` (integer) — athlete age; drives age-appropriate training/nutrition
     - `height_cm` (integer) — height in centimeters
     - `weight_kg` (numeric) — optional weight in kilograms
     - `training_days` (text[]) — days of the week the athlete can train
     - `injuries` (text) — injuries and limitations the coach should work around
     - `current_schedule` (text) — the athlete's existing training schedule
     - `diet_notes` (text) — dietary preferences and allergies

3. Security changes
   - None. Row Level Security and existing owner-scoped policies remain unchanged;
     new columns inherit the table's existing grants.

4. Important notes
   - All columns are nullable so existing rows and clients keep working unchanged.
   - Idempotent: uses ADD COLUMN IF NOT EXISTS.
*/

ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS age integer;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS height_cm integer;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS weight_kg numeric;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS training_days text[];
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS injuries text;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS current_schedule text;
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS diet_notes text;
