import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from './supabase';

export interface GeneratedExercise {
  name: string;
  type: 'strength' | 'mobility' | 'core' | 'sport' | 'cardio';
  sets: number;
  reps: string;
  duration?: string;
  rest: string;
  description: string;
}

export interface WorkoutPreferences {
  skillLevel?: string;
  sessionsPerWeek?: number;
  sessionMinutes?: number;
  equipment?: string[];
  notes?: string;
  age?: number | null;
  heightCm?: number | null;
  weightKg?: number | null;
  injuries?: string | null;
  currentSchedule?: string | null;
  dietNotes?: string | null;
  /** Compact summary of recent workouts so the AI can vary the new session. */
  recentWorkouts?: string | null;
  /** Perceived effort / recovery feedback from the athlete's last sessions. */
  feedback?: string | null;
}

/** Builds a compact recent-workout summary; keeps prompts small. */
export function summarizeRecentWorkouts(
  entries: { name?: string; workoutType?: string; date?: string; intensity?: string | null; notes?: string | null }[],
  max = 3
): string | null {
  const relevant = entries
    .slice()
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
    .slice(0, max);
  if (relevant.length === 0) return null;
  return relevant
    .map((e) => {
      const day = e.date ? e.date.slice(0, 10) : '';
      const what = e.workoutType || e.name || 'session';
      const bits = [day, what];
      if (e.intensity) bits.push(e.intensity);
      return bits.filter(Boolean).join(': ');
    })
    .join(' | ');
}

const DEDUPE_WINDOW_MS = 60 * 1000;

/** In-memory guard so tapping Generate twice (or remounting) doesn't double-call the AI. */
const recentCalls = new Map<string, number>();

export function claimWorkoutCall(key: string): boolean {
  const now = Date.now();
  const last = recentCalls.get(key) ?? 0;
  if (now - last < DEDUPE_WINDOW_MS) return false;
  recentCalls.set(key, now);
  return true;
}

const FALLBACK_ERROR = 'The workout generator is unavailable right now. Please try again.';

export async function generateWorkout(
  sport: string,
  goal: string,
  preferences: WorkoutPreferences
): Promise<GeneratedExercise[]> {
  const { data, error } = await supabase.functions.invoke<{ exercises?: unknown }>(
    'workout-generator',
    { body: { sport, goal, preferences } }
  );

  if (error) {
    let message = FALLBACK_ERROR;
    if (error instanceof FunctionsHttpError) {
      const body = await error.context.json().catch(() => null);
      if (typeof body?.error === 'string') message = body.error;
    }
    throw new Error(message);
  }

  const exercises = data?.exercises;
  if (!Array.isArray(exercises) || exercises.length === 0) {
    throw new Error(FALLBACK_ERROR);
  }
  return exercises as GeneratedExercise[];
}
