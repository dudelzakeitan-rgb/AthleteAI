import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Waves,
  Dumbbell,
  Apple,
  CheckCircle,
  Save,
  Trophy,
  Target,
  TrendingUp,
  Activity,
  Flame,
  Zap,
  Heart,
  Calendar,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { sportsConfig, TrainingPlan, ProgressEntry } from '../types';
import { useApp } from '../context/AppContext';
import { generateTrainingPlan } from '../lib/trainingGenerator';
import { generateWorkout, GeneratedExercise } from '../lib/workoutApi';

// Map AI exercises onto the plan's main-set slot structure so the existing
// plan screens render them unchanged. Falls back to the static template on error.
function applyAiExercises(
  plan: TrainingPlan,
  exercises: GeneratedExercise[],
  improvement: string
): TrainingPlan {
  const sportDrills = exercises.map((ex) => ({
    name: ex.name,
    distance: ex.duration || ex.reps,
    repetitions: ex.sets,
    rest: ex.rest,
    technique: ex.description,
    difficulty: 'medium' as const,
  }));

  const byType = (type: GeneratedExercise['type']) =>
    exercises
      .filter((ex) => ex.type === type)
      .map((ex) => ({
        name: ex.name,
        type,
        sets: ex.sets,
        reps: ex.reps,
        description: ex.description,
        difficulty: 'medium' as const,
        muscleGroups: [] as string[],
      }));

  const strength = byType('strength');
  const core = byType('core');
  const mobility = byType('mobility');

  return {
    ...plan,
    waterTraining: {
      warmup: plan.waterTraining.warmup,
      mainSet: sportDrills.length ? sportDrills : plan.waterTraining.mainSet,
      drillSet: plan.waterTraining.drillSet,
      cooldown: plan.waterTraining.cooldown,
    },
    drylandTraining: {
      strength: strength.length ? strength : plan.drylandTraining.strength,
      core: core.length ? core : plan.drylandTraining.core,
      mobility: mobility.length ? mobility : plan.drylandTraining.mobility,
    },
    tips: [
      ...plan.tips,
      `AI-generated session for ${improvement}. Regenerate any time for fresh exercises.`,
    ],
  };
}

