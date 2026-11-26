export type Sport = 'swimming' | 'strength' | 'running' | 'football' | 'basketball' | 'tennis' | 'cycling' | 'volleyball' | 'gym';

export type SwimmingStroke = 'freestyle' | 'breaststroke' | 'backstroke' | 'butterfly';

export type SwimmingImprovement = 'speed' | 'technique' | 'endurance' | 'starts' | 'turns' | 'breathing' | 'kick' | 'pull';

export type FootballImprovement = 'speed' | 'shooting' | 'passing' | 'dribbling' | 'stamina';

export type TennisImprovement = 'serve' | 'forehand' | 'backhand' | 'footwork' | 'endurance';

export type BasketballImprovement = 'shooting' | 'ball_handling' | 'defense' | 'speed' | 'vertical_jump';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Questionnaire {
  age: number;
  skillLevel: SkillLevel;
  sessionsPerWeek: number;
  trainingDuration: number;
  equipment: string[];
  weakness: string;
  goal: string;
}

export interface WaterDrill {
  name: string;
  distance: string;
  repetitions: number;
  rest: string;
  technique: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface DrylandExercise {
  name: string;
  type: 'strength' | 'mobility' | 'core';
  sets: number;
  reps: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  muscleGroups?: string[];
}

export interface MealSuggestion {
  name: string;
  timing: string;
  description: string;
  nutrients: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface TrainingPlan {
  waterTraining: {
    warmup: WaterDrill[];
    mainSet: WaterDrill[];
    drillSet: WaterDrill[];
    cooldown: WaterDrill[];
  };
  drylandTraining: {
    strength: DrylandExercise[];
    mobility: DrylandExercise[];
    core: DrylandExercise[];
  };
  nutrition: {
    preTraining: MealSuggestion[];
    postTraining: MealSuggestion[];
    hydration: string;
    proteinRecommendation: string;
    recoveryTips: string[];
  };
  tips: string[];
  performanceAnalysis?: PerformanceAnalysis;
  weeklyGoals?: WeeklyGoals;
}

export interface PerformanceAnalysis {
  strengths: string[];
  weaknesses: string[];
  priorityAreas: string[];
  estimatedTimeline: string;
  improvementPotential: number;
}

export interface WeeklyGoals {
  dailyTasks: DailyTask[];
  weeklyTargets: WeeklyTarget[];
  milestones: Milestone[];
}

export interface DailyTask {
  day: string;
  tasks: string[];
  type: 'rest' | 'light' | 'moderate' | 'intense';
}

export interface WeeklyTarget {
  metric: string;
  target: number;
  unit: string;
  current?: number;
}

export interface Milestone {
  week: number;
  description: string;
  completed: boolean;
}

export interface ProgressEntry {
  id: string;
  date: string;
  sport: Sport;
  workoutType: string;
  duration: number;
  completed: boolean;
  notes?: string;
  intensity?: 'light' | 'moderate' | 'intense';
  caloriesBurned?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt?: string;
  progress: number;
  target: number;
  category: 'workouts' | 'streak' | 'performance' | 'milestone';
}

export interface SportConfig {
  id: Sport;
  name: string;
  icon: string;
  color: string;
  bgGradient: string;
  improvements: { id: string; label: string; icon: string }[];
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  weight: number;
  height: number;
  sport: Sport;
  goal: string;
  skillLevel: SkillLevel;
  equipment: string[];
  notifications: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface FoodEntry {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  name: string;
  calories: number;
  isEstimate?: boolean;
  createdAt?: string;
}

export interface TrainingPreferences {
  goals: string[];
  sports: string[];
  skill_level: string | null;
  equipment: string[];
  sessions_per_week: number | null;
  session_minutes: number | null;
  age?: number | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  training_days?: string[] | null;
  injuries?: string | null;
  current_schedule?: string | null;
  diet_notes?: string | null;
}

export const TRAINING_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export function describePreferencesForAi(prefs: {
  goals?: string[] | null;
  sports?: string[] | null;
  skill_level?: string | null;
  equipment?: string[] | null;
  sessions_per_week?: number | null;
  session_minutes?: number | null;
  age?: number | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  training_days?: string[] | null;
  injuries?: string | null;
  current_schedule?: string | null;
  diet_notes?: string | null;
} | null): string | null {
  if (!prefs) return null;
  const parts: string[] = [];
  if (prefs.goals?.length) parts.push(`Goals: ${prefs.goals.join(', ')}`);
  if (prefs.sports?.length) parts.push(`Sports: ${prefs.sports.join(', ')}`);
  if (prefs.skill_level) parts.push(`Level: ${prefs.skill_level}`);
  if (prefs.equipment?.length) parts.push(`Equipment: ${prefs.equipment.join(', ')}`);
  if (prefs.sessions_per_week) parts.push(`${prefs.sessions_per_week}x/week`);
  if (prefs.session_minutes) parts.push(`${prefs.session_minutes} min/session`);
  if (prefs.age) parts.push(`Age: ${prefs.age}`);
  if (prefs.height_cm) parts.push(`Height: ${prefs.height_cm}cm`);
  if (prefs.weight_kg) parts.push(`Weight: ${prefs.weight_kg}kg`);
  if (prefs.training_days?.length) parts.push(`Days: ${prefs.training_days.join(', ')}`);
  if (prefs.injuries?.trim()) parts.push(`Injuries: ${prefs.injuries.trim()}`);
  if (prefs.current_schedule?.trim()) parts.push(`Schedule: ${prefs.current_schedule.trim()}`);
  if (prefs.diet_notes?.trim()) parts.push(`Diet: ${prefs.diet_notes.trim()}`);
  return parts.length ? parts.join(' | ') : null;
}

export function isMinor(prefs: { age?: number | null } | null): boolean {
  const age = prefs?.age;
  return typeof age === 'number' && age > 0 && age < 18;
}

export interface DailyMealPlan {
  date: string;
  meals: {
    breakfast: MealSuggestion[];
    lunch: MealSuggestion[];
    dinner: MealSuggestion[];
    snacks: MealSuggestion[];
  };
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  waterIntake: number;
  waterGoal: number;
}

export interface HydrationEntry {
  id: string;
  date: string;
  amount: number;
  unit: 'ml' | 'oz';
  timestamp: string;
}

export interface CalorieCalculation {
  bmr: number;
  tdee: number;
  goalCalories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const sportsConfig: SportConfig[] = [
  {
    id: 'swimming',
    name: 'Swimming',
    icon: 'Waves',
    color: 'from-blue-400 to-cyan-500',
    bgGradient: 'from-blue-500 via-cyan-400 to-blue-600',
    improvements: [
      { id: 'speed', label: 'Speed', icon: 'Zap' },
      { id: 'technique', label: 'Technique', icon: 'Target' },
      { id: 'endurance', label: 'Endurance', icon: 'Heart' },
      { id: 'starts', label: 'Starts', icon: 'Play' },
      { id: 'turns', label: 'Turns', icon: 'RotateCcw' },
    ],
  },
  {
    id: 'strength',
    name: 'Strength Training',
    icon: 'Dumbbell',
    color: 'from-zinc-500 to-stone-600',
    bgGradient: 'from-zinc-600 via-stone-500 to-zinc-700',
    improvements: [
      { id: 'build_muscle', label: 'Build Muscle', icon: 'TrendingUp' },
      { id: 'lose_weight', label: 'Lose Weight', icon: 'Flame' },
      { id: 'strength', label: 'Strength', icon: 'Zap' },
      { id: 'fitness', label: 'General Fitness', icon: 'Heart' },
    ],
  },
  {
    id: 'running',
    name: 'Running',
    icon: 'Activity',
    color: 'from-slate-400 to-zinc-500',
    bgGradient: 'from-slate-500 via-zinc-400 to-slate-600',
    improvements: [
      { id: 'speed', label: 'Speed', icon: 'Zap' },
      { id: 'endurance', label: 'Endurance', icon: 'Heart' },
      { id: 'sprint', label: 'Sprint', icon: 'Flame' },
      { id: 'marathon', label: 'Marathon', icon: 'MapPin' },
      { id: 'technique', label: 'Technique', icon: 'Target' },
    ],
  },
  {
    id: 'football',
    name: 'Football',
    icon: 'CircleDot',
    color: 'from-green-400 to-emerald-500',
    bgGradient: 'from-green-500 via-emerald-400 to-green-600',
    improvements: [
      { id: 'speed', label: 'Speed', icon: 'Zap' },
      { id: 'shooting', label: 'Shooting', icon: 'Target' },
      { id: 'passing', label: 'Passing', icon: 'ArrowRight' },
      { id: 'dribbling', label: 'Dribbling', icon: 'Move' },
      { id: 'stamina', label: 'Stamina', icon: 'Heart' },
    ],
  },
  {
    id: 'basketball',
    name: 'Basketball',
    icon: 'CircleDot',
    color: 'from-orange-400 to-red-500',
    bgGradient: 'from-orange-500 via-red-400 to-orange-600',
    improvements: [
      { id: 'shooting', label: 'Shooting', icon: 'Target' },
      { id: 'ball_handling', label: 'Ball Handling', icon: 'Hand' },
      { id: 'defense', label: 'Defense', icon: 'Shield' },
      { id: 'speed', label: 'Speed', icon: 'Zap' },
      { id: 'vertical_jump', label: 'Vertical Jump', icon: 'TrendingUp' },
    ],
  },
];

export const PRIMARY_SPORTS: Sport[] = ['swimming', 'strength', 'running', 'football', 'basketball'];
