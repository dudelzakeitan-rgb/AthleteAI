import { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft, ChevronDown, ChevronUp, Waves, Dumbbell, Apple, Activity,
  Target, TrendingUp, Award, Zap, Flame, CheckCircle, Info, Clock,
  Calendar, Trophy, Save, AlertCircle, X,
} from 'lucide-react-native';
import { sportsConfig, ProgressEntry, DrylandExercise } from '../types';
import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'TrainingPlan'>;

type TabType = 'training' | 'analysis' | 'goals';

export function TrainingPlanScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { questionnaire, currentPlan, addProgressEntry } = useApp();
  const { sportId, improvementId } = route.params;

  const [activeTab, setActiveTab] = useState<TabType>('training');
  const [expandedSection, setExpandedSection] = useState<string>('water');
  const [selectedExercise, setSelectedExercise] = useState<DrylandExercise | null>(null);
  const [saved, setSaved] = useState(false);

  const sport = sportsConfig.find(s => s.id === sportId);
  const improvement = sport?.improvements.find(i => i.id === improvementId);

  if (!sport || !improvement || !questionnaire || !currentPlan) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center px-6">
        <Target size={48} color="#d1d5db" />
        <Text className="text-xl font-bold text-gray-900 mt-4 mb-2">No Plan Yet</Text>
        <Text className="text-gray-500 text-center mb-6">Complete the questionnaire to generate your plan.</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MainTabs' as any)}>
          <LinearGradient colors={['#3b82f6', '#06b6d4']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="rounded-2xl px-6 py-3">
            <Text className="text-white font-bold">Choose a Sport</Text>
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleSave = async () => {
    const entry: ProgressEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      sport: sport.id,
      workoutType: `${improvement.label} Training`,
      duration: questionnaire.trainingDuration,
      completed: true,
      intensity: 'moderate',
      caloriesBurned: Math.round(questionnaire.trainingDuration * 8),
    };
    await addProgressEntry(entry);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'training', label: 'Training' },
    { id: 'analysis', label: 'Analysis' },
    { id: 'goals', label: 'Goals' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <LinearGradient colors={['#1d4ed8', '#3b82f6', '#06b6d4']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <TouchableOpacity className="flex-row items-center px-5 pt-4 pb-2" onPress={() => navigation.goBack()}>
          <ChevronLeft size={20} color="#ffffff" />
          <Text className="text-white ml-1 font-medium">Back</Text>
        </TouchableOpacity>
        <View className="px-5 pb-5">
          <Text className="text-white/70 text-xs mb-1 uppercase tracking-widest">Training Plan</Text>
          <Text className="text-white text-2xl font-bold">{improvement.label}</Text>
          <View className="flex-row items-center mt-1">
            <Clock size={14} color="rgba(255,255,255,0.7)" />
            <Text className="text-white/70 text-sm ml-1">{questionnaire.trainingDuration} min · {questionnaire.sessionsPerWeek}x/week · {questionnaire.skillLevel}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View className="flex-row bg-white px-4 py-2 gap-2 border-b border-gray-100">
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 rounded-xl items-center ${activeTab === tab.id ? 'bg-blue-500' : 'bg-gray-100'}`}
          >
            <Text className={`text-sm font-semibold ${activeTab === tab.id ? 'text-white' : 'text-gray-600'}`}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* Training Tab */}
        {activeTab === 'training' && (
          <View className="gap-3">
            {/* Tips */}
            {currentPlan.tips && currentPlan.tips.length > 0 && (
              <View className="bg-blue-50 rounded-2xl p-4">
                <View className="flex-row items-center mb-2">
                  <Info size={16} color="#3b82f6" />
                  <Text className="text-blue-900 font-semibold ml-2">Training Tips</Text>
                </View>
                {currentPlan.tips.slice(0, 3).map((tip, i) => (
                  <View key={i} className="flex-row items-start mb-1">
                    <CheckCircle size={14} color="#3b82f6" style={{ marginTop: 2 }} />
                    <Text className="text-blue-800 text-sm ml-2 flex-1">{tip}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Primary Training */}
            <SectionCard
              title={sport.id === 'swimming' ? 'Water Training' : sport.id === 'gym' ? 'Gym Workout' : `${sport.name} Training`}
              icon={sport.id === 'swimming' ? <Waves size={18} color="#3b82f6" /> : <Activity size={18} color="#3b82f6" />}
              expanded={expandedSection === 'water'}
              onToggle={() => setExpandedSection(expandedSection === 'water' ? '' : 'water')}
            >
              {[
                { label: 'Warm-up', drills: currentPlan.waterTraining.warmup, color: '#f59e0b' },
                { label: 'Main Set', drills: currentPlan.waterTraining.mainSet, color: '#3b82f6' },
                { label: 'Drill Set', drills: currentPlan.waterTraining.drillSet || [], color: '#8b5cf6' },
                { label: 'Cooldown', drills: currentPlan.waterTraining.cooldown, color: '#10b981' },
              ].map(({ label, drills, color }) => drills.length > 0 && (
                <View key={label} className="mb-4">
                  <Text className="font-semibold text-sm mb-2" style={{ color }}>{label}</Text>
                  {drills.map((d, i) => (
                    <View key={i} className="bg-gray-50 rounded-xl p-3 mb-2">
                      <View className="flex-row justify-between items-start mb-1">
                        <Text className="font-medium text-gray-900 flex-1 text-sm">{d.name}</Text>
                        {d.difficulty && (
                          <View className={`px-2 py-0.5 rounded-full ${d.difficulty === 'easy' ? 'bg-green-100' : d.difficulty === 'medium' ? 'bg-yellow-100' : 'bg-red-100'}`}>
                            <Text className={`text-xs font-medium ${d.difficulty === 'easy' ? 'text-green-700' : d.difficulty === 'medium' ? 'text-yellow-700' : 'text-red-700'}`}>
                              {d.difficulty}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-xs text-blue-600">{d.repetitions}x {d.distance} · Rest: {d.rest}</Text>
                      <Text className="text-xs text-gray-500 mt-1">{d.technique}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </SectionCard>

            {/* Gym Training / Conditioning */}
            <SectionCard
              title={sport.id === 'gym' ? 'Conditioning & Mobility' : 'Gym Training'}
              icon={<Dumbbell size={18} color="#10b981" />}
              expanded={expandedSection === 'dryland'}
              onToggle={() => setExpandedSection(expandedSection === 'dryland' ? '' : 'dryland')}
            >
              {[
                { label: 'Strength', exercises: currentPlan.drylandTraining.strength, color: '#f43f5e' },
                { label: 'Mobility', exercises: currentPlan.drylandTraining.mobility, color: '#8b5cf6' },
                { label: 'Core', exercises: currentPlan.drylandTraining.core, color: '#f59e0b' },
              ].map(({ label, exercises, color }) => (
                <View key={label} className="mb-4">
                  <Text className="font-semibold text-sm mb-2" style={{ color }}>{label}</Text>
                  {exercises.map((ex, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => setSelectedExercise(ex)}
                      className="bg-gray-50 rounded-xl p-3 mb-2 flex-row items-center"
                    >
                      <View className="flex-1">
                        <Text className="font-medium text-gray-900 text-sm">{ex.name}</Text>
                        <Text className="text-xs text-gray-500 mt-0.5">{ex.sets} sets × {ex.reps}</Text>
                      </View>
                      <View className={`px-2 py-0.5 rounded-full mr-2 ${ex.difficulty === 'easy' ? 'bg-green-100' : ex.difficulty === 'medium' ? 'bg-yellow-100' : 'bg-red-100'}`}>
                        <Text className={`text-xs ${ex.difficulty === 'easy' ? 'text-green-700' : ex.difficulty === 'medium' ? 'text-yellow-700' : 'text-red-700'}`}>{ex.difficulty}</Text>
                      </View>
                      <Info size={14} color="#94a3b8" />
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </SectionCard>

            {/* Nutrition */}
            <SectionCard
              title="Nutrition"
              icon={<Apple size={18} color="#f43f5e" />}
              expanded={expandedSection === 'nutrition'}
              onToggle={() => setExpandedSection(expandedSection === 'nutrition' ? '' : 'nutrition')}
            >
              <View className="flex-row gap-3 mb-3">
                <View className="flex-1 bg-amber-50 rounded-xl p-3">
                  <Text className="text-amber-700 font-semibold text-xs mb-2">Pre-Training</Text>
                  {currentPlan.nutrition.preTraining.slice(0, 2).map((m, i) => (
                    <Text key={i} className="text-amber-900 text-sm mb-1">{m.name}</Text>
                  ))}
                </View>
                <View className="flex-1 bg-emerald-50 rounded-xl p-3">
                  <Text className="text-emerald-700 font-semibold text-xs mb-2">Post-Training</Text>
                  {currentPlan.nutrition.postTraining.slice(0, 2).map((m, i) => (
                    <Text key={i} className="text-emerald-900 text-sm mb-1">{m.name}</Text>
                  ))}
                </View>
              </View>
              <View className="bg-blue-50 rounded-xl p-3">
                <Text className="text-blue-700 font-semibold text-xs mb-1">Hydration</Text>
                <Text className="text-blue-800 text-sm">{currentPlan.nutrition.hydration}</Text>
              </View>
            </SectionCard>
          </View>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && currentPlan.performanceAnalysis && (
          <View className="gap-3">
            <View className="bg-white rounded-2xl p-5">
              <View className="flex-row gap-3 mb-4">
                <View className="flex-1 bg-emerald-50 rounded-xl p-3">
                  <Text className="text-emerald-700 font-semibold text-xs mb-2 flex-row">Strengths</Text>
                  {currentPlan.performanceAnalysis.strengths.map((s, i) => (
                    <Text key={i} className="text-emerald-800 text-sm mb-1">• {s}</Text>
                  ))}
                </View>
                <View className="flex-1 bg-amber-50 rounded-xl p-3">
                  <Text className="text-amber-700 font-semibold text-xs mb-2">Weaknesses</Text>
                  {currentPlan.performanceAnalysis.weaknesses.map((w, i) => (
                    <Text key={i} className="text-amber-800 text-sm mb-1">• {w}</Text>
                  ))}
                </View>
              </View>

              <View className="bg-blue-50 rounded-xl p-4 mb-3">
                <Text className="text-blue-900 font-semibold mb-2">Timeline</Text>
                <Text className="text-blue-700 text-sm">{currentPlan.performanceAnalysis.estimatedTimeline}</Text>
              </View>

              <View className="bg-purple-50 rounded-xl p-4">
                <Text className="text-purple-900 font-semibold mb-2">Improvement Potential</Text>
                <View className="h-3 bg-purple-200 rounded-full overflow-hidden">
                  <View className="h-full bg-purple-500 rounded-full" style={{ width: `${currentPlan.performanceAnalysis.improvementPotential}%` }} />
                </View>
                <Text className="text-purple-700 font-bold text-lg mt-2">{currentPlan.performanceAnalysis.improvementPotential}%</Text>
              </View>
            </View>
          </View>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && currentPlan.weeklyGoals && (
          <View className="gap-3">
            <View className="bg-white rounded-2xl p-5">
              <Text className="font-bold text-gray-900 mb-4">Weekly Targets</Text>
              <View className="flex-row flex-wrap gap-2 mb-6">
                {currentPlan.weeklyGoals.weeklyTargets.map((t, i) => (
                  <View key={i} className="bg-gray-50 rounded-xl px-4 py-3 items-center" style={{ minWidth: '45%' }}>
                    <Text className="text-2xl font-bold text-blue-600">{t.target}</Text>
                    <Text className="text-xs text-gray-500 mt-1">{t.metric}</Text>
                  </View>
                ))}
              </View>

              <Text className="font-bold text-gray-900 mb-3">4-Week Milestones</Text>
              <View className="gap-2">
                {currentPlan.weeklyGoals.milestones.map((m, i) => (
                  <View key={i} className={`rounded-xl p-3 flex-row items-center ${m.completed ? 'bg-emerald-50' : 'bg-gray-50'}`}>
                    <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${m.completed ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                      {m.completed ? <CheckCircle size={16} color="#ffffff" /> : <Text className="text-gray-500 font-bold text-sm">{m.week}</Text>}
                    </View>
                    <Text className={`text-sm flex-1 ${m.completed ? 'text-emerald-800' : 'text-gray-700'}`}>{m.description}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Save button */}
      <View className="absolute bottom-0 left-0 right-0 px-5 pb-6 pt-3 bg-white border-t border-gray-100">
        <TouchableOpacity onPress={handleSave} activeOpacity={0.85}>
          <View className={`rounded-2xl py-4 flex-row items-center justify-center ${saved ? 'bg-emerald-500' : 'bg-blue-500'}`}>
            {saved ? <CheckCircle size={18} color="#ffffff" /> : <Save size={18} color="#ffffff" />}
            <Text className="text-white font-bold ml-2">{saved ? 'Saved!' : 'Mark as Complete'}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Exercise Modal */}
      <ExerciseDetailModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
    </SafeAreaView>
  );
}

function SectionCard({ title, icon, expanded, onToggle, children }: {
  title: string;
  icon: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <View className="bg-white rounded-2xl overflow-hidden">
      <TouchableOpacity
        onPress={onToggle}
        className="flex-row items-center justify-between p-4"
      >
        <View className="flex-row items-center gap-3">
          <View className="w-9 h-9 rounded-xl bg-gray-50 items-center justify-center">{icon}</View>
          <Text className="font-bold text-gray-900">{title}</Text>
        </View>
        {expanded ? <ChevronUp size={18} color="#94a3b8" /> : <ChevronDown size={18} color="#94a3b8" />}
      </TouchableOpacity>
      {expanded && <View className="px-4 pb-4">{children}</View>}
    </View>
  );
}

function ExerciseDetailModal({ exercise, onClose }: { exercise: DrylandExercise | null; onClose: () => void }) {
  if (!exercise) return null;

  const typeColor = exercise.type === 'strength' ? '#f43f5e' : exercise.type === 'mobility' ? '#8b5cf6' : '#f59e0b';

  return (
    <Modal visible={!!exercise} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-white">
        <View style={{ backgroundColor: typeColor }} className="px-5 pt-5 pb-6">
          <TouchableOpacity className="self-end mb-3" onPress={onClose}>
            <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center">
              <X size={16} color="#ffffff" />
            </View>
          </TouchableOpacity>
          <Text className="text-white/70 text-xs uppercase tracking-widest capitalize">{exercise.type}</Text>
          <Text className="text-white text-2xl font-bold">{exercise.name}</Text>
          <Text className="text-white/80 text-sm mt-1">{exercise.description}</Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View className="flex-row gap-3 mb-5">
            <View className="flex-1 bg-gray-50 rounded-xl p-3 items-center">
              <Text className="text-lg font-bold text-gray-900">{exercise.sets} × {exercise.reps}</Text>
              <Text className="text-xs text-gray-500">Sets & Reps</Text>
            </View>
            <View className="flex-1 bg-gray-50 rounded-xl p-3 items-center">
              <Text className="text-lg font-bold capitalize" style={{ color: typeColor }}>{exercise.difficulty}</Text>
              <Text className="text-xs text-gray-500">Difficulty</Text>
            </View>
          </View>

          {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
            <View className="mb-5">
              <Text className="font-bold text-gray-900 mb-2">Muscle Groups</Text>
              <View className="flex-row flex-wrap gap-2">
                {exercise.muscleGroups.map(m => (
                  <View key={m} className="bg-rose-50 rounded-full px-3 py-1">
                    <Text className="text-rose-700 text-sm capitalize">{m}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View>
            <Text className="font-bold text-gray-900 mb-3">Tips</Text>
            <View className="gap-2">
              {[
                'Focus on quality over quantity.',
                'Engage your core throughout the movement.',
                'Breathe consistently — exhale on effort.',
                'Control both the lift and the lowering phase.',
              ].map((tip, i) => (
                <View key={i} className="flex-row items-start gap-2">
                  <CheckCircle size={16} color="#10b981" style={{ marginTop: 1 }} />
                  <Text className="text-gray-700 text-sm flex-1">{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        <View className="px-5 pb-6 pt-3 border-t border-gray-100">
          <TouchableOpacity onPress={onClose} className="bg-gray-100 rounded-2xl py-4 items-center">
            <Text className="text-gray-700 font-semibold">Close</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
