import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle, Loader2, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  useOnboardingState, TOTAL_STEPS,
  preferencesToAnswers, answersToPreferences, OnboardingAnswers,
} from '../lib/onboarding';
import { OnboardingStepContent } from './onboardingSteps';

export function OnboardingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { preferences, preferencesLoaded, savePreferences } = useApp();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const state = useOnboardingState(preferencesToAnswers(preferences));
  const editing = Boolean(preferences);

  // Wait until preferences are loaded so existing users edit their real answers.
  if (!preferencesLoaded) {
    return (
      <div className="pt-20 pb-12 min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
      </div>
    );
  }

  const handleFinish = async (answersOverride?: OnboardingAnswers) => {
    const answers = answersOverride ?? state.answers;
    setIsSaving(true);
    setError(null);
    const ok = await savePreferences(answersToPreferences(answers));
    setIsSaving(false);
    if (ok) {
      setSaved(true);
      // Return where the user came from (a workout flow), or home.
      const from = (location.state as { from?: string } | null)?.from;
      setTimeout(() => navigate(from || '/', { replace: true }), 900);
    } else {
      setError('Could not save your answers. Check your connection and try again.');
    }
  };

  const handleNext = () => {
    if (state.step < TOTAL_STEPS) {
      state.next();
      return;
    }
    handleFinish();
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {editing ? 'Edit Your Training Profile' : 'Set Up Your Training Profile'}
          </h1>
          <p className="text-gray-600">
            {editing
              ? 'Update any answer — the AI Coach and workouts use the new details immediately.'
              : 'One short questionnaire. The AI Coach and every workout use these answers automatically.'}
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between max-w-md mx-auto">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div
                key={i}
                className={`w-full h-1 mx-1 rounded-full ${
                  i < state.step ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gray-200'
                } transition-all duration-300`}
              />
            ))}
          </div>
          <p className="text-center text-gray-500 mt-3 text-sm">Step {state.step} of {TOTAL_STEPS}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10">
          <OnboardingStepContent answers={state.answers} onChange={state.setAnswers} step={state.step} errors={state.errors} />
        </div>

        {error && <p className="text-sm text-red-600 text-center mt-4">{error}</p>}
        {saved && (
          <p className="text-sm text-emerald-600 text-center mt-4 flex items-center justify-center gap-1.5">
            <CheckCircle className="w-4 h-4" /> Saved — taking you back…
          </p>
        )}

        <div className="mt-8 flex justify-between max-w-md mx-auto">
          <button
            onClick={state.back}
            disabled={state.step === 1 || isSaving}
            className="flex items-center px-6 py-3 rounded-full text-gray-600 hover:text-gray-900 disabled:opacity-40 transition-all"
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> Previous
          </button>
          <button
            onClick={handleNext}
            disabled={isSaving || saved}
            className="flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 transition-all"
          >
            {isSaving ? (
              <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Saving…</>
            ) : state.step === TOTAL_STEPS ? (
              <>Finish<CheckCircle className="ml-2 w-5 h-5" /></>
            ) : (
              <>Continue<ChevronRight className="ml-2 w-5 h-5" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
