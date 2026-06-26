export type Sport = 'swimming' | 'football' | 'tennis' | 'basketball' | 'running' | 'cycling' | 'volleyball' | 'gym';

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
      { id: 'breathing', label: 'Breathing', icon: 'Wind' },
      { id: 'kick', label: 'Kick', icon: 'Activity' },
      { id: 'pull', label: 'Pull', icon: 'Move' },
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
    id: 'tennis',
    name: 'Tennis',
    icon: 'Circle',
    color: 'from-yellow-400 to-orange-500',
    bgGradient: 'from-yellow-500 via-orange-400 to-yellow-600',
    improvements: [
      { id: 'serve', label: 'Serve', icon: 'ArrowUpCircle' },
      { id: 'forehand', label: 'Forehand', icon: 'MoveRight' },
      { id: 'backhand', label: 'Backhand', icon: 'MoveLeft' },
      { id: 'footwork', label: 'Footwork', icon: 'Activity' },
      { id: 'endurance', label: 'Endurance', icon: 'Heart' },
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
    id: 'cycling',
    name: 'Cycling',
    icon: 'Bike',
    color: 'from-teal-400 to-green-500',
    bgGradient: 'from-teal-500 via-green-400 to-teal-600',
    improvements: [
      { id: 'speed', label: 'Speed', icon: 'Zap' },
      { id: 'endurance', label: 'Endurance', icon: 'Heart' },
      { id: 'climbing', label: 'Climbing', icon: 'TrendingUp' },
      { id: 'technique', label: 'Technique', icon: 'Target' },
      { id: 'power', label: 'Power', icon: 'Flame' },
    ],
  },
  {
    id: 'volleyball',
    name: 'Volleyball',
    icon: 'CircleDot',
    color: 'from-pink-400 to-rose-500',
    bgGradient: 'from-pink-500 via-rose-400 to-pink-600',
    improvements: [
      { id: 'spike', label: 'Spike', icon: 'TrendingUp' },
      { id: 'serve', label: 'Serve', icon: 'ArrowUpCircle' },
      { id: 'block', label: 'Block', icon: 'Shield' },
      { id: 'passing', label: 'Passing', icon: 'ArrowRight' },
      { id: 'jump', label: 'Jump', icon: 'Activity' },
    ],
  },
  {
    id: 'gym',
    name: 'Gym',
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
];
