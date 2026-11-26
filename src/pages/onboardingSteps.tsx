import type { ReactNode } from 'react';
import {
  Activity,
  Minus,
  Plus,
  Calendar,
  Dumbbell,
  Target,
  HeartPulse,
  Salad,
} from 'lucide-react';
import type { OnboardingAnswers, OnboardingErrors } from '../lib/onboarding';
import {
  EQUIPMENT_OPTIONS,
  GOAL_OPTIONS,
  SKILL_LEVELS,
  SPORT_OPTIONS,
  TRAINING_DAY_OPTIONS,
} from '../lib/onboarding';

const INPUT_CLASS =
  'w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-gray-900';

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
        selected
          ? 'border-blue-500 bg-blue-50 text-blue-700'
          : 'border-gray-200 text-gray-600 hover:border-gray-300'
      }`}
    >
      {label}
    </button>
  );
}

function NumberStepper({
  value,
  onChange,
  min,
  max,
  suffix,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  suffix: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all"
        aria-label={`Decrease ${suffix}`}
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="text-2xl font-bold text-gray-900 w-24 text-center">
        {value} <span className="text-sm font-medium text-gray-500">{suffix}</span>
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all"
        aria-label={`Increase ${suffix}`}
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}

function StepHeading({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
        {icon}
      </div>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
    </div>
  );
}

export function OnboardingStepContent({
  step,
  answers,
  onChange,
  errors,
}: {
  step: number;
  answers: OnboardingAnswers;
  onChange: (changes: Partial<OnboardingAnswers>) => void;
  errors: OnboardingErrors;
}) {
  const toggle = (field: 'sports' | 'trainingDays' | 'equipment' | 'goals', value: string) => {
    const list = answers[field];
    onChange({
      [field]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    });
  };

  switch (step) {
    case 1:
      return (
        <div>
          <StepHeading
            icon={<Activity className="w-5 h-5" />}
            title="About you"
            subtitle="Basic details so plans fit your body."
          />
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
              <input
                type="number"
                inputMode="numeric"
                className={INPUT_CLASS}
                value={answers.age}
                min={8}
                max={100}
                onChange={(e) => onChange({ age: e.target.value })}
                placeholder="25"
              />
              {errors.age && <p className="text-sm text-red-600 mt-1">{errors.age}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
              <input
                type="number"
                inputMode="numeric"
                className={INPUT_CLASS}
                value={answers.heightCm}
                min={100}
                max={250}
                onChange={(e) => onChange({ heightCm: e.target.value })}
                placeholder="175"
              />
              {errors.heightCm && <p className="text-sm text-red-600 mt-1">{errors.heightCm}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg, optional)</label>
              <input
                type="number"
                inputMode="decimal"
                className={INPUT_CLASS}
                value={answers.weightKg}
                min={20}
                max={300}
                onChange={(e) => onChange({ weightKg: e.target.value })}
                placeholder="70"
              />
              {errors.weightKg && <p className="text-sm text-red-600 mt-1">{errors.weightKg}</p>}
            </div>
          </div>
        </div>
      );

    case 2:
      return (
        <div>
          <StepHeading
            icon={<Dumbbell className="w-5 h-5" />}
            title="Your sports"
            subtitle="Pick every sport you train."
          />
          <div className="flex flex-wrap gap-2">
            {SPORT_OPTIONS.map((sport) => (
              <Chip
                key={sport}
                label={sport}
                selected={answers.sports.includes(sport)}
                onClick={() => toggle('sports', sport)}
              />
            ))}
          </div>
          {errors.sports && <p className="text-sm text-red-600 mt-3">{errors.sports}</p>}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Skill level</label>
            <div className="grid grid-cols-3 gap-2">
              {SKILL_LEVELS.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => onChange({ skillLevel: level })}
                  className={`py-3 rounded-xl border-2 text-sm font-medium capitalize transition-all ${
                    answers.skillLevel === level
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>
      );

    case 3:
      return (
        <div>
          <StepHeading
            icon={<Activity className="w-5 h-5" />}
            title="Training frequency"
            subtitle="How often and how long are your sessions?"
          />
          <div className="space-y-6">
            <NumberStepper
              value={answers.sessionsPerWeek}
              onChange={(v) => onChange({ sessionsPerWeek: v })}
              min={1}
              max={14}
              suffix="x / week"
            />
            <NumberStepper
              value={answers.sessionMinutes}
              onChange={(v) => onChange({ sessionMinutes: v })}
              min={15}
              max={180}
              suffix="min / session"
            />
          </div>
        </div>
      );

    case 4:
      return (
        <div>
          <StepHeading
            icon={<Calendar className="w-5 h-5" />}
            title="Available days"
            subtitle="Which days can you train?"
          />
          <div className="flex flex-wrap gap-2">
            {TRAINING_DAY_OPTIONS.map((day) => (
              <Chip
                key={day}
                label={day}
                selected={answers.trainingDays.includes(day)}
                onClick={() => toggle('trainingDays', day)}
              />
            ))}
          </div>
          {errors.trainingDays && <p className="text-sm text-red-600 mt-3">{errors.trainingDays}</p>}
        </div>
      );

    case 5:
      return (
        <div>
          <StepHeading
            icon={<Dumbbell className="w-5 h-5" />}
            title="Equipment"
            subtitle="What do you have access to?"
          />
          <div className="flex flex-wrap gap-2">
            {EQUIPMENT_OPTIONS.map((eq) => (
              <Chip
                key={eq.id}
                label={eq.label}
                selected={answers.equipment.includes(eq.id)}
                onClick={() => toggle('equipment', eq.id)}
              />
            ))}
          </div>
          {errors.equipment && <p className="text-sm text-red-600 mt-3">{errors.equipment}</p>}
        </div>
      );

    case 6:
      return (
        <div>
          <StepHeading
            icon={<Target className="w-5 h-5" />}
            title="Goals & weaknesses"
            subtitle="What are you working toward?"
          />
          <div className="flex flex-wrap gap-2 mb-6">
            {GOAL_OPTIONS.map((goal) => (
              <Chip
                key={goal}
                label={goal}
                selected={answers.goals.includes(goal)}
                onClick={() => toggle('goals', goal)}
              />
            ))}
          </div>
          {errors.goals && <p className="text-sm text-red-600 mt-3 mb-3">{errors.goals}</p>}
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weaknesses to improve (optional)
          </label>
          <textarea
            className={INPUT_CLASS}
            rows={3}
            value={answers.weaknesses}
            onChange={(e) => onChange({ weaknesses: e.target.value })}
            placeholder="e.g. sprint starts, weaker left foot, shoulder mobility"
          />
        </div>
      );

    case 7:
      return (
        <div>
          <StepHeading
            icon={<HeartPulse className="w-5 h-5" />}
            title="Injuries & schedule"
            subtitle="Anything the coach should work around."
          />
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Injuries or limitations (optional)
          </label>
          <textarea
            className={INPUT_CLASS}
            rows={3}
            value={answers.injuries}
            onChange={(e) => onChange({ injuries: e.target.value })}
            placeholder="e.g. knee pain when running"
          />
          <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
            Current training schedule (optional)
          </label>
          <textarea
            className={INPUT_CLASS}
            rows={3}
            value={answers.currentSchedule}
            onChange={(e) => onChange({ currentSchedule: e.target.value })}
            placeholder="e.g. Team practice Tue/Thu, gym on weekends"
          />
        </div>
      );

    case 8:
    default:
      return (
        <div>
          <StepHeading
            icon={<Salad className="w-5 h-5" />}
            title="Dietary preferences"
            subtitle="Allergies and preferences for meal suggestions."
          />
          <textarea
            className={INPUT_CLASS}
            rows={4}
            value={answers.dietNotes}
            onChange={(e) => onChange({ dietNotes: e.target.value })}
            placeholder="e.g. vegetarian, allergic to peanuts"
          />
        </div>
      );
  }
}
