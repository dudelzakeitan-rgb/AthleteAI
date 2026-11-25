import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Waves,
  Dumbbell,
  Apple,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Info,
  Trophy,
  Target,
  TrendingUp,
  Calendar,
  Zap,
  Flame,
  AlertCircle,
  Clock,
  Award,
  Save,
  ChevronRight,
} from 'lucide-react';
import { sportsConfig, DrylandExercise } from '../types';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import { generateTrainingPlan } from '../lib/trainingGenerator';
import { ExerciseModal } from '../components/ExerciseModal';

export function TrainingPlanPage() {
  const { sportId, improvementId } = useParams<{ sportId: string; improvementId: string }>();
  const navigate = useNavigate();
  const { questionnaire, currentPlan, setCurrentPlan } = useApp();
  const [expandedSection, setExpandedSection] = useState<string>('water');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedToAccount, setSavedToAccount] = useState(false);
  const clientKeyRef = useRef<string | null>(null);
  const [activeTab, setActiveTab] = useState<'training' | 'analysis' | 'goals'>('training');
  const [selectedExercise, setSelectedExercise] = useState<DrylandExercise | null>(null);

  const sport = sportsConfig.find((s) => s.id === sportId);
  const improvement = sport?.improvements.find((i) => i.id === improvementId);

  useEffect(() => {
    if (!currentPlan && questionnaire && sport && improvement) {
      const plan = generateTrainingPlan({
        sport: sport.id,
        improvement: improvement.id,
        questionnaire,
      });
      setCurrentPlan(plan);
    }
  }, [questionnaire, sport, improvement, currentPlan, setCurrentPlan]);

  const handleSaveProgress = async () => {
    if (isSaving || savedToAccount) return;
    setIsSaving(true);
    setSaveError(null);

    const clientKey = clientKeyRef.current ?? `finish-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    clientKeyRef.current = clientKey;

    const entry = {
      client_key: clientKey,
      sport: sport?.id || 'swimming',
      workout_type: `${improvement?.label} Training`,
      duration: questionnaire?.trainingDuration || 60,
      completed_at: new Date().toISOString(),
      intensity: 'moderate',
      calories_burned: Math.round((questionnaire?.trainingDuration || 60) * 8),
    };

    const { error } = await supabase.from('saved_workouts').upsert(entry, {
      onConflict: 'client_key',
      ignoreDuplicates: true,
    });

    if (error) {
      setSaveError('We could not save your workout. Your data is safe — try again.');
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    setSavedToAccount(true);
    navigate('/', { state: { workoutSaved: true } });
  };

  if (!sport || !improvement || !questionnaire || !currentPlan) {
    return (
      <div className="pt-20 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
              <Target className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Training Plan Generated</h2>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => navigate(`/sports/${sportId}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to {sport.name}</span>
        </button>

        <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-cyan-300/20 rounded-full blur-2xl" />
          </div>
          <div className="relative">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="text-blue-100 text-sm font-medium mb-1">
                  Personalized Training Plan
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                  {improvement.label} Training
                </h1>
                <p className="text-blue-100">
                  {sport.name} • {questionnaire.skillLevel} level • {questionnaire.sessionsPerWeek}x per week
                </p>
              </div>
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">{questionnaire.trainingDuration} min/session</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              {questionnaire.equipment.slice(0, 6).map((eq) => (
                <span
                  key={eq}
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm capitalize"
                >
                  {eq.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'training', label: 'Training Plan', icon: Dumbbell },
            { id: 'analysis', label: 'Performance Analysis', icon: TrendingUp },
            { id: 'goals', label: 'Weekly Goals', icon: Target },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'training' && (
          <div className="space-y-6 animate-fade-in">
            {(currentPlan.tips || []).length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <Info className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Training Tips</h3>
                    <ul className="space-y-1.5">
                      {currentPlan.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-blue-800 text-sm">
                          <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-500" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <Section
              title={sportId === 'gym' ? 'Gym Workout' : sportId === 'swimming' ? 'Water Training' : `${sport.name} Training`}
              icon={<Waves className="w-5 h-5" />}
              expanded={expandedSection === 'water'}
              onToggle={() => setExpandedSection(expandedSection === 'water' ? '' : 'water')}
              color="blue"
            >
              <div className="space-y-6">
                <DrillSection
                  title="Warm-up"
                  drills={currentPlan.waterTraining.warmup}
                  color="from-amber-400 to-orange-400"
                  icon={Flame}
                />
                <DrillSection
                  title="Main Set"
                  drills={currentPlan.waterTraining.mainSet}
                  color="from-blue-400 to-cyan-400"
                  icon={Zap}
                />
                <DrillSection
                  title="Drill Set"
                  drills={currentPlan.waterTraining.drillSet || []}
                  color="from-purple-400 to-pink-400"
                  icon={Target}
                />
                <DrillSection
                  title="Cooldown"
                  drills={currentPlan.waterTraining.cooldown}
                  color="from-emerald-400 to-teal-400"
                  icon={CheckCircle}
                />
              </div>
            </Section>

            <Section
              title={sportId === 'gym' ? 'Conditioning & Mobility' : 'Gym Training'}
              icon={<Dumbbell className="w-5 h-5" />}
              expanded={expandedSection === 'dryland'}
              onToggle={() => setExpandedSection(expandedSection === 'dryland' ? '' : 'dryland')}
              color="emerald"
            >
              <div className="grid sm:grid-cols-3 gap-6">
                <ExerciseSection
                  title="Strength"
                  exercises={currentPlan.drylandTraining.strength}
                  color="from-rose-500 to-pink-500"
                  icon={Dumbbell}
                  onExerciseClick={setSelectedExercise}
                />
                <ExerciseSection
                  title="Mobility"
                  exercises={currentPlan.drylandTraining.mobility}
                  color="from-purple-500 to-indigo-500"
                  icon={TrendingUp}
                  onExerciseClick={setSelectedExercise}
                />
                <ExerciseSection
                  title="Core"
                  exercises={currentPlan.drylandTraining.core}
                  color="from-amber-500 to-orange-500"
                  icon={Award}
                  onExerciseClick={setSelectedExercise}
                />
              </div>
            </Section>

            <Section
              title="Nutrition"
              icon={<Apple className="w-5 h-5" />}
              expanded={expandedSection === 'nutrition'}
              onToggle={() => setExpandedSection(expandedSection === 'nutrition' ? '' : 'nutrition')}
              color="rose"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    Pre-Training Meals
                  </h4>
                  <div className="space-y-3">
                    {currentPlan.nutrition.preTraining.map((meal, i) => (
                      <MealCard key={i} meal={meal} />
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Post-Training Recovery
                  </h4>
                  <div className="space-y-3">
                    {currentPlan.nutrition.postTraining.map((meal, i) => (
                      <MealCard key={i} meal={meal} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Hydration Guidelines
                  </h4>
                  <p className="text-blue-800 text-sm">{currentPlan.nutrition.hydration}</p>
                </div>

                <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                  <h4 className="font-semibold text-rose-900 mb-2">Protein Recommendation</h4>
                  <p className="text-rose-800 text-sm">
                    {currentPlan.nutrition.proteinRecommendation}
                  </p>
                </div>

                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <h4 className="font-semibold text-emerald-900 mb-2">Recovery Tips</h4>
                  <ul className="space-y-2">
                    {currentPlan.nutrition.recoveryTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-emerald-800 text-sm">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Section>
          </div>
        )}

        {activeTab === 'analysis' && currentPlan.performanceAnalysis && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Performance Analysis</h2>
                  <p className="text-gray-500 text-sm">Based on your profile and goals</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <h3 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Your Strengths
                  </h3>
                  <ul className="space-y-2">
                    {currentPlan.performanceAnalysis.strengths.map((s, i) => (
                      <li key={i} className="text-emerald-800 text-sm flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Areas to Improve
                  </h3>
                  <ul className="space-y-2">
                    {currentPlan.performanceAnalysis.weaknesses.map((w, i) => (
                      <li key={i} className="text-amber-800 text-sm flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 mb-6">
                <h3 className="font-semibold text-blue-900 mb-3">Priority Improvement Areas</h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  {currentPlan.performanceAnalysis.priorityAreas.map((area, i) => (
                    <div
                      key={i}
                      className="bg-white p-3 rounded-lg text-center border border-blue-100"
                    >
                      <div className="text-2xl font-bold text-blue-600 mb-1">{i + 1}</div>
                      <div className="text-sm text-gray-700">{area}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px] p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl text-white">
                  <div className="text-sm opacity-90 mb-1">Estimated Improvement Timeline</div>
                  <div className="text-xl font-bold">{currentPlan.performanceAnalysis.estimatedTimeline}</div>
                </div>
                <div className="min-w-[140px] p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl text-white text-center">
                  <div className="text-sm opacity-90 mb-1">Improvement Potential</div>
                  <div className="text-3xl font-bold">{currentPlan.performanceAnalysis.improvementPotential}%</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'goals' && currentPlan.weeklyGoals && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Weekly Goals</h2>
                  <p className="text-gray-500 text-sm">Your personalized training schedule</p>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                Daily Tasks
              </h3>
              <div className="grid sm:grid-cols-7 gap-2 mb-8">
                {currentPlan.weeklyGoals.dailyTasks.map((day, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl ${
                      day.type === 'rest'
                        ? 'bg-gray-100 border border-gray-200'
                        : day.type === 'intense'
                        ? 'bg-orange-50 border border-orange-200'
                        : 'bg-blue-50 border border-blue-200'
                    }`}
                  >
                    <div className="text-xs font-medium text-gray-500 mb-2">{day.day}</div>
                    <div
                      className={`text-xs font-semibold ${
                        day.type === 'rest'
                          ? 'text-gray-600'
                          : day.type === 'intense'
                          ? 'text-orange-700'
                          : 'text-blue-700'
                      }`}
                    >
                      {day.type === 'rest' ? 'Recovery' : day.type === 'intense' ? 'Hard' : 'Mod'}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-8">
                {currentPlan.weeklyGoals.dailyTasks.slice(0, 5).map((day, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">{day.day}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          day.type === 'rest'
                            ? 'bg-gray-200 text-gray-700'
                            : day.type === 'intense'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {day.type}
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {day.tasks.slice(0, 3).map((task, j) => (
                        <li key={j} className="text-sm text-gray-600 flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 flex-shrink-0 mt-1 text-gray-400" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                Weekly Targets
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {currentPlan.weeklyGoals.weeklyTargets.map((target, i) => (
                  <div key={i} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">{target.metric}</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {target.target}
                      <span className="text-sm font-normal text-gray-500 ml-1">{target.unit}</span>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-500" />
                4-Week Milestones
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {currentPlan.weeklyGoals.milestones.map((milestone, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border-2 ${
                      milestone.completed
                        ? 'border-emerald-300 bg-emerald-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="text-xs text-gray-500 mb-1">Week {milestone.week}</div>
                    <div className="font-medium text-gray-900 text-sm">{milestone.description}</div>
                    {milestone.completed && (
                      <div className="flex items-center gap-1 text-emerald-600 text-xs mt-2">
                        <CheckCircle className="w-3 h-3" />
                        Completed
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleSaveProgress}
            disabled={isSaving || savedToAccount}
            className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 disabled:opacity-60 disabled:hover:scale-100"
          >
            <Save className="w-5 h-5 mr-2" />
            {isSaving ? 'Saving...' : savedToAccount ? 'Saved' : 'Mark as Complete'}
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold text-lg rounded-full shadow hover:shadow-lg hover:border-gray-300 transition-all duration-300"
          >
            <Trophy className="w-5 h-5 mr-2" />
            View Dashboard
          </button>
        </div>

        {saveError && (
          <div className="mt-4 max-w-md mx-auto bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700">{saveError}</p>
              <button
                onClick={handleSaveProgress}
                disabled={isSaving}
                className="mt-2 text-sm font-semibold text-red-700 underline hover:text-red-800 disabled:opacity-50"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      <ExerciseModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
    </div>
  );
}

function Section({
  title,
  icon,
  expanded,
  onToggle,
  color,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  color: string;
  children: React.ReactNode;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500 to-cyan-500',
    emerald: 'from-emerald-500 to-teal-500',
    rose: 'from-rose-500 to-pink-500',
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${
              colorClasses[color] || colorClasses.blue
            } flex items-center justify-center`}
          >
            {icon}
          </div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {expanded && <div className="px-6 pb-6 animate-fade-in">{children}</div>}
    </div>
  );
}

function DrillSection({
  title,
  drills,
  color,
  icon,
}: {
  title: string;
  drills: { name: string; distance: string; repetitions: number; rest: string; technique: string; difficulty?: string }[];
  color: string;
  icon: React.ElementType;
}) {
  if (drills.length === 0) return null;

  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <div className={`w-6 h-6 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center`}>
          {React.createElement(icon, { className: 'w-3 h-3 text-white' })}
        </div>
        {title}
      </h3>
      <div className="space-y-2">
        {drills.map((drill, i) => (
          <div
            key={i}
            className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="font-medium text-gray-900">{drill.name}</div>
              <div className="flex items-center gap-2">
                {drill.difficulty && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      drill.difficulty === 'easy'
                        ? 'bg-green-100 text-green-700'
                        : drill.difficulty === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {drill.difficulty}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                {drill.repetitions}x {drill.distance}
              </span>
              <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">
                Rest: {drill.rest}
              </span>
            </div>
            <p className="text-sm text-gray-600">{drill.technique}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExerciseSection({
  title,
  exercises,
  color,
  icon,
  onExerciseClick,
}: {
  title: string;
  exercises: DrylandExercise[];
  color: string;
  icon: React.ElementType;
  onExerciseClick: (exercise: DrylandExercise) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center`}>
          {React.createElement(icon, { className: 'w-4 h-4 text-white' })}
        </div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-2">
        {exercises.map((ex, i) => (
          <button
            key={i}
            onClick={() => onExerciseClick(ex)}
            className="w-full text-left p-3 bg-gray-50 rounded-xl hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all group"
          >
            <div className="flex justify-between items-start">
              <div className="font-medium text-gray-900 text-sm group-hover:text-blue-700 transition-colors">{ex.name}</div>
              <div className="flex items-center gap-1">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    ex.difficulty === 'easy'
                      ? 'bg-green-100 text-green-700'
                      : ex.difficulty === 'medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {ex.difficulty}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-400 transition-colors" />
              </div>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {ex.sets} sets x {ex.reps}
            </div>
            <p className="text-xs text-gray-500 mt-1">{ex.description}</p>
            {ex.muscleGroups && (
              <div className="flex flex-wrap gap-1 mt-1">
                {ex.muscleGroups.map((m) => (
                  <span key={m} className="text-xs text-gray-400">
                    #{m}
                  </span>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function MealCard({ meal }: { meal: { name: string; timing: string; description: string; nutrients: string[]; calories: number } }) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
      <div className="flex justify-between items-start mb-1">
        <div className="font-medium text-gray-900">{meal.name}</div>
        <div className="text-xs text-gray-500">{meal.calories} cal</div>
      </div>
      <div className="text-xs text-blue-600 mb-1">{meal.timing}</div>
      <p className="text-sm text-gray-600 mb-2">{meal.description}</p>
      <div className="flex flex-wrap gap-1">
        {meal.nutrients.map((n) => (
          <span key={n} className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}
