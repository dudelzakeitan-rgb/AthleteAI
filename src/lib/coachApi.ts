import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { TrainingPreferences } from '../types';

export interface CoachTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface CoachRequestPreferences {
  goals: string[];
  sports: string[];
  skill_level: string | null;
  equipment: string[];
  sessions_per_week: number | null;
  session_minutes: number | null;
}

const FALLBACK_ERROR = 'The AI Coach is unavailable right now. Please try again.';

export function toCoachPreferences(prefs: TrainingPreferences | null): CoachRequestPreferences | null {
  if (!prefs) return null;
  const result: CoachRequestPreferences = {
    goals: Array.isArray(prefs.goals) ? prefs.goals : [],
    sports: Array.isArray(prefs.sports) ? prefs.sports : [],
    skill_level: prefs.skill_level ?? null,
    equipment: Array.isArray(prefs.equipment) ? prefs.equipment : [],
    sessions_per_week: prefs.sessions_per_week ?? null,
    session_minutes: prefs.session_minutes ?? null,
  };
  const hasAnything =
    result.goals.length > 0 ||
    result.sports.length > 0 ||
    result.skill_level !== null ||
    result.equipment.length > 0 ||
    result.sessions_per_week !== null ||
    result.session_minutes !== null;
  return hasAnything ? result : null;
}

export async function askCoach(
  messages: CoachTurn[],
  preferences?: CoachRequestPreferences | null
): Promise<string> {
  const { data, error } = await supabase.functions.invoke<{ reply?: unknown }>('coach-chat', {
    body: preferences ? { messages, preferences } : { messages },
  });

  if (error) {
    let message = FALLBACK_ERROR;
    if (error instanceof FunctionsHttpError) {
      const body = await error.context.json().catch(() => null);
      if (typeof body?.error === 'string') message = body.error;
    }
    throw new Error(message);
  }

  if (typeof data?.reply !== 'string') throw new Error(FALLBACK_ERROR);
  return data.reply;
}
