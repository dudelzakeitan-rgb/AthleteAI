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