export function PlanPreviewPage() {
  const { sportId, improvementId } = useParams<{ sportId: string; improvementId: string }>();
  const navigate = useNavigate();
  const { questionnaire, setCurrentPlan, addProgressEntry, session } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [savedToDashboard, setSavedToDashboard] = useState(false);
  const [aiNotice, setAiNotice] = useState<string | null>(null);

  const sport = sportsConfig.find((s) => s.id === sportId);
  const improvement = sport?.improvements.find((i) => i.id === improvementId);

  useEffect(() => {
    let cancelled = false;
    if (!questionnaire || !sport || !improvement) return;

    const basePlan = generateTrainingPlan({
      sport: sport.id,
      improvement: improvement.id,
      questionnaire,
    });

    if (!session) {
      setPlan(basePlan);
      setIsLoading(false);
      return;
    }

    generateWorkout(sport.name, `${improvement.label} — ${questionnaire.goal}`, {
      skillLevel: questionnaire.skillLevel,
      sessionsPerWeek: questionnaire.sessionsPerWeek,
      sessionMinutes: questionnaire.trainingDuration,
      equipment: questionnaire.equipment,
      notes: `Weakness to address: ${questionnaire.weakness}`,
    })
      .then((exercises) => {
        if (cancelled) return;
        setPlan(applyAiExercises(basePlan, exercises, improvement.label));
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setAiNotice('AI session is unavailable right now — showing your standard plan.');
        setPlan(basePlan);
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [questionnaire, sport, improvement, session, setCurrentPlan]);

  const handleSavePlan = async () => {
    setCurrentPlan(plan);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleAddToDashboard = async () => {
    const entry: ProgressEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      sport: sport?.id || 'swimming',
      workoutType: `${improvement?.label} Training Plan`,
      duration: questionnaire?.trainingDuration || 60,
      completed: false,
      intensity: 'moderate',
      notes: `Plan generated: ${improvement?.label} focus for ${sport?.name}`,
    };

    await addProgressEntry(entry);
    setSavedToDashboard(true);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleStartTraining = () => {
    navigate(`/training/${sportId}/${improvementId}/plan`);
  };

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Generating your personalized plan...</p>
        </div>
      </div>
    );
  }

  if (!sport || !improvement || !questionnaire || !plan) {
    return (
      <div className="pt-20 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center py-20">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Plan Generated</h2>
            <p className="text-gray-600 mb-6">Complete the questionnaire to get your personalized plan.</p>
            <button
              onClick={() => navigate('/sports')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-semibold hover:shadow-lg transition-all"
            >
              Choose a Sport
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Questionnaire</span>
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
            <CheckCircle className="w-4 h-4 mr-2" />
            Step 6 of 6
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Your Personalized Plan</h1>
          <p className="text-gray-600">Based on your profile, here's your recommended training program</p>
        </div>

        {aiNotice && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800" role="alert">
            {aiNotice}
          </div>
        )}

        <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-cyan-300/20 rounded-full blur-2xl" />
          </div>

          <div className="relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="text-blue-100 text-sm font-medium mb-1">Training Focus</div>
                <h2 className="text-2xl sm:text-3xl font-bold">{improvement.label}</h2>
              </div>
              <div className={`px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm`}>
                <span className="font-semibold">{sport.name}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="text-xs text-blue-100 mb-1">Goal</div>
                <div className="font-semibold text-sm truncate">{questionnaire.goal}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="text-xs text-blue-100 mb-1">Skill Level</div>
                <div className="font-semibold capitalize">{questionnaire.skillLevel}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="text-xs text-blue-100 mb-1">Sessions/Week</div>
                <div className="font-semibold">{questionnaire.sessionsPerWeek}x</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="text-xs text-blue-100 mb-1">Duration</div>
                <div className="font-semibold">{questionnaire.trainingDuration} min</div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {questionnaire.equipment.slice(0, 5).map((eq) => (
                <span key={eq} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                  {eq.replace('_', ' ')}
                </span>
              ))}
              {questionnaire.equipment.length > 5 && (
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                  +{questionnaire.equipment.length - 5} more
                </span>
              )}
            </div>
          </div>
        </div>

        {plan.performanceAnalysis && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Improvement Priorities</h2>
                <p className="text-sm text-gray-500">Focus areas for your training</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-rose-600">
                  <Target className="w-4 h-4" />
                  Top 3 Weaknesses to Address
                </h3>
                <div className="space-y-2">
                  {plan.performanceAnalysis.weaknesses.slice(0, 3).map((w, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 bg-rose-50 rounded-xl border border-rose-100">
                      <span className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                      <span className="text-rose-800 text-sm">{w}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-emerald-600">
                  <TrendingUp className="w-4 h-4" />
                  Focus Areas
                </h3>
                <div className="space-y-2">
                  {plan.performanceAnalysis.priorityAreas.slice(0, 3).map((area, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-emerald-800 text-sm">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Estimated Improvement Timeline
              </h4>
              <p className="text-blue-800 text-sm">{plan.performanceAnalysis.estimatedTimeline}</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-2 bg-blue-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${plan.performanceAnalysis.improvementPotential}%` }} />
                </div>
                <span className="text-sm font-bold text-blue-700">{plan.performanceAnalysis.improvementPotential}%</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Waves className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Water Training</h2>
                <p className="text-sm text-gray-500">Pool session breakdown</p>
              </div>
            </div>

            <div className="space-y-4">
              <TrainingSection
                title="Warm-up"
                drills={plan.waterTraining.warmup}
                color="from-amber-400 to-orange-400"
                icon={Flame}
              />
              <TrainingSection
                title="Main Set"
                drills={plan.waterTraining.mainSet}
                color="from-blue-400 to-cyan-400"
                icon={Zap}
              />
              <TrainingSection
                title="Drill Set"
                drills={plan.waterTraining.drillSet}
                color="from-purple-400 to-pink-400"
                icon={Target}
              />
              <TrainingSection
                title="Cool Down"
                drills={plan.waterTraining.cooldown}
                color="from-emerald-400 to-teal-400"
                icon={Heart}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Dryland Training</h2>
                <p className="text-sm text-gray-500">Strength & conditioning</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-rose-600">
                  <Dumbbell className="w-4 h-4" />
                  Strength ({plan.drylandTraining.strength.length} exercises)
                </h4>
                <div className="space-y-1">
                  {plan.drylandTraining.strength.slice(0, 3).map((ex, i) => (
                    <div key={i} className="text-sm text-gray-600 flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span>{ex.name}</span>
                      <span className="text-gray-400">{ex.sets}x{ex.reps}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-amber-600">
                  <Activity className="w-4 h-4" />
                  Core ({plan.drylandTraining.core.length} exercises)
                </h4>
                <div className="space-y-1">
                  {plan.drylandTraining.core.slice(0, 3).map((ex, i) => (
                    <div key={i} className="text-sm text-gray-600 flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span>{ex.name}</span>
                      <span className="text-gray-400">{ex.sets}x{ex.reps}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-purple-600">
                  <Heart className="w-4 h-4" />
                  Mobility ({plan.drylandTraining.mobility.length} exercises)
                </h4>
                <div className="space-y-1">
                  {plan.drylandTraining.mobility.slice(0, 3).map((ex, i) => (
                    <div key={i} className="text-sm text-gray-600 flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span>{ex.name}</span>
                      <span className="text-gray-400">{ex.sets}x{ex.reps}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Apple className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Nutrition Plan</h2>
              <p className="text-sm text-gray-500">Fuel your performance</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <h4 className="font-semibold text-amber-900 mb-2">Before Training</h4>
              <p className="text-sm text-amber-800">{plan.nutrition.preTraining[0]?.name}</p>
              <p className="text-xs text-amber-600 mt-1">{plan.nutrition.preTraining[0]?.timing}</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <h4 className="font-semibold text-emerald-900 mb-2">After Training</h4>
              <p className="text-sm text-emerald-800">{plan.nutrition.postTraining[0]?.name}</p>
              <p className="text-xs text-emerald-600 mt-1">{plan.nutrition.postTraining[0]?.timing}</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Hydration</h4>
                <p className="text-blue-800 text-sm">{plan.nutrition.hydration}</p>
              </div>
            </div>
          </div>
        </div>

        {plan.weeklyGoals && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Weekly Goals</h2>
                <p className="text-sm text-gray-500">Your training targets</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-4 gap-4">
              {plan.weeklyGoals.weeklyTargets.map((target, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl text-center">
                  <div className="text-2xl font-bold text-gray-900">{target.target}</div>
                  <div className="text-xs text-gray-500">{target.metric}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleSavePlan}
            className="flex items-center justify-center px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold text-lg rounded-full shadow hover:shadow-lg hover:border-gray-300 transition-all"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Plan
          </button>
          <button
            onClick={handleAddToDashboard}
            disabled={savedToDashboard}
            className={`flex items-center justify-center px-6 py-4 font-semibold text-lg rounded-full shadow-lg transition-all ${
              savedToDashboard
                ? 'bg-emerald-500 text-white'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-xl'
            }`}
          >
            {savedToDashboard ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Added to Dashboard
              </>
            ) : (
              <>
                <Trophy className="w-5 h-5 mr-2" />
                Add To Dashboard
              </>
            )}
          </button>
          <button
            onClick={handleStartTraining}
            className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300"
          >
            Start Training
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>

        {showSuccess && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-emerald-500 text-white rounded-full shadow-lg animate-slide-up flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {savedToDashboard ? 'Added to dashboard!' : 'Plan saved successfully!'}
          </div>
        )}
      </div>
    </div>
  );
}

function TrainingSection({
  title,
  drills,
  color,
  icon,
}: {
  title: string;
  drills: { name: string; distance: string; repetitions: number; rest: string }[];
  color: string;
  icon: React.ElementType;
}) {
  const totalDistance = drills.reduce((sum, d) => {
    const dist = parseInt(d.distance) || 0;
    return sum + dist * d.repetitions;
  }, 0);

  return (
    <div>
      <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2 text-sm">
        <div className={`w-5 h-5 rounded-md bg-gradient-to-r ${color} flex items-center justify-center`}>
          {React.createElement(icon, { className: 'w-3 h-3 text-white' })}
        </div>
        {title}
        <span className="text-gray-400 font-normal ml-auto">
          ~{totalDistance}m total
        </span>
      </h4>
      <div className="space-y-1">
        {drills.slice(0, 2).map((drill, i) => (
          <div key={i} className="text-sm text-gray-600 flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <span>{drill.name}</span>
            <span className="text-gray-400">{drill.repetitions}x{drill.distance} | {drill.rest}</span>
          </div>
        ))}
        {drills.length > 2 && (
          <div className="text-xs text-gray-400 text-center py-1">
            +{drills.length - 2} more drills
          </div>
        )}
      </div>
    </div>
  );
}
