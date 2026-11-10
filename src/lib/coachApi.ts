import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from './supabase';

export interface CoachTurn {
  role: 'user' | 'assistant';
  content: string;
}

const FALLBACK_ERROR = 'The AI Coach is unavailable right now. Please try again.';

export async function askCoach(messages: CoachTurn[]): Promise<string> {
  const { data, error } = await supabase.functions.invoke<{ reply?: unknown }>('coach-chat', {
    body: { messages },
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
