-- Create user_profiles table for storing user settings
CREATE TABLE IF NOT EXISTS user_profiles (
  id TEXT PRIMARY KEY,
  name TEXT,
  age INTEGER,
  weight DECIMAL(5,2),
  height INTEGER,
  sport TEXT DEFAULT 'swimming',
  goal TEXT,
  skill_level TEXT DEFAULT 'intermediate',
  equipment TEXT[] DEFAULT '{}',
  notifications BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create chat_messages table for AI Coach history
CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create hydration_entries table for tracking water intake
CREATE TABLE IF NOT EXISTS hydration_entries (
  id TEXT PRIMARY KEY,
  date TIMESTAMPTZ NOT NULL,
  amount INTEGER NOT NULL,
  unit TEXT DEFAULT 'oz',
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create daily_meal_plans table for meal planning
CREATE TABLE IF NOT EXISTS daily_meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  breakfast JSONB,
  lunch JSONB,
  dinner JSONB,
  snacks JSONB,
  total_calories INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date)
);

-- Create video_analyses table for video analysis feature
CREATE TABLE IF NOT EXISTS video_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  video_url TEXT,
  sport TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  results JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all new tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE hydration_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_analyses ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "select_user_profiles" ON user_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_user_profiles" ON user_profiles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_user_profiles" ON user_profiles FOR UPDATE TO authenticated USING (true);

-- Create policies for chat_messages
CREATE POLICY "select_chat_messages" ON chat_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_chat_messages" ON chat_messages FOR INSERT TO authenticated WITH CHECK (true);

-- Create policies for hydration_entries
CREATE POLICY "select_hydration" ON hydration_entries FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_hydration" ON hydration_entries FOR INSERT TO authenticated WITH CHECK (true);

-- Create policies for daily_meal_plans
CREATE POLICY "select_meal_plans" ON daily_meal_plans FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_meal_plans" ON daily_meal_plans FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_meal_plans" ON daily_meal_plans FOR UPDATE TO authenticated USING (true);

-- Create policies for video_analyses
CREATE POLICY "select_video_analyses" ON video_analyses FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_video_analyses" ON video_analyses FOR INSERT TO authenticated WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_sport ON user_profiles(sport);
CREATE INDEX IF NOT EXISTS idx_chat_messages_timestamp ON chat_messages(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_hydration_entries_date ON hydration_entries(date DESC);
CREATE INDEX IF NOT EXISTS idx_video_analyses_status ON video_analyses(status);