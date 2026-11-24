import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {
  Sport,
  Questionnaire,
  TrainingPlan,
  ProgressEntry,
  Achievement,
  UserProfile,
  ChatMessage,
  HydrationEntry,
  FoodEntry,
  TrainingPreferences,
} from '../types';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

interface AppState {
  // Training flow
  currentSport: Sport | null;
  setCurrentSport: (sport: Sport | null) => void;
  questionnaire: Questionnaire | null;
  setQuestionnaire: (q: Questionnaire | null) => void;
  selectedImprovement: string | null;
  setSelectedImprovement: (i: string | null) => void;
  currentPlan: TrainingPlan | null;
  setCurrentPlan: (plan: TrainingPlan | null) => void;

  // Progress tracking
  progressEntries: ProgressEntry[];
  addProgressEntry: (entry: ProgressEntry) => void;
  achievements: Achievement[];
  updateAchievement: (id: string, progress: number) => void;

  // User profile
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;

  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;

  // Last save failure, if any
  saveError: string | null;
  clearSaveError: () => void;

  // Hydration
  hydrationEntries: HydrationEntry[];
  addHydrationEntry: (entry: HydrationEntry) => void;

  // Food log
  foodEntries: FoodEntry[];
  addFoodEntry: (entry: Omit<FoodEntry, 'id' | 'createdAt'>) => Promise<FoodEntry | null>;
  updateFoodEntry: (id: string, changes: Partial<FoodEntry>) => Promise<boolean>;
  deleteFoodEntry: (id: string) => Promise<boolean>;

  // Training preferences (onboarding answers)
  preferences: TrainingPreferences | null;
  preferencesLoaded: boolean;
  savePreferences: (prefs: TrainingPreferences) => Promise<boolean>;

  // Training streak
  streak: number;
  setStreak: (streak: number) => void;

  // Auth session
  session: Session | null;
}

const AppContext = createContext<AppState | undefined>(undefined);

