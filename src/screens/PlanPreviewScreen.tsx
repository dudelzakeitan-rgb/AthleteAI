import { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft, CheckCircle, Target, TrendingUp, Calendar,
  Waves, Dumbbell, Apple, Trophy, Save, ArrowRight, Activity, Sparkles,
} from 'lucide-react-native';
import { sportsConfig, TrainingPlan, ProgressEntry, WaterDrill, DrylandExercise } from '../types';
import { useApp } from '../context/AppContext';
import { generateTrainingPlan } from '../lib/trainingGenerator';
import { generateWorkout, GeneratedExercise } from '../lib/workoutApi';
import { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'PlanPreview'>;

const DIFFICULTY_BY_LEVEL: Record<string, 'easy' | 'medium' | 'hard'> = {
  beginner: 'easy',
  intermediate: 'medium',
  advanced: 'hard',
};

/** Maps AI-generated exercises onto the plan structure, matching the web implementation. */
function applyAiExercises(plan: TrainingPlan, exercises: GeneratedExercise[], skillLevel: string): TrainingPlan {
  const fallbackDifficulty = DIFFICULTY_BY_LEVEL[skillLevel] || 'medium';

  const mainSet: WaterDrill[] = exercises
    .filter(ex => ex.type === 'sport' || ex.type === 'cardio')
    .map(ex => ({
      name: ex.name,
      distance: ex.duration || ex.reps,
      repetitions: ex.sets,
      rest: ex.rest,
      technique: ex.description,
      difficulty: fallbackDifficulty,
    }));

  const byType = (type: 'strength' | 'core' | 'mobility'): DrylandExercise[] =>
    exercises
      .filter(ex => ex.type === type)
      .map(ex => ({
        name: ex.name,
        type,
        sets: ex.sets,
        reps: ex.duration || ex.reps,
        description: ex.description,
        difficulty: fallbackDifficulty,
      }));

  const strength = byType('strength');
  const core = byType('core');
  const mobility = byType('mobility');

  if (mainSet.length > 0) {
    plan.waterTraining.mainSet = mainSet;
  }
  if (strength.length > 0) {
    plan.drylandTraining.strength = strength;
  }
  if (core.length > 0) {
    plan.drylandTraining.core = core;
  }
  if (mobility.length > 0) {
    plan.drylandTraining.mobility = mobility;
  }
  return plan;
}

export function PlanPreviewScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { questionnaire, setCurrentPlan, addProgressEntry, session } = useApp();
  const { sportId, improvementId } = route.params;

  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [savedToDashboard, setSavedToDashboard] = useState(false);

  const sport = sportsConfig.find(s => s.id === sportId);
  const improvement = sport?.improvements.find(i => i.id === improvementId);

  useEffect(() => {
    if (questionnaire && sport && improvement) {
      const generated = generateTrainingPlan({
        sport: sport.id,
        improvement: improvement.id,
        questionnaire,
      });
      setPlan(generated);
      setCurrentPlan(generated);

      if (session) {
        generateWorkout(sport.id, questionnaire.goal, {
          skillLevel: questionnaire.skillLevel,
          sessionsPerWeek: questionnaire.sessionsPerWeek,
          sessionMinutes: questionnaire.trainingDuration,
          equipment: questionnaire.equipment,
          notes: `Weakness: ${questionnaire.weakness}. Improvement focus: ${improvement.label}.`,
        })
          .then(exercises => {
            const aiPlan = applyAiExercises(generated, exercises, questionnaire.skillLevel);
            setPlan({ ...aiPlan });
            setCurrentPlan({ ...aiPlan });
          })
          .catch(() => {
            // Keep the static template plan on AI failure
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionnaire, sport, improvement, session]);

  if (!plan || !questionnaire || !sport || !improvement) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-500 mt-4">Generating your plan...</Text>
      </SafeAreaView>
    );
  }

  const handleAddToDashboard = async () => {
    const entry: ProgressEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      sport: sport.id,
      workoutType: `${improvement.label} Training Plan`,
      duration: questionnaire.trainingDuration,
      completed: false,
      intensity: 'moderate',
      notes: `Plan generated: ${improvement.label} focus for ${sport.name}`,
    };
    await addProgressEntry(entry);
    setSavedToDashboard(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={['#1d4ed8', '#3b82f6', '#06b6d4']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <TouchableOpacity
            className="flex-row items-center px-5 pt-4 pb-2"
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={20} color="#ffffff" />
            <Text className="text-white ml-1 font-medium">Back</Text>
          </TouchableOpacity>
          <View className="px-5 pb-6">
            <View className="flex-row items-center bg-white/20 rounded-full px-3 py-1.5 self-start mb-3">
              <CheckCircle size={14} color="#ffffff" />
              <Text className="text-white text-xs font-medium ml-1.5">Step 6 of 6</Text>
            </View>
            <Text className="text-white text-2xl font-bold mb-1">Your Personalized Plan</Text>
            <Text className="text-white/80 text-sm">{sport.name} · {improvement.label} · {questionnaire.skillLevel}</Text>
          </View>
        </LinearGradient>

        <View className="px-5 py-5 gap-4">
          {/* Stats */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-white rounded-2xl p-4 items-center">
              <Text className="text-xl font-bold text-blue-600">{questionnaire.sessionsPerWeek}x</Text>
              <Text className="text-xs text-gray-500 mt-1">Per Week</Text>
            </View>
            <View className="flex-1 bg-white rounded-2xl p-4 items-center">
              <Text className="text-xl font-bold text-blue-600">{questionnaire.trainingDuration}m</Text>
              <Text className="text-xs text-gray-500 mt-1">Per Session</Text>
            </View>
            <View className="flex-1 bg-white rounded-2xl p-4 items-center">
              <Text className="text-xl font-bold text-blue-600 capitalize">{questionnaire.skillLevel[0].toUpperCase()}</Text>
              <Text className="text-xs text-gray-500 mt-1">Level</Text>
            </View>
          </View>

          {/* Priorities */}
          {plan.performanceAnalysis && (
            <View className="bg-white rounded-2xl p-5">
              <View className="flex-row items-center mb-4">
                <View className="w-9 h-9 rounded-xl bg-rose-100 items-center justify-center mr-3">
                  <Target size={18} color="#f43f5e" />
                </View>
                <Text className="font-bold text-gray-900 text-base">Improvement Priorities</Text>
              </View>
              {plan.performanceAnalysis.priorityAreas.slice(0, 3).map((area, i) => (
                <View key={i} className="flex-row items-center mb-2">
                  <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center mr-3">
                    <Text className="text-white text-xs font-bold">{i + 1}</Text>
                  </View>
                  <Text className="text-gray-700 flex-1">{area}</Text>
                </View>
              ))}
              <View className="mt-3 bg-blue-50 rounded-xl p-3">
                <Text className="text-blue-700 text-sm font-medium">
                  Timeline: {plan.performanceAnalysis.estimatedTimeline}
                </Text>
              </View>
            </View>
          )}

          {/* Primary Training */}
          <View className="bg-white rounded-2xl p-5">
            <View className="flex-row items-center mb-4">
              <View className="w-9 h-9 rounded-xl bg-blue-100 items-center justify-center mr-3">
                {sport.id === 'swimming' ? <Waves size={18} color="#3b82f6" /> : <Activity size={18} color="#3b82f6" />}
              </View>
              <Text className="font-bold text-gray-900 text-base flex-1">
                {sport.id === 'swimming' ? 'Water Training' : sport.id === 'gym' ? 'Gym Workout' : `${sport.name} Training`}
              </Text>
              <Sparkles size={16} color="#f59e0b" />
            </View>
            {[
              { label: 'Warm-up', drills: plan.waterTraining.warmup },
              { label: 'Main Set', drills: plan.waterTraining.mainSet },
              { label: 'Drill Set', drills: plan.waterTraining.drillSet },
              { label: 'Cooldown', drills: plan.waterTraining.cooldown },
            ].map(({ label, drills }) => drills.length > 0 && (
              <View key={label} className="mb-3">
                <Text className="text-sm font-semibold text-gray-700 mb-1">{label}</Text>
                {drills.slice(0, 2).map((d, i) => (
                  <View key={i} className="flex-row justify-between py-1.5 border-b border-gray-50">
                    <Text className="text-gray-600 text-sm flex-1">{d.name}</Text>
                    <Text className="text-gray-400 text-xs">{d.repetitions}x{d.distance}</Text>
                  </View>
                ))}
                {drills.length > 2 && (
                  <Text className="text-gray-400 text-xs mt-1">+{drills.length - 2} more</Text>
                )}
              </View>
            ))}
          </View>

          {/* Gym Training */}
          <View className="bg-white rounded-2xl p-5">
            <View className="flex-row items-center mb-4">
              <View className="w-9 h-9 rounded-xl bg-emerald-100 items-center justify-center mr-3">
                <Dumbbell size={18} color="#10b981" />
              </View>
              <Text className="font-bold text-gray-900 text-base">
                {sport.id === 'gym' ? 'Conditioning & Mobility' : 'Gym Training'}
              </Text>
            </View>
            {[
              { label: 'Strength', exercises: plan.drylandTraining.strength, color: '#f43f5e' },
              { label: 'Core', exercises: plan.drylandTraining.core, color: '#f59e0b' },
              { label: 'Mobility', exercises: plan.drylandTraining.mobility, color: '#8b5cf6' },
            ].map(({ label, exercises, color }) => (
              <View key={label} className="mb-3">
                <Text className="text-sm font-semibold mb-1" style={{ color }}>{label} ({exercises.length})</Text>
                {exercises.slice(0, 2).map((ex, i) => (
                  <View key={i} className="flex-row justify-between py-1.5 border-b border-gray-50">
                    <Text className="text-gray-600 text-sm flex-1">{ex.name}</Text>
                    <Text className="text-gray-400 text-xs">{ex.sets}×{ex.reps}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>

          {/* Nutrition */}
          <View className="bg-white rounded-2xl p-5">
            <View className="flex-row items-center mb-4">
              <View className="w-9 h-9 rounded-xl bg-green-100 items-center justify-center mr-3">
                <Apple size={18} color="#10b981" />
              </View>
              <Text className="font-bold text-gray-900 text-base">Nutrition Plan</Text>
            </View>
            <View className="flex-row gap-3">
              <View className="flex-1 bg-amber-50 rounded-xl p-3">
                <Text className="text-amber-700 font-semibold text-xs mb-1">Before</Text>
                <Text className="text-amber-900 text-sm">{plan.nutrition.preTraining[0]?.name}</Text>
              </View>
              <View className="flex-1 bg-emerald-50 rounded-xl p-3">
                <Text className="text-emerald-700 font-semibold text-xs mb-1">After</Text>
                <Text className="text-emerald-900 text-sm">{plan.nutrition.postTraining[0]?.name}</Text>
              </View>
            </View>
          </View>

          {/* Weekly Goals */}
          {plan.weeklyGoals && (
            <View className="bg-white rounded-2xl p-5">
              <View className="flex-row items-center mb-4">
                <View className="w-9 h-9 rounded-xl bg-purple-100 items-center justify-center mr-3">
                  <Calendar size={18} color="#8b5cf6" />
                </View>
                <Text className="font-bold text-gray-900 text-base">Weekly Goals</Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {plan.weeklyGoals.weeklyTargets.map((t, i) => (
                  <View key={i} className="bg-gray-50 rounded-xl px-3 py-2">
                    <Text className="text-xl font-bold text-gray-900">{t.target}</Text>
                    <Text className="text-xs text-gray-500">{t.metric}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Actions */}
          <TouchableOpacity
            onPress={handleAddToDashboard}
            disabled={savedToDashboard}
            activeOpacity={0.85}
          >
            <View className="rounded-2xl py-4 flex-row items-center justify-center bg-emerald-500">
              {savedToDashboard ? (
                <>
                  <CheckCircle size={18} color="#ffffff" />
                  <Text className="text-white font-bold ml-2">Added to Dashboard</Text>
                </>
              ) : (
                <>
                  <Trophy size={18} color="#ffffff" />
                  <Text className="text-white font-bold ml-2">Add To Dashboard</Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('TrainingPlan', { sportId, improvementId })}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#3b82f6', '#06b6d4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="rounded-2xl py-4 flex-row items-center justify-center"
            >
              <Text className="text-white font-bold text-base mr-2">Start Training</Text>
              <ArrowRight size={18} color="#ffffff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
