import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Target, Activity, Dumbbell, Calendar, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sportsConfig } from '../types';

const goalOptions = [
  'Improve overall fitness',
  'Lose weight',
  'Build muscle',
  'Increase speed',
  'Improve technique',
  'Prepare for competition',
];

const skillLevels = ['beginner', 'intermediate', 'advanced'] as const;

const equipmentOptions = [
  'pool',
  'gym membership',
  'free weights',
  'resistance bands',
  'foam roller',
  'sports ball',
  'bodyweight only',
];

export function TrainingPreferencesPage() {
  const navigate = useNavigate();
  const { preferences, preferencesLoaded, savePreferences } = useApp();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    goals: preferences?.goals ?? [],
    sports: preferences?.sports ?? [],
    skill_level: preferences?.skill_level ?? 'intermediate',
    equipment: preferences?.equipment ?? [],
    sessions_per_week: preferences?.sessions_per_week ?? 3,
    session_minutes: preferences?.session_minutes ?? 60,
  });

  const toggle = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const handleSave = async () => {
    if (form.goals.length === 0 || form.sports.length === 0) {
      setError('Pick at least one goal and one sport.');
      return;
    }
    setIsSaving(true);
    setError(null);
    const ok = await savePreferences({
      goals: form.goals,
      sports: form.sports,
      skill_level: form.skill_level,
      equipment: form.equipment,
      sessions_per_week: form.sessions_per_week,
      session_minutes: form.session_minutes,
    });
    setIsSaving(false);
    if (ok) navigate(-1);
  };

  if (!preferencesLoaded) {
    return (
      <div className="pt-20 pb-12 min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading your preferences...</p>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Training Preferences</h1>
          <p className="text-gray-600">
            These answers power Create Workout and the AI Coach, so you never answer them twice.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" /> Training goals
            </h2>
            <div className="flex flex-wrap gap-2">
              {goalOptions.map((goal) => (
                <button
                  key={goal}
                  onClick={() => setForm({ ...form, goals: toggle(form.goals, goal) })}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    form.goals.includes(goal)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {form.goals.includes(goal) && <CheckCircle className="w-4 h-4" />}
                  {goal}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" /> Preferred sports
            </h2>
            <div className="flex flex-wrap gap-2">
              {sportsConfig.map((sport) => (
                <button
                  key={sport.id}
                  onClick={() => setForm({ ...form, sports: toggle(form.sports, sport.name) })}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    form.sports.includes(sport.name)
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {form.sports.includes(sport.name) && <CheckCircle className="w-4 h-4" />}
                  {sport.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-purple-500" /> Experience level
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {skillLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => setForm({ ...form, skill_level: level })}
                  className={`py-3 px-4 rounded-xl font-medium capitalize transition-all ${
                    form.skill_level === level
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" /> Sessions per week
            </h2>
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <button
                  key={num}
                  onClick={() => setForm({ ...form, sessions_per_week: num })}
                  className={`w-12 h-12 rounded-xl text-lg font-bold transition-all ${
                    form.sessions_per_week === num
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <h2 className="text-lg font-bold text-gray-900 mb-4 mt-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-rose-500" /> Time per session
            </h2>
            <div className="flex flex-wrap gap-3">
              {[30, 45, 60, 90, 120].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setForm({ ...form, session_minutes: mins })}
                  className={`px-5 py-3 rounded-xl font-semibold transition-all ${
                    form.session_minutes === mins
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-gray-600" /> Available equipment
            </h2>
            <div className="flex flex-wrap gap-2">
              {equipmentOptions.map((equip) => (
                <button
                  key={equip}
                  onClick={() => setForm({ ...form, equipment: toggle(form.equipment, equip) })}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                    form.equipment.includes(equip)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {form.equipment.includes(equip) && <CheckCircle className="w-4 h-4" />}
                  {equip}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-full hover:shadow-lg disabled:opacity-50 transition-all"
            >
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