const defaultAchievements: Achievement[] = [
  {
    id: 'first_workout',
    title: 'First Steps',
    description: 'Complete your first training session',
    icon: 'Trophy',
    progress: 0,
    target: 1,
    category: 'workouts',
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Train 7 days in a row',
    icon: 'Flame',
    progress: 0,
    target: 7,
    category: 'streak',
  },
  {
    id: 'streak_30',
    title: 'Monthly Master',
    description: 'Train 30 days in a row',
    icon: 'Star',
    progress: 0,
    target: 30,
    category: 'streak',
  },
  {
    id: 'complete_10',
    title: 'Dedicated Athlete',
    description: 'Complete 10 training sessions',
    icon: 'Medal',
    progress: 0,
    target: 10,
    category: 'workouts',
  },
  {
    id: 'complete_50',
    title: 'Training Champion',
    description: 'Complete 50 training sessions',
    icon: 'Award',
    progress: 0,
    target: 50,
    category: 'workouts',
  },
  {
    id: 'multi_sport',
    title: 'Multi-Sport Athlete',
    description: 'Train in 3 different sports',
    icon: 'Target',
    progress: 0,
    target: 3,
    category: 'milestone',
  },
  {
    id: 'hydration_hero',
    title: 'Hydration Hero',
    description: 'Track hydration for 7 days',
    icon: 'Droplets',
    progress: 0,
    target: 7,
    category: 'milestone',
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete 10 morning workouts',
    icon: 'Sunrise',
    progress: 0,
    target: 10,
    category: 'workouts',
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentSport, setCurrentSport] = useState<Sport | null>(null);
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [selectedImprovement, setSelectedImprovement] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<TrainingPlan | null>(null);
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>(defaultAchievements);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [hydrationEntries, setHydrationEntries] = useState<HydrationEntry[]>([]);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [preferences, setPreferences] = useState<TrainingPreferences | null>(null);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [streak, setStreak] = useState(0);
  const [session, setSession] = useState<Session | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const SAVE_FAILED = 'We could not save that. Check your connection and try again.';
  const clearSaveError = () => setSaveError(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    loadData();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      (() => loadData())();
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const loadData = async () => {
    await Promise.all([loadProgress(), loadProfile(), loadHydration(), loadChat(), loadFood(), loadPreferences()]);
  };

  const loadProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_workouts')
        .select('*')
        .order('completed_at', { ascending: false })
        .limit(100);

      if (data && !error) {
        const entries: ProgressEntry[] = data.map((row: any) => ({
          id: row.id,
          date: row.completed_at,
          sport: row.sport,
          workoutType: row.workout_type,
          duration: row.duration,
          completed: true,
          intensity: row.intensity,
          caloriesBurned: row.calories_burned,
          notes: row.notes,
        }));
        setProgressEntries(entries);
        calculateStreak(entries);
        updateAchievementsFromProgress(entries);
      }
    } catch (e) {
      console.log('Progress data unavailable');
    }
  };

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (data && !error) {
        setUserProfile(data);
      }
    } catch (e) {
      console.log('Profile not found');
    }
  };

  const loadHydration = async () => {
    try {
      const { data } = await supabase
        .from('hydration_entries')
        .select('*')
        .order('date', { ascending: false })
        .limit(30);

      if (data) setHydrationEntries(data);
    } catch (e) {
      console.log('Hydration data unavailable');
    }
  };

  const loadChat = async () => {
    try {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);

      if (data) setChatMessages([...data].reverse());
    } catch (e) {
      console.log('Chat history unavailable');
    }
  };

  const calculateStreak = (entries: ProgressEntry[]) => {
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < entries.length; i++) {
      const entryDate = new Date(entries[i].date);
      entryDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);

      if (entryDate.getTime() === expectedDate.getTime() && entries[i].completed) {
        currentStreak++;
      } else if (entryDate.getTime() < expectedDate.getTime()) {
        break;
      }
    }

    setStreak(currentStreak);
  };

  const updateAchievementsFromProgress = (entries: ProgressEntry[]) => {
    const completed = entries.filter((e) => e.completed);
    const uniqueSports = new Set(entries.map((e) => e.sport));

    setAchievements((prev) =>
      prev.map((a) => {
        let progress = a.progress;
        if (a.id === 'first_workout' && completed.length >= 1) progress = 1;
        if (a.id === 'complete_10') progress = Math.min(completed.length, 10);
        if (a.id === 'complete_50') progress = Math.min(completed.length, 50);
        if (a.id === 'multi_sport') progress = Math.min(uniqueSports.size, 3);
        return { ...a, progress };
      })
    );
  };

  const addProgressEntry = async (entry: ProgressEntry) => {
    setProgressEntries((prev) => [entry, ...prev]);

    try {
      const { error } = await supabase.from('saved_workouts').upsert(
        {
          client_key: entry.id,
          sport: entry.sport,
          workout_type: entry.workoutType,
          duration: entry.duration,
          intensity: entry.intensity ?? null,
          calories_burned: entry.caloriesBurned ?? null,
          notes: entry.notes ?? null,
          completed_at: entry.date,
        },
        { onConflict: 'client_key', ignoreDuplicates: true }
      );
      if (error) setSaveError(SAVE_FAILED);
    } catch (e) {
      setSaveError(SAVE_FAILED);
    }

    calculateStreak([entry, ...progressEntries]);
    updateAchievementsFromProgress([entry, ...progressEntries]);
  };

  const updateAchievement = (id: string, progress: number) => {
    setAchievements((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, progress, earnedAt: progress >= a.target ? new Date().toISOString() : undefined }
          : a
      )
    );
  };

  const addChatMessage = async (message: ChatMessage) => {
    setChatMessages((prev) => [...prev, message]);

    try {
      const { error } = await supabase.from('chat_messages').insert([message]);
      if (error) setSaveError(SAVE_FAILED);
    } catch (e) {
      setSaveError(SAVE_FAILED);
    }
  };

  const loadFood = async () => {
    try {
      const { data } = await supabase
        .from('food_entries')
        .select('*')
        .order('entry_date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(200);
      if (data) setFoodEntries(data);
    } catch (e) {
      console.log('Food data unavailable');
    }
  };

  const loadPreferences = async () => {
    try {
      const { data } = await supabase
        .from('user_preferences')
        .select('*')
        .limit(1)
        .maybeSingle();
      setPreferences(data || null);
    } catch (e) {
      console.log('Preferences unavailable');
    } finally {
      setPreferencesLoaded(true);
    }
  };

  const savePreferences = async (prefs: TrainingPreferences) => {
    const { error } = await supabase
      .from('user_preferences')
      .upsert({ ...prefs, updated_at: new Date().toISOString() });
    if (error) {
      setSaveError(SAVE_FAILED);
      return false;
    }
    setPreferences(prefs);
    return true;
  };

  const addFoodEntry = async (entry: Omit<FoodEntry, 'id' | 'createdAt'>) => {
    const { data, error } = await supabase
      .from('food_entries')
      .insert({
        entry_date: entry.date,
        meal_type: entry.mealType,
        name: entry.name,
        calories: entry.calories,
        is_estimate: entry.isEstimate,
      })
      .select()
      .maybeSingle();
    if (error || !data) {
      setSaveError(SAVE_FAILED);
      return null;
    }
    setFoodEntries((prev) => [data, ...prev]);
    return data;
  };

  const updateFoodEntry = async (id: string, changes: Partial<FoodEntry>) => {
    const dbChanges: Record<string, unknown> = {};
    if (changes.name !== undefined) dbChanges.name = changes.name;
    if (changes.calories !== undefined) dbChanges.calories = changes.calories;
    if (changes.mealType !== undefined) dbChanges.meal_type = changes.mealType;
    if (changes.date !== undefined) dbChanges.entry_date = changes.date;
    if (changes.isEstimate !== undefined) dbChanges.is_estimate = changes.isEstimate;

    const { error } = await supabase.from('food_entries').update(dbChanges).eq('id', id);
    if (error) {
      setSaveError(SAVE_FAILED);
      return false;
    }
    setFoodEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...changes } : e)));
    return true;
  };

  const deleteFoodEntry = async (id: string) => {
    const { error } = await supabase.from('food_entries').delete().eq('id', id);
    if (error) {
      setSaveError(SAVE_FAILED);
      return false;
    }
    setFoodEntries((prev) => prev.filter((e) => e.id !== id));
    return true;
  };

  const addHydrationEntry = async (entry: HydrationEntry) => {
    setHydrationEntries((prev) => [entry, ...prev]);

    try {
      const { error } = await supabase.from('hydration_entries').insert([entry]);
      if (error) setSaveError(SAVE_FAILED);
    } catch (e) {
      setSaveError(SAVE_FAILED);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentSport,
        setCurrentSport,
        questionnaire,
        setQuestionnaire,
        selectedImprovement,
        setSelectedImprovement,
        currentPlan,
        setCurrentPlan,
        progressEntries,
        addProgressEntry,
        achievements,
        updateAchievement,
        userProfile,
        setUserProfile,
        chatMessages,
        addChatMessage,
        hydrationEntries,
        addHydrationEntry,
        foodEntries,
        addFoodEntry,
        updateFoodEntry,
        deleteFoodEntry,
        preferences,
        preferencesLoaded,
        savePreferences,
        saveError,
        clearSaveError,
        streak,
        setStreak,
        session,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
