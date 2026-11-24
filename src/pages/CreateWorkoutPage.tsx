import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Dumbbell, Target, Clock, RefreshCw, AlertCircle,
  Timer, Repeat, Info, Sliders,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateWorkout, GeneratedExercise } from '../lib/workoutApi';
import { sportsConfig } from '../types';

export function CreateWorkoutPage() {
  const navigate = useNavigate();
  const { preferences, preferencesLoaded, session } = useApp();
  const [sport, setSport] = useState('');
  const [goal, setGoal] = useState('');
  const [sessionMinutes, setSessionMinutes] = useState<number | null>(null);
  const [exercises, setExercises] = useState<GeneratedExercise[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (preferencesLoaded && preferences) {
      if (!sport && preferences.sports.length > 0) setSport(preferences.sports[0]);
      if (!goal && preferences.goals.length > 0) setGoal(preferences.goals[0]);
      if (sessionMinutes === null) setSessionMinutes(preferences.session_minutes);
    }
  }, [preferencesLoaded, preferences]);

  const hasSavedPrefs = Boolean(preferences && (preferences.goals.length > 0 || preferences.sports.length > 0));

  const handleGenerate = async () => {
    if (!session) return;
    setIsLoading(true);
    setError(null);
    setExercises(null);
    try {
      const result = await generateWorkout(sport, goal, {
        skillLevel: preferences?.skill_level ?? undefined,
        sessionsPerWeek: preferences?.sessions_per_week ?? undefined,
        sessionMinutes: sessionMinutes ?? preferences?.session_minutes ?? undefined,
        equipment: preferences?.equipment ?? [],
      });
      setExercises(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const sportOptions = useMemo(() => sportsConfig.map((s) => ({ id: s.id, name: s.name })), []);

  if (!session) {
    return (
      <div className="pt-20 pb-12 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="max-w-md mx-auto px-4 text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-6">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Sign in to create workouts</h2>
          <p className="text-gray-600 mb-6">
            Create a free account to generate AI workouts and save your progress.
          </p>
          <Link
            to="/coach"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-semibold hover:shadow-lg transition-all"
          >
            Sign in or Create Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Create Workout</h1>
          <p className="text-gray-600">A session built for your sport, goal, and preferences.</p>
        </div>

        {hasSavedPrefs && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <Sliders className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              Using your saved training preferences. Adjust below for just this session — your saved
              profile stays unchanged.
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5 mb-8">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sport</label>
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              >
                <option value="">Choose a sport</option>
                {sportOptions.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Goal</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              >
                <option value="">Choose a goal</option>
                {[
                  'Improve overall fitness',
                  'Lose weight',
                  'Build muscle',
                  'Increase speed',
                  'Improve technique',
                  'Prepare for competition',
                ].map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1.5 -mt-0.5" />
              Session length {hasSavedPrefs && '(override for this session only)'}
            </label>
            <div className="flex flex-wrap gap-2">
              {[30, 45, 60, 90].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setSessionMinutes(mins)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    sessionMinutes === mins
                      ? 'bg-blue-500 text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !sport || !goal}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Building your workout...
              </>
            ) : (
              <>
                <Dumbbell className="w-5 h-5" />
                {exercises ? 'Regenerate Workout' : 'Generate Workout'}
              </>
            )}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-700">{error}</p>
                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="mt-2 text-sm font-semibold text-red-700 underline hover:text-red-800 disabled:opacity-50"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>

        {isLoading && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Your coach is putting together a session...</p>
          </div>
        )}

        {exercises && !isLoading && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">{sport} · {goal}</h2>
                  <p className="text-blue-100 text-sm">
                    {sessionMinutes || 60} min session · {exercises.length} exercises
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {exercises.map((ex, i) => (
                <div key={i} className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-1.5">
                    <h3 className="font-semibold text-gray-900">
                      {i + 1}. {ex.name}
                    </h3>
                    <span className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium capitalize">
                      {ex.type}
                    </span>
                  </div>
                  {ex.description && (
                    <p className="text-sm text-gray-500 mb-2">{ex.description}</p>
                  )}
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <Repeat className="w-4 h-4 text-gray-400" />
                      {ex.sets} × {ex.reps}
                    </span>
                    {ex.duration && (
                      <span className="flex items-center gap-1.5">
                        <Timer className="w-4 h-4 text-gray-400" />
                        {ex.duration}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-gray-400" />
                      Rest {ex.rest}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
