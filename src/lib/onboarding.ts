import { useCallback, useMemo, useState } from 'react';
import type { TrainingPreferences } from '../types';
import { TRAINING_DAYS, sportsConfig } from '../types';

export const TOTAL_STEPS = 8;

export interface OnboardingAnswers {
  age: string;
  heightCm: string;
  weightKg: string;
  sports: string[];
  skillLevel: string;
  sessionsPerWeek: number;
  sessionMinutes: number;
  trainingDays: string[];
  equipment: string[];
  goals: string[];
  weaknesses: string;
  injuries: string;
  currentSchedule: string;
  dietNotes: string;
}

export const DEFAULT_ANSWERS: OnboardingAnswers = {
  age: '',
  heightCm: '',
  weightKg: '',
  sports: [],
  skillLevel: 'intermediate',
  sessionsPerWeek: 3,
  sessionMinutes: 60,
  trainingDays: [],
  equipment: [],
  goals: [],
  weaknesses: '',
  injuries: '',
  currentSchedule: '',
  dietNotes: '',
};

export const SPORT_OPTIONS = sportsConfig.map((s) => s.name);

export const SKILL_LEVELS = ['beginner', 'intermediate', 'advanced'];

export const EQUIPMENT_OPTIONS = [
  { id: 'pool', label: 'Access to Pool' },
  { id: 'gym', label: 'Gym Membership' },
  { id: 'weights', label: 'Free Weights' },
  { id: 'resistance_bands', label: 'Resistance Bands' },
  { id: 'foam_roller', label: 'Foam Roller' },
  { id: 'pull_buoy', label: 'Pull Buoy' },
  { id: 'kickboard', label: 'Kickboard' },
  { id: 'paddles', label: 'Hand Paddles' },
  { id: 'fins', label: 'Swim Fins' },
  { id: 'stairs', label: 'Stairs/Bleachers' },
  { id: 'ball', label: 'Sports Ball' },
  { id: 'net', label: 'Net/Goal' },
];

export const GOAL_OPTIONS = [
  'Improve overall fitness',
  'Lose weight',
  'Build muscle',
  'Increase speed',
  'Improve technique',
  'Prepare for competition',
  'Rehabilitate injury',
  'General health',
];

export const DURATION_OPTIONS = [30, 45, 60, 90, 120];

export function answersToPreferences(a: OnboardingAnswers): TrainingPreferences {
  const age = parseInt(a.age, 10);
  const height = parseInt(a.heightCm, 10);
  const weight = parseFloat(a.weightKg);
  return {
    goals: a.goals,
    sports: a.sports,
    skill_level: a.skillLevel || null,
    equipment: a.equipment,
    sessions_per_week: a.sessionsPerWeek || null,
    session_minutes: a.sessionMinutes || null,
    age: Number.isFinite(age) && age > 0 ? age : null,
    height_cm: Number.isFinite(height) && height > 0 ? height : null,
    weight_kg: Number.isFinite(weight) && weight > 0 ? weight : null,
    training_days: a.trainingDays,
    injuries: a.injuries.trim() || null,
    current_schedule: a.currentSchedule.trim() || null,
    diet_notes: a.dietNotes.trim() || null,
  };
}

export function preferencesToAnswers(p: TrainingPreferences | null): OnboardingAnswers {
  if (!p) return { ...DEFAULT_ANSWERS };
  return {
    age: p.age != null ? String(p.age) : '',
    heightCm: p.height_cm != null ? String(p.height_cm) : '',
    weightKg: p.weight_kg != null ? String(p.weight_kg) : '',
    sports: p.sports ?? [],
    skillLevel: p.skill_level ?? 'intermediate',
    sessionsPerWeek: p.sessions_per_week ?? 3,
    sessionMinutes: p.session_minutes ?? 60,
    trainingDays: p.training_days ?? [],
    equipment: p.equipment ?? [],
    goals: p.goals ?? [],
    weaknesses: '',
    injuries: p.injuries ?? '',
    currentSchedule: p.current_schedule ?? '',
    dietNotes: p.diet_notes ?? '',
  };
}

export type OnboardingErrors = Record<string, string>;

export function validateOnboardingStep(step: number, a: OnboardingAnswers): OnboardingErrors {
  const errors: OnboardingErrors = {};
  if (step === 1) {
    const age = parseInt(a.age, 10);
    if (!Number.isFinite(age) || age < 8 || age > 100) errors.age = 'Enter an age between 8 and 100.';
    if (a.heightCm.trim()) {
      const h = parseInt(a.heightCm, 10);
      if (!Number.isFinite(h) || h < 100 || h > 250) errors.heightCm = 'Enter a height between 100 and 250 cm.';
    }
    if (a.weightKg.trim()) {
      const w = parseFloat(a.weightKg);
      if (!Number.isFinite(w) || w < 20 || w > 300) errors.weightKg = 'Enter a weight between 20 and 300 kg.';
    }
  }
  if (step === 2 && a.sports.length === 0) errors.sports = 'Pick at least one sport.';
  if (step === 4 && a.trainingDays.length === 0) errors.trainingDays = 'Pick at least one training day.';
  if (step === 5 && a.equipment.length === 0) errors.equipment = 'Pick at least one option (bodyweight counts).';
  if (step === 6 && a.goals.length === 0) errors.goals = 'Pick at least one goal.';
  return errors;
}

export function useOnboardingState(initial: OnboardingAnswers) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<OnboardingAnswers>(initial);
  const [errors, setErrors] = useState<OnboardingErrors>({});

  const patch = useCallback((changes: Partial<OnboardingAnswers>) => {
    setAnswers((prev) => ({ ...prev, ...changes }));
  }, []);

  const next = useCallback(() => {
    const stepErrors = validateOnboardingStep(step, answers);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length === 0) {
      setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    }
  }, [step, answers]);

  const back = useCallback(() => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  return useMemo(
    () => ({ step, answers, errors, setAnswers: patch, next, back }),
    [step, answers, errors, patch, next, back],
  );
}

export const TRAINING_DAY_OPTIONS: string[] = [...TRAINING_DAYS];
