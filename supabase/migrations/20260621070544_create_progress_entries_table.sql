-- Create progress_entries table for tracking athlete workouts
CREATE TABLE IF NOT EXISTS progress_entries (
  id TEXT PRIMARY KEY,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sport TEXT NOT NULL,
  workout_type TEXT NOT NULL,
  duration INTEGER NOT NULL,
  completed BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_questionnaires table for saving athlete profiles
CREATE TABLE IF NOT EXISTS user_questionnaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sport TEXT NOT NULL,
  improvement TEXT NOT NULL,
  age INTEGER NOT NULL,
  skill_level TEXT NOT NULL,
  sessions_per_week INTEGER NOT NULL,
  training_duration INTEGER NOT NULL,
  equipment TEXT[] DEFAULT '{}',
  weakness TEXT,
  goal TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_achievements table for tracking progress on achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id TEXT PRIMARY KEY,
  progress INTEGER DEFAULT 0,
  earned_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE progress_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for progress_entries (public access for demo)
CREATE POLICY "select_progress_entries" ON progress_entries FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_progress_entries" ON progress_entries FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_progress_entries" ON progress_entries FOR UPDATE TO authenticated USING (true);
CREATE POLICY "delete_progress_entries" ON progress_entries FOR DELETE TO authenticated USING (true);

-- Create policies for user_questionnaires
CREATE POLICY "select_questionnaires" ON user_questionnaires FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_questionnaires" ON user_questionnaires FOR INSERT TO authenticated WITH CHECK (true);

-- Create policies for user_achievements
CREATE POLICY "select_achievements" ON user_achievements FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_achievements" ON user_achievements FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_achievements" ON user_achievements FOR UPDATE TO authenticated USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_progress_entries_date ON progress_entries(date DESC);
CREATE INDEX IF NOT EXISTS idx_progress_entries_sport ON progress_entries(sport);